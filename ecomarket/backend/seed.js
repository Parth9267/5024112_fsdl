const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Listing = require('./models/Listing');

// Mumbai Metropolitan Region locations
const mumbaiLocations = [
  'Andheri West', 'Andheri East', 'Bandra West', 'Bandra East', 'Dadar',
  'Borivali West', 'Borivali East', 'Malad West', 'Malad East', 'Goregaon West',
  'Goregaon East', 'Kandivali West', 'Kandivali East', 'Jogeshwari West',
  'Vile Parle', 'Santacruz', 'Khar West', 'Juhu', 'Versova', 'Lokhandwala',
  'Powai', 'Vikhroli', 'Ghatkopar', 'Mulund', 'Bhandup', 'Kurla',
  'Chembur', 'Sion', 'Wadala', 'Matunga', 'Parel', 'Worli',
  'Lower Parel', 'Churchgate', 'Fort', 'Colaba', 'Marine Lines',
  'Navi Mumbai', 'Vashi', 'Airoli', 'Panvel', 'Kharghar', 'Belapur',
  'Thane West', 'Thane East', 'Dombivli', 'Kalyan', 'Mira Road', 'Dahisar',
  'Vasai', 'Virar', 'Bhayander'
];

const getRandomLocation = () => mumbaiLocations[Math.floor(Math.random() * mumbaiLocations.length)];

const sampleListings = [
  // E-Waste (10 items)
  { title: 'Old Desktop Computer', category: 'e-waste', weight: 8 },
  { title: 'Broken Laptop - Dell', category: 'e-waste', weight: 3 },
  { title: 'Old CRT Monitor', category: 'e-waste', weight: 12 },
  { title: 'Damaged Printer - HP', category: 'e-waste', weight: 6 },
  { title: 'Old Keyboard & Mouse Set', category: 'e-waste', weight: 1 },
  { title: 'Broken Microwave Oven', category: 'e-waste', weight: 14 },
  { title: 'Old Mobile Phones (5 units)', category: 'e-waste', weight: 0.8 },
  { title: 'Damaged Washing Machine PCB', category: 'e-waste', weight: 2 },
  { title: 'Old WiFi Router (3 units)', category: 'e-waste', weight: 1.5 },
  { title: 'Broken LED TV - 32 inch', category: 'e-waste', weight: 5 },

  // Plastic (10 items)
  { title: 'PET Bottles Bundle (50 pcs)', category: 'plastic', weight: 4 },
  { title: 'Old Plastic Chairs (4 pcs)', category: 'plastic', weight: 10 },
  { title: 'Plastic Packaging Material', category: 'plastic', weight: 3 },
  { title: 'Used Water Cans (20L x 5)', category: 'plastic', weight: 5 },
  { title: 'HDPE Containers Lot', category: 'plastic', weight: 7 },
  { title: 'Broken Plastic Buckets (10 pcs)', category: 'plastic', weight: 6 },
  { title: 'Old Plastic Pipes (10 ft)', category: 'plastic', weight: 8 },
  { title: 'PVC Scrap from Renovation', category: 'plastic', weight: 15 },
  { title: 'Plastic Crates Bundle', category: 'plastic', weight: 12 },
  { title: 'Damaged Plastic Storage Boxes', category: 'plastic', weight: 4 },

  // Metal (10 items)
  { title: 'Old Iron Gate', category: 'metal', weight: 25 },
  { title: 'Scrap Aluminum Sheets', category: 'metal', weight: 10 },
  { title: 'Used Copper Wire (5 kg)', category: 'metal', weight: 5 },
  { title: 'Old Steel Almirah', category: 'metal', weight: 30 },
  { title: 'Broken Ceiling Fan (3 units)', category: 'metal', weight: 9 },
  { title: 'Old Gas Stove - Steel Body', category: 'metal', weight: 8 },
  { title: 'Iron Rods (Sariya) Scrap', category: 'metal', weight: 20 },
  { title: 'Old Bicycle Frame', category: 'metal', weight: 7 },
  { title: 'AC Outdoor Unit (Non-working)', category: 'metal', weight: 35 },
  { title: 'Scrap Brass Items Lot', category: 'metal', weight: 3 },

  // Paper (10 items)
  { title: 'Old Newspapers (6 months)', category: 'paper', weight: 15 },
  { title: 'Used Textbooks Bundle', category: 'paper', weight: 8 },
  { title: 'Cardboard Boxes (Moving)', category: 'paper', weight: 12 },
  { title: 'Office Paper Waste', category: 'paper', weight: 20 },
  { title: 'Old Magazines Collection', category: 'paper', weight: 6 },
  { title: 'Corrugated Packaging Scrap', category: 'paper', weight: 10 },
  { title: 'Exam Answer Sheets (Old)', category: 'paper', weight: 5 },
  { title: 'Shredded Paper Bags', category: 'paper', weight: 3 },
  { title: 'Notebook Scrap (School)', category: 'paper', weight: 7 },
  { title: 'Wedding Card Waste Lot', category: 'paper', weight: 4 },

  // Other (5 items)
  { title: 'Old Rubber Tyres (4 pcs)', category: 'other', weight: 20 },
  { title: 'Broken Glass Bottles (Crate)', category: 'other', weight: 15 },
  { title: 'Old Clothes Bundle (30 kg)', category: 'other', weight: 30 },
  { title: 'Wooden Furniture Scrap', category: 'other', weight: 18 },
  { title: 'Mixed Junk Clearance Lot', category: 'other', weight: 25 },
];

// Extra completed listings (to ensure 20+ completed purchases)
const completedListings = [
  { title: 'Recycled Office Computers (Batch)', category: 'e-waste', weight: 22 },
  { title: 'Old Refrigerator - LG', category: 'e-waste', weight: 45 },
  { title: 'Scrap Motherboards (10 pcs)', category: 'e-waste', weight: 3.5 },
  { title: 'PET Bottle Collection (200 pcs)', category: 'plastic', weight: 18 },
  { title: 'Industrial Plastic Wrap Rolls', category: 'plastic', weight: 9 },
  { title: 'Broken Plastic Furniture Set', category: 'plastic', weight: 14 },
  { title: 'Scrap Iron Railing - Balcony', category: 'metal', weight: 16 },
  { title: 'Old Aluminum Windows (4 sets)', category: 'metal', weight: 20 },
  { title: 'Copper Piping Scrap (8 meters)', category: 'metal', weight: 6 },
  { title: 'Steel Kitchen Rack - Rusted', category: 'metal', weight: 11 },
  { title: 'Old Library Books (Bulk)', category: 'paper', weight: 35 },
  { title: 'Newspaper Collection (1 year)', category: 'paper', weight: 25 },
  { title: 'Cardboard Packaging (Diwali)', category: 'paper', weight: 10 },
  { title: 'Broken Ceramic Tiles Lot', category: 'other', weight: 40 },
  { title: 'Old Mattress (2 pcs)', category: 'other', weight: 22 },
  { title: 'Construction Debris - Wood', category: 'other', weight: 50 },
  { title: 'Used AC Unit - Window Type', category: 'e-waste', weight: 30 },
  { title: 'Old Mixer Grinder (3 units)', category: 'e-waste', weight: 8 },
  { title: 'Scrap HDPE Drums (5 pcs)', category: 'plastic', weight: 12 },
  { title: 'Old Tin Cans Collection', category: 'metal', weight: 7 },
  { title: 'Wedding Invitation Card Waste', category: 'paper', weight: 5 },
  { title: 'Wooden Door Frames (2 sets)', category: 'other', weight: 28 },
  { title: 'Old Washing Machine - Samsung', category: 'e-waste', weight: 38 },
  { title: 'Thermocol Packaging Waste', category: 'plastic', weight: 4 },
  { title: 'Old Iron Bed Frame', category: 'metal', weight: 32 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log('Cleared old data');

    // Create demo seller accounts with Mumbai MMR locations
    const sellers = [
      { name: 'Rajesh Kumar', email: 'rajesh@test.com', password: '123456', role: 'seller' },
      { name: 'Priya Sharma', email: 'priya@test.com', password: '123456', role: 'seller' },
      { name: 'Amit Patel', email: 'amit@test.com', password: '123456', role: 'seller' },
      { name: 'Sneha Desai', email: 'sneha@test.com', password: '123456', role: 'seller' },
      { name: 'Vikram Singh', email: 'vikram@test.com', password: '123456', role: 'seller' },
      { name: 'Meera Joshi', email: 'meera@test.com', password: '123456', role: 'seller' },
      { name: 'Rohan Gupta', email: 'rohan@test.com', password: '123456', role: 'seller' },
    ];

    // Create demo buyer accounts
    const buyers = [
      { name: 'GreenRecycle Corp', email: 'buyer@test.com', password: '123456', role: 'buyer' },
      { name: 'EcoScrap Traders', email: 'ecoscrap@test.com', password: '123456', role: 'buyer' },
      { name: 'Mumbai Recyclers Pvt Ltd', email: 'mumbairecyclers@test.com', password: '123456', role: 'buyer' },
    ];

    const createdSellers = [];
    for (const s of sellers) {
      const user = await User.create(s);
      createdSellers.push(user);
    }
    console.log(`Created ${createdSellers.length} seller accounts`);

    const createdBuyers = [];
    for (const b of buyers) {
      const user = await User.create(b);
      createdBuyers.push(user);
    }
    console.log(`Created ${createdBuyers.length} buyer accounts`);

    // Create active listings assigned to random sellers with Mumbai locations
    for (const item of sampleListings) {
      const randomSeller = createdSellers[Math.floor(Math.random() * createdSellers.length)];
      await Listing.create({
        ...item,
        seller: randomSeller._id,
        city: getRandomLocation(),
        status: 'active'
      });
    }
    console.log(`Created ${sampleListings.length} active listings`);

    // Create 25 completed listings with proof of completion
    let completedCount = 0;
    for (const item of completedListings) {
      const randomSeller = createdSellers[Math.floor(Math.random() * createdSellers.length)];
      const randomBuyer = createdBuyers[Math.floor(Math.random() * createdBuyers.length)];
      
      // Create a completed listing with an accepted offer
      const listing = await Listing.create({
        ...item,
        seller: randomSeller._id,
        buyer: randomBuyer._id,
        city: getRandomLocation(),
        status: 'completed',
        completedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
        offers: [{
          buyer: randomBuyer._id,
          buyerName: randomBuyer.name,
          amount: Math.floor(Math.random() * 2000) + 200,
          status: 'accepted'
        }]
      });

      completedCount++;

      // Increment completed transactions for both parties
      await User.findByIdAndUpdate(randomSeller._id, { $inc: { completedTransactions: 1 } });
      await User.findByIdAndUpdate(randomBuyer._id, { $inc: { completedTransactions: 1 } });
    }
    console.log(`Created ${completedCount} completed listings`);

    // Set ratings for some sellers
    for (const seller of createdSellers) {
      const randomRating = (Math.random() * 2 + 3).toFixed(1); // Rating between 3.0 and 5.0
      const totalRatings = Math.floor(Math.random() * 15) + 3;
      await User.findByIdAndUpdate(seller._id, {
        averageRating: parseFloat(randomRating),
        totalRatings: totalRatings
      });
    }
    console.log('Set seller ratings');

    console.log('\n=== SEED COMPLETE ===');
    console.log('Seller Logins (any of these):');
    sellers.forEach(s => console.log(`  Email: ${s.email} | Password: 123456`));
    console.log('\nBuyer Logins:');
    buyers.forEach(b => console.log(`  Email: ${b.email} | Password: 123456`));
    console.log(`\nTotal Active Listings: ${sampleListings.length}`);
    console.log(`Total Completed Listings: ${completedCount}`);
    console.log('All locations: Mumbai Metropolitan Region');
    console.log('====================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
