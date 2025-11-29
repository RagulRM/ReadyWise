/**
 * Badge Routes
 * Placeholder for badge management routes
 */

const express = require('express');
const router = express.Router();

// @route   GET /api/badges
// @desc    Get all available badges
// @access  Public
router.get('/', (req, res) => {
  res.json({ message: 'Get badges endpoint - to be implemented' });
});

// @route   GET /api/badges/:category
// @desc    Get badges by category
// @access  Public
router.get('/:category', (req, res) => {
  res.json({ message: 'Get badges by category endpoint - to be implemented' });
});

module.exports = router;
