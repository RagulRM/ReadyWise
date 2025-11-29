/**
 * Student Model
 * For student accounts with learning progress
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  // Organization Reference
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization is required']
  },

  // Class Teacher Reference
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
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

  // Academic Information
  class: {
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

  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true
  },

  // Additional Information
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  phone: String,
  parentPhone: String,
  parentEmail: String,

  // Profile
  profilePicture: String,
  
  // Learning Progress - References to Progress Model
  progress: {
    modulesCompleted: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Progress'
    }],
    quizzesCompleted: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Progress'
    }],
    gamesCompleted: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Progress'
    }],
    totalScore: {
      type: Number,
      default: 0
    },
    badges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    }]
  },

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
  enrollmentDate: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for organization, class, and roll number uniqueness
studentSchema.index({ 
  organization: 1, 
  'class.grade': 1, 
  'class.section': 1, 
  rollNumber: 1 
}, { unique: true });

// Index for faster queries
studentSchema.index({ organization: 1, classTeacher: 1 });

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
studentSchema.methods.createVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return token;
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;