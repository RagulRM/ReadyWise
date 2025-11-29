/**
 * Progress Routes
 * Placeholder for progress tracking routes
 */

const express = require('express');
const router = express.Router();

// @route   POST /api/progress
// @desc    Save user progress
// @access  Public
router.post('/', (req, res) => {
  res.json({ message: 'Save progress endpoint - to be implemented' });
});

// @route   GET /api/progress/:userId
// @desc    Get user progress
// @access  Public
router.get('/:userId', (req, res) => {
  res.json({ message: 'Get progress endpoint - to be implemented' });
});

module.exports = router;
