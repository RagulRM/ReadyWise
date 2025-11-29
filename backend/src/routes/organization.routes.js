/**
 * Organization Routes
 * Public routes for organization list and lookup
 */

const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organization.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Public routes (no auth required - needed for registration)
router.get('/list', organizationController.getOrganizationsList);
router.get('/check/:name', organizationController.checkOrganization);

// Protected route - Get all students under a specific teacher
router.get(
  '/teacher/:teacherId/students',
  protect,
  restrictTo('organization'),
  organizationController.getTeacherStudents
);

module.exports = router;