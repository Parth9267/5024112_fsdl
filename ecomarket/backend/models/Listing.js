const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerName: { type: String }, // Storing name for easier display without deep population
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const listingSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, enum: ['e-waste', 'plastic', 'metal', 'paper', 'other'], required: true },
  weight: { type: Number, required: true }, // Estimated weight in kg
  city: { type: String, default: 'Mumbai' }, // Location of the scrap
  imageUrl: { type: String }, // Storing base64 or URL
  proofPhotos: [{ type: String }], // Array of proof photo URLs/base64 for seller completion proof
  status: { type: String, enum: ['active', 'scheduled', 'completed'], default: 'active' },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // The buyer who requested pickup or had offer accepted
  offers: [offerSchema], // Array of offers made on this listing
  completedAt: { type: Date, default: null } // When the transaction was completed
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
