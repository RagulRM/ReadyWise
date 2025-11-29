/**
 * Disaster Content Database
 * Contains disaster-specific educational content, do's & don'ts, and resources
 */

const disasterContent = {
  earthquake: {
    id: 'earthquake',
    name: 'Earthquake',
    icon: '🌍',
    description: 'Learn how to stay safe when the ground starts shaking',
    ageAppropriateDescription: 'Sometimes the earth shakes and moves. Let\'s learn how to stay safe!',
    
    safetySteps: [
      { step: 1, action: 'DROP to the ground', icon: '⬇️' },
      { step: 2, action: 'COVER your head under a table', icon: '🪑' },
      { step: 3, action: 'HOLD ON until shaking stops', icon: '✊' },
      { step: 4, action: 'Stay away from windows', icon: '🪟' },
      { step: 5, action: 'Don\'t use elevators', icon: '🚫🛗' }
    ],
    
    dos: [
      'Stay calm and don\'t panic',
      'Drop, Cover, and Hold On',
      'Stay under a strong table or desk',
      'Move away from windows and heavy objects',
      'If outside, move to an open area',
      'After shaking stops, exit the building calmly',
      'Listen to your teacher\'s instructions'
    ],
    
    donts: [
      'Don\'t run towards doors or windows',
      'Don\'t use stairs during shaking',
      'Don\'t stand near tall furniture',
      'Don\'t use elevators',
      'Don\'t light matches or candles after earthquake',
      'Don\'t shout or create panic'
    ],
    
    games: ['earthquake-drill', 'safe-spot-finder', 'emergency-kit-builder'],
    
    quizTopics: ['drop-cover-hold', 'safe-places', 'emergency-kit', 'after-earthquake'],
    
    visualAssets: {
      characters: ['ravi', 'meera'],
      scenarios: ['classroom', 'playground', 'home'],
      animations: ['shaking-effect', 'safe-zone-highlight']
    }
  },

  cyclone: {
    id: 'cyclone',
    name: 'Cyclone',
    icon: '🌀',
    description: 'Be prepared for strong winds and heavy rain',
    ageAppropriateDescription: 'Strong winds and lots of rain! Learn how to stay safe indoors.',
    
    safetySteps: [
      { step: 1, action: 'Listen to weather warnings', icon: '📻' },
      { step: 2, action: 'Stay indoors', icon: '🏠' },
      { step: 3, action: 'Close all windows and doors', icon: '🚪' },
      { step: 4, action: 'Stay away from windows', icon: '🪟' },
      { step: 5, action: 'Keep emergency kit ready', icon: '🎒' }
    ],
    
    dos: [
      'Stay inside a strong building',
      'Listen to radio for updates',
      'Keep flashlight and batteries ready',
      'Store drinking water',
      'Keep away from windows',
      'Follow evacuation orders if given',
      'Stay with your family'
    ],
    
    donts: [
      'Don\'t go outside during the cyclone',
      'Don\'t stand near trees or poles',
      'Don\'t use electrical appliances during storm',
      'Don\'t touch wet electrical items',
      'Don\'t go near the beach or coast',
      'Don\'t believe in rumors'
    ],
    
    games: ['cyclone-preparation', 'emergency-kit-packing', 'safe-room-choice'],
    
    quizTopics: ['cyclone-warnings', 'indoor-safety', 'emergency-supplies', 'after-cyclone'],
    
    visualAssets: {
      characters: ['coastal-ravi', 'coastal-meera'],
      scenarios: ['coastal-home', 'school-near-beach', 'cyclone-shelter'],
      animations: ['wind-effect', 'rain-animation', 'safe-room']
    }
  },

  flood: {
    id: 'flood',
    name: 'Flood',
    icon: '🌊',
    description: 'Know what to do when water levels rise',
    ageAppropriateDescription: 'Too much water everywhere! Let\'s learn how to stay safe and dry.',
    
    safetySteps: [
      { step: 1, action: 'Move to higher ground immediately', icon: '⬆️' },
      { step: 2, action: 'Don\'t walk in flowing water', icon: '🚫🚶' },
      { step: 3, action: 'Switch off electricity', icon: '💡' },
      { step: 4, action: 'Keep important things on high places', icon: '📦' },
      { step: 5, action: 'Listen to warnings', icon: '📻' }
    ],
    
    dos: [
      'Move to the highest floor',
      'Turn off electricity and gas',
      'Keep emergency kit ready',
      'Listen to flood warnings',
      'Follow evacuation instructions',
      'Avoid walking in flood water',
      'Stay with adults'
    ],
    
    donts: [
      'Don\'t walk in flowing water',
      'Don\'t touch electrical equipment when wet',
      'Don\'t drive through flooded roads',
      'Don\'t drink flood water',
      'Don\'t go near drainage areas',
      'Don\'t panic'
    ],
    
    games: ['flood-escape-route', 'water-safety-decisions', 'emergency-kit-selection'],
    
    quizTopics: ['flood-safety', 'electricity-danger', 'evacuation', 'clean-water'],
    
    visualAssets: {
      characters: ['ravi', 'meera'],
      scenarios: ['flooded-street', 'house-waterlogging', 'school-flood'],
      animations: ['water-rising', 'evacuation-route', 'safe-zone']
    }
  },

  fire: {
    id: 'fire',
    name: 'Fire',
    icon: '🔥',
    description: 'Escape safely when there\'s a fire',
    ageAppropriateDescription: 'Fire can spread fast! Learn how to get out safely.',
    
    safetySteps: [
      { step: 1, action: 'Alert others - shout "FIRE!"', icon: '📢' },
      { step: 2, action: 'Crawl low under smoke', icon: '🐛' },
      { step: 3, action: 'Touch doors before opening', icon: '🚪' },
      { step: 4, action: 'Use stairs, NOT elevator', icon: '🚫🛗' },
      { step: 5, action: 'Meet at safe meeting point', icon: '📍' }
    ],
    
    dos: [
      'Alert everyone immediately',
      'Crawl under smoke',
      'Use stairs only',
      'Touch doors to check if hot',
      'Close doors behind you',
      'Go to designated meeting point',
      'Call fire brigade: 101'
    ],
    
    donts: [
      'Don\'t use elevator',
      'Don\'t hide in cupboards or bathrooms',
      'Don\'t go back for belongings',
      'Don\'t open hot doors',
      'Don\'t panic and run blindly',
      'Don\'t stand up in smoke'
    ],
    
    games: ['fire-corridor-escape', 'smoke-safety-crawl', 'exit-finder'],
    
    quizTopics: ['fire-alert', 'smoke-danger', 'escape-routes', 'stop-drop-roll'],
    
    visualAssets: {
      characters: ['ravi', 'meera'],
      scenarios: ['school-corridor', 'classroom', 'metro-building'],
      animations: ['fire-spread', 'smoke-effect', 'crawling-animation']
    }
  },

  landslide: {
    id: 'landslide',
    name: 'Landslide',
    icon: '⛰️',
    description: 'Stay safe when rocks and soil slide down',
    ageAppropriateDescription: 'Sometimes mountains and hills slide down. Know how to stay safe!',
    
    safetySteps: [
      { step: 1, action: 'Move away from the slide path', icon: '➡️' },
      { step: 2, action: 'Go to higher, stable ground', icon: '⬆️' },
      { step: 3, action: 'Listen for unusual sounds', icon: '👂' },
      { step: 4, action: 'Stay alert during heavy rain', icon: '🌧️' },
      { step: 5, action: 'Follow evacuation routes', icon: '🚶' }
    ],
    
    dos: [
      'Move to stable ground immediately',
      'Listen for rumbling sounds',
      'Watch for tilting trees or poles',
      'Follow marked evacuation routes',
      'Stay alert during heavy rains',
      'Inform authorities',
      'Stay away from slide area'
    ],
    
    donts: [
      'Don\'t go near slopes during rain',
      'Don\'t ignore warning signs',
      'Don\'t return to slide area',
      'Don\'t build near steep slopes',
      'Don\'t remove plants from hillsides',
      'Don\'t panic'
    ],
    
    games: ['landslide-warning-signs', 'safe-path-finder', 'evacuation-route'],
    
    quizTopics: ['landslide-warning', 'safe-areas', 'heavy-rain-risks', 'evacuation'],
    
    visualAssets: {
      characters: ['himalayan-ravi', 'himalayan-meera'],
      scenarios: ['mountain-school', 'hillside-home', 'valley-area'],
      animations: ['sliding-effect', 'warning-signs', 'evacuation-path']
    }
  },

  stampede: {
    id: 'stampede',
    name: 'Stampede / Crowd Safety',
    icon: '👥',
    description: 'Stay safe in crowded places',
    ageAppropriateDescription: 'Lots of people in one place? Learn how to stay safe in crowds!',
    
    safetySteps: [
      { step: 1, action: 'Stay calm, don\'t push', icon: '🙏' },
      { step: 2, action: 'Move to the side, not forward', icon: '⬅️' },
      { step: 3, action: 'Protect your chest with arms', icon: '💪' },
      { step: 4, action: 'Stay on your feet', icon: '🦵' },
      { step: 5, action: 'Follow exit signs', icon: '🚪' }
    ],
    
    dos: [
      'Stay calm and alert',
      'Keep hands up to protect chest',
      'Move diagonally towards exit',
      'Stay on your feet',
      'Listen to crowd managers',
      'Identify exits when entering',
      'Hold hands with group members'
    ],
    
    donts: [
      'Don\'t push others',
      'Don\'t bend down for fallen items',
      'Don\'t move against crowd',
      'Don\'t panic or shout',
      'Don\'t run',
      'Don\'t go to overcrowded areas'
    ],
    
    games: ['crowd-navigation', 'exit-finder-rush', 'safe-position-practice'],
    
    quizTopics: ['crowd-safety', 'exit-awareness', 'staying-upright', 'group-safety'],
    
    visualAssets: {
      characters: ['ravi', 'meera'],
      scenarios: ['school-assembly', 'metro-station', 'festival-area'],
      animations: ['crowd-movement', 'safe-exit', 'protective-stance']
    }
  }
};

module.exports = disasterContent;
