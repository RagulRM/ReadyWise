/**
 * Database Seeding Script
 * Seeds initial data to MongoDB Atlas
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Badge = require('../models/Badge.model');
const connectDatabase = require('./database.config');

// Seed data
const badges = [
  {
    badgeId: 'EARTHQUAKE_EXPERT',
    name: 'Earthquake Expert',
    description: 'Master of earthquake safety',
    icon: '🌟',
    category: 'disaster-specific',
    criteria: {
      type: 'score',
      requirement: 280,
      description: 'Score 280+ in earthquake game'
    },
    rarity: 'rare',
    color: '#f39c12',
    points: 100
  },
  {
    badgeId: 'FIRE_HERO',
    name: 'Fire Safety Hero',
    description: 'Expert in fire escape procedures',
    icon: '🚒',
    category: 'disaster-specific',
    criteria: {
      type: 'perfect',
      requirement: 1,
      description: 'Perfect score in fire safety quiz'
    },
    rarity: 'epic',
    color: '#e74c3c',
    points: 150
  },
  {
    badgeId: 'FLOOD_WISE',
    name: 'Flood Wise',
    description: 'Knows how to stay safe in floods',
    icon: '🌊',
    category: 'disaster-specific',
    criteria: {
      type: 'completion',
      requirement: 1,
      description: 'Complete flood safety module'
    },
    rarity: 'common',
    color: '#3498db',
    points: 75
  },
  {
    badgeId: 'CYCLONE_CHAMPION',
    name: 'Cyclone Champion',
    description: 'Ready for any storm',
    icon: '🌀',
    category: 'disaster-specific',
    criteria: {
      type: 'score',
      requirement: 250,
      description: 'Score 250+ in cyclone preparedness'
    },
    rarity: 'rare',
    color: '#9b59b6',
    points: 100
  },
  {
    badgeId: 'SAFETY_STAR',
    name: 'Safety Star',
    description: 'General safety knowledge champion',
    icon: '⭐',
    category: 'achievement',
    criteria: {
      type: 'score',
      requirement: 200,
      description: 'Total score of 200+ across all modules'
    },
    rarity: 'common',
    color: '#f1c40f',
    points: 50
  },
  {
    badgeId: 'QUIZ_MASTER',
    name: 'Quiz Master',
    description: 'Ace of all disaster quizzes',
    icon: '🏆',
    category: 'milestone',
    criteria: {
      type: 'completion',
      requirement: 5,
      description: 'Complete 5 different quizzes'
    },
    rarity: 'epic',
    color: '#2ecc71',
    points: 200
  },
  {
    badgeId: 'SPEED_RUNNER',
    name: 'Speed Runner',
    description: 'Quick decision maker in emergencies',
    icon: '⚡',
    category: 'special',
    criteria: {
      type: 'speed',
      requirement: 30,
      description: 'Complete any game in under 30 seconds'
    },
    rarity: 'legendary',
    color: '#e67e22',
    points: 300
  },
  {
    badgeId: 'LEARNING_HERO',
    name: 'Learning Hero',
    description: 'Dedicated to disaster preparedness',
    icon: '📚',
    category: 'milestone',
    criteria: {
      type: 'completion',
      requirement: 10,
      description: 'Complete 10 learning modules'
    },
    rarity: 'epic',
    color: '#8e44ad',
    points: 250
  },
  {
    badgeId: 'DISASTER_SAGE',
    name: 'Disaster Sage',
    description: 'Ultimate disaster response expert',
    icon: '🧙',
    category: 'special',
    criteria: {
      type: 'score',
      requirement: 1000,
      description: 'Achieve total score of 1000+ points'
    },
    rarity: 'legendary',
    color: '#34495e',
    points: 500
  },
  {
    badgeId: 'FIRST_STEPS',
    name: 'First Steps',
    description: 'Welcome to disaster safety learning!',
    icon: '👶',
    category: 'milestone',
    criteria: {
      type: 'completion',
      requirement: 1,
      description: 'Complete your first module'
    },
    rarity: 'common',
    color: '#95a5a6',
    points: 25
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting badge seeding...');
    
    // Clear existing badges
    await Badge.deleteMany({});
    console.log('🗑️  Cleared existing badges');
    
    // Insert new badges
    const insertedBadges = await Badge.insertMany(badges);
    console.log(`✅ Inserted ${insertedBadges.length} badges`);
    
    // Display seeded badges
    console.log('\n🏆 Seeded Badges:');
    insertedBadges.forEach(badge => {
      console.log(`   ${badge.icon} ${badge.name} (${badge.rarity})`);
    });
    
    return insertedBadges;
    
  } catch (error) {
    console.error('❌ Badge seeding failed:', error.message);
    throw error;
  }
};

// Standalone seeding function with DB connection
const seedDatabaseStandalone = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDatabase();
    
    await seedDatabase();
    
    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabaseStandalone();
}

module.exports = { seedDatabase, badges };