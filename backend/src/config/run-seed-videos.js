/**
 * Seed Video Lessons Only
 * Run this script to update video lessons without re-seeding everything
 * Usage: node src/config/run-seed-videos.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { seedVideoLessons } = require('./seed-video-lessons');

const runVideoSeeding = async () => {
  try {
    console.log('🎥 Starting video lessons seeding...\n');

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster-response';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✓ Connected to MongoDB\n');

    // Seed video lessons
    await seedVideoLessons();

    console.log('\n✅ Video seeding completed successfully!');
    
    // Disconnect
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during video seeding:', error);
    process.exit(1);
  }
};

// Run seeding
runVideoSeeding();
