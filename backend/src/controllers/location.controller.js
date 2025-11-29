/**
 * Location Controller
 * Handles location-based disaster identification
 */

const {
  getDisastersByLocation,
  getLocationRiskProfile,
  getAllStates,
  isValidState,
} = require('../services/location.service');
const { getDisastersByTypes } = require('../services/disaster.service');
const { sendSuccess, sendError } = require('../utils/response.util');
const { validateRequiredFields } = require('../utils/validation.util');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants/response.constants');

/**
 * @route   POST /api/location/disasters
 * @desc    Get personalized disasters based on user location
 * @access  Public
 */
const getLocationDisasters = async (req, res) => {
  try {
    const { state, city, district, pincode } = req.body;
    
    // Validate required fields
    const validation = validateRequiredFields(req.body, ['state']);
    if (!validation.isValid) {
      return sendError(res, validation.errors.join(', '), HTTP_STATUS.BAD_REQUEST);
    }
    
    // Validate state exists
    if (!isValidState(state)) {
      return sendError(res, `Invalid state: ${state}`, HTTP_STATUS.BAD_REQUEST);
    }
    
    // Get risk profile and disasters
    const riskProfile = getLocationRiskProfile(state, city, district);
    const disasterTypes = getDisastersByLocation(state, city, pincode);
    const disasters = getDisastersByTypes(disasterTypes);
    
    const responseData = {
      location: { state, city, district, pincode },
      riskProfile,
      disasters,
      totalDisasters: disasters.length,
    };
    
    return sendSuccess(
      res,
      responseData,
      `Found ${disasters.length} relevant disaster types for ${state}`
    );
  } catch (error) {
    console.error('Error in getLocationDisasters:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   GET /api/location/states
 * @desc    Get list of all Indian states and UTs
 * @access  Public
 */
const getStates = async (req, res) => {
  try {
    const states = getAllStates();
    
    return sendSuccess(res, { states, count: states.length }, 'States retrieved successfully');
  } catch (error) {
    console.error('Error in getStates:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   GET /api/location/risk-profile/:state
 * @desc    Get detailed risk profile for a state
 * @access  Public
 */
const getRiskProfile = async (req, res) => {
  try {
    const { state } = req.params;
    const { city, district } = req.query;
    
    if (!isValidState(state)) {
      return sendError(res, `Invalid state: ${state}`, HTTP_STATUS.BAD_REQUEST);
    }
    
    const riskProfile = getLocationRiskProfile(state, city, district);
    
    return sendSuccess(res, riskProfile, 'Risk profile retrieved successfully');
  } catch (error) {
    console.error('Error in getRiskProfile:', error);
    return sendError(res, error.message);
  }
};

module.exports = {
  getLocationDisasters,
  getStates,
  getRiskProfile,
};
