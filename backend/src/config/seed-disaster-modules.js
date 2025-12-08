/**
 * Seed Disaster Modules
 * Creates initial disaster preparedness modules in database
 */

const DisasterModule = require('../models/DisasterModule.model');
const { disasterModules } = require('../services/disaster-mapping.service');

const seedDisasterModules = async () => {
  try {
    console.log('🌍 Starting disaster module seeding...');

    // Clear existing modules
    await DisasterModule.deleteMany({});
    console.log('✓ Cleared existing modules');

    const modulesToSeed = [
      // 1. EARTHQUAKE MODULE
      {
        disasterType: 'earthquake',
        name: 'Earthquake Safety',
        icon: '🌍',
        description: 'Learn Drop, Cover, and Hold techniques to stay safe during earthquakes',
        basePriority: 1,
        color: '#8B4513',
        tags: ['seismic', 'structural', 'immediate', 'safety'],
        lessons: [
          {
            title: 'What is an Earthquake?',
            description: 'Understanding earthquakes and why they happen',
            content: 'An earthquake happens when the ground shakes. The Earth\'s surface is made of big pieces called plates. When these plates move, the ground shakes. This shaking can be gentle or very strong.',
            mediaType: 'animation',
            duration: 5,
            order: 1
          },
          {
            title: 'Drop, Cover, and Hold',
            description: 'The most important earthquake safety technique',
            content: 'When you feel shaking:\n1. DROP to your hands and knees\n2. COVER your head and neck under a strong table\n3. HOLD ON until the shaking stops\n\nRemember: DROP, COVER, HOLD!',
            mediaType: 'interactive',
            duration: 10,
            order: 2
          },
          {
            title: 'Safe Places in Your Home',
            description: 'Where to go during an earthquake',
            content: 'Safe places:\n- Under a strong table or desk\n- Against an inside wall\n- Away from windows\n\nUnsafe places:\n- Near windows\n- Under heavy objects that can fall\n- In doorways (old advice, not safe!)',
            mediaType: 'image',
            duration: 7,
            order: 3
          },
          {
            title: 'After the Earthquake',
            description: 'What to do when shaking stops',
            content: 'After an earthquake:\n1. Stay calm\n2. Check if you are hurt\n3. Look for your family\n4. Stay away from damaged buildings\n5. Listen to adults and teachers\n6. Be ready for aftershocks (more shaking)',
            mediaType: 'video',
            duration: 8,
            order: 4
          }
        ],
        quiz: {
          questions: [
            {
              question: 'What should you do first when you feel an earthquake?',
              options: [
                { text: 'Run outside', isCorrect: false },
                { text: 'Drop to your hands and knees', isCorrect: true },
                { text: 'Stand in a doorway', isCorrect: false },
                { text: 'Call for help', isCorrect: false }
              ],
              explanation: 'The first step is to DROP to your hands and knees so you don\'t fall.',
              points: 10
            },
            {
              question: 'Where is the SAFEST place during an earthquake?',
              options: [
                { text: 'Under a strong table', isCorrect: true },
                { text: 'Near a window', isCorrect: false },
                { text: 'Under a heavy bookshelf', isCorrect: false },
                { text: 'In the middle of the room', isCorrect: false }
              ],
              explanation: 'Under a strong table protects you from falling objects.',
              points: 10
            },
            {
              question: 'What are aftershocks?',
              options: [
                { text: 'The first earthquake', isCorrect: false },
                { text: 'Smaller earthquakes that come after the main one', isCorrect: true },
                { text: 'Thunder after lightning', isCorrect: false },
                { text: 'A type of building', isCorrect: false }
              ],
              explanation: 'Aftershocks are smaller earthquakes that can happen after the main earthquake.',
              points: 10
            }
          ],
          passingScore: 70,
          timeLimit: 10
        },
        game: {
          type: 'simulation',
          title: 'Earthquake Drill Practice',
          description: 'Practice Drop, Cover, and Hold in different scenarios',
          difficulty: 'easy',
          config: {
            scenarios: ['classroom', 'home', 'playground'],
            timeLimit: 60,
            points: 100
          }
        },
        learningObjectives: [
          'Understand what causes earthquakes',
          'Master Drop, Cover, and Hold technique',
          'Identify safe and unsafe places',
          'Know what to do after an earthquake'
        ],
        dosList: [
          'Drop to hands and knees immediately',
          'Cover head and neck under strong furniture',
          'Hold on until shaking stops',
          'Stay away from windows and heavy objects',
          'Listen to teachers and adults'
        ],
        dontsList: [
          'Don\'t run outside during shaking',
          'Don\'t use elevators',
          'Don\'t stand in doorways',
          'Don\'t go near damaged buildings',
          'Don\'t panic'
        ],
        ageGroup: { min: 6, max: 12 },
        difficulty: 'beginner',
        isActive: true
      },

      // 2. CYCLONE MODULE
      {
        disasterType: 'cyclone',
        name: 'Cyclone Safety',
        icon: '🌀',
        description: 'Understand cyclone warnings and evacuation procedures',
        basePriority: 2,
        color: '#4682B4',
        tags: ['wind', 'coastal', 'evacuation', 'warning'],
        lessons: [
          {
            title: 'What is a Cyclone?',
            description: 'Understanding cyclones and storm systems',
            content: 'A cyclone is a very big storm with strong winds that spin in circles. It forms over the ocean and can bring heavy rain, strong winds, and big waves when it reaches land.',
            mediaType: 'animation',
            duration: 6,
            order: 1
          },
          {
            title: 'Cyclone Warning Signals',
            description: 'Understanding different warning levels',
            content: 'Cyclone warnings:\n🟢 GREEN: No danger\n🟡 YELLOW: Be alert, cyclone may come\n🟠 ORANGE: Be ready to evacuate\n🔴 RED: Danger! Evacuate now!\n\nListen to radio and TV for updates.',
            mediaType: 'interactive',
            duration: 8,
            order: 2
          },
          {
            title: 'Evacuation Safety',
            description: 'How to evacuate safely',
            content: 'During evacuation:\n1. Take your emergency bag\n2. Go to cyclone shelter\n3. Stay with your family\n4. Follow adult instructions\n5. Don\'t go near the sea\n6. Stay in shelter until safe',
            mediaType: 'video',
            duration: 10,
            order: 3
          }
        ],
        quiz: {
          questions: [
            {
              question: 'What color warning means "Evacuate NOW"?',
              options: [
                { text: 'Yellow', isCorrect: false },
                { text: 'Orange', isCorrect: false },
                { text: 'Red', isCorrect: true },
                { text: 'Green', isCorrect: false }
              ],
              explanation: 'RED warning means extreme danger - evacuate immediately!',
              points: 10
            },
            {
              question: 'Where should you go during a cyclone?',
              options: [
                { text: 'To the beach', isCorrect: false },
                { text: 'To a cyclone shelter', isCorrect: true },
                { text: 'To the rooftop', isCorrect: false },
                { text: 'Stay outside', isCorrect: false }
              ],
              explanation: 'Cyclone shelters are specially built to protect people from cyclones.',
              points: 10
            }
          ],
          passingScore: 70,
          timeLimit: 8
        },
        learningObjectives: [
          'Understand cyclone formation',
          'Recognize warning signals',
          'Know evacuation procedures',
          'Understand shelter safety'
        ],
        dosList: [
          'Listen to cyclone warnings',
          'Evacuate when told',
          'Go to designated shelter',
          'Stay away from windows',
          'Keep emergency supplies ready'
        ],
        dontsList: [
          'Don\'t ignore warnings',
          'Don\'t go near the sea',
          'Don\'t stay in weak buildings',
          'Don\'t go outside during cyclone',
          'Don\'t touch fallen power lines'
        ],
        ageGroup: { min: 6, max: 12 },
        difficulty: 'beginner',
        isActive: true
      },

      // 3. FLOOD MODULE
      {
        disasterType: 'flood',
        name: 'Flood Safety',
        icon: '🌊',
        description: 'Water safety and evacuation procedures during floods',
        basePriority: 3,
        color: '#1E90FF',
        tags: ['water', 'evacuation', 'monsoon', 'safety'],
        lessons: [
          {
            title: 'Understanding Floods',
            description: 'What causes floods and warning signs',
            content: 'A flood happens when water covers land that is usually dry. Floods can happen from:\n- Heavy rain\n- Rivers overflowing\n- Broken dams\n- Cyclones\n\nWarning signs:\n- Very heavy rain\n- Water rising in rivers\n- Warnings on TV/radio',
            mediaType: 'animation',
            duration: 7,
            order: 1
          },
          {
            title: 'Water Safety Rules',
            description: 'Critical flood safety rules',
            content: 'IMPORTANT RULES:\n1. Never walk in flood water\n2. Never try to swim in flood water\n3. Stay away from rivers and streams\n4. Don\'t touch electrical wires\n5. Move to higher ground\n6. Listen to adults',
            mediaType: 'interactive',
            duration: 9,
            order: 2
          },
          {
            title: 'Evacuation and Safety',
            description: 'How to evacuate during floods',
            content: 'During flood evacuation:\n1. Go to higher ground or upper floors\n2. Take emergency bag\n3. Turn off electricity if safe\n4. Don\'t go back for things\n5. Stay together with family\n6. Wait for rescue if needed',
            mediaType: 'video',
            duration: 8,
            order: 3
          }
        ],
        quiz: {
          questions: [
            {
              question: 'What should you NEVER do during a flood?',
              options: [
                { text: 'Move to higher ground', isCorrect: false },
                { text: 'Walk or play in flood water', isCorrect: true },
                { text: 'Listen to adults', isCorrect: false },
                { text: 'Stay indoors', isCorrect: false }
              ],
              explanation: 'Flood water is very dangerous - it can sweep you away and may have dangerous things in it.',
              points: 10
            },
            {
              question: 'Where is the safest place during a flood?',
              options: [
                { text: 'Near the river', isCorrect: false },
                { text: 'In the basement', isCorrect: false },
                { text: 'On higher ground or upper floor', isCorrect: true },
                { text: 'In a car', isCorrect: false }
              ],
              explanation: 'Higher ground keeps you safe from rising water.',
              points: 10
            }
          ],
          passingScore: 70,
          timeLimit: 8
        },
        learningObjectives: [
          'Understand flood causes',
          'Recognize flood dangers',
          'Know water safety rules',
          'Learn evacuation procedures'
        ],
        dosList: [
          'Move to higher ground',
          'Listen to flood warnings',
          'Stay away from flood water',
          'Keep emergency supplies ready',
          'Follow evacuation orders'
        ],
        dontsList: [
          'Don\'t walk in flood water',
          'Don\'t try to swim in floods',
          'Don\'t go near rivers during floods',
          'Don\'t touch electrical equipment',
          'Don\'t return until safe'
        ],
        ageGroup: { min: 6, max: 12 },
        difficulty: 'beginner',
        isActive: true
      },

      // 4. FIRE MODULE
      {
        disasterType: 'fire',
        name: 'Fire Safety',
        icon: '🔥',
        description: 'Fire safety, prevention, and evacuation techniques',
        basePriority: 6,
        color: '#FF4500',
        tags: ['urban', 'forest', 'evacuation', 'prevention'],
        lessons: [
          {
            title: 'Fire Prevention',
            description: 'How to prevent fires',
            content: 'Preventing fires:\n1. Don\'t play with matches or lighters\n2. Stay away from stoves when cooking\n3. Keep papers away from flames\n4. Don\'t overload electrical outlets\n5. Tell adults about fire hazards',
            mediaType: 'interactive',
            duration: 8,
            order: 1
          },
          {
            title: 'Stop, Drop, and Roll',
            description: 'What to do if clothes catch fire',
            content: 'If your clothes catch fire:\n1. STOP - Don\'t run!\n2. DROP - Drop to the ground\n3. ROLL - Roll over and over to put out flames\n4. Cover your face with hands\n\nRemember: STOP, DROP, ROLL!',
            mediaType: 'animation',
            duration: 7,
            order: 2
          },
          {
            title: 'Fire Evacuation',
            description: 'How to escape from fire safely',
            content: 'During fire:\n1. Get out fast - don\'t take things\n2. Crawl low under smoke\n3. Feel doors before opening (hot = fire)\n4. Use stairs, not elevators\n5. Meet at family meeting point\n6. Never go back inside',
            mediaType: 'video',
            duration: 9,
            order: 3
          }
        ],
        quiz: {
          questions: [
            {
              question: 'What should you do if your clothes catch fire?',
              options: [
                { text: 'Run fast', isCorrect: false },
                { text: 'Stop, Drop, and Roll', isCorrect: true },
                { text: 'Pour water on yourself', isCorrect: false },
                { text: 'Jump up and down', isCorrect: false }
              ],
              explanation: 'Stop, Drop, and Roll helps put out the fire on your clothes.',
              points: 10
            },
            {
              question: 'How should you move in a room filled with smoke?',
              options: [
                { text: 'Stand up and walk', isCorrect: false },
                { text: 'Crawl low on the ground', isCorrect: true },
                { text: 'Run very fast', isCorrect: false },
                { text: 'Jump over the smoke', isCorrect: false }
              ],
              explanation: 'Smoke rises up, so crawl low where the air is cleaner.',
              points: 10
            }
          ],
          passingScore: 70,
          timeLimit: 8
        },
        learningObjectives: [
          'Understand fire prevention',
          'Learn Stop, Drop, and Roll',
          'Know evacuation procedures',
          'Recognize fire hazards'
        ],
        dosList: [
          'Alert adults about fire immediately',
          'Evacuate quickly and calmly',
          'Crawl under smoke',
          'Feel doors before opening',
          'Go to meeting point outside'
        ],
        dontsList: [
          'Don\'t play with fire',
          'Don\'t hide during a fire',
          'Don\'t go back for toys',
          'Don\'t use elevators',
          'Don\'t run if clothes catch fire'
        ],
        ageGroup: { min: 6, max: 12 },
        difficulty: 'beginner',
        isActive: true
      },

      // 5. DROUGHT MODULE
      {
        disasterType: 'drought',
        name: 'Drought Awareness',
        icon: '🏜️',
        description: 'Water conservation and drought preparedness',
        basePriority: 4,
        color: '#D2691E',
        tags: ['water-scarcity', 'conservation', 'long-term', 'awareness'],
        lessons: [
          {
            title: 'What is Drought?',
            description: 'Understanding drought and its effects',
            content: 'Drought means there is not enough water. It happens when there is very little rain for a long time. During drought:\n- Wells and rivers dry up\n- Plants and crops die\n- Animals have no water\n- People must save water',
            mediaType: 'animation',
            duration: 7,
            order: 1
          },
          {
            title: 'Water Conservation',
            description: 'How to save water every day',
            content: 'Save water:\n1. Turn off taps when brushing teeth\n2. Take short baths\n3. Use bucket instead of shower\n4. Don\'t waste drinking water\n5. Reuse water for plants\n6. Fix leaking taps',
            mediaType: 'interactive',
            duration: 10,
            order: 2
          }
        ],
        quiz: {
          questions: [
            {
              question: 'What is drought?',
              options: [
                { text: 'Too much rain', isCorrect: false },
                { text: 'Not enough rain for a long time', isCorrect: true },
                { text: 'A type of flood', isCorrect: false },
                { text: 'Very hot weather', isCorrect: false }
              ],
              explanation: 'Drought happens when there is very little rain for many days or months.',
              points: 10
            }
          ],
          passingScore: 70,
          timeLimit: 8
        },
        learningObjectives: [
          'Understand drought causes',
          'Learn water conservation',
          'Recognize drought signs',
          'Know community preparedness'
        ],
        dosList: [
          'Save water every day',
          'Turn off taps properly',
          'Report water leaks',
          'Reuse water when possible',
          'Support community water efforts'
        ],
        dontsList: [
          'Don\'t waste water',
          'Don\'t leave taps running',
          'Don\'t pollute water sources',
          'Don\'t use more water than needed',
          'Don\'t ignore drought warnings'
        ],
        ageGroup: { min: 6, max: 12 },
        difficulty: 'beginner',
        isActive: true
      },

      // 6. LANDSLIDE MODULE
      {
        disasterType: 'landslide',
        name: 'Landslide Safety',
        icon: '⛰️',
        description: 'Recognize warning signs and escape routes during landslides',
        basePriority: 5,
        color: '#8B7355',
        tags: ['terrain', 'monsoon', 'evacuation', 'mountain'],
        lessons: [
          {
            title: 'What is a Landslide?',
            description: 'Understanding landslides',
            content: 'A landslide is when rocks, mud, and soil slide down a hill or mountain. This happens when:\n- Heavy rain makes soil wet and loose\n- Earthquakes shake the ground\n- Trees are cut from hillsides\n\nLandslides can be very fast and dangerous.',
            mediaType: 'animation',
            duration: 6,
            order: 1
          },
          {
            title: 'Warning Signs',
            description: 'How to know a landslide might happen',
            content: 'Warning signs:\n1. Cracks in the ground or roads\n2. Water springs in new places\n3. Leaning trees or poles\n4. Unusual sounds from the hill\n5. Sudden decrease in water flow\n\nTell adults immediately if you see these!',
            mediaType: 'interactive',
            duration: 8,
            order: 2
          },
          {
            title: 'Stay Safe from Landslides',
            description: 'Evacuation and safety procedures',
            content: 'During landslide warning:\n1. Move away from the slope quickly\n2. Go to higher, stable ground\n3. Don\'t try to outrun a landslide\n4. Listen to evacuation orders\n5. Stay away from rivers (landslides can block them)\n6. Don\'t go back until safe',
            mediaType: 'video',
            duration: 9,
            order: 3
          }
        ],
        quiz: {
          questions: [
            {
              question: 'What causes landslides?',
              options: [
                { text: 'Sunny weather', isCorrect: false },
                { text: 'Heavy rain making soil loose', isCorrect: true },
                { text: 'Strong wind', isCorrect: false },
                { text: 'Cold temperature', isCorrect: false }
              ],
              explanation: 'Heavy rain makes soil wet and heavy, causing it to slide down slopes.',
              points: 10
            },
            {
              question: 'What is a warning sign of landslide?',
              options: [
                { text: 'Rainbow in the sky', isCorrect: false },
                { text: 'Cracks appearing in the ground', isCorrect: true },
                { text: 'Birds flying', isCorrect: false },
                { text: 'Clear blue sky', isCorrect: false }
              ],
              explanation: 'Cracks in the ground show the soil is moving and may slide.',
              points: 10
            }
          ],
          passingScore: 70,
          timeLimit: 8
        },
        learningObjectives: [
          'Understand landslide causes',
          'Recognize warning signs',
          'Know evacuation routes',
          'Learn prevention awareness'
        ],
        dosList: [
          'Report warning signs to adults',
          'Evacuate immediately when warned',
          'Move to stable higher ground',
          'Stay alert during heavy rains',
          'Follow safety instructions'
        ],
        dontsList: [
          'Don\'t ignore warning signs',
          'Don\'t stay near slopes during heavy rain',
          'Don\'t try to outrun a landslide',
          'Don\'t go near damaged areas',
          'Don\'t return before safety clearance'
        ],
        ageGroup: { min: 6, max: 12 },
        difficulty: 'beginner',
        isActive: true
      },

      // 7. STAMPEDE MODULE
      {
        disasterType: 'stampede',
        name: 'Stampede Safety',
        icon: '🏃',
        description: 'Stay safe in crowds and avoid stampede situations',
        basePriority: 7,
        color: '#FF6B6B',
        tags: ['crowd', 'public-safety', 'awareness', 'urban'],
        lessons: [
          {
            title: 'What is a Stampede?',
            description: 'Understanding crowd safety',
            content: 'A stampede happens when many people panic and push in a crowd. This can happen at:\n- Festivals and fairs\n- Sports events\n- Concerts\n- Temple gatherings\n\nPeople can get hurt or fall down.',
            mediaType: 'animation',
            duration: 6,
            order: 1
          },
          {
            title: 'Staying Safe in Crowds',
            description: 'How to stay safe in crowded places',
            content: 'In crowds:\n1. Stay with your family - hold hands\n2. Stay calm, don\'t panic\n3. Move with the crowd, not against it\n4. If crowd pushes, protect your chest\n5. Look for exits before entering\n6. Tell adult if you feel uncomfortable',
            mediaType: 'interactive',
            duration: 9,
            order: 2
          },
          {
            title: 'If You Fall Down',
            description: 'Emergency protection technique',
            content: 'If you fall in a crowd:\n1. Get up quickly if you can\n2. If you can\'t get up, curl into a ball\n3. Protect your head with your arms\n4. Keep space around your chest to breathe\n5. Call for help loudly\n\nStay strong and protect yourself!',
            mediaType: 'video',
            duration: 7,
            order: 3
          }
        ],
        quiz: {
          questions: [
            {
              question: 'What should you do in a crowded place?',
              options: [
                { text: 'Run around', isCorrect: false },
                { text: 'Stay with family and hold hands', isCorrect: true },
                { text: 'Push others', isCorrect: false },
                { text: 'Shout and scream', isCorrect: false }
              ],
              explanation: 'Staying with family keeps you safe and prevents getting lost.',
              points: 10
            },
            {
              question: 'If you fall in a crowd, what should you do?',
              options: [
                { text: 'Lie flat', isCorrect: false },
                { text: 'Curl into a ball and protect your head', isCorrect: true },
                { text: 'Stand up immediately', isCorrect: false },
                { text: 'Roll around', isCorrect: false }
              ],
              explanation: 'Curling up protects your vital organs and helps you breathe.',
              points: 10
            }
          ],
          passingScore: 70,
          timeLimit: 8
        },
        learningObjectives: [
          'Understand stampede dangers',
          'Learn crowd safety rules',
          'Know protective positions',
          'Recognize risky situations'
        ],
        dosList: [
          'Stay with your group',
          'Remain calm in crowds',
          'Know where exits are',
          'Move sideways out of dense crowds',
          'Follow instructions from authorities'
        ],
        dontsList: [
          'Don\'t panic or run',
          'Don\'t push others',
          'Don\'t bend down to pick things',
          'Don\'t go against the crowd flow',
          'Don\'t enter overcrowded areas'
        ],
        ageGroup: { min: 6, max: 12 },
        difficulty: 'beginner',
        isActive: true
      },

      // 8. HEATWAVE MODULE
      {
        disasterType: 'heatwave',
        name: 'Heat Wave Safety',
        icon: '☀️',
        description: 'Heat stroke prevention and staying cool during extreme heat',
        basePriority: 8,
        color: '#FF6347',
        tags: ['temperature', 'health', 'summer', 'prevention'],
        lessons: [
          {
            title: 'What is a Heat Wave?',
            description: 'Understanding extreme heat',
            content: 'A heat wave is when the weather is very, very hot for many days. The temperature becomes so high that it can make people sick.\n\nDangers:\n- Heat stroke\n- Dehydration\n- Sunburn\n- Exhaustion',
            mediaType: 'animation',
            duration: 6,
            order: 1
          },
          {
            title: 'Staying Cool and Hydrated',
            description: 'How to protect yourself from heat',
            content: 'During heat wave:\n1. Drink lots of water (even if not thirsty)\n2. Stay indoors during hottest hours (12-3 PM)\n3. Wear light, loose cotton clothes\n4. Use umbrella or hat outside\n5. Take cool baths\n6. Eat light, fresh food',
            mediaType: 'interactive',
            duration: 9,
            order: 2
          },
          {
            title: 'Heat Stroke Warning Signs',
            description: 'Recognizing heat-related illness',
            content: 'Warning signs:\n- Very hot skin\n- Headache and dizziness\n- Feeling very tired\n- Nausea or vomiting\n- Fast heartbeat\n\nIf you feel these:\n1. Tell an adult immediately\n2. Move to shade\n3. Drink cool water\n4. Rest and cool down',
            mediaType: 'video',
            duration: 8,
            order: 3
          }
        ],
        quiz: {
          questions: [
            {
              question: 'What should you drink a lot during a heat wave?',
              options: [
                { text: 'Soft drinks', isCorrect: false },
                { text: 'Water', isCorrect: true },
                { text: 'Coffee', isCorrect: false },
                { text: 'Energy drinks', isCorrect: false }
              ],
              explanation: 'Water is the best drink to stay hydrated and cool.',
              points: 10
            },
            {
              question: 'When should you avoid going outside during a heat wave?',
              options: [
                { text: 'Early morning', isCorrect: false },
                { text: '12 PM to 3 PM (afternoon)', isCorrect: true },
                { text: 'Evening', isCorrect: false },
                { text: 'Night', isCorrect: false }
              ],
              explanation: 'Afternoon is the hottest time - stay indoors or in shade.',
              points: 10
            }
          ],
          passingScore: 70,
          timeLimit: 8
        },
        learningObjectives: [
          'Understand heat wave dangers',
          'Learn hydration importance',
          'Recognize heat illness symptoms',
          'Know cooling techniques'
        ],
        dosList: [
          'Drink water frequently',
          'Stay in shade or indoors',
          'Wear light-colored clothes',
          'Use sunscreen',
          'Check on elderly and young children'
        ],
        dontsList: [
          'Don\'t play outside in peak heat',
          'Don\'t forget to drink water',
          'Don\'t wear dark or tight clothes',
          'Don\'t ignore feeling unwell',
          'Don\'t leave anyone in parked cars'
        ],
        ageGroup: { min: 6, max: 12 },
        difficulty: 'beginner',
        isActive: true
      },

      // 9. TSUNAMI MODULE
      {
        disasterType: 'tsunami',
        name: 'Tsunami Safety',
        icon: '🌊',
        description: 'Tsunami warning signs and high ground evacuation',
        basePriority: 9,
        color: '#008B8B',
        tags: ['coastal', 'earthquake', 'evacuation', 'warning'],
        lessons: [
          {
            title: 'What is a Tsunami?',
            description: 'Understanding tsunamis',
            content: 'A tsunami is a series of very large ocean waves caused by:\n- Underwater earthquakes\n- Volcanic eruptions in the sea\n- Landslides into the ocean\n\nThese waves can be as tall as buildings and move very fast!',
            mediaType: 'animation',
            duration: 7,
            order: 1
          },
          {
            title: 'Natural Warning Signs',
            description: 'How to recognize tsunami warnings',
            content: 'Tsunami warning signs:\n1. Strong earthquake (if near coast, evacuate!)\n2. Sea water suddenly goes far back\n3. Loud roar from the ocean\n4. Official sirens and warnings\n\nIf you see these - RUN to high ground!',
            mediaType: 'interactive',
            duration: 8,
            order: 2
          },
          {
            title: 'Evacuation to High Ground',
            description: 'How to evacuate during tsunami warning',
            content: 'During tsunami warning:\n1. Drop everything - GO immediately!\n2. Run to high ground or tall building\n3. Go as far inland as possible\n4. Don\'t wait for official warnings\n5. Help others if safe\n6. Stay away until "all clear" signal',
            mediaType: 'video',
            duration: 9,
            order: 3
          }
        ],
        quiz: {
          questions: [
            {
              question: 'What causes a tsunami?',
              options: [
                { text: 'Heavy rain', isCorrect: false },
                { text: 'Underwater earthquake', isCorrect: true },
                { text: 'Strong wind', isCorrect: false },
                { text: 'Hot weather', isCorrect: false }
              ],
              explanation: 'Underwater earthquakes shake the ocean floor and create huge waves.',
              points: 10
            },
            {
              question: 'If you feel a strong earthquake near the coast, what should you do?',
              options: [
                { text: 'Go to the beach to watch', isCorrect: false },
                { text: 'Run to high ground immediately', isCorrect: true },
                { text: 'Wait for instructions', isCorrect: false },
                { text: 'Stay where you are', isCorrect: false }
              ],
              explanation: 'Don\'t wait! Run to high ground immediately - tsunami can come in minutes.',
              points: 10
            }
          ],
          passingScore: 70,
          timeLimit: 8
        },
        learningObjectives: [
          'Understand tsunami causes',
          'Recognize natural warnings',
          'Know evacuation routes',
          'Learn speed and urgency'
        ],
        dosList: [
          'Evacuate immediately when warned',
          'Run to highest ground available',
          'Move as far inland as possible',
          'Listen to warning systems',
          'Help others evacuate if safe'
        ],
        dontsList: [
          'Don\'t wait to see the wave',
          'Don\'t go to the beach to watch',
          'Don\'t return until all-clear given',
          'Don\'t ignore earthquake warnings',
          'Don\'t take belongings - just go!'
        ],
        ageGroup: { min: 6, max: 12 },
        difficulty: 'beginner',
        isActive: true
      },

      // 10. AVALANCHE MODULE
      {
        disasterType: 'avalanche',
        name: 'Avalanche Safety',
        icon: '🏔️',
        description: 'Mountain safety and avalanche awareness',
        basePriority: 10,
        color: '#F0F8FF',
        tags: ['mountain', 'snow', 'evacuation', 'winter'],
        lessons: [
          {
            title: 'What is an Avalanche?',
            description: 'Understanding avalanches',
            content: 'An avalanche is when a large amount of snow slides down a mountain very fast. It can happen when:\n- Too much new snow builds up\n- Snow becomes unstable\n- Loud sounds shake the snow\n- Temperature changes\n\nAvalanches are very dangerous and fast!',
            mediaType: 'animation',
            duration: 7,
            order: 1
          },
          {
            title: 'Avalanche Warning Signs',
            description: 'How to recognize avalanche danger',
            content: 'Danger signs:\n1. Recent heavy snowfall\n2. Hearing cracking sounds\n3. Seeing cracks in snow\n4. Recent avalanches nearby\n5. Steep slopes covered with snow\n\nIf you see these, stay away from slopes!',
            mediaType: 'interactive',
            duration: 8,
            order: 2
          },
          {
            title: 'Mountain Safety Rules',
            description: 'How to stay safe in mountains',
            content: 'Safety rules:\n1. Always go with adults and guides\n2. Check avalanche warnings before trips\n3. Stay on marked safe paths\n4. Don\'t make loud noises near slopes\n5. If avalanche comes, move sideways fast\n6. Carry safety equipment',
            mediaType: 'video',
            duration: 9,
            order: 3
          }
        ],
        quiz: {
          questions: [
            {
              question: 'What is an avalanche?',
              options: [
                { text: 'A snowman', isCorrect: false },
                { text: 'Large amount of snow sliding down mountain', isCorrect: true },
                { text: 'A snow storm', isCorrect: false },
                { text: 'A type of ice cream', isCorrect: false }
              ],
              explanation: 'Avalanche is when snow slides down fast, which can bury everything in its path.',
              points: 10
            },
            {
              question: 'What should you do if you hear cracking sounds in the snow on a slope?',
              options: [
                { text: 'Keep walking', isCorrect: false },
                { text: 'Move away from the slope immediately', isCorrect: true },
                { text: 'Jump up and down', isCorrect: false },
                { text: 'Make loud noises', isCorrect: false }
              ],
              explanation: 'Cracking sounds mean snow is unstable - get to safety fast!',
              points: 10
            }
          ],
          passingScore: 70,
          timeLimit: 8
        },
        learningObjectives: [
          'Understand avalanche formation',
          'Recognize danger signs',
          'Know mountain safety rules',
          'Learn escape techniques'
        ],
        dosList: [
          'Check weather and avalanche forecasts',
          'Travel with experienced guides',
          'Stay on marked trails',
          'Carry safety equipment',
          'Move perpendicular to avalanche if caught'
        ],
        dontsList: [
          'Don\'t go to mountains alone',
          'Don\'t ignore warning signs',
          'Don\'t make loud sounds near slopes',
          'Don\'t ski in unmarked areas',
          'Don\'t go after recent heavy snow'
        ],
        ageGroup: { min: 6, max: 12 },
        difficulty: 'beginner',
        isActive: true
      }

      // Additional modules for other disaster types can be added here
    ];

    const created = await DisasterModule.insertMany(modulesToSeed);
    console.log(`✓ Created ${created.length} disaster modules`);

    return created;

  } catch (error) {
    console.error('Error seeding disaster modules:', error);
    throw error;
  }
};

module.exports = { seedDisasterModules };
