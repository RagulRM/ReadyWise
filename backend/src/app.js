/**
 * Disaster Response Platform - Main Application Entry Point
 * A location-aware disaster response training platform for primary school students
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const connectDatabase = require('./config/database.config');
const appConfig = require('./config/app.config');
const { requestLogger, responseTimeLogger } = require('./middleware/logger.middleware');
const { notFound, errorHandler } = require('./middleware/error.middleware');

// Initialize Express app
const app = express();

// ==================== MIDDLEWARE ====================

// CORS Configuration
app.use(cors(appConfig.cors));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
if (appConfig.server.env !== 'test') {
  app.use(requestLogger);
  app.use(responseTimeLogger);
}

// ==================== ROUTES ====================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Disaster Response Platform API is running',
    environment: appConfig.server.env,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
const locationRoutes = require('./routes/location.routes');
const disasterRoutes = require('./routes/disaster.routes');
const userRoutes = require('./routes/user.routes');
const progressRoutes = require('./routes/progress.routes');
const quizRoutes = require('./routes/quiz.routes');
const gameRoutes = require('./routes/game.routes');
const badgeRoutes = require('./routes/badge.routes');

app.use(`${appConfig.server.apiPrefix}/location`, locationRoutes);
app.use(`${appConfig.server.apiPrefix}/disasters`, disasterRoutes);
app.use(`${appConfig.server.apiPrefix}/users`, userRoutes);
app.use(`${appConfig.server.apiPrefix}/progress`, progressRoutes);
app.use(`${appConfig.server.apiPrefix}/quiz`, quizRoutes);
app.use(`${appConfig.server.apiPrefix}/games`, gameRoutes);
app.use(`${appConfig.server.apiPrefix}/badges`, badgeRoutes);

// Welcome Route
app.get('/', (req, res) => {
  res.json({
    name: 'Disaster Response Training Platform API',
    version: '1.0.0',
    description: 'Location-aware disaster response training for primary school students',
    endpoints: {
      health: '/health',
      location: `${appConfig.server.apiPrefix}/location`,
      disasters: `${appConfig.server.apiPrefix}/disasters`,
      users: `${appConfig.server.apiPrefix}/users`,
      progress: `${appConfig.server.apiPrefix}/progress`,
      quiz: `${appConfig.server.apiPrefix}/quiz`,
      games: `${appConfig.server.apiPrefix}/games`,
      badges: `${appConfig.server.apiPrefix}/badges`,
    },
  });
});

// ==================== ERROR HANDLING ====================

// 404 Not Found
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// ==================== SERVER INITIALIZATION ====================

const startServer = async () => {
  try {
    // Connect to Database
    await connectDatabase();
    
    // Start Server
    const PORT = appConfig.server.port;
    app.listen(PORT, () => {
      console.log('\n🚀 ========================================');
      console.log('   DISASTER RESPONSE PLATFORM API');
      console.log('   ========================================');
      console.log(`   📍 Environment: ${appConfig.server.env}`);
      console.log(`   🌐 Server: http://localhost:${PORT}`);
      console.log(`   🔌 API Base: ${appConfig.server.apiPrefix}`);
      console.log(`   💾 Database: Connected`);
      console.log('   ========================================\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;
