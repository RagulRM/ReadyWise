/**
 * Module Progress Routes
 * API endpoints for tracking student progress through learning path steps
 */

const express = require('express');
const router = express.Router();
const ModuleProgress = require('../models/ModuleProgress.model');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { sendSuccess, sendError } = require('../utils/response.util');

// @route   GET /api/module-progress/:moduleId
// @desc    Get student's progress for a specific module
// @access  Private (Student)
router.get('/:moduleId', protect, restrictTo('student'), async (req, res) => {
  try {
    const { moduleId } = req.params;
    const studentId = req.user.id;

    const progress = await ModuleProgress.getOrCreate(studentId, moduleId);

    sendSuccess(res, progress, 'Progress retrieved successfully');
  } catch (error) {
    console.error('Error fetching module progress:', error);
    sendError(res, 'Failed to fetch progress', 500);
  }
});

// @route   GET /api/module-progress/student/all
// @desc    Get all module progress for logged-in student
// @access  Private (Student)
router.get('/student/all', protect, restrictTo('student'), async (req, res) => {
  try {
    const studentId = req.user.id;

    const allProgress = await ModuleProgress.getStudentProgress(studentId, { populate: true });

    sendSuccess(res, allProgress, 'All progress retrieved successfully');
  } catch (error) {
    console.error('Error fetching all student progress:', error);
    sendError(res, 'Failed to fetch progress', 500);
  }
});

// @route   POST /api/module-progress/:moduleId/step/:stepName
// @desc    Mark a step as complete
// @access  Private (Student)
router.post('/:moduleId/step/:stepName', protect, restrictTo('student'), async (req, res) => {
  try {
    const { moduleId, stepName } = req.params;
    const studentId = req.user.id;
    const additionalData = req.body;

    console.log(`📝 Step completion request:`, { moduleId, stepName, studentId, additionalData });

    // Validate step name
    const validSteps = ['learn', 'videos', 'quiz', 'practice', 'game'];
    if (!validSteps.includes(stepName)) {
      console.warn('⚠️ Invalid step name:', stepName);
      return sendError(res, `Invalid step name: ${stepName}`, 400);
    }

    const progress = await ModuleProgress.getOrCreate(studentId, moduleId);
    console.log(`📊 Progress before ${stepName} completion:`, JSON.stringify(progress.stepCompletions[stepName], null, 2));
    
    await progress.completeStep(stepName, additionalData);
    
    console.log(`✅ Progress after ${stepName} completion:`, JSON.stringify(progress.stepCompletions[stepName], null, 2));

    sendSuccess(res, progress, `Step '${stepName}' marked as complete`);
  } catch (error) {
    console.error('❌ Error completing step:', error);
    sendError(res, error.message || 'Failed to complete step', 500);
  }
});

// @route   POST /api/module-progress/:moduleId/video/:videoId
// @desc    Record video watch
// @access  Private (Student)
router.post('/:moduleId/video/:videoId', protect, restrictTo('student'), async (req, res) => {
  try {
    const { moduleId, videoId } = req.params;
    const { totalVideos } = req.body; // Total videos in module
    const studentId = req.user.id;

    console.log('📹 Video watch request:', { moduleId, videoId, totalVideos, studentId });

    if (!totalVideos || totalVideos <= 0) {
      console.warn('⚠️ Invalid totalVideos:', totalVideos);
      return sendError(res, 'Total videos count is required', 400);
    }

    const progress = await ModuleProgress.getOrCreate(studentId, moduleId);
    console.log('📊 Progress before update:', JSON.stringify(progress.stepCompletions.videos, null, 2));
    
    await progress.recordVideoWatch(videoId, totalVideos);
    
    console.log('✅ Progress after update:', JSON.stringify(progress.stepCompletions.videos, null, 2));

    sendSuccess(res, progress, 'Video watch recorded');
  } catch (error) {
    console.error('❌ Error recording video watch:', error);
    sendError(res, 'Failed to record video watch', 500);
  }
});

// @route   GET /api/module-progress/module/:moduleId/students
// @desc    Get all students' progress for a specific module (for teachers)
// @access  Private (Teacher)
router.get('/module/:moduleId/students', protect, restrictTo('teacher'), async (req, res) => {
  try {
    const { moduleId } = req.params;

    const allProgress = await ModuleProgress.getModuleProgress(moduleId, { populate: true });

    sendSuccess(res, allProgress, 'Module progress for all students retrieved');
  } catch (error) {
    console.error('Error fetching module progress for students:', error);
    sendError(res, 'Failed to fetch progress', 500);
  }
});

// @route   GET /api/module-progress/teacher/overview
// @desc    Get overview of all students' progress across all modules (for teachers)
// @access  Private (Teacher)
router.get('/teacher/overview', protect, restrictTo('teacher'), async (req, res) => {
  try {
    // Get all students under this teacher's organization
    const teacherId = req.user.id;
    const Teacher = require('../models/Teacher.model');
    const teacher = await Teacher.findById(teacherId).populate('organization');
    
    if (!teacher) {
      return sendError(res, 'Teacher not found', 404);
    }

    // Find all students in same organization
    const Student = require('../models/Student.model');
    const students = await Student.find({ organization: teacher.organization._id });
    const studentIds = students.map(s => s._id);

    // Get progress for all these students
    const allProgress = await ModuleProgress.find({ student: { $in: studentIds } })
      .populate('student', 'name email class')
      .populate('module', 'name type gradeLevel');

    sendSuccess(res, allProgress, 'Teacher overview retrieved');
  } catch (error) {
    console.error('Error fetching teacher overview:', error);
    sendError(res, 'Failed to fetch overview', 500);
  }
});

module.exports = router;
