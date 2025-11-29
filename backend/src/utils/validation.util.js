/**
 * Validation Utility Helper
 * Common validation functions
 */

/**
 * Validate required fields
 */
const validateRequiredFields = (data, requiredFields) => {
  const errors = [];
  
  requiredFields.forEach((field) => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate age range
 */
const validateAge = (age, min = 5, max = 15) => {
  const ageNum = parseInt(age);
  
  if (isNaN(ageNum)) {
    return { isValid: false, error: 'Age must be a number' };
  }
  
  if (ageNum < min || ageNum > max) {
    return { isValid: false, error: `Age must be between ${min} and ${max}` };
  }
  
  return { isValid: true };
};

/**
 * Validate pincode format (6 digits)
 */
const validatePincode = (pincode) => {
  if (!pincode) return { isValid: true }; // Optional field
  
  const pincodeRegex = /^\d{6}$/;
  
  if (!pincodeRegex.test(pincode)) {
    return { isValid: false, error: 'Pincode must be 6 digits' };
  }
  
  return { isValid: true };
};

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true };
};

/**
 * Sanitize string input
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
};

/**
 * Validate score range
 */
const validateScore = (score, maxScore) => {
  const scoreNum = parseInt(score);
  const maxScoreNum = parseInt(maxScore);
  
  if (isNaN(scoreNum) || isNaN(maxScoreNum)) {
    return { isValid: false, error: 'Score must be a number' };
  }
  
  if (scoreNum < 0 || scoreNum > maxScoreNum) {
    return { isValid: false, error: `Score must be between 0 and ${maxScoreNum}` };
  }
  
  return { isValid: true };
};

module.exports = {
  validateRequiredFields,
  validateAge,
  validatePincode,
  validateEmail,
  sanitizeString,
  validateScore,
};
