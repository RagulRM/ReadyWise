/**
 * Disaster Routes
 * Routes for disaster information and personalized modules
 */

const express = require('express');
const router = express.Router();
const {
  getDisasters,
  getDisasterDetails,
  getSafetySteps,
  getPersonalizedDisasterModules,
  getModuleDetails,
  getOrganizationDisasterStats,
  getAllModules,
  getModuleLessons,
  getModuleQuiz,
  submitModuleQuiz,
  submitQuiz
} = require('../controllers/disaster.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Public routes
// @route   GET /api/disasters
// @desc    Get all disasters
// @access  Public
router.get('/', getDisasters);

// @route   GET /api/disasters/:id
// @desc    Get disaster details
// @access  Public
router.get('/:id', getDisasterDetails);

// @route   GET /api/disasters/:id/safety-steps
// @desc    Get safety steps for disaster
// @access  Public
router.get('/:id/safety-steps', getSafetySteps);

// Protected routes - Student
// @route   GET /api/disasters/personalized
// @desc    Get personalized modules based on student location
// @access  Private (Student)
router.get('/personalized/modules', protect, restrictTo('student'), getPersonalizedDisasterModules);

// @route   GET /api/disasters/module/:moduleId
// @desc    Get module details
// @access  Private
router.get('/module/:moduleId', protect, getModuleDetails);

// Alias route for game page compatibility
// @route   GET /api/disasters/modules/:moduleId
// @desc    Get module details (alias)
// @access  Private
router.get('/modules/:moduleId', protect, getModuleDetails);

// @route   GET /api/disasters/module/:moduleId/lessons
// @desc    Get module lessons
// @access  Private
router.get('/module/:moduleId/lessons', protect, getModuleLessons);

// @route   GET /api/disasters/module/:moduleId/quiz
// @desc    Get module quiz
// @access  Private
router.get('/module/:moduleId/quiz', protect, getModuleQuiz);

// @route   POST /api/disasters/module/:moduleId/quiz/submit
// @desc    Submit quiz answers (Grade-specific)
// @access  Private (Student)
router.post('/module/:moduleId/quiz/submit', protect, restrictTo('student'), submitModuleQuiz);

// Legacy quiz submit route (keeping for backward compatibility)
// @route   POST /api/disasters/module/:moduleId/quiz/submit-legacy
// @desc    Submit quiz answers (Legacy)
// @access  Private (Student)
router.post('/module/:moduleId/quiz/submit-legacy', protect, restrictTo('student'), submitQuiz);

// Protected routes - Organization
// @route   GET /api/disasters/stats/organization
// @desc    Get disaster statistics for organization
// @access  Private (Organization)
router.get('/stats/organization', protect, restrictTo('organization'), getOrganizationDisasterStats);

// Protected routes - All authenticated users
// @route   GET /api/disasters/modules
// @desc    Get all modules
// @access  Private
router.get('/modules/all', protect, getAllModules);

module.exports = router;
