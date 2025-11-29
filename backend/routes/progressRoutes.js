const express = require('express');
const router = express.Router();

// In-memory storage (replace with database)
let progressData = [];

/**
 * POST /api/progress
 * Save student progress
 */
router.post('/', (req, res) => {
  try {
    const { userId, moduleId, moduleType, score, completed, timeTaken } = req.body;
    
    const progress = {
      userId,
      moduleId,
      moduleType, // 'game', 'quiz', 'video', 'simulation'
      score: score || 0,
      completed: completed || false,
      timeTaken: timeTaken || 0,
      timestamp: new Date()
    };
    
    progressData.push(progress);
    
    res.json({
      success: true,
      message: 'Progress saved successfully',
      progress
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save progress', message: error.message });
  }
});

/**
 * GET /api/progress/:userId
 * Get all progress for a user
 */
router.get('/:userId', (req, res) => {
  try {
    const userProgress = progressData.filter(p => p.userId === req.params.userId);
    
    // Calculate statistics
    const stats = {
      totalModulesCompleted: userProgress.filter(p => p.completed).length,
      totalScore: userProgress.reduce((sum, p) => sum + p.score, 0),
      averageScore: userProgress.length > 0 
        ? (userProgress.reduce((sum, p) => sum + p.score, 0) / userProgress.length).toFixed(2)
        : 0,
      totalTimeLearning: userProgress.reduce((sum, p) => sum + p.timeTaken, 0)
    };
    
    res.json({
      success: true,
      progress: userProgress,
      statistics: stats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress', message: error.message });
  }
});

/**
 * POST /api/progress/badge
 * Award a badge to user
 */
router.post('/badge', (req, res) => {
  try {
    const { userId, badgeId, badgeName } = req.body;
    
    const badge = {
      userId,
      badgeId,
      badgeName,
      earnedAt: new Date()
    };
    
    res.json({
      success: true,
      message: `Congratulations! You earned the ${badgeName} badge! 🎖️`,
      badge
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to award badge', message: error.message });
  }
});

module.exports = router;
