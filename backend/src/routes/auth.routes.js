/**
 * Authentication Routes
 * Routes for registration, login, and email verification
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// =============================================
// ORGANIZATION ROUTES
// =============================================

router.post('/organization/register', authController.registerOrganization);
router.post('/organization/login', authController.loginOrganization);

// =============================================
// TEACHER ROUTES
// =============================================

router.post('/teacher/register', authController.registerTeacher);
router.post('/teacher/login', authController.loginTeacher);

// =============================================
// STUDENT ROUTES
// =============================================

router.post('/student/register', authController.registerStudent);
router.post('/student/login', authController.loginStudent);

// =============================================
// COMMON ROUTES
// =============================================

// Email verification
router.get('/verify-email/:token', authController.verifyEmail);

// Get current user
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;