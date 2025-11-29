/**
 * Organization/School Model
 * For admin accounts that manage teachers and students
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const organizationSchema = new mongoose.Schema({
  // Basic Information
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    unique: true
  },
  
  organizationType: {
    type: String,
    enum: ['school', 'organization', 'institution'],
    default: 'school'
  },

  // Admin Contact
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
    select: false // Don't return password in queries by default
  },

  // Location for Disaster Personalization
  location: {
    state: {
      type: String,
      required: [true, 'State is required for disaster personalization'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required for disaster personalization'],
      trim: true
    },
    district: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      trim: true,
      match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
    },
    disasterPriority: [{
      type: String,
      enum: ['earthquake', 'flood', 'cyclone', 'fire', 'tsunami', 'landslide', 'drought']
    }]
  },

  // Contact Information
  contactPerson: {
    name: String,
    phone: String,
    designation: String
  },

  // Organization Details
  establishedYear: Number,
  totalTeachers: {
    type: Number,
    default: 0
  },
  totalStudents: {
    type: Number,
    default: 0
  },

  // Verification Status
  isVerified: {
    type: Boolean,
    default: false
  },
  
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

  // Subscription/Plan (for future use)
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },

  // Metadata
  lastLogin: Date,
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for teachers
organizationSchema.virtual('teachers', {
  ref: 'Teacher',
  localField: '_id',
  foreignField: 'organization'
});

// Virtual for students
organizationSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'organization'
});

// Hash password before saving
organizationSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
organizationSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
organizationSchema.methods.createVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return token;
};

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;