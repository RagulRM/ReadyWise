/**
 * Seed Video Lessons for All Disasters
 * Adds age-appropriate YouTube video lessons to each disaster module
 * Videos are embedded directly in the site (not external links)
 */

const DisasterModule = require('../models/DisasterModule.model');

/**
 * Video lessons organized by disaster type and grade level
 * Grade mapping hierarchy (aligned to grades 1-12):
 * - Grades 1-3: FOUNDATIONAL (gentle introductions)
 * - Grades 4-6: BASIC (core safety skills)
 * - Grades 7-8: INTERMEDIATE (scenario-based learning)
 * - Grades 9-10: COMMUNITY (community response focus)
 * - Grades 11-12: ANALYTICAL (advanced preparedness & leadership)
 */
const videoLessonsByDisaster = {
  // ==================== AVALANCHE ====================
  avalanche: [
    // Grade 1-2 (Ages 5-7)
    {
      title: 'Avalanche Science & Safety',
      description: 'Learn about avalanches through fun riddles! Perfect for young learners to understand snow safety.',
      content: 'Eggbert Explores teaches kids about avalanches in a gentle, engaging way with riddles.',
      mediaUrl: 'https://www.youtube.com/watch?v=j2lwBuADJMA',
      mediaType: 'video',
      duration: 4,
      order: 10,
      gradeLevel: 'FOUNDATIONAL',
      ageGroup: '5-7',
      minGrade: 1,
      maxGrade: 3
    },
    // Grade 3-4 (Ages 8-10)
    {
      title: 'What Causes an Avalanche?',
      description: 'Dr. Binocs explains what causes avalanches and how to survive them with fun animations.',
      content: 'Learn the science behind avalanches and essential survival tips from Dr. Binocs.',
      mediaUrl: 'https://www.youtube.com/watch?v=vZoTByhlrt0',
      mediaType: 'video',
      duration: 4,
      order: 11,
      gradeLevel: 'BASIC',
      ageGroup: '8-10',
      minGrade: 4,
      maxGrade: 6
    },
    {
      title: 'Avalanche Warning Signs (Middle School)',
      description: 'Break down snow layers, slope angles, and travel tips using the Dr. Binocs explanation for older learners.',
      content: 'Focus on spotting warning signs, buddy checks, and staying with trained guides during alpine trips.',
      mediaUrl: 'https://www.youtube.com/watch?v=vZoTByhlrt0',
      mediaType: 'video',
      duration: 4,
      order: 12,
      gradeLevel: 'INTERMEDIATE',
      ageGroup: '11-13',
      minGrade: 7,
      maxGrade: 8
    },
    {
      title: 'Community Avalanche Prep',
      description: 'See how rescue teams and ski patrols prepare towns for avalanche season with the National Geographic explainer.',
      content: 'Understand evacuation signage, safe zones, and how to support community drills before and after snowfall.',
      mediaUrl: 'https://www.youtube.com/watch?v=kjMonaUIJuY',
      mediaType: 'video',
      duration: 4,
      order: 13,
      gradeLevel: 'COMMUNITY',
      ageGroup: '12-14',
      minGrade: 9,
      maxGrade: 10
    },
    // Grade 11-12 (Advanced preparedness)
    {
      title: 'Avalanche 101 - National Geographic',
      description: 'Real footage with clear animation overlays showing how avalanches form and move.',
      content: 'National Geographic explains avalanche science with real footage and clear visuals.',
      mediaUrl: 'https://www.youtube.com/watch?v=kjMonaUIJuY',
      mediaType: 'video',
      duration: 4,
      order: 14,
      gradeLevel: 'ANALYTICAL',
      ageGroup: '16-18',
      minGrade: 11,
      maxGrade: 12
    }
  ],

  // ==================== CYCLONE ====================
  cyclone: [
    // Grade 1-2 (Ages 4-7)
    {
      title: 'Cyclone / Hurricane / Typhoon Explained',
      description: 'Gentle storytelling about cyclones from the Sky Wonders series by Eggbert Explores.',
      content: 'Learn about cyclones, hurricanes, and typhoons through gentle storytelling.',
      mediaUrl: 'https://www.youtube.com/watch?v=oJRw38jHYn0',
      mediaType: 'video',
      duration: 5,
      order: 10,
      gradeLevel: 'FOUNDATIONAL',
      ageGroup: '4-7',
      minGrade: 1,
      maxGrade: 3
    },
    {
      title: 'Hurricane Safety Guide for Kids',
      description: 'Animated cartoon explainer with clear safety rules every child should know.',
      content: 'Simple and clear hurricane safety rules presented in an animated format.',
      mediaUrl: 'https://www.youtube.com/watch?v=ljHa5XwfiuU',
      mediaType: 'video',
      duration: 3,
      order: 11,
      gradeLevel: 'BASIC',
      ageGroup: '4-8',
      minGrade: 4,
      maxGrade: 6
    },
    // Grade 7-8 (Ages 11-13)
    {
      title: 'Hurricane Explained by Dr. Binocs',
      description: 'Detailed explanation of hurricane categories, the eye, and safety measures.',
      content: 'Dr. Binocs explains hurricanes in detail - categories, eye of the storm, and how to stay safe.',
      mediaUrl: 'https://www.youtube.com/watch?v=J2__Bk4dVS0',
      mediaType: 'video',
      duration: 3,
      order: 12,
      gradeLevel: 'INTERMEDIATE',
      ageGroup: '8-12',
      minGrade: 7,
      maxGrade: 8
    },
    // Grade 9-10 (Ages 13-15)
    {
      title: 'Cyclone and Storm Awareness',
      description: 'Learn about cyclone evacuation process from a real-world perspective.',
      content: 'Comprehensive cyclone awareness video showing evacuation procedures and community response.',
      mediaUrl: 'https://www.youtube.com/watch?v=8FxcA1QNeYY',
      mediaType: 'video',
      duration: 7,
      order: 13,
      gradeLevel: 'COMMUNITY',
      ageGroup: '12-15',
      minGrade: 9,
      maxGrade: 10
    },
    // Grade 11-12 (Ages 15-18)
    {
      title: 'Cyclone Evacuation Leadership',
      description: 'Dive deeper into command centers, relief logistics, and decision making during severe cyclones.',
      content: 'Understand how senior students can support drills, verify information sources, and coordinate community relief tasks.',
      mediaUrl: 'https://www.youtube.com/watch?v=8FxcA1QNeYY',
      mediaType: 'video',
      duration: 7,
      order: 14,
      gradeLevel: 'ANALYTICAL',
      ageGroup: '15-18',
      minGrade: 11,
      maxGrade: 12
    }
  ],

  // ==================== DROUGHT ====================
  drought: [
    // Grade 1-3 (Ages 5-8)
    {
      title: 'What is a Drought?',
      description: 'Simple, visual explanation of drought for young children by Smile and Learn.',
      content: 'A quick and simple explanation of what drought means and why water is precious.',
      mediaUrl: 'https://www.youtube.com/watch?v=07VNIy5gzOY',
      mediaType: 'video',
      duration: 1,
      order: 10,
      gradeLevel: 'FOUNDATIONAL',
      ageGroup: '5-8',
      minGrade: 1,
      maxGrade: 3
    },
    // Grade 4-6 (Ages 8-11)
    {
      title: 'Drought Awareness Cartoon',
      description: 'Learn about drought from a farmer\'s perspective with water conservation tips.',
      content: 'Understand how drought affects farmers and learn important water-saving tips.',
      mediaUrl: 'https://www.youtube.com/watch?v=O5R6p2DC8ok',
      mediaType: 'video',
      duration: 8,
      order: 11,
      gradeLevel: 'BASIC',
      ageGroup: '8-11',
      minGrade: 4,
      maxGrade: 6
    },
    // Grade 7-8 (Ages 12-13)
    {
      title: 'Drought Science Explained',
      description: 'Break down the science of drought, including causes, climate links, and early warning signs.',
      content: 'Explore how scientists classify droughts, monitor rainfall deficits, and plan for long dry spells.',
      mediaUrl: 'https://www.youtube.com/watch?v=O5a6yHSI0L0',
      mediaType: 'video',
      duration: 4,
      order: 12,
      gradeLevel: 'INTERMEDIATE',
      ageGroup: '12-13',
      minGrade: 7,
      maxGrade: 8
    },
    // Grade 9-10 (Ages 13-15)
    {
      title: 'Community Water Scarcity Stories',
      description: 'Analyze how towns coordinate water rationing, relief camps, and mutual aid during extended droughts.',
      content: 'Explore leadership roles for students in awareness drives, community notice boards, and responsible water sharing.',
      mediaUrl: 'https://www.youtube.com/watch?v=B9pOdqAEXCg',
      mediaType: 'video',
      duration: 6,
      order: 13,
      gradeLevel: 'COMMUNITY',
      ageGroup: '13-15',
      minGrade: 9,
      maxGrade: 10
    },
    // Grade 11-12 (Ages 15-18)
    {
      title: 'Drought Preparedness Leadership',
      description: 'Investigate policy responses, aquifer management, and early warning systems that inform drought mitigation.',
      content: 'Develop advanced community action plans, evaluate scientific data, and propose sustainable water governance solutions.',
      mediaUrl: 'https://www.youtube.com/watch?v=B9pOdqAEXCg',
      mediaType: 'video',
      duration: 6,
      order: 14,
      gradeLevel: 'ANALYTICAL',
      ageGroup: '15-18',
      minGrade: 11,
      maxGrade: 12
    }
  ],

  // ==================== EARTHQUAKE ====================
  earthquake: [
    // Grade 1-2 (Ages 3-6)
    {
      title: 'Turtle Safe - Drop, Cover, Hold',
      description: 'Learn the turtle technique: Drop, Cover, and Hold On with a friendly turtle character.',
      content: 'New Zealand Get Ready teaches earthquake safety with the turtle technique.',
      mediaUrl: 'https://www.youtube.com/watch?v=eeZ0GJTFYKw',
      mediaType: 'video',
      duration: 3,
      order: 10,
      gradeLevel: 'FOUNDATIONAL',
      ageGroup: '3-6',
      minGrade: 1,
      maxGrade: 3
    },
    {
      title: 'Earthquake Drill at Preschool',
      description: 'BabyBus shows children how to practice earthquake drills in the classroom.',
      content: 'See how to do an earthquake drill at school with the BabyBus characters.',
      mediaUrl: 'https://www.youtube.com/watch?v=oCRSGHpQE2U',
      mediaType: 'video',
      duration: 8,
      order: 11,
      gradeLevel: 'FOUNDATIONAL',
      ageGroup: '3-6',
      minGrade: 1,
      maxGrade: 3
    },
    // Grade 3-4 (Ages 7-10)
    {
      title: 'How to Survive an Earthquake',
      description: 'Dr. Binocs provides detailed safety tips with engaging animations.',
      content: 'Learn comprehensive earthquake survival tips from Dr. Binocs.',
      mediaUrl: 'https://www.youtube.com/watch?v=MllUVQM3KVk',
      mediaType: 'video',
      duration: 6,
      order: 12,
      gradeLevel: 'BASIC',
      ageGroup: '7-10',
      minGrade: 4,
      maxGrade: 6
    },
    {
      title: 'Prepare with Pedro: Earthquake',
      description: 'Red Cross penguin character teaches family earthquake preparedness.',
      content: 'Pedro the penguin helps families prepare for earthquakes with practical tips.',
      mediaUrl: 'https://www.youtube.com/watch?v=rfC2idGJ9R8',
      mediaType: 'video',
      duration: 8,
      order: 13,
      gradeLevel: 'INTERMEDIATE',
      ageGroup: '7-10',
      minGrade: 7,
      maxGrade: 8
    },
    // Grade 9-10 (Ages 13-15)
    {
      title: 'Community Earthquake Response Teams',
      description: 'Understand how community emergency response teams operate after earthquakes.',
      content: 'Learn how teens can assist with damage assessments, communication trees, and relief logistics after a quake.',
      mediaUrl: 'https://www.youtube.com/watch?v=BLEPakj1YTY',
      mediaType: 'video',
      duration: 5,
      order: 14,
      gradeLevel: 'COMMUNITY',
      ageGroup: '13-15',
      minGrade: 9,
      maxGrade: 10
    },
    // Grade 11-12 (Ages 15-18)
    {
      title: 'Earthquake Safety Scenarios',
      description: 'Advanced earthquake safety in different locations like malls and streets.',
      content: 'Learn how to stay safe during earthquakes in various real-world scenarios.',
      mediaUrl: 'https://www.youtube.com/watch?v=BLEPakj1YTY',
      mediaType: 'video',
      duration: 5,
      order: 15,
      gradeLevel: 'ANALYTICAL',
      ageGroup: '15-18',
      minGrade: 11,
      maxGrade: 12
    }
  ],

  // ==================== FIRE ====================
  fire: [
    // Grade 1-2 (Ages 4-7)
    {
      title: 'Sparky\'s Fire Safety Club',
      description: 'NFPA\'s Sparky teaches fire safety using all your senses.',
      content: 'Join Sparky\'s Fire Safety Club and learn to use your senses to stay safe from fire.',
      mediaUrl: 'https://www.youtube.com/watch?v=jpEeQw5zq3c',
      mediaType: 'video',
      duration: 4,
      order: 10,
      gradeLevel: 'FOUNDATIONAL',
      ageGroup: '4-7',
      minGrade: 1,
      maxGrade: 3
    },
    {
      title: 'Robocar POLI Fire Training',
      description: 'Vehicle characters teach fire safety rules in an exciting animated series.',
      content: 'Learn fire safety with Robocar POLI and friends through exciting adventures.',
      mediaUrl: 'https://www.youtube.com/watch?v=IZ1z6t8F3PI',
      mediaType: 'video',
      duration: 5,
      order: 11,
      gradeLevel: 'FOUNDATIONAL',
      ageGroup: '4-7',
      minGrade: 1,
      maxGrade: 3
    },
    // Grade 3-4 (Ages 8-10)
    {
      title: 'Fire Safety for Kids',
      description: 'Comprehensive home and school fire safety rules by Twinkl.',
      content: 'Learn complete fire safety rules for home and school from Twinkl.',
      mediaUrl: 'https://www.youtube.com/watch?v=2dS2Sisj4GQ',
      mediaType: 'video',
      duration: 7,
      order: 12,
      gradeLevel: 'BASIC',
      ageGroup: '8-12',
      minGrade: 4,
      maxGrade: 6
    },
    // Grade 5-6 (Ages 10-12)
    {
      title: 'Wildfire by Eggbert Explores',
      description: 'Learn about wildfires from the Sky Wonders series.',
      content: 'Understand wildfires - how they start, spread, and how to stay safe.',
      mediaUrl: 'https://www.youtube.com/watch?v=6oVdeg67V9Q',
      mediaType: 'video',
      duration: 5,
      order: 13,
      gradeLevel: 'INTERMEDIATE',
      ageGroup: '10-14',
      minGrade: 7,
      maxGrade: 8
    },
    // Grade 9-10 (Ages 13-15)
    {
      title: 'Community Wildfire Mitigation Teams',
      description: 'Follow how fire crews, volunteers, and students partner to reduce wildfire risks before a blaze.',
      content: 'Learn to create defensible space, support evacuation drills, and communicate safety plans within your neighborhood.',
      mediaUrl: 'https://www.youtube.com/watch?v=6oVdeg67V9Q',
      mediaType: 'video',
      duration: 5,
      order: 14,
      gradeLevel: 'COMMUNITY',
      ageGroup: '13-15',
      minGrade: 9,
      maxGrade: 10
    },
    // Grade 11-12 (Ages 15-18)
    {
      title: 'Wildfire Response Strategies',
      description: 'Advanced look at wildfire behavior, community response, and leadership actions for older students.',
      content: 'Discover how teams coordinate during wildfires, learn about firebreaks, and explore how to plan evacuations safely.',
      mediaUrl: 'https://www.youtube.com/watch?v=6oVdeg67V9Q',
      mediaType: 'video',
      duration: 5,
      order: 15,
      gradeLevel: 'ANALYTICAL',
      ageGroup: '15-18',
      minGrade: 11,
      maxGrade: 12
    }
  ],

  // ==================== FLOOD ====================
  flood: [
    // Grade 1-2 (Ages 5-9)
    {
      title: 'FLOODS - Dr. Binocs Show',
      description: 'Dr. Binocs explains flood causes, types, and prevention in an engaging way.',
      content: 'Learn about different types of floods and how they happen from Dr. Binocs.',
      mediaUrl: 'https://www.youtube.com/watch?v=9hQZCiZ21fk',
      mediaType: 'video',
      duration: 4,
      order: 10,
      gradeLevel: 'FOUNDATIONAL',
      ageGroup: '5-9',
      minGrade: 1,
      maxGrade: 3
    },
    // Grade 3-4 (Ages 8-10)
    {
      title: 'Flood Drowning Prevention',
      description: 'International Lifesaving Society provides practical flood safety tips.',
      content: 'Essential flood safety and drowning prevention tips for everyone.',
      mediaUrl: 'https://www.youtube.com/watch?v=g6XLRu-bloc',
      mediaType: 'video',
      duration: 6,
      order: 11,
      gradeLevel: 'BASIC',
      ageGroup: '5-10',
      minGrade: 4,
      maxGrade: 6
    },
    // Grade 7-8 (Ages 11-13)
    {
      title: 'How to Survive Floods',
      description: 'Detailed disaster management strategies for flood survival.',
      content: 'Learn detailed strategies for surviving floods and helping your community.',
      mediaUrl: 'https://www.youtube.com/watch?v=pi_nUPcQz_A',
      mediaType: 'video',
      duration: 6,
      order: 12,
      gradeLevel: 'INTERMEDIATE',
      ageGroup: '10-13',
      minGrade: 7,
      maxGrade: 8
    },
    // Grade 9-10 (Ages 13-15)
    {
      title: 'Community Flood Response Playbook',
      description: 'See how communities organize sandbag teams, shelter logistics, and neighborhood alerts during floods.',
      content: 'Practice coordinating supply chains, supporting shelters, and sharing accurate updates with local officials.',
      mediaUrl: 'https://www.youtube.com/watch?v=wqEKBkxS7QY',
      mediaType: 'video',
      duration: 18,
      order: 13,
      gradeLevel: 'COMMUNITY',
      ageGroup: '13-15',
      minGrade: 9,
      maxGrade: 10
    },
    // Grade 11-12 (Ages 15-18)
    {
      title: 'Flash Flood Safety for Students',
      description: 'Interactive lesson with real scenarios for older students.',
      content: 'Comprehensive flash flood safety with interactive scenarios and real-world examples.',
      mediaUrl: 'https://www.youtube.com/watch?v=wqEKBkxS7QY',
      mediaType: 'video',
      duration: 18,
      order: 14,
      gradeLevel: 'ANALYTICAL',
      ageGroup: '15-18',
      minGrade: 11,
      maxGrade: 12
    }
  ],

  // ==================== HEATWAVE ====================
  heatwave: [
    // Grade 1-2 (Ages 5-8)
    {
      title: 'Hazardous Heat Waves',
      description: 'Quick, clear animation explaining heat waves by UCAR.',
      content: 'A brief but clear explanation of what heat waves are and how to stay safe.',
      mediaUrl: 'https://www.youtube.com/watch?v=nLIalNwOYCU',
      mediaType: 'video',
      duration: 1,
      order: 10,
      gradeLevel: 'FOUNDATIONAL',
      ageGroup: '5-8',
      minGrade: 1,
      maxGrade: 3
    },
    // Grade 3-4 (Ages 8-10)
    {
      title: 'Heatwave - Dr. Binocs Show',
      description: 'Dr. Binocs explains the science of heat waves and safety tips.',
      content: 'Learn about heat waves, why they happen, and how to protect yourself.',
      mediaUrl: 'https://www.youtube.com/watch?v=DnR_gi9Wz6k',
      mediaType: 'video',
      duration: 4,
      order: 11,
      gradeLevel: 'BASIC',
      ageGroup: '5-10',
      minGrade: 4,
      maxGrade: 6
    },
    // Grade 7-8 (Ages 11-13)
    {
      title: 'Heatwave Science for Kids',
      description: 'Learn about infrastructure impacts and mitigation strategies.',
      content: 'Understand how heat waves affect cities and what we can do about them.',
      mediaUrl: 'https://www.youtube.com/watch?v=kr0VCdbVdu4',
      mediaType: 'video',
      duration: 4,
      order: 12,
      gradeLevel: 'INTERMEDIATE',
      ageGroup: '9-12',
      minGrade: 7,
      maxGrade: 8
    },
    // Grade 9-10 (Ages 13-15)
    {
      title: 'Community Heat Action Plans',
      description: 'Explore how cities set up cooling centers, buddy systems, and outreach during extreme heat.',
      content: 'Plan neighborhood door-knock campaigns, hydration stations, and communication trees for heat emergencies.',
      mediaUrl: 'https://www.youtube.com/watch?v=kr0VCdbVdu4',
      mediaType: 'video',
      duration: 4,
      order: 13,
      gradeLevel: 'COMMUNITY',
      ageGroup: '13-15',
      minGrade: 9,
      maxGrade: 10
    },
    // Grade 11-12 (Ages 15-18)
    {
      title: 'Heatwave Science for Teens',
      description: 'Dive deeper into how heatwaves impact cities, infrastructure, and emergency planning.',
      content: 'Analyze real-world heatwave case studies and explore community-level mitigation strategies.',
      mediaUrl: 'https://www.youtube.com/watch?v=kr0VCdbVdu4',
      mediaType: 'video',
      duration: 4,
      order: 14,
      gradeLevel: 'ANALYTICAL',
      ageGroup: '15-18',
      minGrade: 11,
      maxGrade: 12
    }
  ],

  // ==================== LANDSLIDE ====================
  landslide: [
    // Grade 1-2 (Ages 5-8)
    {
      title: 'Landslide for Kids - Eggbert Explores',
      description: 'Gentle, riddle-based learning about landslides.',
      content: 'Learn about landslides through fun riddles with Eggbert.',
      mediaUrl: 'https://www.youtube.com/watch?v=bH0OXDlQ_CI',
      mediaType: 'video',
      duration: 3,
      order: 10,
      gradeLevel: 'FOUNDATIONAL',
      ageGroup: '5-8',
      minGrade: 1,
      maxGrade: 3
    },
    // Grade 3-4 (Ages 8-10)
    {
      title: 'LANDSLIDE - Dr. Binocs Show',
      description: 'Learn about landslide types, causes, and safety from Dr. Binocs.',
      content: 'Dr. Binocs explains different types of landslides and how to stay safe.',
      mediaUrl: 'https://www.youtube.com/watch?v=krJLnXpemtQ',
      mediaType: 'video',
      duration: 3,
      order: 11,
      gradeLevel: 'BASIC',
      ageGroup: '5-10',
      minGrade: 4,
      maxGrade: 6
    },
    // Grade 7-8 (Ages 11-13)
    {
      title: 'Landslide Science for Kids',
      description: 'Detailed geology and human activities that cause landslides.',
      content: 'Learn the science behind landslides and how human activities can trigger them.',
      mediaUrl: 'https://www.youtube.com/watch?v=xKk8hAqh_Xg',
      mediaType: 'video',
      duration: 4,
      order: 12,
      gradeLevel: 'INTERMEDIATE',
      ageGroup: '9-12',
      minGrade: 7,
      maxGrade: 8
    },
    // Grade 9-10 (Ages 13-15)
    {
      title: 'Community Landslide Watch',
      description: 'See how communities monitor slopes, set up lookout teams, and plan safe evacuation routes.',
      content: 'Practice creating hazard maps, coordinating warnings, and supporting rescue teams during landslides.',
      mediaUrl: 'https://www.youtube.com/watch?v=N-gXK72VMWs',
      mediaType: 'video',
      duration: 4,
      order: 13,
      gradeLevel: 'COMMUNITY',
      ageGroup: '13-15',
      minGrade: 9,
      maxGrade: 10
    },
    // Grade 11-12 (Ages 15-18)
    {
      title: 'What is a Landslide?',
      description: 'Clear diagrams and real examples from Learning Junction.',
      content: 'Understand landslides with clear diagrams and real-world examples.',
      mediaUrl: 'https://www.youtube.com/watch?v=N-gXK72VMWs',
      mediaType: 'video',
      duration: 4,
      order: 14,
      gradeLevel: 'ANALYTICAL',
      ageGroup: '15-18',
      minGrade: 11,
      maxGrade: 12
    }
  ],

  // ==================== STAMPEDE ====================
  stampede: [
    // Grade 7-8 (Ages 11-13) - Limited content due to topic severity
    {
      title: 'How to Survive a Stampede?',
      description: 'Dr. Binocs explains crowd physics and survival strategies in an animated format.',
      content: 'Learn about crowd safety and how to protect yourself in crowded situations.',
      mediaUrl: 'https://www.youtube.com/watch?v=MSiw9ZGdtSQ',
      mediaType: 'video',
      duration: 5,
      order: 10,
      gradeLevel: 'INTERMEDIATE',
      ageGroup: '10-14',
      minGrade: 7,
      maxGrade: 8
    },
    // Grade 9-10 (Ages 13-15)
    {
      title: 'How to Stay Safe in a Crowd Crush',
      description: 'Essential viewing about crowd safety with practical tips.',
      content: 'Learn critical crowd safety techniques that could save your life.',
      mediaUrl: 'https://www.youtube.com/watch?v=mx9gghoiZUE',
      mediaType: 'video',
      duration: 3,
      order: 11,
      gradeLevel: 'COMMUNITY',
      ageGroup: '12-15',
      minGrade: 9,
      maxGrade: 10
    },
    // Grade 11-12 (Ages 15-18)
    {
      title: 'Stampede Safety Explained',
      description: 'Visual explanation of stampede safety with drawings.',
      content: 'Understand stampede risks and safety measures through visual explanations.',
      mediaUrl: 'https://www.youtube.com/watch?v=OV4dM7eSB4w',
      mediaType: 'video',
      duration: 6,
      order: 12,
      gradeLevel: 'ANALYTICAL',
      ageGroup: '14-18',
      minGrade: 11,
      maxGrade: 12
    }
  ],

  // ==================== TSUNAMI ====================
  tsunami: [
    // Grade 1-2 (Ages 5-8)
    {
      title: 'Tsunami Wave Song for Kids',
      description: 'Learn about tsunamis with a memorable song set to "Row Your Boat" tune.',
      content: 'A fun, memorable song that teaches tsunami safety basics.',
      mediaUrl: 'https://www.youtube.com/watch?v=Il8OsgIaSlU',
      mediaType: 'video',
      duration: 2,
      order: 10,
      gradeLevel: 'FOUNDATIONAL',
      ageGroup: '5-8',
      minGrade: 1,
      maxGrade: 3
    },
    // Grade 3-4 (Ages 8-10)
    {
      title: 'Tsunamis: Know What to Do!',
      description: 'Animated crab character teaches tsunami safety from San Diego County.',
      content: 'Learn what to do before, during, and after a tsunami with a friendly crab guide.',
      mediaUrl: 'https://www.youtube.com/watch?v=UzR0Rt3i4kc',
      mediaType: 'video',
      duration: 8,
      order: 11,
      gradeLevel: 'BASIC',
      ageGroup: '5-10',
      minGrade: 4,
      maxGrade: 6
    },
    // Grade 5-6 (Ages 9-12)
    {
      title: 'Tsunami - Dr. Binocs Show',
      description: 'Scientific explanation of tsunamis with safety tips from Dr. Binocs.',
      content: 'Learn the science behind tsunamis and how to stay safe.',
      mediaUrl: 'https://www.youtube.com/watch?v=GZ7Jtd4OJMo',
      mediaType: 'video',
      duration: 4,
      order: 12,
      gradeLevel: 'INTERMEDIATE',
      ageGroup: '9-12',
      minGrade: 7,
      maxGrade: 8
    },
    // Grade 9-10 (Ages 13-15)
    {
      title: 'Tsunami Facts for Kids!',
      description: 'Detailed tsunami science with engaging presentation by Mr. DeMaio.',
      content: 'Comprehensive tsunami facts presented in an engaging, educational format.',
      mediaUrl: 'https://www.youtube.com/watch?v=64FxBgv0n2o',
      mediaType: 'video',
      duration: 7,
      order: 13,
      gradeLevel: 'COMMUNITY',
      ageGroup: '10-14',
      minGrade: 9,
      maxGrade: 10
    },
    // Grade 11-12 (Ages 15-18)
    {
      title: 'Tsunami Science Deep Dive',
      description: 'Advanced exploration of tsunami warning systems, early detection, and leadership during evacuations.',
      content: 'Study real tsunami case studies, interpret warning maps, and learn how to support community preparedness initiatives.',
      mediaUrl: 'https://www.youtube.com/watch?v=64FxBgv0n2o',
      mediaType: 'video',
      duration: 7,
      order: 14,
      gradeLevel: 'ANALYTICAL',
      ageGroup: '14-18',
      minGrade: 11,
      maxGrade: 12
    }
  ]
};

/**
 * Seed video lessons to existing disaster modules
 */
const seedVideoLessons = async () => {
  try {
    console.log('\n🔄 Seeding video lessons...');
    const modules = await DisasterModule.find({});

    await Promise.all(
      modules.map(async disasterModule => {
        const disasterType = disasterModule.disasterType?.toLowerCase();
        const videos = videoLessonsByDisaster[disasterType];

        if (!videos || videos.length === 0) {
          console.warn(`  ⚠️ No video lessons configured for ${disasterModule.disasterType}`);
          return;
        }

        // Remove existing video lessons (to avoid duplicates on re-run)
        disasterModule.lessons = disasterModule.lessons.filter(lesson => lesson.mediaType !== 'video');

        // Add new video lessons with grade targeting
        videos.forEach(video => {
          disasterModule.lessons.push({
            title: video.title,
            description: video.description,
            content: video.content,
            mediaUrl: video.mediaUrl,
            mediaType: 'video',
            duration: video.duration,
            order: video.order,
            gradeLevel: video.gradeLevel,
            ageGroup: video.ageGroup,
            minGrade: video.minGrade,
            maxGrade: video.maxGrade
          });
        });

        // Sort lessons by order so display remains consistent
        disasterModule.lessons.sort((a, b) => a.order - b.order);

        await disasterModule.save();
        console.log(`  ✅ Added ${videos.length} video lessons to ${disasterModule.disasterType}`);
      })
    );

    console.log('\n✅ Video lessons seeding completed!');
    return { success: true, message: 'Video lessons seeded successfully' };
  } catch (error) {
    console.error('❌ Error seeding video lessons:', error);
    throw error;
  }
};

/**
 * Get video lessons for a specific disaster and grade level
 */
const getVideoLessonsForGrade = (disasterType, gradeLevel) => {
  const videos = videoLessonsByDisaster[disasterType] || [];
  
  // Grade to level mapping
  const gradeLevelMap = {
    '1st Grade': 'FOUNDATIONAL',
    '2nd Grade': 'FOUNDATIONAL',
    '3rd Grade': 'FOUNDATIONAL',
    '4th Grade': 'BASIC',
    '5th Grade': 'BASIC',
    '6th Grade': 'BASIC',
    '7th Grade': 'INTERMEDIATE',
    '8th Grade': 'INTERMEDIATE',
    '9th Grade': 'COMMUNITY',
    '10th Grade': 'COMMUNITY',
    '11th Grade': 'ANALYTICAL',
    '12th Grade': 'ANALYTICAL'
  };

  const level = gradeLevelMap[gradeLevel] || 'FOUNDATIONAL';
  
  // Return videos appropriate for this level and below
  const levelOrder = ['FOUNDATIONAL', 'BASIC', 'INTERMEDIATE', 'COMMUNITY', 'ANALYTICAL'];
  const currentLevelIndex = levelOrder.indexOf(level);
  
  return videos.filter(video => {
    const videoLevelIndex = levelOrder.indexOf(video.gradeLevel);
    return videoLevelIndex <= currentLevelIndex;
  });
};

module.exports = {
  seedVideoLessons,
  videoLessonsByDisaster,
  getVideoLessonsForGrade
};
