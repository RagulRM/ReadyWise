/**
 * Disaster Controller
 * Handles disaster information retrieval
 */

const {
  getAllDisasters,
  getDisasterById,
  getDisasterSafetySteps,
} = require('../services/disaster.service');
const { sendSuccess, sendNotFound } = require('../utils/response.util');

/**
 * @route   GET /api/disasters
 * @desc    Get all disaster types
 * @access  Public
 */
const getDisasters = async (req, res) => {
  try {
    const disasters = getAllDisasters();
    
    return sendSuccess(
      res,
      { disasters, count: disasters.length },
      'Disasters retrieved successfully'
    );
  } catch (error) {
    console.error('Error in getDisasters:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   GET /api/disasters/:id
 * @desc    Get detailed disaster information by ID
 * @access  Public
 */
const getDisasterDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const disaster = getDisasterById(id);
    
    if (!disaster) {
      return sendNotFound(res, 'Disaster');
    }
    
    return sendSuccess(res, disaster, 'Disaster details retrieved successfully');
  } catch (error) {
    console.error('Error in getDisasterDetails:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   GET /api/disasters/:id/safety-steps
 * @desc    Get safety steps for a specific disaster
 * @access  Public
 */
const getSafetySteps = async (req, res) => {
  try {
    const { id } = req.params;
    const safetySteps = getDisasterSafetySteps(id);
    
    if (safetySteps.length === 0) {
      return sendNotFound(res, 'Safety steps for this disaster');
    }
    
    return sendSuccess(
      res,
      { disasterId: id, safetySteps },
      'Safety steps retrieved successfully'
    );
  } catch (error) {
    console.error('Error in getSafetySteps:', error);
    return sendError(res, error.message);
  }
};

module.exports = {
  getDisasters,
  getDisasterDetails,
  getSafetySteps,
};
