/**
 * Database Initialization Script
 * Seeds the database with initial data
 */

const badges = [
  {
    badgeId: 'earthquake-expert',
    name: 'Earthquake Expert',
    description: 'Master earthquake safety by completing all earthquake modules',
    icon: '🌟',
    category: 'disaster-specific',
    criteria: {
      type: 'completion',
      requirement: 100,
      description: 'Complete all earthquake learning modules with 90%+ score'
    },
    rarity: 'epic',
    color: '#667eea'
  },
  {
    badgeId: 'fire-safety-hero',
    name: 'Fire Safety Hero',
    description: 'Know exactly how to escape safely from fire',
    icon: '🚒',
    category: 'disaster-specific',
    criteria: {
      type: 'perfect',
      requirement: 1,
      description: 'Score 100% in fire safety quiz'
    },
    rarity: 'rare',
    color: '#eb3349'
  },
  {
    badgeId: 'flood-wise',
    name: 'Flood Wise',
    description: 'Expert in flood safety measures',
    icon: '🌊',
    category: 'disaster-specific',
    criteria: {
      type: 'completion',
      requirement: 100,
      description: 'Complete all flood safety modules'
    },
    rarity: 'rare',
    color: '#11998e'
  },
  {
    badgeId: 'cyclone-champion',
    name: 'Cyclone Champion',
    description: 'Ready to face cyclone situations safely',
    icon: '🌀',
    category: 'disaster-specific',
    criteria: {
      type: 'score',
      requirement: 90,
      description: 'Score 90%+ in cyclone preparedness'
    },
    rarity: 'rare',
    color: '#764ba2'
  },
  {
    badgeId: 'safety-star',
    name: 'Safety Star',
    description: 'Complete your first learning module',
    icon: '⭐',
    category: 'milestone',
    criteria: {
      type: 'completion',
      requirement: 1,
      description: 'Complete any learning module'
    },
    rarity: 'common',
    color: '#f2994a'
  },
  {
    badgeId: 'quiz-master',
    name: 'Quiz Master',
    description: 'Score perfectly in any quiz',
    icon: '🏆',
    category: 'achievement',
    criteria: {
      type: 'perfect',
      requirement: 1,
      description: 'Score 100% in any quiz'
    },
    rarity: 'epic',
    color: '#f2c94c'
  },
  {
    badgeId: 'game-champion',
    name: 'Game Champion',
    description: 'Complete 5 simulation games',
    icon: '🎮',
    category: 'achievement',
    criteria: {
      type: 'completion',
      requirement: 5,
      description: 'Complete 5 different games'
    },
    rarity: 'rare',
    color: '#38ef7d'
  },
  {
    badgeId: 'learning-hero',
    name: 'Learning Hero',
    description: 'Spend 1 hour learning disaster safety',
    icon: '📚',
    category: 'milestone',
    criteria: {
      type: 'streak',
      requirement: 3600,
      description: 'Spend 1 hour learning (3600 seconds)'
    },
    rarity: 'rare',
    color: '#f093fb'
  },
  {
    badgeId: 'speed-runner',
    name: 'Speed Runner',
    description: 'Complete a game in record time',
    icon: '⚡',
    category: 'achievement',
    criteria: {
      type: 'speed',
      requirement: 120,
      description: 'Complete any game in under 2 minutes'
    },
    rarity: 'epic',
    color: '#f5576c'
  },
  {
    badgeId: 'disaster-sage',
    name: 'Disaster Sage',
    description: 'Learn about all disaster types',
    icon: '🧙',
    category: 'milestone',
    criteria: {
      type: 'completion',
      requirement: 6,
      description: 'Complete modules for 6 different disaster types'
    },
    rarity: 'legendary',
    color: '#667eea'
  }
];

const sampleUsers = [
  {
    name: 'Ravi Kumar',
    age: 10,
    grade: 'Class 5',
    school: 'Chennai Public School',
    location: {
      state: 'Tamil Nadu',
      city: 'Chennai',
      district: 'Chennai',
      pincode: '600001'
    },
    language: 'Tamil'
  },
  {
    name: 'Meera Patel',
    age: 9,
    grade: 'Class 4',
    school: 'Delhi Model School',
    location: {
      state: 'Delhi',
      city: 'Delhi',
      district: 'Central Delhi'
    },
    language: 'Hindi'
  }
];

module.exports = {
  badges,
  sampleUsers
};
