const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database in production)
let users = [];

/**
 * POST /api/users/register
 * Register a new student
 */
router.post('/register', (req, res) => {
  try {
    const { name, age, grade, school, state, city, district, language } = req.body;
    
    if (!name || !age || !grade) {
      return res.status(400).json({ error: 'Name, age, and grade are required' });
    }
    
    const user = {
      id: uuidv4(),
      name,
      age,
      grade,
      school: school || 'Not specified',
      location: {
        state: state || 'Not specified',
        city: city || 'Not specified',
        district: district || 'Not specified'
      },
      language: language || 'English',
      createdAt: new Date(),
      progress: {
        completedModules: [],
        badges: [],
        totalScore: 0
      }
    };
    
    users.push(user);
    
    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
});

/**
 * GET /api/users/:id
 * Get user profile
 */
router.get('/:id', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', message: error.message });
  }
});

/**
 * GET /api/users/:id/progress
 * Get user's learning progress
 */
router.get('/:id/progress', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, progress: user.progress });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress', message: error.message });
  }
});

module.exports = router;
