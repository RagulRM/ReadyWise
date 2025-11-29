const express = require('express');
const router = express.Router();
const disasterContent = require('../data/disasterContent');

/**
 * GET /api/disasters
 * Get all disaster types
 */
router.get('/', (req, res) => {
  try {
    const disasters = Object.values(disasterContent).map(d => ({
      id: d.id,
      name: d.name,
      icon: d.icon,
      description: d.description
    }));
    
    res.json({ success: true, disasters });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch disasters', message: error.message });
  }
});

/**
 * GET /api/disasters/:id
 * Get detailed info about a specific disaster
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const disaster = disasterContent[id];
    
    if (!disaster) {
      return res.status(404).json({ error: 'Disaster type not found' });
    }
    
    res.json({ success: true, disaster });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch disaster details', message: error.message });
  }
});

/**
 * GET /api/disasters/:id/safety-steps
 * Get safety steps for a disaster
 */
router.get('/:id/safety-steps', (req, res) => {
  try {
    const { id } = req.params;
    const disaster = disasterContent[id];
    
    if (!disaster) {
      return res.status(404).json({ error: 'Disaster type not found' });
    }
    
    res.json({
      success: true,
      disasterName: disaster.name,
      safetySteps: disaster.safetySteps,
      dos: disaster.dos,
      donts: disaster.donts
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch safety steps', message: error.message });
  }
});

module.exports = router;
