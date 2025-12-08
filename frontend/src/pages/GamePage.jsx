import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api.config';
import './GamePage.css';

// Import TPP Game Engine and configs
import TPPGameEngine from '../game/engine/TPPGameEngine';
import disasterGameConfigs from '../game/configs/disasterGameConfigs';

const GamePage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/disasters/modules/${moduleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setModule(response.data.data.module);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching module:', err);
        setError('Failed to load scenario. Please try again.');
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchModule();
    }
  }, [moduleId]);

  const handleScenarioComplete = async (result) => {
    console.log('🎯 Game scenario completed with result:', result);
    setGameResult(result);
    
    // Record game completion in module progress tracking (only if successful)
    if (result.success && moduleId) {
      try {
        const token = localStorage.getItem('token');
        console.log('🎮 Game completed successfully, saving progress:', { moduleId, success: result.success });
        
        const response = await axios.post(
          `${API_BASE_URL}/module-progress/${moduleId}/step/game`,
          { success: result.success },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log('✅ Game progress recorded:', response.data);
      } catch (err) {
        console.error('❌ Error saving game progress:', err);
      }
    } else {
      console.warn('⚠️ Game not marked complete because:', !result.success ? 'failed' : 'no moduleId');
    }
  };

  const handleBackToModule = () => {
    if (moduleId) {
      navigate(`/learning-path/module/${moduleId}`);
    } else {
      navigate('/disaster-modules');
    }
  };

  const handleRetry = () => {
    setGameResult(null);
  };

  if (loading) {
    return (
      <div className="game-page">
        <div className="loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading 3D scenario-based learning experience...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="game-page">
        <div className="error-container">
          <h2>⚠️ Error</h2>
          <p>{error || 'Module not found'}</p>
          <button onClick={handleBackToModule} className="btn-primary">
            Back to Module
          </button>
        </div>
      </div>
    );
  }

  // Get the appropriate game config
  const gameConfig = disasterGameConfigs[module.disasterType];

  if (!gameConfig) {
    return (
      <div className="game-page">
        <div className="error-container">
          <h2>Game not available for {module.title}</h2>
          <button onClick={handleBackToModule} className="btn-primary">
            Back to Module
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <button className="back-button" onClick={handleBackToModule}>← Back to Module</button>
      {!gameResult ? (
        <TPPGameEngine
          disasterType={module.disasterType}
          onComplete={handleScenarioComplete}
          environmentConfig={gameConfig.environmentConfig}
          goals={gameConfig.goals}
          instructions={gameConfig.instructions}
          obstacles={gameConfig.obstacles}
          collectibles={gameConfig.collectibles}
        />
      ) : gameResult ? (
        <div className="game-completion-overlay">
          <div className="completion-card">
            <h2>🎉 Mission Complete!</h2>
            <div className="result-stats">
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-label">Score</span>
                <span className="stat-value">{gameResult.score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⏱️</span>
                <span className="stat-label">Time</span>
                <span className="stat-value">{Math.floor(gameResult.time)}s</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">❤️</span>
                <span className="stat-label">Health</span>
                <span className="stat-value">{gameResult.health}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📦</span>
                <span className="stat-label">Items</span>
                <span className="stat-value">{gameResult.collectibles}</span>
              </div>
            </div>

            <div className="completion-actions">
              <button onClick={handleRetry} className="retry-button">
                🔄 Play Again
              </button>
              <button onClick={handleBackToModule} className="dashboard-button">
                📚 Back to Module
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default GamePage;
