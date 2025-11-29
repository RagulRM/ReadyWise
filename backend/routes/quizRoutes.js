const express = require('express');
const router = express.Router();

/**
 * Quiz questions database organized by disaster type and topic
 */
const quizQuestions = {
  earthquake: [
    {
      id: 'eq1',
      question: 'What should you do FIRST when you feel an earthquake?',
      image: null,
      options: [
        { id: 'a', text: 'Run outside quickly', icon: '🏃' },
        { id: 'b', text: 'Drop to the ground', icon: '⬇️', correct: true },
        { id: 'c', text: 'Stand near the window', icon: '🪟' },
        { id: 'd', text: 'Call your parents', icon: '📞' }
      ],
      explanation: 'The first step is to DROP to the ground immediately. This prevents you from being knocked down!',
      difficulty: 'easy'
    },
    {
      id: 'eq2',
      question: 'Where is the SAFEST place during an earthquake in your classroom?',
      image: null,
      options: [
        { id: 'a', text: 'Near the door', icon: '🚪' },
        { id: 'b', text: 'Under a strong desk', icon: '🪑', correct: true },
        { id: 'c', text: 'By the window', icon: '🪟' },
        { id: 'd', text: 'In the middle of the room', icon: '📍' }
      ],
      explanation: 'Under a strong desk or table is safest! It protects you from falling objects.',
      difficulty: 'easy'
    },
    {
      id: 'eq3',
      question: 'Should you use the elevator during an earthquake?',
      image: null,
      options: [
        { id: 'a', text: 'Yes, it\'s faster', icon: '✅' },
        { id: 'b', text: 'No, NEVER use elevator', icon: '🚫', correct: true },
        { id: 'c', text: 'Only if it\'s nearby', icon: '🤔' },
        { id: 'd', text: 'Only going down', icon: '⬇️' }
      ],
      explanation: 'NEVER use elevators during an earthquake! They might get stuck. Always use stairs.',
      difficulty: 'easy'
    }
  ],
  
  fire: [
    {
      id: 'fire1',
      question: 'If you see smoke in a room, how should you move?',
      image: null,
      options: [
        { id: 'a', text: 'Walk normally', icon: '🚶' },
        { id: 'b', text: 'Run very fast', icon: '🏃' },
        { id: 'c', text: 'Crawl low on the ground', icon: '🐛', correct: true },
        { id: 'd', text: 'Jump over the smoke', icon: '🦘' }
      ],
      explanation: 'Crawl low under the smoke! Clean air stays near the floor, and smoke rises up.',
      difficulty: 'easy'
    },
    {
      id: 'fire2',
      question: 'Which way should you NEVER use during a fire?',
      image: null,
      options: [
        { id: 'a', text: 'Stairs', icon: '🪜' },
        { id: 'b', text: 'Fire exit', icon: '🚪' },
        { id: 'c', text: 'Elevator', icon: '🛗', correct: true },
        { id: 'd', text: 'Emergency door', icon: '🚨' }
      ],
      explanation: 'NEVER use the elevator during a fire! It could stop working and trap you. Always use stairs!',
      difficulty: 'easy'
    },
    {
      id: 'fire3',
      question: 'What number should you call for fire emergency in India?',
      image: null,
      options: [
        { id: 'a', text: '100', icon: '👮' },
        { id: 'b', text: '101', icon: '🚒', correct: true },
        { id: 'c', text: '102', icon: '🚑' },
        { id: 'd', text: '112', icon: '📞' }
      ],
      explanation: 'Call 101 for fire emergencies in India! 🚒 Remember: 101 for Fire!',
      difficulty: 'medium'
    }
  ],
  
  flood: [
    {
      id: 'flood1',
      question: 'When flood water is rising, where should you go?',
      image: null,
      options: [
        { id: 'a', text: 'To the basement', icon: '⬇️' },
        { id: 'b', text: 'Stay on ground floor', icon: '🏠' },
        { id: 'c', text: 'To the highest floor', icon: '⬆️', correct: true },
        { id: 'd', text: 'Outside the house', icon: '🚪' }
      ],
      explanation: 'Go to the highest floor! Water fills from bottom to top, so higher is safer.',
      difficulty: 'easy'
    },
    {
      id: 'flood2',
      question: 'Is it safe to walk in flowing flood water?',
      image: null,
      options: [
        { id: 'a', text: 'Yes, if it\'s not deep', icon: '✅' },
        { id: 'b', text: 'No, NEVER walk in flowing water', icon: '🚫', correct: true },
        { id: 'c', text: 'Yes, with an adult', icon: '👨‍👧' },
        { id: 'd', text: 'Yes, if wearing boots', icon: '👢' }
      ],
      explanation: 'NEVER walk in flowing water! Even shallow water can sweep you away if it\'s moving fast.',
      difficulty: 'easy'
    }
  ],
  
  cyclone: [
    {
      id: 'cyclone1',
      question: 'During a cyclone, where is the safest place to be?',
      image: null,
      options: [
        { id: 'a', text: 'Outside watching', icon: '👀' },
        { id: 'b', text: 'Near the window', icon: '🪟' },
        { id: 'c', text: 'Inside a strong room', icon: '🏠', correct: true },
        { id: 'd', text: 'Under a tree', icon: '🌳' }
      ],
      explanation: 'Stay inside a strong room away from windows! Cyclone winds can break windows and blow things around.',
      difficulty: 'easy'
    }
  ]
};

/**
 * GET /api/quiz/:disasterType
 * Get quiz questions for a specific disaster
 */
router.get('/:disasterType', (req, res) => {
  try {
    const { disasterType } = req.params;
    const questions = quizQuestions[disasterType];
    
    if (!questions) {
      return res.status(404).json({ error: 'Quiz not found for this disaster type' });
    }
    
    // Return questions without correct answers marked (for security)
    const sanitizedQuestions = questions.map(q => ({
      id: q.id,
      question: q.question,
      image: q.image,
      options: q.options.map(opt => ({ id: opt.id, text: opt.text, icon: opt.icon })),
      difficulty: q.difficulty
    }));
    
    res.json({
      success: true,
      disasterType,
      questions: sanitizedQuestions,
      totalQuestions: questions.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz', message: error.message });
  }
});

/**
 * POST /api/quiz/submit
 * Submit quiz answers and get results
 */
router.post('/submit', (req, res) => {
  try {
    const { disasterType, answers, userId } = req.body;
    
    const questions = quizQuestions[disasterType];
    if (!questions) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    let score = 0;
    const results = questions.map((q, index) => {
      const userAnswer = answers[index];
      const correctOption = q.options.find(opt => opt.correct);
      const isCorrect = userAnswer === correctOption.id;
      
      if (isCorrect) score++;
      
      return {
        questionId: q.id,
        question: q.question,
        userAnswer,
        correctAnswer: correctOption.id,
        isCorrect,
        explanation: q.explanation
      };
    });
    
    const percentage = ((score / questions.length) * 100).toFixed(0);
    
    // Determine badge/message based on score
    let message = '';
    let badge = null;
    
    if (percentage >= 90) {
      message = '🌟 Excellent! You are a Disaster Safety Expert!';
      badge = 'expert';
    } else if (percentage >= 70) {
      message = '👍 Great job! You know how to stay safe!';
      badge = 'good';
    } else if (percentage >= 50) {
      message = '📚 Good try! Review the lessons and try again!';
      badge = 'learner';
    } else {
      message = '💪 Keep learning! Practice makes perfect!';
      badge = 'beginner';
    }
    
    res.json({
      success: true,
      score,
      totalQuestions: questions.length,
      percentage,
      results,
      message,
      badge
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit quiz', message: error.message });
  }
});

module.exports = router;
