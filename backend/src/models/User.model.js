const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [5, 'Age must be at least 5 years'],
      max: [15, 'Age cannot exceed 15 years'],
    },
    grade: {
      type: String,
      required: [true, 'Grade is required'],
      trim: true,
    },
    school: {
      type: String,
      default: 'Not specified',
      trim: true,
    },
    location: {
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
        match: [/^\d{6}$/, 'Invalid pincode format'],
      },
    },
    language: {
      type: String,
      default: 'English',
      enum: {
        values: ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam'],
        message: '{VALUE} is not a supported language',
      },
    },
    progress: {
      completedModules: [
        {
          moduleId: String,
          moduleType: {
            type: String,
            enum: ['game', 'quiz', 'video', 'simulation', 'reading'],
          },
          completedAt: {
            type: Date,
            default: Date.now,
          },
          score: {
            type: Number,
            default: 0,
          },
        },
      ],
      badges: [
        {
          badgeId: String,
          badgeName: String,
          earnedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      totalScore: {
        type: Number,
        default: 0,
        min: 0,
      },
      currentLevel: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userSchema.index({ 'location.state': 1, 'location.city': 1 });
userSchema.index({ age: 1, grade: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for display name
userSchema.virtual('displayInfo').get(function () {
  return `${this.name} - Grade ${this.grade}`;
});

// Method to add completed module
userSchema.methods.addCompletedModule = function (moduleData) {
  this.progress.completedModules.push(moduleData);
  this.progress.totalScore += moduleData.score || 0;
  return this.save();
};

// Method to award badge
userSchema.methods.awardBadge = function (badgeData) {
  const badgeExists = this.progress.badges.find((b) => b.badgeId === badgeData.badgeId);
  
  if (!badgeExists) {
    this.progress.badges.push(badgeData);
    return this.save();
  }
  
  return this;
};

// Static method to find users by location
userSchema.statics.findByLocation = function (state, city = null) {
  const query = { 'location.state': state };
  if (city) query['location.city'] = city;
  return this.find(query);
};

module.exports = mongoose.model('User', userSchema);
