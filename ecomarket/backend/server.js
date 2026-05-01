const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Listing = require('./models/Listing');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// API: Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Register attempt:', { name, email, role });
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, role });
    console.log('User created:', user._id);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallbacksecret', { expiresIn: '30d' });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role, token
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API: Listings
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find().populate('seller', 'name').sort('-createdAt');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/listings', protect, async (req, res) => {
  try {
    if (req.user.role !== 'seller') return res.status(403).json({ message: 'Only sellers can create listings' });
    const { title, category, weight, city, imageUrl } = req.body;
    const listing = await Listing.create({ seller: req.user._id, title, category, weight, city, imageUrl });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/listings/:id/request', protect, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') return res.status(403).json({ message: 'Only buyers can request pickup' });
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    listing.buyer = req.user._id;
    listing.status = 'scheduled';
    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Make an offer (Buyer)
app.post('/api/listings/:id/offer', protect, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') return res.status(403).json({ message: 'Only buyers can make offers' });
    const { amount } = req.body;
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status !== 'active') return res.status(400).json({ message: 'Listing is no longer active' });

    // Check if buyer already made an offer, if so update it, else push new
    const existingOfferIndex = listing.offers.findIndex(o => o.buyer.toString() === req.user._id.toString());
    if (existingOfferIndex >= 0) {
      listing.offers[existingOfferIndex].amount = amount;
      listing.offers[existingOfferIndex].status = 'pending';
    } else {
      listing.offers.push({ buyer: req.user._id, buyerName: req.user.name, amount });
    }

    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept an offer (Seller)
app.put('/api/listings/:id/offer/:offerId/accept', protect, async (req, res) => {
  try {
    if (req.user.role !== 'seller') return res.status(403).json({ message: 'Only sellers can accept offers' });
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.seller.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not your listing' });

    const offer = listing.offers.id(req.params.offerId);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    // Reject all other pending offers
    listing.offers.forEach(o => {
      if (o._id.toString() !== offer._id.toString()) {
        o.status = 'rejected';
      }
    });

    offer.status = 'accepted';
    listing.status = 'scheduled';
    listing.buyer = offer.buyer; // Assign the buyer

    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Mark listing as completed (Seller) - with proof photo upload
app.put('/api/listings/:id/complete', protect, async (req, res) => {
  try {
    if (req.user.role !== 'seller') return res.status(403).json({ message: 'Only sellers can complete listings' });
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.seller.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not your listing' });
    if (listing.status !== 'scheduled') return res.status(400).json({ message: 'Listing must be scheduled first' });

    // Save proof photos if provided
    const { proofPhotos } = req.body;
    if (proofPhotos && Array.isArray(proofPhotos) && proofPhotos.length > 0) {
      listing.proofPhotos = proofPhotos;
    }

    listing.status = 'completed';
    listing.completedAt = new Date();
    await listing.save();

    // Increment completed transactions for seller
    req.user.completedTransactions += 1;
    await req.user.save();

    // Increment completed transactions for buyer
    if (listing.buyer) {
      const buyerUser = await User.findById(listing.buyer);
      if (buyerUser) {
        buyerUser.completedTransactions += 1;
        await buyerUser.save();
      }
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rate a user (Buyer or Seller rating each other)
app.post('/api/users/:id/rate', protect, async (req, res) => {
  try {
    const { rating } = req.body; // 1 to 5
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });
    if (targetUser._id.toString() === req.user._id.toString()) return res.status(400).json({ message: 'Cannot rate yourself' });

    const newTotalRatings = targetUser.totalRatings + 1;
    const currentTotalScore = targetUser.averageRating * targetUser.totalRatings;
    targetUser.averageRating = (currentTotalScore + rating) / newTotalRatings;
    targetUser.totalRatings = newTotalRatings;

    await targetUser.save();
    res.json({ message: 'Rating submitted successfully', averageRating: targetUser.averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Socket.io for Real-time Chat
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });
  socket.on('send_message', async (data) => {
    const { sender, receiver, listing, content } = data;
    const msg = await Message.create({ sender, receiver, listing, content });
    io.to(listing).emit('receive_message', msg);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
