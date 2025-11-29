/**
 * Disaster Routes
 * Routes for disaster information
 */

const express = require('express');
const router = express.Router();
const {
  getDisasters,
  getDisasterDetails,
  getSafetySteps,
} = require('../controllers/disaster.controller');

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

module.exports = router;
