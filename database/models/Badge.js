const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  badgeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['disaster-specific', 'achievement', 'milestone', 'special'],
    required: true
  },
  criteria: {
    type: {
      type: String,
      enum: ['score', 'completion', 'streak', 'speed', 'perfect'],
      required: true
    },
    requirement: {
      type: Number,
      required: true
    },
    description: String
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  color: {
    type: String,
    default: '#667eea'
  }
});

module.exports = mongoose.model('Badge', badgeSchema);
