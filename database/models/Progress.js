const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moduleId: {
    type: String,
    required: true
  },
  moduleType: {
    type: String,
    required: true,
    enum: ['game', 'quiz', 'video', 'simulation', 'reading']
  },
  disasterType: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0
  },
  attempts: {
    type: Number,
    default: 1
  },
  answers: [{
    questionId: String,
    userAnswer: String,
    isCorrect: Boolean,
    pointsEarned: Number
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
progressSchema.index({ userId: 1, timestamp: -1 });
progressSchema.index({ userId: 1, moduleId: 1 });

module.exports = mongoose.model('Progress', progressSchema);
