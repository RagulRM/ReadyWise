/**
 * Teacher Model
 * For teacher accounts that monitor student progress
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  // Organization Reference
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization is required']
  },

  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },

  // Professional Information
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },

  classTeacher: {
    grade: {
      type: Number,
      required: [true, 'Class grade is required'],
      min: 1,
      max: 12
    },
    section: {
      type: String,
      default: 'A',
      uppercase: true,
      trim: true
    }
  },

  // Additional Information
  qualification: String,
  experience: Number, // in years
  phone: {
    type: String,
    trim: true
  },
  dateOfJoining: {
    type: Date,
    default: Date.now
  },

  // Profile
  profilePicture: String,
  bio: String,

  // Verification
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  verificationToken: String,
  verificationTokenExpires: Date,

  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },

  // Metadata
  lastLogin: Date,

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for students under this teacher
teacherSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'classTeacher'
});

// Index for faster queries
teacherSchema.index({ organization: 1, 'classTeacher.grade': 1, 'classTeacher.section': 1 });

// Hash password before saving
teacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
teacherSchema.methods.createVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return token;
};

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;