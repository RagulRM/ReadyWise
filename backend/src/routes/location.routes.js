/**
 * Location Routes
 * Routes for location-based disaster identification
 */

const express = require('express');
const router = express.Router();
const {
  getLocationDisasters,
  getStates,
  getRiskProfile,
} = require('../controllers/location.controller');

// @route   POST /api/location/disasters
// @desc    Get disasters based on location
// @access  Public
router.post('/disasters', getLocationDisasters);

// @route   GET /api/location/states
// @desc    Get all Indian states
// @access  Public
router.get('/states', getStates);

// @route   GET /api/location/risk-profile/:state
// @desc    Get risk profile for a state
// @access  Public
router.get('/risk-profile/:state', getRiskProfile);

module.exports = router;
