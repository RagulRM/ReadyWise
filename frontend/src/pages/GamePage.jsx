import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGame, submitGameResults } from '../services/api';
import './GamePage.css';

function GamePage({ user }) {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    loadGame();
  }, [gameId]);

  useEffect(() => {
    if (game && currentSceneIndex < game.scenarios.length && !gameCompleted) {
      const currentScene = game.scenarios[currentSceneIndex];
      setTimeLeft(currentScene.timeLimit);
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentSceneIndex, game, gameCompleted]);

  const loadGame = async () => {
    try {
      const response = await getGame(gameId);
      setGame(response.game);
    } catch (error) {
      console.error('Failed to load game:', error);
      alert('Failed to load game. Please try again.');
      navigate('/dashboard');
    }
  };

  const handleTimeout = () => {
    setFeedback({
      text: '⏰ Time\'s up! Let\'s move to the next scene.',
      isCorrect: false
    });
    
    setTimeout(() => {
      nextScene(null);
    }, 2000);
  };

  const handleAnswer = (optionId) => {
    if (feedback) return; // Prevent multiple selections

    const currentScene = game.scenarios[currentSceneIndex];
    const selectedOption = currentScene.options.find(opt => opt.id === optionId);
    
    setAnswers([...answers, optionId]);
    setScore(score + selectedOption.points);
    
    setFeedback({
      text: selectedOption.feedback,
      isCorrect: selectedOption.correct || false
    });

    setTimeout(() => {
      nextScene(optionId);
    }, 3000);
  };

  const nextScene = (answer) => {
    setFeedback(null);
    
    if (currentSceneIndex + 1 < game.scenarios.length) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else {
      completeGame(answer);
    }
  };

  const completeGame = async (lastAnswer) => {
    const finalAnswers = lastAnswer ? [...answers, lastAnswer] : answers;
    
    try {
      const response = await submitGameResults(gameId, {
        userId: user?.id,
        answers: finalAnswers,
        timeTaken: 0 // You can track actual time
      });
      
      setResult(response);
      setGameCompleted(true);
    } catch (error) {
      console.error('Failed to submit game results:', error);
    }
  };

  if (!game) {
    return (
      <div className="game-page">
        <div className="loading">Loading game... 🎮</div>
      </div>
    );
  }

  if (gameCompleted && result) {
    return (
      <div className="game-page">
        <div className="container">
          <div className="card result-card fade-in">
            <h1>🎉 Game Complete!</h1>
            
            <div className="final-score">
              <div className="score-display">
                <span className="score-value">{result.totalScore}</span>
                <span className="score-max">/ {result.maxScore}</span>
              </div>
              <div className="score-percentage">
                {Math.round((result.totalScore / result.maxScore) * 100)}%
              </div>
            </div>

            {result.earnedBadge && (
              <div className="badge-earned bounce">
                <span className="badge-emoji">{result.earnedBadge.emoji}</span>
                <h2>{result.earnedBadge.name}</h2>
                <p>{result.message}</p>
              </div>
            )}

            <div className="results-summary">
              <h3>📊 Your Performance:</h3>
              {result.results.map((res, idx) => (
                <div key={idx} className="result-item">
                  <div className="result-header">
                    <span>Scene {idx + 1}</span>
                    <span className={res.points >= 80 ? 'points-good' : 'points-low'}>
                      {res.points} points
                    </span>
                  </div>
                  <p className="result-feedback">{res.feedback}</p>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard 🏠
              </button>
              <button 
                className="btn btn-success"
                onClick={() => window.location.reload()}
              >
                Play Again 🔄
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentScene = game.scenarios[currentSceneIndex];

  return (
    <div className="game-page">
      <div className="game-header">
        <h2>{game.name}</h2>
        <div className="game-progress">
          <span>Scene {currentSceneIndex + 1} of {game.scenarios.length}</span>
          <div className="timer">⏱️ {timeLeft}s</div>
        </div>
      </div>

      <div className="container">
        <div className="card scene-card fade-in">
          <div className="scene-situation">
            <h3>📖 Situation:</h3>
            <p>{currentScene.situation}</p>
          </div>

          <div className="current-score">
            Current Score: <strong>{score}</strong> points
          </div>

          <div className="options-grid">
            {currentScene.options.map((option) => (
              <button
                key={option.id}
                className={`option-button ${feedback ? 'disabled' : ''}`}
                onClick={() => handleAnswer(option.id)}
                disabled={feedback !== null}
              >
                <span className="option-id">{option.id.toUpperCase()}</span>
                <span className="option-text">{option.text}</span>
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`feedback-box ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
              <p>{feedback.text}</p>
            </div>
          )}

          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentSceneIndex + 1) / game.scenarios.length) * 100}%` }}
            >
              {Math.round(((currentSceneIndex + 1) / game.scenarios.length) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
