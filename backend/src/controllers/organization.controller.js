/**
 * Organization List Controller
 * Get list of all registered organizations for dropdown selection
 */

const Organization = require('../models/Organization.model');
const Student = require('../models/Student.model');

/**
 * Get all organizations (for teacher/student registration dropdown)
 * GET /api/organizations/list
 */
exports.getOrganizationsList = async (req, res) => {
  try {
    const organizations = await Organization.find({ isActive: true })
      .select('organizationName organizationType location')
      .sort({ organizationName: 1 });

    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching organizations',
      error: error.message
    });
  }
};

/**
 * Get organization by name (for validation during registration)
 * GET /api/organizations/check/:name
 */
exports.checkOrganization = async (req, res) => {
  try {
    const { name } = req.params;

    const organization = await Organization.findOne({ 
      organizationName: { $regex: new RegExp(`^${name}$`, 'i') },
      isActive: true 
    }).select('organizationName organizationType location');

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    res.status(200).json({
      success: true,
      data: organization
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking organization',
      error: error.message
    });
  }
};

/**
 * Get all students under a specific teacher
 * GET /api/organizations/teacher/:teacherId/students
 */
exports.getTeacherStudents = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Find all students assigned to this teacher
    const students = await Student.find({ classTeacher: teacherId })
      .select('name rollNumber email class isActive')
      .sort({ rollNumber: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher students',
      error: error.message
    });
  }
};