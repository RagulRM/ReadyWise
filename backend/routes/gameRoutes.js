const express = require('express');
const router = express.Router();

/**
 * Game configurations and scenarios
 */
const gameScenarios = {
  'earthquake-drill': {
    id: 'earthquake-drill',
    name: 'Earthquake Drill Game',
    type: 'earthquake',
    description: 'The classroom starts shaking! Make the right choices quickly!',
    difficulty: 'easy',
    estimatedTime: '3-5 minutes',
    
    scenarios: [
      {
        id: 'scene1',
        situation: 'You feel the ground shaking while sitting in class. What do you do FIRST?',
        image: 'classroom-shaking.png',
        options: [
          { id: 'a', text: 'Run to the door', points: 0, feedback: '❌ Running during shaking is dangerous! You might fall.' },
          { id: 'b', text: 'Drop under your desk', points: 100, feedback: '✅ Perfect! DROP is the first step!', correct: true },
          { id: 'c', text: 'Stand by the window', points: 0, feedback: '❌ Windows can break! Stay away from them.' },
          { id: 'd', text: 'Shout for help', points: 20, feedback: '⚠️ Stay calm. Drop first, then you can alert others.' }
        ],
        timeLimit: 10
      },
      {
        id: 'scene2',
        situation: 'You are under the desk. What should you do next?',
        image: 'under-desk.png',
        options: [
          { id: 'a', text: 'Cover your head with hands', points: 100, feedback: '✅ Excellent! Protect your head!', correct: true },
          { id: 'b', text: 'Look around', points: 20, feedback: '⚠️ Better to protect your head first!' },
          { id: 'c', text: 'Try to run outside', points: 0, feedback: '❌ Stay under the desk until shaking stops!' },
          { id: 'd', text: 'Close your eyes', points: 30, feedback: '⚠️ Good for staying calm, but protect your head!' }
        ],
        timeLimit: 10
      },
      {
        id: 'scene3',
        situation: 'The shaking has stopped. What should you do now?',
        image: 'after-earthquake.png',
        options: [
          { id: 'a', text: 'Stay under the desk', points: 40, feedback: '⚠️ Shaking stopped. Time to evacuate calmly.' },
          { id: 'b', text: 'Walk calmly to the exit', points: 100, feedback: '✅ Perfect! Calm evacuation is important!', correct: true },
          { id: 'c', text: 'Run to the exit', points: 30, feedback: '⚠️ Walk, don\'t run! Running causes accidents.' },
          { id: 'd', text: 'Use the elevator', points: 0, feedback: '❌ NEVER use elevators after earthquake!' }
        ],
        timeLimit: 10
      }
    ],
    
    badges: {
      perfect: { name: 'Earthquake Expert', emoji: '🌟', minScore: 280 },
      good: { name: 'Safety Star', emoji: '⭐', minScore: 200 },
      participant: { name: 'Brave Learner', emoji: '🎖️', minScore: 100 }
    }
  },
  
  'fire-corridor-escape': {
    id: 'fire-corridor-escape',
    name: 'Fire Escape Maze',
    type: 'fire',
    description: 'Fire in the school corridor! Find the safe exit path!',
    difficulty: 'medium',
    estimatedTime: '4-6 minutes',
    
    scenarios: [
      {
        id: 'scene1',
        situation: 'You smell smoke in the corridor. What do you do first?',
        image: 'smoke-corridor.png',
        options: [
          { id: 'a', text: 'Shout "FIRE!" to alert others', points: 100, feedback: '✅ Yes! Alert everyone immediately!', correct: true },
          { id: 'b', text: 'Run to check what\'s burning', points: 0, feedback: '❌ Don\'t investigate! Alert and evacuate!' },
          { id: 'c', text: 'Go back to classroom', points: 20, feedback: '⚠️ Alert others first!' },
          { id: 'd', text: 'Hide in bathroom', points: 0, feedback: '❌ NEVER hide! You must evacuate!' }
        ],
        timeLimit: 8
      },
      {
        id: 'scene2',
        situation: 'Smoke is filling the corridor. How should you move?',
        image: 'smoke-filled.png',
        options: [
          { id: 'a', text: 'Walk normally', points: 20, feedback: '⚠️ Smoke rises up! Crawl low!' },
          { id: 'b', text: 'Crawl on the floor', points: 100, feedback: '✅ Perfect! Clean air is near the floor!', correct: true },
          { id: 'c', text: 'Run very fast', points: 30, feedback: '⚠️ You need to crawl to breathe clean air!' },
          { id: 'd', text: 'Cover face and walk', points: 50, feedback: '⚠️ Good to cover face, but you should crawl!' }
        ],
        timeLimit: 8
      },
      {
        id: 'scene3',
        situation: 'You reach the stairs and see an elevator. Which do you use?',
        image: 'stairs-elevator.png',
        options: [
          { id: 'a', text: 'Take the elevator (it\'s faster)', points: 0, feedback: '❌ NEVER use elevator in fire!' },
          { id: 'b', text: 'Use the stairs', points: 100, feedback: '✅ Correct! Always use stairs in fire!', correct: true },
          { id: 'c', text: 'Wait for someone to decide', points: 10, feedback: '⚠️ Don\'t wait! Use stairs immediately!' },
          { id: 'd', text: 'Check if elevator is working', points: 0, feedback: '❌ Elevators can trap you! Use stairs!' }
        ],
        timeLimit: 8
      }
    ],
    
    badges: {
      perfect: { name: 'Fire Safety Hero', emoji: '🚒', minScore: 280 },
      good: { name: 'Escape Expert', emoji: '🎖️', minScore: 200 },
      participant: { name: 'Safety Learner', emoji: '⭐', minScore: 100 }
    }
  },
  
  'flood-safety-decisions': {
    id: 'flood-safety-decisions',
    name: 'Flood Safety Game',
    type: 'flood',
    description: 'Water is rising in your area! Make safe choices!',
    difficulty: 'medium',
    estimatedTime: '4-5 minutes',
    
    scenarios: [
      {
        id: 'scene1',
        situation: 'Heavy rain alert! Water is starting to enter your house. What should you do FIRST?',
        image: 'water-entering.png',
        options: [
          { id: 'a', text: 'Switch off main electricity', points: 100, feedback: '✅ Excellent! Prevent electric shock!', correct: true },
          { id: 'b', text: 'Try to stop the water', points: 20, feedback: '⚠️ Safety first! Turn off electricity!' },
          { id: 'c', text: 'Move furniture', points: 30, feedback: '⚠️ Electricity first, then move things!' },
          { id: 'd', text: 'Call friends', points: 10, feedback: '⚠️ Safety action first!' }
        ],
        timeLimit: 10
      },
      {
        id: 'scene2',
        situation: 'Water level is rising. Where should you keep important things?',
        image: 'rising-water.png',
        options: [
          { id: 'a', text: 'On the ground', points: 0, feedback: '❌ Water will reach them there!' },
          { id: 'b', text: 'On high shelves/upper floor', points: 100, feedback: '✅ Smart! Keep things above water level!', correct: true },
          { id: 'c', text: 'In the basement', points: 0, feedback: '❌ Basement fills with water first!' },
          { id: 'd', text: 'Outside the house', points: 20, feedback: '⚠️ They might float away!' }
        ],
        timeLimit: 10
      },
      {
        id: 'scene3',
        situation: 'You need to cross a flooded street. The water is flowing. Should you?',
        image: 'flooded-street.png',
        options: [
          { id: 'a', text: 'Walk carefully through it', points: 0, feedback: '❌ Flowing water can sweep you away!' },
          { id: 'b', text: 'AVOID it and find another route', points: 100, feedback: '✅ Correct! Never walk in flowing water!', correct: true },
          { id: 'c', text: 'Hold someone\'s hand and cross', points: 20, feedback: '⚠️ Still dangerous! Avoid flowing water!' },
          { id: 'd', text: 'Run across quickly', points: 0, feedback: '❌ Very dangerous! You could fall!' }
        ],
        timeLimit: 10
      }
    ],
    
    badges: {
      perfect: { name: 'Flood Safety Expert', emoji: '🌊', minScore: 280 },
      good: { name: 'Water Wise', emoji: '💧', minScore: 200 },
      participant: { name: 'Safety Learner', emoji: '⭐', minScore: 100 }
    }
  }
};

/**
 * GET /api/games
 * Get list of all available games
 */
router.get('/', (req, res) => {
  try {
    const games = Object.values(gameScenarios).map(g => ({
      id: g.id,
      name: g.name,
      type: g.type,
      description: g.description,
      difficulty: g.difficulty,
      estimatedTime: g.estimatedTime
    }));
    
    res.json({ success: true, games });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games', message: error.message });
  }
});

/**
 * GET /api/games/:gameId
 * Get specific game details
 */
router.get('/:gameId', (req, res) => {
  try {
    const game = gameScenarios[req.params.gameId];
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json({ success: true, game });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game', message: error.message });
  }
});

/**
 * POST /api/games/:gameId/submit
 * Submit game results
 */
router.post('/:gameId/submit', (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId, answers, timeTaken } = req.body;
    
    const game = gameScenarios[gameId];
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    let totalScore = 0;
    const results = game.scenarios.map((scenario, index) => {
      const userAnswer = answers[index];
      const selectedOption = scenario.options.find(opt => opt.id === userAnswer);
      
      if (selectedOption) {
        totalScore += selectedOption.points;
      }
      
      return {
        scenarioId: scenario.id,
        userAnswer,
        points: selectedOption ? selectedOption.points : 0,
        feedback: selectedOption ? selectedOption.feedback : 'No answer selected'
      };
    });
    
    // Determine badge earned
    let earnedBadge = null;
    if (totalScore >= game.badges.perfect.minScore) {
      earnedBadge = game.badges.perfect;
    } else if (totalScore >= game.badges.good.minScore) {
      earnedBadge = game.badges.good;
    } else if (totalScore >= game.badges.participant.minScore) {
      earnedBadge = game.badges.participant;
    }
    
    res.json({
      success: true,
      gameId,
      totalScore,
      maxScore: game.scenarios.length * 100,
      results,
      earnedBadge,
      timeTaken,
      message: earnedBadge 
        ? `🎉 Congratulations! You earned: ${earnedBadge.emoji} ${earnedBadge.name}!`
        : '💪 Keep practicing! You can do better!'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit game results', message: error.message });
  }
});

module.exports = router;
