/**
 * Seed All Data
 * Seeds badges, disaster modules, and video lessons into database
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { seedDatabase } = require('./seed-database');
const { seedDisasterModules } = require('./seed-disaster-modules');
const { seedVideoLessons } = require('./seed-video-lessons');

const seedAll = async () => {
  try {
    console.log('🚀 Starting database seeding process...\n');

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster-response';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✓ Connected to MongoDB\n');

    // Seed badges
    console.log('📛 Seeding badges...');
    await seedDatabase();
    console.log('✓ Badges seeding completed\n');

    // Seed disaster modules
    console.log('🌍 Seeding disaster modules...');
    await seedDisasterModules();
    console.log('✓ Disaster modules seeding completed\n');

    // Seed video lessons
    console.log('🎥 Seeding video lessons...');
    await seedVideoLessons();
    console.log('✓ Video lessons seeding completed\n');

    console.log('✅ All seeding completed successfully!');
    
    // Disconnect
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

// Run seeding
seedAll();
