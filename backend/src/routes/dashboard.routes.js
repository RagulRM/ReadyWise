/**
 * Dashboard Routes
 * Routes for organization, teacher, and student dashboards
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// =============================================
// ORGANIZATION DASHBOARD ROUTES
// =============================================

router.get(
  '/organization',
  protect,
  restrictTo('organization'),
  dashboardController.getOrganizationDashboard
);

router.get(
  '/organization/teachers/:grade/:section',
  protect,
  restrictTo('organization'),
  dashboardController.getTeachersByClass
);

// =============================================
// TEACHER DASHBOARD ROUTES
// =============================================

router.get(
  '/teacher',
  protect,
  restrictTo('teacher'),
  dashboardController.getTeacherDashboard
);

router.get(
  '/teacher/student/:studentId',
  protect,
  restrictTo('teacher'),
  dashboardController.getStudentProgress
);

// =============================================
// STUDENT DASHBOARD ROUTES
// =============================================

router.get(
  '/student',
  protect,
  restrictTo('student'),
  dashboardController.getStudentDashboard
);

router.get(
  '/student/content',
  protect,
  restrictTo('student'),
  dashboardController.getStudentContent
);

module.exports = router;