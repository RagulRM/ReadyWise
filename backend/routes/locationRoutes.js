const express = require('express');
const router = express.Router();
const { getDisastersByLocation, getLocationRiskProfile } = require('../utils/locationMapper');

/**
 * POST /api/location/disasters
 * Get personalized disasters based on location
 */
router.post('/disasters', (req, res) => {
  try {
    const { state, city, district, pincode } = req.body;
    
    if (!state) {
      return res.status(400).json({ error: 'State is required' });
    }
    
    const riskProfile = getLocationRiskProfile(state, city, district);
    const disasters = getDisastersByLocation(state, city, pincode);
    
    res.json({
      success: true,
      location: {
        state,
        city,
        district,
        pincode
      },
      riskProfile,
      disasters,
      message: `Found ${disasters.length} relevant disaster types for your location`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location data', message: error.message });
  }
});

/**
 * GET /api/location/states
 * Get list of all states
 */
router.get('/states', (req, res) => {
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Puducherry', 'Andaman and Nicobar Islands',
    'Lakshadweep'
  ];
  
  res.json({ success: true, states });
});

module.exports = router;
