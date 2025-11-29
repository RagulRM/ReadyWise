/**
 * Database Configuration
 * MongoDB connection settings and configuration
 */

const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    // Get MongoDB URI with fallback
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster-response';
    
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📍 URI:', mongoUri.replace(/:([^:@]*@)/, ':****@')); // Hide password in logs
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const connection = await mongoose.connect(mongoUri, options);

    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
    console.log(`📊 Database: ${connection.connection.name}`);
    
    return connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('💡 Troubleshooting:');
    console.error('   1. Make sure MongoDB is running locally');
    console.error('   2. Check your .env file has MONGODB_URI set');
    console.error('   3. Verify the database URI is correct');
    
    // Don't exit in development, allow app to run without DB for testing
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('⚠️  Running in development mode without database connection');
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDatabase;
