/**
 * Disaster Controller
 * Handles disaster information retrieval with location-based personalization
 */

const {
  getAllDisasters,
  getDisasterById,
  getDisasterSafetySteps,
} = require('../services/disaster.service');
const { sendSuccess, sendNotFound, sendError } = require('../utils/response.util');
const DisasterModule = require('../models/DisasterModule.model');
const Student = require('../models/Student.model');
const Organization = require('../models/Organization.model');
const { getPersonalizedModules, getDisasterPriority, getDisasterStats } = require('../services/disaster-mapping.service');

/**
 * @route   GET /api/disasters
 * @desc    Get all disaster types
 * @access  Public
 */
const getDisasters = async (req, res) => {
  try {
    const disasters = getAllDisasters();
    
    return sendSuccess(
      res,
      { disasters, count: disasters.length },
      'Disasters retrieved successfully'
    );
  } catch (error) {
    console.error('Error in getDisasters:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   GET /api/disasters/:id
 * @desc    Get detailed disaster information by ID
 * @access  Public
 */
const getDisasterDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const disaster = getDisasterById(id);
    
    if (!disaster) {
      return sendNotFound(res, 'Disaster');
    }
    
    return sendSuccess(res, disaster, 'Disaster details retrieved successfully');
  } catch (error) {
    console.error('Error in getDisasterDetails:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   GET /api/disasters/:id/safety-steps
 * @desc    Get safety steps for a specific disaster
 * @access  Public
 */
const getSafetySteps = async (req, res) => {
  try {
    const { id } = req.params;
    const safetySteps = getDisasterSafetySteps(id);
    
    if (safetySteps.length === 0) {
      return sendNotFound(res, 'Safety steps for this disaster');
    }
    
    return sendSuccess(
      res,
      { disasterId: id, safetySteps },
      'Safety steps retrieved successfully'
    );
  } catch (error) {
    console.error('Error in getSafetySteps:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   GET /api/disasters/personalized
 * @desc    Get personalized disaster modules for a student based on location
 * @access  Private (Student)
 */
const getPersonalizedDisasterModules = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId).populate('organization', 'location');

    if (!student) {
      return sendNotFound(res, 'Student');
    }

    const { state, city } = student.organization.location;

    // Get personalized module priority
    const personalizedOrder = getPersonalizedModules(state, city);
    const locationInfo = getDisasterPriority(state, city);

    // Fetch actual module data from database
    const modules = await DisasterModule.find({ isActive: true });

    // Map modules with personalized priority
    const personalizedModules = personalizedOrder.map(priorityInfo => {
      const moduleData = modules.find(m => m.disasterType === priorityInfo.type);
      
      if (!moduleData) return null;

      return {
        _id: moduleData._id,
        disasterType: moduleData.disasterType,
        name: moduleData.name,
        icon: moduleData.icon,
        description: moduleData.description,
        color: moduleData.color,
        totalLessons: moduleData.totalLessons,
        totalQuestions: moduleData.totalQuestions,
        locationPriority: priorityInfo.locationPriority,
        displayOrder: priorityInfo.displayOrder,
        recommended: priorityInfo.recommended,
        urgent: priorityInfo.urgent,
        regionalContent: moduleData.getRegionalContent(state)
      };
    }).filter(m => m !== null);

    return sendSuccess(res, {
      modules: personalizedModules,
      location: {
        state,
        city,
        riskLevel: locationInfo.riskLevel,
        region: locationInfo.region,
        earthquakeZone: locationInfo.earthquakeZone,
        specialNotes: locationInfo.specialNotes
      },
      stats: {
        totalModules: personalizedModules.length,
        primaryDisasters: personalizedModules.filter(m => m.locationPriority === 'PRIMARY').length,
        recommendedModules: personalizedModules.filter(m => m.recommended).length,
        urgentModules: personalizedModules.filter(m => m.urgent).length
      }
    }, 'Personalized modules retrieved successfully');

  } catch (error) {
    console.error('Error in getPersonalizedDisasterModules:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   GET /api/disasters/module/:moduleId
 * @desc    Get disaster module details by ID
 * @access  Private
 */
const getModuleDetails = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const studentId = req.user.id;

    const module = await DisasterModule.findById(moduleId);

    if (!module) {
      return sendNotFound(res, 'Module');
    }

    // Get student's location for regional content and grade for video filtering
    const student = await Student.findById(studentId).populate('organization', 'location');
    const regionalContent = student ? module.getRegionalContent(student.organization.location.state) : null;

    // Filter video lessons based on student's grade level
    let moduleData = module.toObject();
    if (student && student.class && student.class.grade) {
      const studentGrade = student.class.grade;
      
      // Filter lessons to include:
      // 1. All non-video lessons
      // 2. Video lessons that match the student's grade range
      moduleData.lessons = moduleData.lessons.filter(lesson => {
        if (lesson.mediaType !== 'video') {
          return true; // Keep all non-video lessons
        }
        
        // For video lessons, check grade range
        const minGrade = lesson.minGrade || 1;
        const maxGrade = lesson.maxGrade || 12;
        return studentGrade >= minGrade && studentGrade <= maxGrade;
      });
    }

    return sendSuccess(res, {
      module: moduleData,
      regionalContent,
      studentGrade: student?.class?.grade
    }, 'Module details retrieved successfully');

  } catch (error) {
    console.error('Error in getModuleDetails:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   GET /api/disasters/stats/organization
 * @desc    Get disaster statistics for organization location
 * @access  Private (Organization)
 */
const getOrganizationDisasterStats = async (req, res) => {
  try {
    const organizationId = req.user.id;

    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return sendNotFound(res, 'Organization');
    }

    const stats = getDisasterStats(organization.location.state);
    const locationInfo = getDisasterPriority(organization.location.state, organization.location.city);

    return sendSuccess(res, {
      location: {
        state: organization.location.state,
        city: organization.location.city,
        district: organization.location.district
      },
      ...stats,
      primaryDisasters: locationInfo.primary,
      secondaryDisasters: locationInfo.secondary,
      tertiaryDisasters: locationInfo.tertiary,
      specialNotes: locationInfo.specialNotes
    }, 'Disaster statistics retrieved successfully');

  } catch (error) {
    console.error('Error in getOrganizationDisasterStats:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   GET /api/disasters/modules
 * @desc    Get all disaster modules
 * @access  Private
 */
const getAllModules = async (req, res) => {
  try {
    const modules = await DisasterModule.find({ isActive: true })
      .select('-lessons -quiz -game')
      .sort({ basePriority: 1 });

    return sendSuccess(res, { modules, count: modules.length }, 'All modules retrieved successfully');

  } catch (error) {
    console.error('Error in getAllModules:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   GET /api/disasters/module/:moduleId/lessons
 * @desc    Get module lessons
 * @access  Private
 */
const getModuleLessons = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await DisasterModule.findById(moduleId).select('name lessons');

    if (!module) {
      return sendNotFound(res, 'Module');
    }

    return sendSuccess(res, {
      moduleName: module.name,
      lessons: module.lessons.sort((a, b) => a.order - b.order)
    }, 'Lessons retrieved successfully');

  } catch (error) {
    console.error('Error in getModuleLessons:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   GET /api/disasters/module/:moduleId/quiz
 * @desc    Get module quiz (Auto grade-based)
 * @access  Private
 */
const getModuleQuiz = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user.id;

    const module = await DisasterModule.findById(moduleId).select('name disasterType');

    if (!module) {
      return sendNotFound(res, 'Module');
    }

    // Get user's grade level automatically
    const userGradeLevel = await getUserGradeLevel(userId, req.user.role);
    
    if (!userGradeLevel) {
      return sendError(res, 'Unable to determine student grade level');
    }

    // Generate grade-specific quiz questions
    const gradeSpecificQuiz = generateGradeSpecificQuiz(module.disasterType, userGradeLevel);

    return sendSuccess(res, {
      moduleName: module.name,
      disasterType: module.disasterType,
      gradeLevel: userGradeLevel,
      quiz: gradeSpecificQuiz
    }, 'Quiz retrieved successfully');

  } catch (error) {
    console.error('Error in getModuleQuiz:', error);
    return sendError(res, error.message);
  }
};

/**
 * Get user's grade level based on their profile
 */
const getUserGradeLevel = async (userId, userRole) => {
  try {
    if (userRole === 'student') {
      const Student = require('../models/Student.model');
      const student = await Student.findById(userId).select('class.grade');
      
      if (student && student.class && student.class.grade) {
        return mapGradeToLevel(student.class.grade);
      }
    }
    
    // Default fallback
    return 'BASIC';
  } catch (error) {
    console.error('Error getting user grade level:', error);
    return 'BASIC';
  }
};

/**
 * Map numeric grade (1-12) to our grade level constants
 */
const mapGradeToLevel = (grade) => {
  if (grade >= 1 && grade <= 2) return 'FOUNDATIONAL';
  if (grade >= 3 && grade <= 4) return 'BASIC';
  if (grade >= 5 && grade <= 6) return 'APPLIED';
  if (grade >= 7 && grade <= 8) return 'COMMUNITY';
  if (grade >= 9 && grade <= 10) return 'ANALYTICAL';
  if (grade >= 11 && grade <= 12) return 'INTEGRATED';
  
  return 'BASIC'; // Default fallback
};

/**
 * Generate grade-specific quiz questions based on disaster type and level
 */
const generateGradeSpecificQuiz = (disasterType, level) => {
  const quizBank = {
    // FOUNDATIONAL (Grade 1-2, Age 5-7) - Visual, simple true/false, basic safety
    FOUNDATIONAL: {
      cyclone: [
        {
          _id: 'cyclone_f1',
          question: 'What should you do when there is a very strong wind called a cyclone?',
          options: [
            { text: 'Run outside to play' },
            { text: 'Go to a safe room inside the building', correct: true },
            { text: 'Stand near the window' },
            { text: 'Keep playing with friends' }
          ],
          explanation: 'During a cyclone, strong winds can break windows and objects can fly around. The safest place is inside a sturdy building, away from windows.',
          points: 10
        },
        {
          _id: 'cyclone_f2',
          question: 'True or False: When a cyclone is coming, we should close all the windows and doors of our home.',
          options: [
            { text: 'True', correct: true },
            { text: 'False' }
          ],
          explanation: 'Closing windows and doors prevents strong winds from entering and breaking things. Glass pieces can hurt us, so this is very important.',
          points: 10
        },
        {
          _id: 'cyclone_f3',
          question: 'Which items should you keep ready before a cyclone comes?',
          options: [
            { text: 'Toys and games' },
            { text: 'Water bottles, torch, and first aid box', correct: true },
            { text: 'School books' },
            { text: 'Birthday decorations' }
          ],
          explanation: 'We need water to drink, torch for light if electricity goes, and first aid box if someone gets hurt. These are emergency supplies.',
          points: 10
        },
        {
          _id: 'cyclone_f4',
          question: 'What sound does a cyclone warning siren make?',
          options: [
            { text: 'A song' },
            { text: 'A loud, continuous sound to warn people', correct: true },
            { text: 'A whisper' },
            { text: 'No sound' }
          ],
          explanation: 'Warning sirens are LOUD so everyone can hear them. When you hear this sound, tell your parents immediately.',
          points: 10
        },
        {
          _id: 'cyclone_f5',
          question: 'Can you go out to play during a cyclone?',
          options: [
            { text: 'Yes, it\'s fun' },
            { text: 'No, it is very dangerous', correct: true },
            { text: 'Only with friends' },
            { text: 'Only in the garden' }
          ],
          explanation: 'Never go outside during a cyclone! Strong winds can blow you away, trees can fall, things can hit you. Stay inside until it\'s completely safe.',
          points: 10
        },
        {
          _id: 'cyclone_f6',
          question: 'Who helps people during a cyclone?',
          options: [
            { text: 'Only teachers' },
            { text: 'Police, firefighters, and rescue teams', correct: true },
            { text: 'Only doctors' },
            { text: 'No one helps' }
          ],
          explanation: 'Many brave people like police, firefighters, army, and rescue teams work hard to keep everyone safe during cyclones.',
          points: 10
        }
      ],
      earthquake: [
        {
          _id: 'earthquake_f1',
          question: 'When the ground shakes (earthquake), what should you do first?',
          options: [
            { text: 'Run outside quickly' },
            { text: 'Drop down and cover your head', correct: true },
            { text: 'Stand and look around' },
            { text: 'Call for help loudly' }
          ],
          explanation: 'When earthquake starts, immediately drop down to protect yourself from falling objects.',
          points: 10
        },
        {
          _id: 'earthquake_f2',
          question: 'Where is the safest place during an earthquake?',
          options: [
            { text: 'Near a window' },
            { text: 'Under a strong table or desk', correct: true },
            { text: 'In the middle of the room' },
            { text: 'Near a wall' }
          ],
          explanation: 'Tables and desks protect you from things that might fall from above during an earthquake.',
          points: 10
        },
        {
          _id: 'earthquake_f3',
          question: 'What happens during an earthquake?',
          options: [
            { text: 'The sky changes color' },
            { text: 'The ground shakes and moves', correct: true },
            { text: 'It rains heavily' },
            { text: 'Birds start singing' }
          ],
          explanation: 'During an earthquake, the ground shakes because the earth moves. This can make things fall down.',
          points: 10
        },
        {
          _id: 'earthquake_f4',
          question: 'True or False: After an earthquake stops, it is safe to play immediately.',
          options: [
            { text: 'True' },
            { text: 'False', correct: true }
          ],
          explanation: 'Wait for adults to check if everything is safe. Sometimes there can be more shaking (aftershocks) after the first earthquake.',
          points: 10
        },
        {
          _id: 'earthquake_f5',
          question: 'What should you NOT do during an earthquake?',
          options: [
            { text: 'Stay calm' },
            { text: 'Run around in panic', correct: true },
            { text: 'Cover your head' },
            { text: 'Hold something strong' }
          ],
          explanation: 'Running around during an earthquake is dangerous. You might fall or things might fall on you. Stay where you are, drop down, and cover your head.',
          points: 10
        }
      ],
      flood: [
        {
          _id: 'flood_f1',
          question: 'What should you do when water is rising on the street?',
          options: [
            { text: 'Play in the water' },
            { text: 'Go to a higher place inside the building', correct: true },
            { text: 'Stay outside' },
            { text: 'Cross the water' }
          ],
          explanation: 'Flood water can be very dangerous - it can sweep you away. Go to higher floors in buildings, or to high ground. Never play in flood water.',
          points: 10
        },
        {
          _id: 'flood_f2',
          question: 'True or False: Flood water is clean and safe to touch.',
          options: [
            { text: 'True' },
            { text: 'False', correct: true }
          ],
          explanation: 'Flood water is dirty and has germs. It can make you sick. Never play in flood water or drink it.',
          points: 10
        },
        {
          _id: 'flood_f3',
          question: 'What causes floods?',
          options: [
            { text: 'Too much sunshine' },
            { text: 'Too much rain and water', correct: true },
            { text: 'Strong wind' },
            { text: 'Snow' }
          ],
          explanation: 'When there is too much rain, water fills up streets and houses. This is called a flood.',
          points: 10
        },
        {
          _id: 'flood_f4',
          question: 'Which of these is safe during a flood?',
          options: [
            { text: 'Going upstairs to higher floors', correct: true },
            { text: 'Walking in flood water' },
            { text: 'Playing near the water' },
            { text: 'Going down to the basement' }
          ],
          explanation: 'Always go UP to higher floors when there is a flood. Water stays down, so higher places are safer.',
          points: 10
        },
        {
          _id: 'flood_f5',
          question: 'What should you take with you if you need to leave home during a flood?',
          options: [
            { text: 'All your toys' },
            { text: 'Important things like water, food, and medicines', correct: true },
            { text: 'Your bicycle' },
            { text: 'Heavy furniture' }
          ],
          explanation: 'Take only important things you need to stay safe and healthy - water, food, medicines, and important papers.',
          points: 10
        }
      ],
      fire: [
        {
          _id: 'fire_f1',
          question: 'If you see fire in your house, what should you do?',
          options: [
            { text: 'Hide under the bed' },
            { text: 'Tell an adult and go outside quickly', correct: true },
            { text: 'Try to put it out with water' },
            { text: 'Take your toys' }
          ],
          explanation: 'If you see fire, tell an adult immediately and get out of the house quickly. Don\'t hide or try to fight the fire. Get out and stay out!',
          points: 10
        },
        {
          _id: 'fire_f2',
          question: 'What should you do if there is smoke in your room?',
          options: [
            { text: 'Stand up tall' },
            { text: 'Crawl low on the floor and go to the door', correct: true },
            { text: 'Jump on the bed' },
            { text: 'Open all windows' }
          ],
          explanation: 'Smoke goes up, clean air stays down. Crawl on your hands and knees to breathe cleaner air and get out safely.',
          points: 10
        },
        {
          _id: 'fire_f3',
          question: 'True or False: You should go back inside a burning house to get your favorite toy.',
          options: [
            { text: 'True' },
            { text: 'False', correct: true }
          ],
          explanation: 'NEVER go back inside a burning building for anything - not for toys, pets, or anything. Your life is more important. Firefighters will help.',
          points: 10
        },
        {
          _id: 'fire_f4',
          question: 'What number should you call for fire emergency?',
          options: [
            { text: '100' },
            { text: '101', correct: true },
            { text: '102' },
            { text: '103' }
          ],
          explanation: 'In India, dial 101 for fire emergency. Firefighters will come quickly to help put out the fire.',
          points: 10
        },
        {
          _id: 'fire_f5',
          question: 'What helps prevent fires at home?',
          options: [
            { text: 'Playing with matches' },
            { text: 'Never playing with matches or lighters', correct: true },
            { text: 'Leaving candles burning' },
            { text: 'Keeping papers near the stove' }
          ],
          explanation: 'Matches and lighters are NOT toys. Only adults should use them. Never play with fire - it can hurt you and burn your house.',
          points: 10
        }
      ],
      drought: [
        {
          _id: 'drought_f1',
          question: 'What does it mean when there is a drought?',
          options: [
            { text: 'Too much rain' },
            { text: 'No rain for a very long time and very little water', correct: true },
            { text: 'It is very cold' },
            { text: 'Too many clouds' }
          ],
          explanation: 'Drought means there is no rain for many days or months. Water becomes very less and we need to save every drop!',
          points: 10
        },
        {
          _id: 'drought_f2',
          question: 'What should you do to save water at home?',
          options: [
            { text: 'Keep the tap running while brushing teeth' },
            { text: 'Turn off the tap when not using water', correct: true },
            { text: 'Take very long baths' },
            { text: 'Waste water while playing' }
          ],
          explanation: 'Turn off taps when you are not using water - like while brushing teeth or soaping hands. Every drop saved helps!',
          points: 10
        },
        {
          _id: 'drought_f3',
          question: 'During drought, what happens to plants and trees?',
          options: [
            { text: 'They grow bigger' },
            { text: 'They become dry and can die without water', correct: true },
            { text: 'They become colorful' },
            { text: 'Nothing happens' }
          ],
          explanation: 'Plants need water to live, just like we do. Without rain during drought, plants become dry and can die. That\'s why we should water them with saved water.',
          points: 10
        },
        {
          _id: 'drought_f4',
          question: 'True or False: We can waste water anytime we want.',
          options: [
            { text: 'True' },
            { text: 'False', correct: true }
          ],
          explanation: 'We should NEVER waste water! Water is precious. During drought, water becomes even more precious. Use only what you need.',
          points: 10
        },
        {
          _id: 'drought_f5',
          question: 'What can you do to help during a drought?',
          options: [
            { text: 'Use more water for fun' },
            { text: 'Tell family members to save water and close dripping taps', correct: true },
            { text: 'Leave taps open' },
            { text: 'Ignore the problem' }
          ],
          explanation: 'Even small kids can help! Tell adults if you see dripping taps, remind family to save water, and use less water yourself.',
          points: 10
        }
      ]
    },

    // BASIC (Grade 3-4, Age 8-9) - Scenario-based, do's & don'ts
    BASIC: {
      cyclone: [
        {
          _id: 'cyclone_b1',
          question: 'Your family gets a cyclone warning. What should you do first?',
          options: [
            { text: 'Pack bags and run outside' },
            { text: 'Turn on the TV and listen to updates', correct: true },
            { text: 'Go to school as usual' },
            { text: 'Open all windows for fresh air' }
          ],
          explanation: 'When a cyclone warning is issued, we should listen to emergency broadcasts (TV, radio) to know the exact time it will hit and evacuation instructions.',
          points: 15
        },
        {
          _id: 'cyclone_b2',
          question: 'It\'s becoming very windy outside. Your mom says we need to evacuate. What should you do?',
          options: [
            { text: 'Wait to see if it gets worse' },
            { text: 'Gather important items and move to the community center', correct: true },
            { text: 'Try to rescue the neighbor\'s pet' },
            { text: 'Continue playing' }
          ],
          explanation: 'When authorities say to evacuate, follow immediately. Don\'t delay. Move to designated safe places like community centers.',
          points: 15
        },
        {
          _id: 'cyclone_b3',
          question: 'What supplies should your family keep ready for a cyclone?',
          options: [
            { text: 'Only mobile phones' },
            { text: 'Drinking water, non-perishable food, flashlight, batteries, first aid kit, and important documents', correct: true },
            { text: 'Just money' },
            { text: 'Video games' }
          ],
          explanation: 'Emergency kit needs: water (3 days supply), food that doesn\'t spoil, flashlight with extra batteries, first aid supplies, radio, and copies of important papers.',
          points: 15
        },
        {
          _id: 'cyclone_b4',
          question: 'During a cyclone, you hear a loud crash outside. What should you do?',
          options: [
            { text: 'Go outside to check what happened' },
            { text: 'Stay inside and away from windows until the cyclone passes', correct: true },
            { text: 'Open the door to look' },
            { text: 'Run to tell neighbors' }
          ],
          explanation: 'Never go outside during a cyclone, even if you hear something. Flying debris, falling trees, and strong winds are extremely dangerous. Stay inside until authorities say it\'s safe.',
          points: 15
        },
        {
          _id: 'cyclone_b5',
          question: 'After a cyclone passes and the wind stops, is it safe to go outside immediately?',
          options: [
            { text: 'Yes, immediately go outside' },
            { text: 'Wait for official announcement that it is safe. Check for dangers like broken wires and debris', correct: true },
            { text: 'Go outside to play' },
            { text: 'Don\'t wait, start cleaning up' }
          ],
          explanation: 'After cyclone: (1) Wait for official all-clear, (2) Check for hazards - broken power lines, sharp debris, unstable structures, (3) Listen to emergency broadcasts for updates.',
          points: 15
        }
      ],
      earthquake: [
        {
          _id: 'earthquake_b1',
          question: 'During an earthquake at school, what should you do?',
          options: [
            { text: 'Run to the door immediately' },
            { text: 'Duck under your desk and hold on', correct: true },
            { text: 'Stand in the middle of the room' },
            { text: 'Look out the window' }
          ],
          explanation: 'Drop, Cover, and Hold On! Get under a sturdy desk to protect from falling objects.',
          points: 15
        },
        {
          _id: 'earthquake_b2',
          question: 'If you are outside during an earthquake, where should you go?',
          options: [
            { text: 'Run into the nearest building' },
            { text: 'Move to an open area away from buildings, trees, and power lines', correct: true },
            { text: 'Stand under a tree' },
            { text: 'Stand next to a wall' }
          ],
          explanation: 'In open areas, move away from anything that can fall on you - buildings, trees, power lines, walls. Stay in the open until shaking stops.',
          points: 15
        },
        {
          _id: 'earthquake_b3',
          question: 'What is an aftershock?',
          options: [
            { text: 'The main earthquake' },
            { text: 'A smaller earthquake that happens after the main one', correct: true },
            { text: 'A type of lightning' },
            { text: 'A loud sound' }
          ],
          explanation: 'Aftershocks are smaller earthquakes that follow the main earthquake. They can happen minutes, hours, or even days later. Be ready to Drop, Cover, and Hold On again!',
          points: 15
        },
        {
          _id: 'earthquake_b4',
          question: 'What should your family keep in an earthquake emergency kit?',
          options: [
            { text: 'Only water bottles' },
            { text: 'Water, food, flashlight, whistle, first aid kit, and sturdy shoes', correct: true },
            { text: 'Just a mobile phone' },
            { text: 'Books and toys' }
          ],
          explanation: 'Earthquake kit needs: water, non-perishable food, flashlight, whistle (to signal for help), first aid supplies, sturdy shoes (for walking on broken glass), and important documents.',
          points: 15
        },
        {
          _id: 'earthquake_b5',
          question: 'During an earthquake, if you are in bed, what should you do?',
          options: [
            { text: 'Jump out and run' },
            { text: 'Stay in bed, cover your head with a pillow, and hold on', correct: true },
            { text: 'Turn on the lights' },
            { text: 'Call someone' }
          ],
          explanation: 'If in bed during an earthquake, stay there! Cover your head with a pillow to protect from falling objects. Bed provides some protection, and moving around is dangerous.',
          points: 15
        }
      ],
      flood: [
        {
          _id: 'flood_b1',
          question: 'Water is rising on your street during heavy rain. What should you do?',
          options: [
            { text: 'Walk through the water to reach higher ground' },
            { text: 'Move to upper floors and wait for help', correct: true },
            { text: 'Try to swim across' },
            { text: 'Stay on the ground floor' }
          ],
          explanation: 'Never try to walk through flood water. Move to higher floors immediately and wait for rescue teams. Even shallow water can sweep you away.',
          points: 15
        },
        {
          _id: 'flood_b2',
          question: 'Why is it dangerous to walk through moving flood water?',
          options: [
            { text: 'It will make your shoes wet' },
            { text: 'Just 6 inches of moving water can knock you down, and 2 feet can sweep away a car', correct: true },
            { text: 'It\'s only dangerous at night' },
            { text: 'It\'s not dangerous' }
          ],
          explanation: 'Moving water is VERY powerful! Even shallow flood water (6 inches) can knock you off your feet. 2 feet of water can carry away cars. NEVER walk or drive through flood water.',
          points: 15
        },
        {
          _id: 'flood_b3',
          question: 'During heavy rains, you hear a flood warning on TV. What should your family do first?',
          options: [
            { text: 'Go to sleep' },
            { text: 'Move valuables to upper floors and prepare to evacuate if told', correct: true },
            { text: 'Go outside to check' },
            { text: 'Ignore the warning' }
          ],
          explanation: 'When flood warning is issued: (1) Move important items upstairs, (2) Prepare emergency kit, (3) Listen for evacuation orders, (4) Be ready to move to higher ground quickly.',
          points: 15
        },
        {
          _id: 'flood_b4',
          question: 'What should you do if flood water enters your house?',
          options: [
            { text: 'Try to push the water out' },
            { text: 'Turn off electricity at the main switch and move to upper floor immediately', correct: true },
            { text: 'Continue watching TV' },
            { text: 'Start cleaning immediately' }
          ],
          explanation: 'If water enters: (1) Turn off electricity (to prevent shock), (2) Go upstairs immediately, (3) Take emergency kit with you, (4) Call for help, (5) Don\'t return until it\'s safe.',
          points: 15
        },
        {
          _id: 'flood_b5',
          question: 'After a flood, what should you check before using water from taps?',
          options: [
            { text: 'Nothing, just use it' },
            { text: 'Check if authorities say water is safe. If not, boil it before drinking', correct: true },
            { text: 'Just smell it' },
            { text: 'Only check the color' }
          ],
          explanation: 'After floods, tap water can be contaminated with germs and sewage. Only drink tap water after authorities say it\'s safe, or boil water for 1 minute before drinking.',
          points: 15
        }
      ],
      fire: [
        {
          _id: 'fire_b1',
          question: 'You smell smoke in your house. What should you do first?',
          options: [
            { text: 'Look for the fire source' },
            { text: 'Alert everyone in the house and move to safety', correct: true },
            { text: 'Try to put out the fire yourself' },
            { text: 'Hide in your room' }
          ],
          explanation: 'When you smell smoke, immediately alert everyone and evacuate. Don\'t waste time looking for the fire. Get out first, then call for help.',
          points: 15
        },
        {
          _id: 'fire_b2',
          question: 'What is the correct way to escape from a smoke-filled room?',
          options: [
            { text: 'Walk normally standing up' },
            { text: 'Crawl low under the smoke, test doors before opening, and follow your escape plan', correct: true },
            { text: 'Run as fast as possible' },
            { text: 'Wait for someone to rescue you' }
          ],
          explanation: 'Smoke rises, cleaner air is near the floor. Crawl low, touch doors before opening (hot door = fire behind it), and follow your family\'s escape plan to get out safely.',
          points: 15
        },
        {
          _id: 'fire_b3',
          question: 'Your family should have a fire escape plan. What should it include?',
          options: [
            { text: 'Just know where the door is' },
            { text: 'Two ways out of each room, a meeting place outside, and practice drills', correct: true },
            { text: 'Only one exit' },
            { text: 'No plan needed' }
          ],
          explanation: 'Good fire escape plan: (1) Two exits from each room, (2) Outdoor meeting spot, (3) Practice the plan twice a year, (4) Know how to call 101, (5) Never go back inside.',
          points: 15
        },
        {
          _id: 'fire_b4',
          question: 'Before opening a door during a fire, what should you do?',
          options: [
            { text: 'Open it quickly' },
            { text: 'Touch the door with the back of your hand. If hot, use another exit', correct: true },
            { text: 'Kick it open' },
            { text: 'Wait and think' }
          ],
          explanation: 'Hot door = fire on the other side! Use back of hand to test (less damage if burned). If door is hot, use your second exit route. Never open a hot door.',
          points: 15
        },
        {
          _id: 'fire_b5',
          question: 'What should you do once you escape from a burning building?',
          options: [
            { text: 'Go back in for your belongings' },
            { text: 'Go to your family meeting place, call 101, and NEVER go back inside', correct: true },
            { text: 'Watch from nearby' },
            { text: 'Try to fight the fire' }
          ],
          explanation: 'Once out, stay out! Go to your meeting place, make sure everyone is there, call fire department (101), and NEVER go back inside for any reason.',
          points: 15
        }
      ],
      drought: [
        {
          _id: 'drought_b1',
          question: 'During a drought, how should you use water at home?',
          options: [
            { text: 'Use as much as you want' },
            { text: 'Save water by turning off taps, taking shorter showers, and reusing water', correct: true },
            { text: 'Only drink water, don\'t use for anything else' },
            { text: 'Water doesn\'t matter' }
          ],
          explanation: 'During drought, every drop counts. Turn off taps when not in use, take shorter showers, and reuse water for plants. Save water for drinking and essential needs.',
          points: 15
        },
        {
          _id: 'drought_b2',
          question: 'What happens to farmers during a drought?',
          options: [
            { text: 'Nothing changes' },
            { text: 'Crops fail due to lack of water, animals don\'t get enough to drink, and farmers lose income', correct: true },
            { text: 'They grow more crops' },
            { text: 'They take a vacation' }
          ],
          explanation: 'Drought is very hard for farmers: crops die without water, cattle don\'t get enough to drink, farmers lose money and may go into debt. This affects food supply for everyone.',
          points: 15
        },
        {
          _id: 'drought_b3',
          question: 'Which of these is a good way to save water during drought?',
          options: [
            { text: 'Wash the car every day' },
            { text: 'Collect and reuse water from washing vegetables to water plants', correct: true },
            { text: 'Keep taps running' },
            { text: 'Use a hose to clean the driveway' }
          ],
          explanation: 'Reuse water wisely! Water from washing vegetables, rice, or fruits can be used to water plants. Water from RO purifiers can be used for cleaning. Every drop counts!',
          points: 15
        },
        {
          _id: 'drought_b4',
          question: 'What is rainwater harvesting and why is it important during drought?',
          options: [
            { text: 'Playing in the rain' },
            { text: 'Collecting and storing rainwater for later use when there is no rain', correct: true },
            { text: 'Stopping the rain' },
            { text: 'Making rain' }
          ],
          explanation: 'Rainwater harvesting means collecting rain from roofs and storing it in tanks. During drought, this saved water can be used for drinking, cooking, and farming.',
          points: 15
        },
        {
          _id: 'drought_b5',
          question: 'How can you tell if your area might face a drought soon?',
          options: [
            { text: 'It\'s impossible to tell' },
            { text: 'Less rainfall than normal, water levels in wells and lakes going down, weather forecasts warning of dry conditions', correct: true },
            { text: 'Only when all water stops completely' },
            { text: 'When it\'s very hot' }
          ],
          explanation: 'Drought warning signs: (1) Less rain than usual for months, (2) Wells and lakes drying up, (3) Weather department warnings, (4) Soil becoming very dry. Start saving water early!',
          points: 15
        }
      ]
    },

    // APPLIED (Grade 5-6, Age 10-11) - Real-world application, analysis
    APPLIED: {
      cyclone: [
        {
          _id: 'cyclone_a1',
          question: 'A cyclone alert is issued for your coastal city. Your family lives on the 2nd floor of a 4-story apartment. What are the CORRECT actions? (Select the best answer)',
          options: [
            { text: 'Move to ground floor for quick exit' },
            { text: 'Stay on 2nd floor and move to interior room away from windows', correct: true },
            { text: 'Move to 4th floor for better view' },
            { text: 'Keep windows open for ventilation' }
          ],
          explanation: 'Middle floors are safer than ground (flood risk) or top floor (wind exposure). Interior rooms without windows are safest.',
          points: 20
        },
        {
          _id: 'cyclone_a2',
          question: 'Why is it dangerous to use elevators during a cyclone?',
          options: [
            { text: 'They are expensive to operate' },
            { text: 'Elevators may get stuck if power fails and people get trapped inside', correct: true },
            { text: 'They go too fast' },
            { text: 'It\'s not dangerous' }
          ],
          explanation: 'During cyclones, power failures are common. People can get trapped in elevators with no way to exit. Always use stairs during emergencies.',
          points: 20
        },
        {
          _id: 'cyclone_a3',
          question: 'Your coastal town has been asked to evacuate 24 hours before the cyclone hits. Your neighbor refuses to leave. What is the BEST argument to convince them?',
          options: [
            { text: 'Tell them they will get fined' },
            { text: 'Explain that rescue teams cannot reach them during the cyclone, and their life is at risk', correct: true },
            { text: 'Say everyone else is leaving' },
            { text: 'Ignore their decision' }
          ],
          explanation: 'During a cyclone, rescue operations stop. Emergency services cannot reach people who stayed behind. Evacuation is mandatory because once the cyclone hits, help cannot come.',
          points: 20
        },
        {
          _id: 'cyclone_a4',
          question: 'After a cyclone passes, you notice water accumulation around your home. Why is this water potentially dangerous?',
          options: [
            { text: 'It\'s just clean rainwater' },
            { text: 'It may contain sewage, chemicals, sharp debris, and can cause diseases like cholera and leptospirosis', correct: true },
            { text: 'It\'s only dangerous if it\'s deep' },
            { text: 'It\'s safe for playing' }
          ],
          explanation: 'Post-cyclone water is contaminated with: sewage, garbage, chemicals, dead animals, sharp objects. It spreads diseases like cholera, typhoid, leptospirosis. Avoid contact, never drink it.',
          points: 20
        },
        {
          _id: 'cyclone_a5',
          question: 'Which structural feature of a building provides the MOST protection during a cyclone?',
          options: [
            { text: 'Large windows for ventilation' },
            { text: 'Reinforced concrete structure with cyclone-resistant roof and shutters', correct: true },
            { text: 'Wooden walls' },
            { text: 'Tall height' }
          ],
          explanation: 'Cyclone-resistant buildings need: (1) Strong concrete foundation, (2) Reinforced walls, (3) Wind-resistant roof with secure fastenings, (4) Storm shutters, (5) No loose attachments.',
          points: 20
        }
      ],
      earthquake: [
        {
          _id: 'earthquake_a1',
          question: 'After an earthquake stops, what should you check for before moving around?',
          options: [
            { text: 'Check if wifi is working' },
            { text: 'Check for gas leaks, electrical damage, and structural damage', correct: true },
            { text: 'Check social media updates' },
            { text: 'Check if TV is working' }
          ],
          explanation: 'After earthquakes, check for hazards like gas leaks (smell), electrical damage (sparks), and cracks in walls before moving around safely.',
          points: 20
        },
        {
          _id: 'earthquake_a2',
          question: 'You are in a multi-story building during an earthquake. Which floor is generally safest?',
          options: [
            { text: 'Top floor for easy helicopter rescue' },
            { text: 'Middle floors - lower than top (less sway) but higher than ground (less debris)', correct: true },
            { text: 'Ground floor only' },
            { text: 'Basement' }
          ],
          explanation: 'Middle floors (2-4) are safer: Top floors sway more and have more damage risk. Ground floor has more falling debris. Middle floors balance both risks.',
          points: 20
        },
        {
          _id: 'earthquake_a3',
          question: 'What is the "Triangle of Life" theory and why do experts NOT recommend it?',
          options: [
            { text: 'It\'s the best earthquake safety method' },
            { text: 'It suggests crouching beside furniture, but "Drop, Cover, Hold On" under furniture is proven safer', correct: true },
            { text: 'It\'s about making triangular shelters' },
            { text: 'It\'s a navigation technique' }
          ],
          explanation: '"Triangle of Life" (crouch beside furniture) is DANGEROUS. Scientific studies prove "Drop, Cover, Hold On" UNDER sturdy furniture is safer. Furniture protects you from falling objects.',
          points: 20
        },
        {
          _id: 'earthquake_a4',
          question: 'Why do earthquakes cause more damage in cities compared to rural areas?',
          options: [
            { text: 'Rural areas don\'t get earthquakes' },
            { text: 'Cities have dense populations, tall buildings, and complex infrastructure that can collapse or fail', correct: true },
            { text: 'City people don\'t know safety rules' },
            { text: 'Rural earthquakes are weaker' }
          ],
          explanation: 'Urban earthquake risks: (1) More buildings to collapse, (2) Dense population = more casualties, (3) Infrastructure damage (water, power, gas), (4) Difficult rescue access, (5) Fire hazards.',
          points: 20
        },
        {
          _id: 'earthquake_a5',
          question: 'If you are driving when an earthquake strikes, what should you do?',
          options: [
            { text: 'Speed up to get home quickly' },
            { text: 'Pull over to a safe open area away from bridges, overpasses, and buildings. Stay in the car', correct: true },
            { text: 'Stop in the middle of the road' },
            { text: 'Keep driving normally' }
          ],
          explanation: 'When driving during earthquake: (1) Pull over safely away from bridges/overpasses/buildings, (2) Stay inside car (it protects from falling debris), (3) Avoid stopping under/near hazards, (4) Wait until shaking stops.',
          points: 20
        }
      ],
      flood: [
        {
          _id: 'flood_a1',
          question: 'After a flood, why should you not drink tap water immediately?',
          options: [
            { text: 'It tastes bad' },
            { text: 'Flood water may have contaminated the water supply with germs and chemicals', correct: true },
            { text: 'It is too cold' },
            { text: 'Water is fine to drink' }
          ],
          explanation: 'After floods, water supply can be contaminated with bacteria, sewage, and chemicals. Always boil water for 1 minute or use water purification tablets before drinking.',
          points: 20
        },
        {
          _id: 'flood_a2',
          question: 'Flash floods are more dangerous than regular floods. Why?',
          options: [
            { text: 'They happen at night' },
            { text: 'They occur within 6 hours with little warning, have powerful currents, and carry heavy debris', correct: true },
            { text: 'They only affect certain areas' },
            { text: 'They are just faster' }
          ],
          explanation: 'Flash floods are deadly because: (1) Little to no warning time, (2) Extremely powerful fast-moving water, (3) Carry large debris (cars, trees, rocks), (4) Can occur in areas not near water bodies.',
          points: 20
        },
        {
          _id: 'flood_a3',
          question: 'Why should you never try to drive through flooded roads, even if the water looks shallow?',
          options: [
            { text: 'It\'s illegal' },
            { text: 'You can\'t see how deep the water is, the road beneath may be damaged, and your car can float or stall', correct: true },
            { text: 'It damages the car paint' },
            { text: 'It\'s actually safe' }
          ],
          explanation: 'Flooded roads are deadly traps: (1) Can\'t see depth, (2) Road may be washed away underneath, (3) 1 foot of water can float cars, (4) Water can enter engine and stall car, (5) Strong currents can sweep vehicle away. Turn Around, Don\'t Drown!',
          points: 20
        },
        {
          _id: 'flood_a4',
          question: 'What is the correct order of actions when a flood warning is issued for your area?',
          options: [
            { text: 'Wait and see, then panic' },
            { text: '(1) Secure important documents, (2) Move valuables up, (3) Turn off utilities, (4) Evacuate to high ground', correct: true },
            { text: 'Just grab clothes and run' },
            { text: 'Do nothing until water enters' }
          ],
          explanation: 'Flood evacuation steps: (1) Waterproof important papers in plastic, (2) Move valuables to upper floors, (3) Turn off gas/electricity, (4) Take emergency kit, (5) Evacuate to designated shelter or high ground, (6) Don\'t return until authorities say safe.',
          points: 20
        },
        {
          _id: 'flood_a5',
          question: 'After floodwater recedes, what should you do before entering your home?',
          options: [
            { text: 'Enter immediately and start cleaning' },
            { text: 'Check for structural damage, gas leaks, electrical hazards, and contaminated water before entering', correct: true },
            { text: 'Turn on all appliances to test them' },
            { text: 'Nothing special needed' }
          ],
          explanation: 'Before re-entering flooded home: (1) Check structure is stable (no cracks/collapse danger), (2) Smell for gas leaks, (3) Don\'t touch electrical if wet, (4) Wear protective gear, (5) Document damage with photos for insurance, (6) Discard contaminated food.',
          points: 20
        }
      ],
      fire: [
        {
          _id: 'fire_a1',
          question: 'If your clothes catch fire, what should you do?',
          options: [
            { text: 'Run to find water' },
            { text: 'Stop, Drop to the ground, and Roll to put out the flames', correct: true },
            { text: 'Wave your arms to put it out' },
            { text: 'Keep walking normally' }
          ],
          explanation: 'Remember: Stop, Drop, and Roll! Running makes fire worse. Drop to the ground and roll back and forth to smother the flames. Cover your face with your hands.',
          points: 20
        },
        {
          _id: 'fire_a2',
          question: 'What type of fire extinguisher should be used for an electrical fire?',
          options: [
            { text: 'Water-based extinguisher' },
            { text: 'CO2 or Dry Chemical (Class C) extinguisher - never water on electrical fires', correct: true },
            { text: 'Foam extinguisher' },
            { text: 'Any extinguisher works' }
          ],
          explanation: 'Electrical fires need Class C extinguishers (CO2 or dry chemical). NEVER use water - it conducts electricity and you can get electrocuted! First, cut power if safe, then use correct extinguisher.',
          points: 20
        },
        {
          _id: 'fire_a3',
          question: 'What does the acronym PASS stand for when using a fire extinguisher?',
          options: [
            { text: 'Point And Start Spraying' },
            { text: 'Pull pin, Aim low, Squeeze handle, Sweep side to side', correct: true },
            { text: 'Push And Stop Smoking' },
            { text: 'Protect And Stay Safe' }
          ],
          explanation: 'PASS technique: (1) Pull the safety pin, (2) Aim at BASE of fire (not flames), (3) Squeeze handle to release agent, (4) Sweep from side to side until fire is out. Stay 6-8 feet back.',
          points: 20
        },
        {
          _id: 'fire_a4',
          question: 'You discover a small kitchen fire in a pan on the stove. What is the correct response?',
          options: [
            { text: 'Throw water on it immediately' },
            { text: 'Turn off heat, slide a lid over the pan to smother flames, and leave lid on until cool', correct: true },
            { text: 'Carry the pan outside' },
            { text: 'Use a towel to fan it out' }
          ],
          explanation: 'Grease fire safety: (1) NEVER use water (it spreads oil fire!), (2) Turn off heat source, (3) Slide lid over pan to cut oxygen, (4) Keep lid on until completely cool, (5) If fire spreads, evacuate and call 101.',
          points: 20
        },
        {
          _id: 'fire_a5',
          question: 'Why are smoke detectors important and where should they be placed?',
          options: [
            { text: 'They\'re not really necessary' },
            { text: 'They detect smoke early and should be on every floor, in bedrooms, and outside sleeping areas', correct: true },
            { text: 'Only needed in the kitchen' },
            { text: 'One detector is enough for any house' }
          ],
          explanation: 'Smoke detectors save lives by providing early warning (often at night when you\'re asleep). Install: (1) Every level of home, (2) Inside each bedroom, (3) Outside sleeping areas, (4) Test monthly, (5) Change batteries yearly.',
          points: 20
        }
      ],
      drought: [
        {
          _id: 'drought_a1',
          question: 'Which crops are better to grow during drought conditions?',
          options: [
            { text: 'Rice and sugarcane (need lots of water)' },
            { text: 'Drought-resistant crops like millets, pulses, and jowar', correct: true },
            { text: 'Only flowers' },
            { text: 'Water-intensive vegetables' }
          ],
          explanation: 'During drought, farmers should grow drought-resistant crops like millets (bajra, jowar), pulses (lentils, chickpeas) that need less water. Rice and sugarcane need lots of water.',
          points: 20
        },
        {
          _id: 'drought_a2',
          question: 'What is drip irrigation and why is it better during drought?',
          options: [
            { text: 'Spraying water everywhere' },
            { text: 'Delivering water directly to plant roots drop by drop, saving 30-70% water compared to flood irrigation', correct: true },
            { text: 'Watering only once a week' },
            { text: 'Using rainwater only' }
          ],
          explanation: 'Drip irrigation: Water goes straight to roots through pipes with small holes. Saves 30-70% water vs traditional methods. Reduces evaporation, prevents water wastage, improves crop yield even with less water.',
          points: 20
        },
        {
          _id: 'drought_a3',
          question: 'How does drought affect groundwater and wells?',
          options: [
            { text: 'No effect on groundwater' },
            { text: 'Water table drops, wells dry up, and it takes years of good rainfall to recharge groundwater', correct: true },
            { text: 'Groundwater increases' },
            { text: 'Wells always have water' }
          ],
          explanation: 'Drought severely impacts groundwater: (1) Water table drops drastically, (2) Wells and borewells go dry, (3) Takes many years of good monsoons to recharge, (4) Over-pumping worsens the problem, (5) Some areas may never fully recover.',
          points: 20
        },
        {
          _id: 'drought_a4',
          question: 'What is mulching and how does it help during drought?',
          options: [
            { text: 'Adding more water to soil' },
            { text: 'Covering soil with organic material to retain moisture, reduce evaporation, and control soil temperature', correct: true },
            { text: 'Removing all plants' },
            { text: 'Building walls around fields' }
          ],
          explanation: 'Mulching = covering soil with leaves, straw, or organic materials. Benefits: (1) Reduces water evaporation by 50-70%, (2) Keeps soil moist longer, (3) Controls soil temperature, (4) Prevents erosion, (5) Adds nutrients as it decomposes.',
          points: 20
        },
        {
          _id: 'drought_a5',
          question: 'What is a watershed management program and how does it help in drought-prone areas?',
          options: [
            { text: 'Building more dams only' },
            { text: 'Integrated water conservation through check dams, ponds, afforestation, and soil conservation to capture and store rainwater', correct: true },
            { text: 'Bringing water from other states' },
            { text: 'Cloud seeding only' }
          ],
          explanation: 'Watershed management: (1) Check dams slow water flow and increase groundwater, (2) Farm ponds store water, (3) Trees prevent soil erosion, (4) Contour farming conserves moisture, (5) Community participation ensures sustainability. Example: Hiware Bazar village in Maharashtra transformed from drought-prone to water-sufficient.',
          points: 20
        }
      ]
    },

    // COMMUNITY (Grade 7-8, Age 12-13) - Multi-stakeholder perspectives
    COMMUNITY: {
      cyclone: [
        {
          _id: 'cyclone_c1',
          question: 'After a cyclone warning, your community needs to set up a temporary shelter. What are the key requirements?',
          options: [
            { text: 'Beach area closest to ocean for updates' },
            { text: 'Large open space away from trees, with access to utilities and fresh water', correct: true },
            { text: 'Highest building in the area' },
            { text: 'Underground basement for protection' }
          ],
          explanation: 'Shelters need open space (no falling trees), access to utilities, and basic facilities. Beach areas are NOT safe as they\'re in the direct cyclone path.',
          points: 25
        },
        {
          _id: 'cyclone_c2',
          question: 'As a young community leader, how would you convince fishermen to evacuate instead of staying to secure their boats?',
          options: [
            { text: 'Tell them boats are more important than life' },
            { text: 'Explain that human life is irreplaceable, boats can be repaired, and families need them to survive', correct: true },
            { text: 'Ignore their concerns' },
            { text: 'Force them to leave immediately' }
          ],
          explanation: 'Human life is more valuable than property. Boats can be repaired/replaced but lives cannot. Government provides compensation for cyclone damage.',
          points: 25
        },
        {
          _id: 'cyclone_c3',
          question: 'Your school is designated as a cyclone shelter. As a student volunteer, what are your key responsibilities?',
          options: [
            { text: 'Just show people where to sit' },
            { text: 'Help with registration, distribute supplies, assist elderly and children, maintain hygiene, and report emergencies to authorities', correct: true },
            { text: 'Tell people what to do' },
            { text: 'Only help people you know' }
          ],
          explanation: 'Student volunteers are crucial: (1) Maintain registration records, (2) Distribute food/water fairly, (3) Help vulnerable groups (elderly, disabled, children), (4) Ensure cleanliness, (5) Communicate needs to authorities, (6) Keep morale up.',
          points: 25
        },
        {
          _id: 'cyclone_c4',
          question: 'After a cyclone, your community has limited medical supplies. How should you prioritize distribution?',
          options: [
            { text: 'First come, first served' },
            { text: 'Use triage system: critical injuries first, then serious, then minor; maintain inventory for ongoing needs', correct: true },
            { text: 'Only to people who can pay' },
            { text: 'Equally to everyone regardless of need' }
          ],
          explanation: 'Medical triage after disasters: (1) Life-threatening injuries get immediate care, (2) Serious but stable cases next, (3) Minor injuries last, (4) Track inventory to ensure supplies last, (5) Request additional help early, (6) Prevent disease outbreak.',
          points: 25
        },
        {
          _id: 'cyclone_c5',
          question: 'Several rumors about another cyclone spread on social media after the disaster. As a responsible community member, what should you do?',
          options: [
            { text: 'Share the rumors to warn everyone' },
            { text: 'Verify information from official sources (IMD, NDMA) and share only authenticated updates to prevent panic', correct: true },
            { text: 'Ignore all information' },
            { text: 'Believe whatever gets most likes' }
          ],
          explanation: 'Combat misinformation: (1) Trust only official sources - India Meteorological Department (IMD), NDMA, District Administration, (2) Don\'t share unverified info, (3) Fact-check before forwarding, (4) Report false rumors to authorities, (5) Calm panic with facts.',
          points: 25
        }
      ],
      flood: [
        {
          _id: 'flood_c1',
          question: 'After devastating floods, relief supplies arrive but there\'s not enough for everyone. How should they be distributed?',
          options: [
            { text: 'First come, first served basis' },
            { text: 'Prioritize vulnerable groups (elderly, children, pregnant women, disabled) first, then others', correct: true },
            { text: 'Give equally to everyone even if some have more need' },
            { text: 'Only to people with money' }
          ],
          explanation: 'Vulnerable groups (elderly, children, pregnant women, disabled, poor) have the most urgent needs. Help them first, then distribute to others. This saves more lives.',
          points: 25
        },
        {
          _id: 'flood_c2',
          question: 'Post-flood, your community faces a disease outbreak threat. What community health measures should be prioritized?',
          options: [
            { text: 'Just treat sick people' },
            { text: 'Ensure safe drinking water, proper sanitation, prevent standing water (mosquitoes), vaccination camps, and health awareness', correct: true },
            { text: 'Wait for government help only' },
            { text: 'Only focus on cleaning houses' }
          ],
          explanation: 'Prevent disease outbreak: (1) Boil/chlorinate drinking water, (2) Build temporary toilets, (3) Remove standing water (dengue/malaria risk), (4) Organize vaccination camps, (5) Health education on hygiene, (6) Isolate infected patients.',
          points: 25
        },
        {
          _id: 'flood_c3',
          question: 'Many families lost their livelihoods in floods. As a community, what long-term rehabilitation should you plan?',
          options: [
            { text: 'Just give them money once' },
            { text: 'Skill training, microloans for businesses, job placement, psychological support, and livelihood diversification programs', correct: true },
            { text: 'Tell them to move to cities' },
            { text: 'Only rebuild houses' }
          ],
          explanation: 'Long-term flood rehabilitation: (1) Skill development training, (2) Microfinance for small businesses, (3) Help find employment, (4) Counseling for trauma, (5) Encourage multiple income sources (not just farming), (6) Flood insurance awareness, (7) Community resilience building.',
          points: 25
        },
        {
          _id: 'flood_c4',
          question: 'Your community wants to reduce future flood impact. What infrastructure improvements should you advocate for?',
          options: [
            { text: 'Only build higher walls' },
            { text: 'Improve drainage systems, create flood retention ponds, plant trees, designate flood zones, and build elevated roads', correct: true },
            { text: 'Nothing can be done' },
            { text: 'Just hope floods don\'t come back' }
          ],
          explanation: 'Flood-resilient community infrastructure: (1) Modern drainage systems, (2) Retention ponds/wetlands to absorb excess water, (3) Afforestation (trees slow water flow), (4) Regulate construction in flood-prone areas, (5) Elevated roads/platforms, (6) Early warning systems.',
          points: 25
        },
        {
          _id: 'flood_c5',
          question: 'Schools in your area will reopen after floods. What should the community prioritize for students?',
          options: [
            { text: 'Just clean the buildings' },
            { text: 'Repair infrastructure, provide school supplies, arrange transport, offer counseling, and organize catch-up classes', correct: true },
            { text: 'Start classes immediately as usual' },
            { text: 'Keep schools closed permanently' }
          ],
          explanation: 'Post-flood education recovery: (1) Repair/clean schools, (2) Replace lost books, uniforms, supplies, (3) Arrange safe transport (bridges may be damaged), (4) Psychological counseling for traumatized children, (5) Remedial classes for learning loss, (6) Mid-day meals (nutrition), (7) Flexible attendance initially.',
          points: 25
        }
      ],
      drought: [
        {
          _id: 'drought_c1',
          question: 'Your village faces severe drought. As a student representative, what community water management strategy would you propose?',
          options: [
            { text: 'Let everyone use water freely' },
            { text: 'Implement water rationing, rainwater harvesting, and community wells management', correct: true },
            { text: 'Close all water sources' },
            { text: 'Import water from other states only' }
          ],
          explanation: 'Community approach: (1) Water rationing - fixed quota per family, (2) Rainwater harvesting - collect every drop, (3) Community wells - shared management, (4) Drought-resistant crops.',
          points: 25
        },
        {
          _id: 'drought_c2',
          question: 'Farmers in your community are facing crop failure due to drought. What immediate support should the community organize?',
          options: [
            { text: 'Nothing, they should manage alone' },
            { text: 'Emergency loans, fodder banks for cattle, alternative employment, and community kitchens for food security', correct: true },
            { text: 'Tell them to leave farming' },
            { text: 'Only provide water' }
          ],
          explanation: 'Immediate drought support for farmers: (1) Low-interest emergency loans, (2) Fodder banks (cattle don\'t starve), (3) MGNREGA work for income, (4) Community kitchens for food, (5) Seed banks for next season, (6) Veterinary camps for livestock.',
          points: 25
        },
        {
          _id: 'drought_c3',
          question: 'Water tankers are coming to your drought-affected area twice a week. How should the community organize fair distribution?',
          options: [
            { text: 'Whoever reaches first gets water' },
            { text: 'Create water committee, assign family quotas, schedule timing, prioritize drinking needs, and maintain queue system', correct: true },
            { text: 'Strong people should take more' },
            { text: 'No organization needed' }
          ],
          explanation: 'Fair water distribution system: (1) Form elected water committee, (2) Calculate per-family quota based on size, (3) Announced schedule (transparency), (4) Drinking water prioritized over other uses, (5) Queue system (no queue jumping), (6) Support for elderly/disabled to collect water, (7) Record maintenance.',
          points: 25
        },
        {
          _id: 'drought_c4',
          question: 'Many families are migrating from your drought-hit village to cities for work. What can the community do to prevent distress migration?',
          options: [
            { text: 'Nothing, let them go' },
            { text: 'Create local employment through MGNREGA, skill development, water conservation projects, and support alternative livelihoods', correct: true },
            { text: 'Stop them from leaving' },
            { text: 'Close the village' }
          ],
          explanation: 'Prevent distress migration: (1) MGNREGA work - build community assets and earn wages, (2) Skill training (not just farming), (3) Watershed development projects (employment + water conservation), (4) Promote dairy, poultry, goat rearing (drought-resistant livelihoods), (5) Self-help groups for women, (6) Financial support and food security.',
          points: 25
        },
        {
          _id: 'drought_c5',
          question: 'Your community successfully overcame drought through collective action. How should you document and share this experience?',
          options: [
            { text: 'Keep it secret' },
            { text: 'Document strategies, create case study, share with nearby villages, present to district authorities for policy change', correct: true },
            { text: 'Don\'t share with others' },
            { text: 'Only celebrate, don\'t document' }
          ],
          explanation: 'Sharing success for wider impact: (1) Document all strategies - what worked, what didn\'t, (2) Create detailed case study with data, (3) Organize visits from nearby villages to learn, (4) Present to block/district administration for replication, (5) Submit to state government for policy consideration, (6) Create training materials, (7) Build network of drought-resilient communities. Example: Hiware Bazar village (Maharashtra) became a model for drought management.',
          points: 25
        }
      ]
    },

    // ANALYTICAL (Grade 9-10, Age 14-15) - Data analysis, case studies
    ANALYTICAL: {
      cyclone: [
        {
          _id: 'cyclone_an1',
          question: 'Cyclone Amphan (2020) had 26 deaths vs 10,000+ in 1999 Super Cyclone, despite being stronger. Why was 2020 cyclone less deadly?',
          options: [
            { text: 'People were just lucky' },
            { text: 'Better early warning systems, improved evacuation procedures, and community preparedness', correct: true },
            { text: 'The cyclone was actually weaker' },
            { text: 'Less people lived in the area' }
          ],
          explanation: 'Technology + Community Preparedness = Fewer casualties. Better satellite warnings, practiced drills, cyclone-resistant buildings, and coordinated response saved lives.',
          points: 30
        }
      ],
      flood: [
        {
          _id: 'flood_an1',
          question: 'Compare 2018 Kerala floods and 2019 Bihar floods. Despite similar rainfall, Kerala had fewer deaths but more economic loss. Analyze why.',
          options: [
            { text: 'Kerala is richer so less deaths' },
            { text: 'Better infrastructure and warning systems in Kerala saved lives, but higher property values meant more economic loss', correct: true },
            { text: 'Bihar had less rainfall' },
            { text: 'Kerala people are stronger swimmers' }
          ],
          explanation: 'Kerala: Better buildings, warning systems, evacuation = fewer deaths BUT expensive infrastructure = high economic loss. Bihar: Poor infrastructure = more deaths, less economic value = lower financial loss. Development quality matters.',
          points: 30
        }
      ],
      earthquake: [
        {
          _id: 'earthquake_an1',
          question: '2001 Gujarat earthquake (Magnitude 7.7, 20,000 deaths) vs 2011 Christchurch earthquake (Magnitude 6.3, 185 deaths). Why such different outcomes?',
          options: [
            { text: 'Gujarat earthquake happened at night' },
            { text: 'Building quality and disaster preparedness infrastructure in developed countries prevents mass casualties despite earthquakes', correct: true },
            { text: 'Christchurch is smaller' },
            { text: 'Gujarat people didn\'t follow safety rules' }
          ],
          explanation: 'Building quality + infrastructure development + disaster preparedness matters MORE than earthquake strength. Well-prepared societies survive even strong earthquakes. Developed countries have earthquake-resistant buildings.',
          points: 30
        }
      ]
    },

    // INTEGRATED (Grade 11-12, Age 16-17) - Systems thinking, policy design
    INTEGRATED: {
      cyclone: [
        {
          _id: 'cyclone_i1',
          question: 'Design a policy framework: How should a coastal state government prepare for cyclone season considering economic, social, and environmental factors?',
          options: [
            { text: 'Only focus on immediate rescue operations' },
            { text: 'Integrate early warning systems, economic support for fishermen, environmental protection of mangroves, and social awareness programs', correct: true },
            { text: 'Build more concrete walls along the coast' },
            { text: 'Relocate entire coastal population inland' }
          ],
          explanation: 'Holistic approach: Early warning systems (technology), economic support (livelihoods), mangrove conservation (natural barriers), and community education creates resilient coastal communities.',
          points: 35
        }
      ],
      flood: [
        {
          _id: 'flood_i1',
          question: 'Climate change is causing more intense floods. Design an integrated urban flood management strategy.',
          options: [
            { text: 'Build higher walls around the city' },
            { text: 'Integrate green infrastructure (wetlands, parks), smart drainage systems, early warning tech, and zoning regulations to create flood-resilient cities', correct: true },
            { text: 'Evacuate cities completely' },
            { text: 'Only focus on rescue operations' }
          ],
          explanation: 'Sustainable approach: Green spaces absorb water, smart drainage reduces overflow, early warnings save lives, zoning prevents building in flood zones. Combined = resilient cities.',
          points: 35
        }
      ],
      drought: [
        {
          _id: 'drought_i1',
          question: 'Design a comprehensive drought management policy for an agricultural state considering water, agriculture, economy, and social factors.',
          options: [
            { text: 'Just pray for rain' },
            { text: 'Integrate watershed management, crop insurance, drip irrigation subsidies, water pricing, and community participation for long-term resilience', correct: true },
            { text: 'Import all food from other states' },
            { text: 'Stop all farming' }
          ],
          explanation: 'Integrated solution: Watershed management (capture rain), crop insurance (financial safety), drip irrigation (efficient water use), fair water pricing (conservation incentive), community involvement (local ownership).',
          points: 35
        }
      ]
    }
  };

  // Get questions for the specific level and disaster type
  const levelQuestions = quizBank[level] || quizBank['BASIC'];
  const disasterQuestions = levelQuestions[disasterType.toLowerCase()] || levelQuestions['cyclone'] || [];

  // If no specific questions for this disaster, use cyclone as default and adapt
  let questions = disasterQuestions;
  if (questions.length === 0) {
    questions = quizBank[level]['cyclone'] || quizBank['BASIC']['cyclone'];
  }

  // Take first 5 questions (or all if less than 5)
  const selectedQuestions = questions.slice(0, 5);

  // Remove correct answers for frontend (security)
  const sanitizedQuestions = selectedQuestions.map(q => ({
    _id: q._id,
    question: q.question,
    options: q.options.map(opt => ({ text: opt.text })),
    points: q.points
  }));

  return {
    questions: sanitizedQuestions,
    passingScore: level === 'FOUNDATIONAL' ? 60 : level === 'BASIC' ? 70 : 75,
    timeLimit: level === 'FOUNDATIONAL' ? 10 : level === 'BASIC' ? 15 : level === 'APPLIED' ? 20 : level === 'COMMUNITY' ? 25 : 30,
    totalQuestions: sanitizedQuestions.length,
    totalPoints: sanitizedQuestions.reduce((sum, q) => sum + q.points, 0),
    gradeLevel: level
  };
};

/**
 * @route   POST /api/disasters/module/:moduleId/quiz/submit
 * @desc    Submit quiz answers
 * @access  Private (Student)
 */
const submitQuiz = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { answers } = req.body;

    const module = await DisasterModule.findById(moduleId);

    if (!module) {
      return sendNotFound(res, 'Module');
    }

    // Validate answers and calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    const results = module.quiz.questions.map(question => {
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      const correctOption = question.options.find(o => o.isCorrect);
      const selectedOption = question.options[userAnswer?.selectedOption];

      const isCorrect = selectedOption?.isCorrect || false;
      
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
      }

      totalPoints += question.points;

      return {
        questionId: question._id,
        question: question.question,
        selectedAnswer: selectedOption?.text,
        correctAnswer: correctOption?.text,
        isCorrect,
        explanation: question.explanation,
        points: isCorrect ? question.points : 0
      };
    });

    const percentage = (earnedPoints / totalPoints) * 100;
    const passed = percentage >= module.quiz.passingScore;

    return sendSuccess(res, {
      results,
      summary: {
        totalQuestions: module.quiz.questions.length,
        correctAnswers,
        incorrectAnswers: module.quiz.questions.length - correctAnswers,
        totalPoints,
        earnedPoints,
        percentage: Math.round(percentage),
        passed,
        passingScore: module.quiz.passingScore
      }
    }, 'Quiz submitted successfully');

  } catch (error) {
    console.error('Error in submitQuiz:', error);
    return sendError(res, error.message);
  }
};

/**
 * @route   POST /api/disasters/module/:moduleId/quiz/submit
 * @desc    Submit quiz answers and get score (Auto grade-based)
 * @access  Private
 */
const submitModuleQuiz = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    const module = await DisasterModule.findById(moduleId).select('name disasterType');

    if (!module) {
      return sendNotFound(res, 'Module');
    }

    // Get user's grade level automatically
    const userGradeLevel = await getUserGradeLevel(userId, req.user.role);

    // Get the correct answers for this grade level and disaster type
    const quizAnswers = getQuizAnswers(module.disasterType, userGradeLevel);
    
    let score = 0;
    let totalPoints = 0;
    const results = [];

    answers.forEach((userAnswer, index) => {
      const correctAnswer = quizAnswers[index];
      if (correctAnswer) {
        totalPoints += correctAnswer.points;
        const isCorrect = correctAnswer.correctOption === userAnswer.selectedOption;
        
        if (isCorrect) {
          score += correctAnswer.points;
        }

        results.push({
          questionId: correctAnswer._id,
          correct: isCorrect,
          userAnswer: userAnswer.selectedOption,
          correctAnswer: correctAnswer.correctOption,
          explanation: correctAnswer.explanation,
          points: isCorrect ? correctAnswer.points : 0
        });
      }
    });

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passed = percentage >= (userGradeLevel === 'FOUNDATIONAL' ? 60 : userGradeLevel === 'BASIC' ? 70 : 75);

    return sendSuccess(res, {
      score,
      totalPoints,
      percentage,
      passed,
      results,
      gradeLevel: userGradeLevel,
      gradeFeedback: getGradeFeedback(userGradeLevel, percentage)
    }, 'Quiz submitted successfully');

  } catch (error) {
    console.error('Error in submitModuleQuiz:', error);
    return sendError(res, error.message);
  }
};

const getQuizAnswers = (disasterType, level) => {
  // This contains the same quiz bank but with correct answers for grading
  const answerBank = {
    FOUNDATIONAL: {
      cyclone: [
        { _id: 'cyclone_f1', correctOption: 1, explanation: 'During a cyclone, strong winds can break windows and objects can fly around. The safest place is inside a sturdy building, away from windows.', points: 10 },
        { _id: 'cyclone_f2', correctOption: 0, explanation: 'Closing windows and doors prevents strong winds from entering and breaking things. Glass pieces can hurt us, so this is very important.', points: 10 }
      ],
      earthquake: [
        { _id: 'earthquake_f1', correctOption: 1, explanation: 'When earthquake starts, immediately drop down to protect yourself from falling objects.', points: 10 }
      ],
      flood: [
        { _id: 'flood_f1', correctOption: 1, explanation: 'Flood water can be very dangerous - it can sweep you away. Go to higher floors in buildings, or to high ground. Never play in flood water.', points: 10 }
      ],
      fire: [
        { _id: 'fire_f1', correctOption: 1, explanation: 'If you see fire, tell an adult immediately and get out of the house quickly. Don\'t hide or try to fight the fire. Get out and stay out!', points: 10 }
      ],
      drought: [
        { _id: 'drought_f1', correctOption: 1, explanation: 'Drought means there is no rain for many days or months. Water becomes very less and we need to save every drop!', points: 10 }
      ]
    },
    BASIC: {
      cyclone: [
        { _id: 'cyclone_b1', correctOption: 1, explanation: 'When a cyclone warning is issued, we should listen to emergency broadcasts (TV, radio) to know the exact time it will hit and evacuation instructions.', points: 15 },
        { _id: 'cyclone_b2', correctOption: 1, explanation: 'When authorities say to evacuate, follow immediately. Don\'t delay. Move to designated safe places like community centers.', points: 15 }
      ],
      earthquake: [
        { _id: 'earthquake_b1', correctOption: 1, explanation: 'Drop, Cover, and Hold On! Get under a sturdy desk to protect from falling objects.', points: 15 }
      ],
      flood: [
        { _id: 'flood_b1', correctOption: 1, explanation: 'Never try to walk through flood water. Move to higher floors immediately and wait for rescue teams. Even shallow water can sweep you away.', points: 15 }
      ],
      fire: [
        { _id: 'fire_b1', correctOption: 1, explanation: 'When you smell smoke, immediately alert everyone and evacuate. Don\'t waste time looking for the fire. Get out first, then call for help.', points: 15 }
      ],
      drought: [
        { _id: 'drought_b1', correctOption: 1, explanation: 'During drought, every drop counts. Turn off taps when not in use, take shorter showers, and reuse water for plants. Save water for drinking and essential needs.', points: 15 }
      ]
    },
    APPLIED: {
      cyclone: [
        { _id: 'cyclone_a1', correctOption: 1, explanation: 'Middle floors are safer than ground (flood risk) or top floor (wind exposure). Interior rooms without windows are safest.', points: 20 },
        { _id: 'cyclone_a2', correctOption: 1, explanation: 'During cyclones, power failures are common. People can get trapped in elevators with no way to exit. Always use stairs during emergencies.', points: 20 }
      ],
      earthquake: [
        { _id: 'earthquake_a1', correctOption: 1, explanation: 'After earthquakes, check for hazards like gas leaks (smell), electrical damage (sparks), and cracks in walls before moving around safely.', points: 20 }
      ],
      flood: [
        { _id: 'flood_a1', correctOption: 1, explanation: 'After floods, water supply can be contaminated with bacteria, sewage, and chemicals. Always boil water for 1 minute or use water purification tablets before drinking.', points: 20 }
      ],
      fire: [
        { _id: 'fire_a1', correctOption: 1, explanation: 'Remember: Stop, Drop, and Roll! Running makes fire worse. Drop to the ground and roll back and forth to smother the flames. Cover your face with your hands.', points: 20 }
      ],
      drought: [
        { _id: 'drought_a1', correctOption: 1, explanation: 'During drought, farmers should grow drought-resistant crops like millets (bajra, jowar), pulses (lentils, chickpeas) that need less water. Rice and sugarcane need lots of water.', points: 20 }
      ]
    },
    COMMUNITY: {
      cyclone: [
        { _id: 'cyclone_c1', correctOption: 1, explanation: 'Shelters need open space (no falling trees), access to utilities, and basic facilities. Beach areas are NOT safe as they\'re in the direct cyclone path.', points: 25 },
        { _id: 'cyclone_c2', correctOption: 1, explanation: 'Human life is more valuable than property. Boats can be repaired/replaced but lives cannot. Government provides compensation for cyclone damage.', points: 25 }
      ],
      flood: [
        { _id: 'flood_c1', correctOption: 1, explanation: 'Vulnerable groups (elderly, children, pregnant women, disabled, poor) have the most urgent needs. Help them first, then distribute to others. This saves more lives.', points: 25 }
      ],
      drought: [
        { _id: 'drought_c1', correctOption: 1, explanation: 'Community approach: (1) Water rationing - fixed quota per family, (2) Rainwater harvesting - collect every drop, (3) Community wells - shared management, (4) Drought-resistant crops.', points: 25 }
      ]
    },
    ANALYTICAL: {
      cyclone: [
        { _id: 'cyclone_an1', correctOption: 1, explanation: 'Technology + Community Preparedness = Fewer casualties. Better satellite warnings, practiced drills, cyclone-resistant buildings, and coordinated response saved lives.', points: 30 }
      ],
      flood: [
        { _id: 'flood_an1', correctOption: 1, explanation: 'Kerala: Better buildings, warning systems, evacuation = fewer deaths BUT expensive infrastructure = high economic loss. Bihar: Poor infrastructure = more deaths, less economic value = lower financial loss. Development quality matters.', points: 30 }
      ],
      earthquake: [
        { _id: 'earthquake_an1', correctOption: 1, explanation: 'Building quality + infrastructure development + disaster preparedness matters MORE than earthquake strength. Well-prepared societies survive even strong earthquakes. Developed countries have earthquake-resistant buildings.', points: 30 }
      ]
    },
    INTEGRATED: {
      cyclone: [
        { _id: 'cyclone_i1', correctOption: 1, explanation: 'Holistic approach: Early warning systems (technology), economic support (livelihoods), mangrove conservation (natural barriers), and community education creates resilient coastal communities.', points: 35 }
      ],
      flood: [
        { _id: 'flood_i1', correctOption: 1, explanation: 'Sustainable approach: Green spaces absorb water, smart drainage reduces overflow, early warnings save lives, zoning prevents building in flood zones. Combined = resilient cities.', points: 35 }
      ],
      drought: [
        { _id: 'drought_i1', correctOption: 1, explanation: 'Integrated solution: Watershed management (capture rain), crop insurance (financial safety), drip irrigation (efficient water use), fair water pricing (conservation incentive), community involvement (local ownership).', points: 35 }
      ]
    }
  };

  const levelAnswers = answerBank[level] || answerBank['BASIC'];
  const disasterAnswers = levelAnswers[disasterType.toLowerCase()] || levelAnswers['cyclone'] || [];

  if (disasterAnswers.length === 0) {
    return answerBank[level]['cyclone'] || answerBank['BASIC']['cyclone'];
  }

  return disasterAnswers.slice(0, 5);
};

/**
 * Get personalized feedback based on grade level and performance
 */
const getGradeFeedback = (level, percentage) => {
  const feedbackBank = {
    FOUNDATIONAL: {
      excellent: 'Fantastic! You know how to stay safe during disasters! 🌟',
      good: 'Great job! You\'re learning to be safe! Keep practicing! 👍',
      needs_improvement: 'Good try! Let\'s practice more safety rules together! 😊'
    },
    BASIC: {
      excellent: 'Excellent work! You understand disaster safety very well! 🏆',
      good: 'Good job! You\'re becoming a safety expert! Keep it up! ⭐',
      needs_improvement: 'Nice effort! Review the safety steps and try again! 📚'
    },
    APPLIED: {
      excellent: 'Outstanding! You can apply disaster knowledge in real situations! 🎯',
      good: 'Well done! Your understanding of disaster response is solid! 💪',
      needs_improvement: 'Good attempt! Focus on practical applications and try again! 🔄'
    },
    COMMUNITY: {
      excellent: 'Superb! You understand community-level disaster management! 🌍',
      good: 'Great work! You\'re thinking like a community leader! 👥',
      needs_improvement: 'Good effort! Consider different stakeholder perspectives! 🤝'
    },
    ANALYTICAL: {
      excellent: 'Brilliant analysis! You can evaluate disaster management strategies! 📊',
      good: 'Strong analytical skills! You understand complex disaster patterns! 📈',
      needs_improvement: 'Good reasoning! Practice analyzing case studies more! 🔍'
    },
    INTEGRATED: {
      excellent: 'Exceptional systems thinking! You understand integrated disaster management! 🎓',
      good: 'Advanced understanding! You can design comprehensive solutions! 🏗️',
      needs_improvement: 'Solid foundation! Focus on connecting multiple factors! 🔗'
    }
  };

  const feedback = feedbackBank[level] || feedbackBank['BASIC'];
  
  if (percentage >= 90) return feedback.excellent;
  if (percentage >= 70) return feedback.good;
  return feedback.needs_improvement;
};

module.exports = {
  getDisasters,
  getDisasterDetails,
  getSafetySteps,
  getPersonalizedDisasterModules,
  getModuleDetails,
  getOrganizationDisasterStats,
  getAllModules,
  getModuleLessons,
  getModuleQuiz,
  submitModuleQuiz,
  submitQuiz
};
