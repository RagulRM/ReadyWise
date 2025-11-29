const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 5,
    max: 15
  },
  grade: {
    type: String,
    required: true
  },
  school: {
    type: String,
    default: 'Not specified'
  },
  location: {
    state: {
      type: String,
      required: true
    },
    city: String,
    district: String,
    pincode: String
  },
  language: {
    type: String,
    default: 'English',
    enum: ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam']
  },
  progress: {
    completedModules: [{
      moduleId: String,
      moduleType: String,
      completedAt: Date,
      score: Number
    }],
    badges: [{
      badgeId: String,
      badgeName: String,
      earnedAt: Date
    }],
    totalScore: {
      type: Number,
      default: 0
    },
    currentLevel: {
      type: Number,
      default: 1
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
