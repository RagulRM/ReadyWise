/**
 * Module Progress Model
 * Tracks student progress through the 5-step disaster learning path
 * (Learning Content, Videos, Quiz, Interactive Learning, Game)
 */

const mongoose = require('mongoose');

const moduleProgressSchema = new mongoose.Schema({
  // Student Reference
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },

  // Module Reference
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DisasterModule',
    required: [true, 'Module is required']
  },

  // Step Completions
  stepCompletions: {
    // Learning Content - auto-completed when viewed
    learn: {
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: {
        type: Date
      }
    },

    // Video-Based Learning - completed when all videos watched
    videos: {
      completed: {
        type: Boolean,
        default: false
      },
      watchedVideos: [{
        videoId: String,
        watchedAt: Date
      }],
      completedAt: {
        type: Date
      }
    },

    // Quiz-Based Learning - completed with 4/5 or higher
    quiz: {
      completed: {
        type: Boolean,
        default: false
      },
      score: {
        type: Number,
        min: 0,
        max: 5
      },
      attempts: [{
        score: Number,
        attemptedAt: Date
      }],
      completedAt: {
        type: Date
      }
    },

    // Interactive Learning - completion criteria TBD
    practice: {
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: {
        type: Date
      }
    },

    // Game - completed when successfully finished
    game: {
      completed: {
        type: Boolean,
        default: false
      },
      attempts: [{
        success: Boolean,
        attemptedAt: Date
      }],
      completedAt: {
        type: Date
      }
    }
  },

  // Overall Module Completion
  overallComplete: {
    type: Boolean,
    default: false
  },

  // Completion Percentage (0-100)
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  // Timestamps
  startedAt: {
    type: Date,
    default: Date.now
  },
  
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
moduleProgressSchema.index({ student: 1, module: 1 }, { unique: true });
moduleProgressSchema.index({ student: 1 });
moduleProgressSchema.index({ module: 1 });
moduleProgressSchema.index({ overallComplete: 1 });

// Calculate completion percentage before saving
moduleProgressSchema.pre('save', function(next) {
  const steps = this.stepCompletions;
  let completedCount = 0;
  const totalSteps = 5; // learn, videos, quiz, practice, game

  if (steps.learn.completed) completedCount++;
  if (steps.videos.completed) completedCount++;
  if (steps.quiz.completed) completedCount++;
  if (steps.practice.completed) completedCount++;
  if (steps.game.completed) completedCount++;

  this.completionPercentage = Math.round((completedCount / totalSteps) * 100);
  
  // Mark overall complete if all steps done
  if (completedCount === totalSteps) {
    this.overallComplete = true;
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  } else {
    this.overallComplete = false;
    this.completedAt = null;
  }

  next();
});

// Instance method to mark a step as complete
moduleProgressSchema.methods.completeStep = async function(stepName, additionalData = {}) {
  if (!this.stepCompletions[stepName]) {
    throw new Error(`Invalid step name: ${stepName}`);
  }

  this.stepCompletions[stepName].completed = true;
  this.stepCompletions[stepName].completedAt = new Date();

  // Handle step-specific data
  if (stepName === 'quiz' && additionalData.score !== undefined) {
    this.stepCompletions.quiz.score = additionalData.score;
    this.stepCompletions.quiz.attempts.push({
      score: additionalData.score,
      attemptedAt: new Date()
    });
  }

  if (stepName === 'game' && additionalData.success !== undefined) {
    this.stepCompletions.game.attempts.push({
      success: additionalData.success,
      attemptedAt: new Date()
    });
  }

  if (stepName === 'videos' && additionalData.videoId) {
    const alreadyWatched = this.stepCompletions.videos.watchedVideos.some(
      v => v.videoId === additionalData.videoId
    );
    if (!alreadyWatched) {
      this.stepCompletions.videos.watchedVideos.push({
        videoId: additionalData.videoId,
        watchedAt: new Date()
      });
    }
  }

  await this.save();
  return this;
};

// Instance method to record video watch
moduleProgressSchema.methods.recordVideoWatch = async function(videoId, totalVideosInModule) {
  const alreadyWatched = this.stepCompletions.videos.watchedVideos.some(
    v => v.videoId === videoId
  );
  
  if (!alreadyWatched) {
    this.stepCompletions.videos.watchedVideos.push({
      videoId,
      watchedAt: new Date()
    });
  }

  // Mark videos step complete if all videos watched
  if (this.stepCompletions.videos.watchedVideos.length >= totalVideosInModule) {
    this.stepCompletions.videos.completed = true;
    this.stepCompletions.videos.completedAt = new Date();
  }

  await this.save();
  return this;
};

// Static method to get or create progress
moduleProgressSchema.statics.getOrCreate = async function(studentId, moduleId) {
  let progress = await this.findOne({ student: studentId, module: moduleId });
  
  if (!progress) {
    progress = await this.create({ student: studentId, module: moduleId });
  }
  
  return progress;
};

// Static method to get student's all progress
moduleProgressSchema.statics.getStudentProgress = async function(studentId, options = {}) {
  const query = this.find({ student: studentId });
  
  if (options.populate) {
    query.populate('module', 'name type gradeLevel');
  }
  
  return query.exec();
};

// Static method to get module progress for all students (for teachers)
moduleProgressSchema.statics.getModuleProgress = async function(moduleId, options = {}) {
  const query = this.find({ module: moduleId });
  
  if (options.populate) {
    query.populate('student', 'name email class');
  }
  
  return query.exec();
};

const ModuleProgress = mongoose.model('ModuleProgress', moduleProgressSchema);

module.exports = ModuleProgress;
