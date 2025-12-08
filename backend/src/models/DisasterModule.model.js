/**
 * Disaster Module Model
 * Stores disaster preparedness learning modules
 */

const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  content: {
    type: String,
    required: true
  },
  mediaUrl: String,
  mediaType: {
    type: String,
    enum: ['image', 'video', 'animation', 'interactive']
  },
  duration: Number, // in minutes
  order: {
    type: Number,
    required: true
  },
  // Grade level targeting for videos
  gradeLevel: {
    type: String,
    enum: ['FOUNDATIONAL', 'BASIC', 'INTERMEDIATE', 'COMMUNITY', 'ANALYTICAL', null],
    default: null
  },
  ageGroup: String, // e.g., '5-8', '9-12', etc.
  minGrade: {
    type: Number,
    min: 1,
    max: 12,
    default: 1
  },
  maxGrade: {
    type: Number,
    min: 1,
    max: 12,
    default: 12
  }
});

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  explanation: String,
  points: {
    type: Number,
    default: 10
  }
});

const disasterModuleSchema = new mongoose.Schema({
  // Basic Information
  disasterType: {
    type: String,
    required: true,
    enum: [
      'earthquake', 'cyclone', 'flood', 'drought', 'landslide', 
      'fire', 'heatwave', 'tsunami', 'avalanche', 'stampede'
    ],
    index: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  icon: {
    type: String,
    default: '🌍'
  },

  description: {
    type: String,
    required: true
  },

  // Priority and Classification
  basePriority: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },

  color: {
    type: String,
    default: '#667eea'
  },

  tags: [{
    type: String,
    trim: true
  }],

  // Content Structure
  lessons: [lessonSchema],

  // Interactive Components
  quiz: {
    questions: [quizQuestionSchema],
    passingScore: {
      type: Number,
      default: 60
    },
    timeLimit: Number // in minutes
  },

  // Gamification
  game: {
    type: {
      type: String,
      enum: ['maze', 'decision', 'simulation', 'puzzle', 'memory']
    },
    title: String,
    description: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    config: mongoose.Schema.Types.Mixed
  },

  // Badge Criteria
  completionBadge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  },

  // Learning Outcomes
  learningObjectives: [{
    type: String
  }],

  dosList: [{
    type: String
  }],

  dontsList: [{
    type: String
  }],

  // Regional Customization
  regionalVariations: [{
    state: String,
    customContent: String,
    localExamples: [String],
    communityResources: [String]
  }],

  // Prerequisites
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DisasterModule'
  }],

  // Difficulty and Age Group
  ageGroup: {
    min: {
      type: Number,
      default: 6
    },
    max: {
      type: Number,
      default: 12
    }
  },

  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },

  // Stats
  averageCompletionTime: Number, // in minutes
  completionRate: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  publishedDate: {
    type: Date,
    default: Date.now
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
disasterModuleSchema.index({ disasterType: 1, isActive: 1 });
disasterModuleSchema.index({ basePriority: 1 });
disasterModuleSchema.index({ 'ageGroup.min': 1, 'ageGroup.max': 1 });

// Virtual for total lessons
disasterModuleSchema.virtual('totalLessons').get(function() {
  return this.lessons?.length || 0;
});

// Virtual for total quiz questions
disasterModuleSchema.virtual('totalQuestions').get(function() {
  return this.quiz?.questions?.length || 0;
});

// Update lastUpdated on save
disasterModuleSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Method to get personalized content for a state
disasterModuleSchema.methods.getRegionalContent = function(state) {
  const regional = this.regionalVariations.find(r => r.state === state);
  return regional || null;
};

// Static method to get modules by disaster type
disasterModuleSchema.statics.getByDisasterType = function(disasterType) {
  return this.find({ disasterType, isActive: true }).sort({ basePriority: 1 });
};

// Static method to get modules for age group
disasterModuleSchema.statics.getByAgeGroup = function(age) {
  return this.find({
    'ageGroup.min': { $lte: age },
    'ageGroup.max': { $gte: age },
    isActive: true
  }).sort({ basePriority: 1 });
};

const DisasterModule = mongoose.model('DisasterModule', disasterModuleSchema);

module.exports = DisasterModule;
