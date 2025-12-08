/**
 * Disaster Game Configurations
 * Each disaster has unique environment, goals, obstacles, and collectibles
 */

// ============================================
// EARTHQUAKE GAME CONFIG
// ============================================
export const earthquakeConfig = {
  disasterType: 'earthquake',
  
  environmentConfig: {
    skyColor: 0x8b8b8b,
    fogColor: 0x8b8b8b,
    groundColor: 0x5d5d5d,
    ambientColor: 0x666666,
    ambientIntensity: 0.4,
    sunColor: 0xffa500,
    sunIntensity: 0.6,
    terrainHeight: 0.3,
    objects: [
      // Damaged buildings
      { type: 'building', x: -15, z: -10, width: 6, height: 10, depth: 6, color: 0x808080, climbable: false },
      { type: 'building', x: 20, z: 5, width: 8, height: 12, depth: 8, color: 0x696969, climbable: false },
      { type: 'building', x: -8, z: 15, width: 5, height: 7, depth: 5, color: 0x778899, climbable: true },
      { type: 'building', x: 25, z: -20, width: 10, height: 15, depth: 10, color: 0x708090, climbable: false },
      // Rubble and rocks
      { type: 'rock', x: 5, z: 5, size: 1.5, color: 0x5d5d5d },
      { type: 'rock', x: -10, z: 8, size: 2, color: 0x696969 },
      { type: 'rock', x: 12, z: -5, size: 1, color: 0x5d5d5d },
      { type: 'rock', x: -5, z: -15, size: 1.8, color: 0x696969 },
      // Safe zone
      { type: 'safeZone', x: 40, z: 40, radius: 4 }
    ]
  },

  instructions: [
    '🏃 An earthquake has struck! Move to the open safe zone',
    '⚠️ Avoid falling debris and ground cracks',
    '🎒 Collect emergency supplies on your way',
    '🏥 Find the first aid kit for bonus health',
    '✅ Reach the green safe zone to complete the mission'
  ],

  goals: [
    { x: 15, z: 15, description: 'Get away from buildings - Move to checkpoint 1' },
    { x: 30, z: 25, description: 'Continue to safer ground - Move to checkpoint 2' },
    { x: 40, z: 40, description: 'Reach the open safe zone!' }
  ],

  obstacles: [
    { type: 'debris', x: 8, z: 3, width: 3, height: 1.5, depth: 2, damage: 10 },
    { type: 'debris', x: -5, z: 10, width: 2, height: 1, depth: 3, damage: 10 },
    { type: 'crack', x: 0, z: 20, width: 8, depth: 1.5, damage: 25 },
    { type: 'crack', x: 20, z: 15, width: 6, depth: 1, damage: 20 },
    { type: 'debris', x: 25, z: 30, width: 4, height: 2, depth: 3, damage: 15 }
  ],

  collectibles: [
    { type: 'firstAid', x: 10, z: 8, points: 20, healthBonus: 25 },
    { type: 'flashlight', x: -8, z: 5, points: 15 },
    { type: 'water', x: 22, z: 20, points: 10, healthBonus: 10 },
    { type: 'default', x: 35, z: 35, points: 25 }
  ]
};

// ============================================
// TSUNAMI GAME CONFIG
// ============================================
export const tsunamiConfig = {
  disasterType: 'tsunami',
  
  environmentConfig: {
    skyColor: 0x4a6fa5,
    fogColor: 0x6b8cae,
    groundColor: 0xc2b280,
    ambientColor: 0x6b8cae,
    ambientIntensity: 0.5,
    sunColor: 0xffffcc,
    sunIntensity: 0.7,
    terrainHeight: 0.2,
    objects: [
      // Coastal buildings
      { type: 'building', x: -20, z: -5, width: 5, height: 6, depth: 5, color: 0xe8dcc8, climbable: true },
      { type: 'building', x: -10, z: 10, width: 6, height: 8, depth: 6, color: 0xd4c4a8, climbable: true },
      { type: 'building', x: 15, z: -15, width: 8, height: 12, depth: 8, color: 0xc9b896, climbable: true },
      // Trees
      { type: 'tree', x: 5, z: 5 },
      { type: 'tree', x: -15, z: 15 },
      { type: 'tree', x: 25, z: 10 },
      // Water (dangerous rising water)
      { type: 'water', x: 0, z: -40, width: 200, depth: 40, y: 0.1, dangerous: true },
      // High ground safe zone
      { type: 'safeZone', x: 0, z: 50, radius: 5 }
    ]
  },

  instructions: [
    '🌊 Tsunami warning! Head to higher ground immediately',
    '⬆️ Move AWAY from the coast (towards positive Z)',
    '🏢 You can climb buildings if needed',
    '💧 Avoid the rising water - it\'s dangerous!',
    '⛰️ Reach the elevated safe zone on the hill'
  ],

  goals: [
    { x: 0, z: 20, description: 'Move inland - Get away from the coast!' },
    { x: 0, z: 35, description: 'Keep moving to higher ground!' },
    { x: 0, z: 50, description: 'Reach the elevated safe zone!' }
  ],

  obstacles: [
    { type: 'debris', x: -5, z: 15, width: 4, height: 1, depth: 2, damage: 10 },
    { type: 'debris', x: 10, z: 25, width: 3, height: 1.5, depth: 3, damage: 15 },
    { type: 'debris', x: -8, z: 40, width: 2, height: 1, depth: 2, damage: 10 }
  ],

  collectibles: [
    { type: 'water', x: 5, z: 10, points: 10, healthBonus: 10 },
    { type: 'firstAid', x: -10, z: 30, points: 20, healthBonus: 25 },
    { type: 'flashlight', x: 8, z: 45, points: 15 }
  ]
};

// ============================================
// FLOOD GAME CONFIG
// ============================================
export const floodConfig = {
  disasterType: 'flood',
  
  environmentConfig: {
    skyColor: 0x5a5a6e,
    fogColor: 0x6e6e7e,
    groundColor: 0x4a6741,
    ambientColor: 0x6e7e8e,
    ambientIntensity: 0.4,
    sunColor: 0xcccccc,
    sunIntensity: 0.5,
    terrainHeight: 0.5,
    objects: [
      // Houses
      { type: 'building', x: -15, z: -10, width: 6, height: 5, depth: 6, color: 0x8b7355, climbable: true },
      { type: 'building', x: 20, z: 5, width: 7, height: 6, depth: 7, color: 0x9e8b6e, climbable: true },
      { type: 'building', x: -5, z: 20, width: 5, height: 4, depth: 5, color: 0x8b7355, climbable: true },
      // Trees
      { type: 'tree', x: 10, z: -5 },
      { type: 'tree', x: -20, z: 15 },
      { type: 'tree', x: 30, z: 20 },
      // Flood water
      { type: 'water', x: 0, z: 0, width: 60, depth: 60, y: 0.3, dangerous: true },
      // Elevated safe zone
      { type: 'safeZone', x: 35, z: 35, radius: 4 }
    ]
  },

  instructions: [
    '🌧️ Flash flood! Get to higher ground',
    '🏠 Climb onto rooftops if water is too deep',
    '⚡ Stay away from electrical areas',
    '🚫 Don\'t try to swim through flood water',
    '🏔️ Reach the elevated safe area'
  ],

  goals: [
    { x: 10, z: 10, description: 'Move to higher ground!' },
    { x: 25, z: 20, description: 'Continue to the elevated area!' },
    { x: 35, z: 35, description: 'Reach the safe high ground!' }
  ],

  obstacles: [
    { type: 'debris', x: 5, z: 5, width: 3, height: 1, depth: 2, damage: 10 },
    { type: 'debris', x: 15, z: 15, width: 2, height: 0.8, depth: 2, damage: 8 },
    { type: 'debris', x: 30, z: 25, width: 4, height: 1.5, depth: 3, damage: 12 }
  ],

  collectibles: [
    { type: 'water', x: 8, z: 8, points: 10, healthBonus: 10 },
    { type: 'firstAid', x: 20, z: 15, points: 20, healthBonus: 25 },
    { type: 'flashlight', x: 28, z: 30, points: 15 }
  ]
};

// ============================================
// FIRE GAME CONFIG
// ============================================
export const fireConfig = {
  disasterType: 'fire',
  
  environmentConfig: {
    skyColor: 0x4a3030,
    fogColor: 0x5a4040,
    groundColor: 0x3a3a3a,
    ambientColor: 0xff6633,
    ambientIntensity: 0.3,
    sunColor: 0xff4400,
    sunIntensity: 0.4,
    terrainHeight: 0.1,
    objects: [
      // Building interior/corridor simulation
      { type: 'building', x: -10, z: 0, width: 3, height: 4, depth: 20, color: 0x505050, climbable: false },
      { type: 'building', x: 10, z: 0, width: 3, height: 4, depth: 20, color: 0x505050, climbable: false },
      { type: 'building', x: 0, z: -30, width: 25, height: 4, depth: 3, color: 0x505050, climbable: false },
      // Exit area
      { type: 'safeZone', x: 0, z: 40, radius: 4 }
    ]
  },

  instructions: [
    '🔥 Fire in the building! Find the emergency exit',
    '🚪 Follow the exit signs to safety',
    '💨 Stay low to avoid smoke inhalation',
    '🔥 Avoid flames and hot areas',
    '🚨 Reach the emergency exit!'
  ],

  goals: [
    { x: 0, z: 0, description: 'Stay calm and find the exit path!' },
    { x: 0, z: 20, description: 'Continue towards the exit!' },
    { x: 0, z: 40, description: 'Reach the emergency exit!' }
  ],

  obstacles: [
    { type: 'fire', x: -5, z: -10, damage: 15 },
    { type: 'fire', x: 5, z: 5, damage: 15 },
    { type: 'fire', x: -3, z: 15, damage: 15 },
    { type: 'fire', x: 6, z: 25, damage: 15 },
    { type: 'debris', x: 0, z: 10, width: 2, height: 1, depth: 1, damage: 5 }
  ],

  collectibles: [
    { type: 'firstAid', x: 3, z: -5, points: 20, healthBonus: 30 },
    { type: 'water', x: -4, z: 8, points: 15, healthBonus: 15 },
    { type: 'flashlight', x: 2, z: 30, points: 10 }
  ]
};

// ============================================
// CYCLONE GAME CONFIG
// ============================================
export const cycloneConfig = {
  disasterType: 'cyclone',
  
  environmentConfig: {
    skyColor: 0x2d3a4a,
    fogColor: 0x3d4a5a,
    groundColor: 0x4a5a4a,
    ambientColor: 0x5a6a7a,
    ambientIntensity: 0.3,
    sunColor: 0x8899aa,
    sunIntensity: 0.3,
    terrainHeight: 0.2,
    objects: [
      // Houses
      { type: 'building', x: -20, z: -15, width: 6, height: 5, depth: 6, color: 0x8b7355 },
      { type: 'building', x: 15, z: -10, width: 7, height: 6, depth: 7, color: 0x9e8b6e },
      // Strong shelter
      { type: 'building', x: 30, z: 30, width: 10, height: 4, depth: 10, color: 0x606060 },
      // Trees (hazards in cyclone)
      { type: 'tree', x: -10, z: 5 },
      { type: 'tree', x: 5, z: -5 },
      { type: 'tree', x: 20, z: 15 },
      // Cyclone shelter safe zone
      { type: 'safeZone', x: 30, z: 30, radius: 5 }
    ]
  },

  instructions: [
    '🌀 Cyclone approaching! Get to the shelter',
    '🌳 Stay away from trees - they can fall!',
    '🏠 Avoid weak structures',
    '💨 Watch for flying debris',
    '🏛️ Reach the cyclone shelter!'
  ],

  goals: [
    { x: 10, z: 10, description: 'Move away from trees and weak buildings!' },
    { x: 20, z: 20, description: 'Head towards the shelter!' },
    { x: 30, z: 30, description: 'Enter the cyclone shelter!' }
  ],

  obstacles: [
    { type: 'debris', x: -5, z: 0, width: 3, height: 1.5, depth: 2, damage: 15 },
    { type: 'debris', x: 10, z: 8, width: 2, height: 1, depth: 2, damage: 10 },
    { type: 'debris', x: 15, z: 20, width: 4, height: 2, depth: 3, damage: 20 },
    { type: 'debris', x: 25, z: 25, width: 2, height: 1, depth: 1, damage: 8 }
  ],

  collectibles: [
    { type: 'firstAid', x: 5, z: 5, points: 20, healthBonus: 25 },
    { type: 'water', x: 15, z: 15, points: 10, healthBonus: 10 },
    { type: 'flashlight', x: 25, z: 28, points: 15 }
  ]
};

// ============================================
// HEATWAVE GAME CONFIG
// ============================================
export const heatwaveConfig = {
  disasterType: 'heatwave',
  
  environmentConfig: {
    skyColor: 0xffe4b5,
    fogColor: 0xffd700,
    groundColor: 0xdaa520,
    ambientColor: 0xffa500,
    ambientIntensity: 0.6,
    sunColor: 0xffff00,
    sunIntensity: 1.2,
    terrainHeight: 0.1,
    objects: [
      // Buildings with shade
      { type: 'building', x: -20, z: 0, width: 8, height: 6, depth: 8, color: 0xf5f5dc },
      { type: 'building', x: 20, z: -10, width: 6, height: 5, depth: 6, color: 0xfaf0e6 },
      // Trees for shade
      { type: 'tree', x: -10, z: 10 },
      { type: 'tree', x: 10, z: 5 },
      { type: 'tree', x: 0, z: 20 },
      // Cool shelter
      { type: 'safeZone', x: 35, z: 35, radius: 5 }
    ]
  },

  instructions: [
    '☀️ Extreme heat! Find a cool shelter',
    '💧 Collect water bottles to stay hydrated',
    '🌳 Use shade from trees and buildings',
    '🏃 Don\'t exert yourself too much',
    '❄️ Reach the air-conditioned shelter!'
  ],

  goals: [
    { x: 10, z: 10, description: 'Find some shade!' },
    { x: 20, z: 20, description: 'Continue towards the cool shelter!' },
    { x: 35, z: 35, description: 'Reach the air-conditioned building!' }
  ],

  obstacles: [
    // Hot zones (asphalt areas)
    { type: 'crack', x: 5, z: 0, width: 5, depth: 5, damage: 8 },
    { type: 'crack', x: 15, z: 15, width: 4, depth: 4, damage: 10 },
    { type: 'crack', x: 30, z: 25, width: 6, depth: 3, damage: 8 }
  ],

  collectibles: [
    { type: 'water', x: 0, z: 5, points: 20, healthBonus: 20 },
    { type: 'water', x: 15, z: 10, points: 20, healthBonus: 20 },
    { type: 'water', x: 25, z: 25, points: 20, healthBonus: 20 },
    { type: 'firstAid', x: 30, z: 30, points: 15, healthBonus: 15 }
  ]
};

// ============================================
// DROUGHT GAME CONFIG
// ============================================
export const droughtConfig = {
  disasterType: 'drought',
  
  environmentConfig: {
    skyColor: 0xd2b48c,
    fogColor: 0xc2a27c,
    groundColor: 0x8b7355,
    ambientColor: 0xdaa520,
    ambientIntensity: 0.5,
    sunColor: 0xffd700,
    sunIntensity: 1.0,
    terrainHeight: 0.3,
    objects: [
      // Dry trees
      { type: 'rock', x: -15, z: 5, size: 1.5, color: 0x8b7355 },
      { type: 'rock', x: 10, z: -10, size: 2, color: 0x9e8b6e },
      { type: 'rock', x: 25, z: 15, size: 1.2, color: 0x8b7355 },
      // Well/water source
      { type: 'building', x: 40, z: 40, width: 3, height: 2, depth: 3, color: 0x696969 },
      // Water source safe zone
      { type: 'safeZone', x: 40, z: 40, radius: 4 }
    ]
  },

  instructions: [
    '🏜️ Severe drought! Find a water source',
    '💧 Collect any water you find on the way',
    '🌡️ Conserve energy in the heat',
    '🔍 Look for signs of water',
    '💦 Reach the water well!'
  ],

  goals: [
    { x: 15, z: 15, description: 'Search for water sources!' },
    { x: 30, z: 30, description: 'Follow signs to the well!' },
    { x: 40, z: 40, description: 'Reach the water well!' }
  ],

  obstacles: [
    { type: 'crack', x: 5, z: 5, width: 4, depth: 2, damage: 5 },
    { type: 'crack', x: 20, z: 10, width: 5, depth: 2, damage: 5 },
    { type: 'crack', x: 35, z: 30, width: 3, depth: 3, damage: 5 }
  ],

  collectibles: [
    { type: 'water', x: 8, z: 8, points: 30, healthBonus: 25 },
    { type: 'water', x: 25, z: 20, points: 30, healthBonus: 25 },
    { type: 'firstAid', x: 35, z: 35, points: 20, healthBonus: 20 }
  ]
};

// ============================================
// LANDSLIDE GAME CONFIG
// ============================================
export const landslideConfig = {
  disasterType: 'landslide',
  
  environmentConfig: {
    skyColor: 0x6b8e23,
    fogColor: 0x5a7a1a,
    groundColor: 0x556b2f,
    ambientColor: 0x6b8e23,
    ambientIntensity: 0.4,
    sunColor: 0xcccccc,
    sunIntensity: 0.6,
    terrainHeight: 1.0,
    objects: [
      // Mountain buildings
      { type: 'building', x: -15, z: -20, width: 5, height: 4, depth: 5, color: 0x8b7355 },
      { type: 'building', x: 10, z: -15, width: 4, height: 3, depth: 4, color: 0x9e8b6e },
      // Rocks (landslide debris)
      { type: 'rock', x: -10, z: 0, size: 3, color: 0x696969 },
      { type: 'rock', x: 5, z: 5, size: 2.5, color: 0x5a5a5a },
      { type: 'rock', x: 15, z: 10, size: 2, color: 0x696969 },
      { type: 'rock', x: -5, z: 15, size: 3.5, color: 0x5a5a5a },
      // Trees
      { type: 'tree', x: 20, z: -10 },
      { type: 'tree', x: -20, z: 5 },
      // Safe zone away from slope
      { type: 'safeZone', x: 40, z: 0, radius: 5 }
    ]
  },

  instructions: [
    '⛰️ Landslide! Move away from the slope',
    '🪨 Avoid falling rocks and debris',
    '➡️ Move perpendicular to the slide direction',
    '🏃 Don\'t stop - keep moving!',
    '✅ Reach the stable ground!'
  ],

  goals: [
    { x: 15, z: 0, description: 'Get away from the unstable slope!' },
    { x: 30, z: 0, description: 'Continue to stable ground!' },
    { x: 40, z: 0, description: 'Reach the safe stable area!' }
  ],

  obstacles: [
    { type: 'debris', x: 0, z: 5, width: 4, height: 2, depth: 4, damage: 20 },
    { type: 'debris', x: 10, z: 0, width: 3, height: 1.5, depth: 3, damage: 15 },
    { type: 'debris', x: 20, z: -5, width: 5, height: 2.5, depth: 4, damage: 25 },
    { type: 'debris', x: 30, z: 5, width: 2, height: 1, depth: 2, damage: 10 }
  ],

  collectibles: [
    { type: 'firstAid', x: 12, z: -5, points: 20, healthBonus: 30 },
    { type: 'flashlight', x: 25, z: 3, points: 15 },
    { type: 'water', x: 35, z: -2, points: 10, healthBonus: 10 }
  ]
};

// ============================================
// STAMPEDE GAME CONFIG
// ============================================
export const stampedeConfig = {
  disasterType: 'stampede',
  
  environmentConfig: {
    skyColor: 0x87ceeb,
    fogColor: 0x8ecae6,
    groundColor: 0xa0a0a0,
    ambientColor: 0xffffff,
    ambientIntensity: 0.6,
    sunColor: 0xffffff,
    sunIntensity: 0.8,
    terrainHeight: 0,
    objects: [
      // Crowd barriers
      { type: 'building', x: -8, z: -20, width: 1, height: 1.5, depth: 40, color: 0x4169e1 },
      { type: 'building', x: 8, z: -20, width: 1, height: 1.5, depth: 40, color: 0x4169e1 },
      // Stage area
      { type: 'building', x: 0, z: -35, width: 20, height: 2, depth: 5, color: 0x2f4f4f },
      // Exit points
      { type: 'safeZone', x: 0, z: 30, radius: 5 }
    ]
  },

  instructions: [
    '👥 Crowd surge! Find an exit calmly',
    '🚶 Move with the crowd, not against it',
    '🛡️ Protect your chest - keep arms up',
    '📍 Head towards the nearest exit',
    '🚪 Reach the emergency exit!'
  ],

  goals: [
    { x: 0, z: 0, description: 'Stay calm and find the exit path!' },
    { x: 0, z: 15, description: 'Keep moving towards the exit!' },
    { x: 0, z: 30, description: 'Reach the emergency exit!' }
  ],

  obstacles: [
    { type: 'debris', x: -3, z: -5, width: 1.5, height: 0.5, depth: 1.5, damage: 5 },
    { type: 'debris', x: 4, z: 5, width: 1, height: 0.5, depth: 1, damage: 5 },
    { type: 'debris', x: -2, z: 15, width: 2, height: 0.5, depth: 1.5, damage: 5 },
    { type: 'debris', x: 3, z: 22, width: 1.5, height: 0.5, depth: 1, damage: 5 }
  ],

  collectibles: [
    { type: 'firstAid', x: 5, z: 0, points: 20, healthBonus: 20 },
    { type: 'water', x: -4, z: 10, points: 10, healthBonus: 10 },
    { type: 'flashlight', x: 2, z: 25, points: 15 }
  ]
};

// ============================================
// AVALANCHE GAME CONFIG
// ============================================
export const avalancheConfig = {
  disasterType: 'avalanche',
  
  environmentConfig: {
    skyColor: 0xb0c4de,
    fogColor: 0xdcdcdc,
    groundColor: 0xfffafa,
    ambientColor: 0xe0ffff,
    ambientIntensity: 0.7,
    sunColor: 0xfffaf0,
    sunIntensity: 0.9,
    terrainHeight: 0.5,
    objects: [
      // Mountain lodge
      { type: 'building', x: 35, z: 0, width: 8, height: 5, depth: 8, color: 0x8b4513 },
      // Pine trees
      { type: 'tree', x: -10, z: -15 },
      { type: 'tree', x: 5, z: -10 },
      { type: 'tree', x: 15, z: -5 },
      { type: 'tree', x: -5, z: 10 },
      // Rocks
      { type: 'rock', x: -15, z: 5, size: 2, color: 0x808080 },
      { type: 'rock', x: 10, z: 15, size: 1.5, color: 0x696969 },
      { type: 'rock', x: 25, z: -10, size: 2.5, color: 0x808080 },
      // Safety lodge
      { type: 'safeZone', x: 35, z: 0, radius: 5 }
    ]
  },

  instructions: [
    '❄️ Avalanche! Get to the lodge immediately',
    '↔️ Move perpendicular to the avalanche path',
    '🌲 Use trees and rocks as shields if needed',
    '🏃 Don\'t stop moving!',
    '🏠 Reach the mountain lodge!'
  ],

  goals: [
    { x: 15, z: 0, description: 'Move away from the avalanche path!' },
    { x: 25, z: 0, description: 'Head towards the lodge!' },
    { x: 35, z: 0, description: 'Reach the safety of the lodge!' }
  ],

  obstacles: [
    { type: 'debris', x: -5, z: -5, width: 4, height: 2, depth: 4, damage: 25, color: 0xfffafa },
    { type: 'debris', x: 5, z: 5, width: 3, height: 1.5, depth: 3, damage: 20, color: 0xfffafa },
    { type: 'debris', x: 15, z: -8, width: 5, height: 2.5, depth: 5, damage: 30, color: 0xfffafa },
    { type: 'debris', x: 28, z: 5, width: 3, height: 1, depth: 3, damage: 15, color: 0xfffafa }
  ],

  collectibles: [
    { type: 'firstAid', x: 10, z: 3, points: 25, healthBonus: 30 },
    { type: 'flashlight', x: 20, z: -3, points: 15 },
    { type: 'water', x: 30, z: 2, points: 10, healthBonus: 10 }
  ]
};

// ============================================
// EXPORT ALL CONFIGS
// ============================================
export const disasterGameConfigs = {
  earthquake: earthquakeConfig,
  tsunami: tsunamiConfig,
  flood: floodConfig,
  fire: fireConfig,
  cyclone: cycloneConfig,
  heatwave: heatwaveConfig,
  drought: droughtConfig,
  landslide: landslideConfig,
  stampede: stampedeConfig,
  avalanche: avalancheConfig
};

export default disasterGameConfigs;
