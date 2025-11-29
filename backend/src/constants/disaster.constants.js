/**
 * Disaster Type Constants
 * Centralized disaster-related constants
 */

const DISASTER_TYPES = {
  EARTHQUAKE: 'earthquake',
  CYCLONE: 'cyclone',
  FLOOD: 'flood',
  FIRE: 'fire',
  LANDSLIDE: 'landslide',
  STAMPEDE: 'stampede',
  HEATWAVE: 'heatwave',
  DROUGHT: 'drought',
  TSUNAMI: 'tsunami',
  AVALANCHE: 'avalanche',
};

const DISASTER_CATEGORIES = {
  NATURAL: 'natural',
  MAN_MADE: 'man-made',
  MIXED: 'mixed',
};

const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

const MODULE_TYPES = {
  GAME: 'game',
  QUIZ: 'quiz',
  VIDEO: 'video',
  SIMULATION: 'simulation',
  READING: 'reading',
};

const BADGE_CATEGORIES = {
  DISASTER_SPECIFIC: 'disaster-specific',
  ACHIEVEMENT: 'achievement',
  MILESTONE: 'milestone',
  SPECIAL: 'special',
};

const BADGE_RARITY = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
};

module.exports = {
  DISASTER_TYPES,
  DISASTER_CATEGORIES,
  RISK_LEVELS,
  MODULE_TYPES,
  BADGE_CATEGORIES,
  BADGE_RARITY,
};
