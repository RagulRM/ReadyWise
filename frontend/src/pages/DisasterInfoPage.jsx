import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDisasterDetails, getSafetySteps } from '../services/api';
import './DisasterInfoPage.css';

function DisasterInfoPage() {
  const { disasterId } = useParams();
  const navigate = useNavigate();
  const [disaster, setDisaster] = useState(null);
  const [activeTab, setActiveTab] = useState('steps');

  useEffect(() => {
    loadDisasterInfo();
  }, [disasterId]);

  const loadDisasterInfo = async () => {
    try {
      const response = await getDisasterDetails(disasterId);
      setDisaster(response.disaster);
    } catch (error) {
      console.error('Failed to load disaster info:', error);
      alert('Failed to load disaster information.');
      navigate('/dashboard');
    }
  };

  if (!disaster) {
    return (
      <div className="disaster-info-page">
        <div className="loading">Loading... 📚</div>
      </div>
    );
  }

  return (
    <div className="disaster-info-page">
      <div className="info-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <div className="header-content">
          <span className="disaster-icon-large">{disaster.icon}</span>
          <h1>{disaster.name}</h1>
          <p>{disaster.ageAppropriateDescription}</p>
        </div>
      </div>

      <div className="container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'steps' ? 'active' : ''}`}
            onClick={() => setActiveTab('steps')}
          >
            📋 Safety Steps
          </button>
          <button 
            className={`tab ${activeTab === 'dos' ? 'active' : ''}`}
            onClick={() => setActiveTab('dos')}
          >
            ✅ Do's
          </button>
          <button 
            className={`tab ${activeTab === 'donts' ? 'active' : ''}`}
            onClick={() => setActiveTab('donts')}
          >
            🚫 Don'ts
          </button>
          <button 
            className={`tab ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            🎮 Learn & Play
          </button>
        </div>

        {activeTab === 'steps' && (
          <div className="card content-card fade-in">
            <h2>🛡️ Safety Steps for {disaster.name}</h2>
            <p className="intro">Follow these steps to stay safe during a {disaster.name.toLowerCase()}:</p>
            
            <div className="steps-list">
              {disaster.safetySteps.map((step) => (
                <div key={step.step} className="step-item">
                  <div className="step-number">{step.step}</div>
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-action">{step.action}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dos' && (
          <div className="card content-card fade-in">
            <h2>✅ Things You SHOULD Do</h2>
            <p className="intro">Remember these important actions:</p>
            
            <div className="list-grid">
              {disaster.dos.map((item, idx) => (
                <div key={idx} className="list-item dos">
                  <span className="list-icon">✅</span>
                  <span className="list-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'donts' && (
          <div className="card content-card fade-in">
            <h2>🚫 Things You Should NOT Do</h2>
            <p className="intro">Avoid these dangerous actions:</p>
            
            <div className="list-grid">
              {disaster.donts.map((item, idx) => (
                <div key={idx} className="list-item donts">
                  <span className="list-icon">🚫</span>
                  <span className="list-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="card content-card fade-in">
            <h2>🎮 Interactive Learning</h2>
            <p className="intro">Practice what you learned with fun games and quizzes!</p>
            
            <div className="activity-grid">
              {disaster.games && disaster.games.map((gameId) => (
                <div key={gameId} className="activity-card">
                  <span className="activity-icon">🎮</span>
                  <h3>Game</h3>
                  <p>{gameId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
                  <button 
                    className="btn btn-success"
                    onClick={() => navigate(`/game/${gameId}`)}
                  >
                    Play Now!
                  </button>
                </div>
              ))}
              
              <div className="activity-card">
                <span className="activity-icon">📝</span>
                <h3>Quiz</h3>
                <p>Test your knowledge about {disaster.name}</p>
                <button 
                  className="btn btn-warning"
                  onClick={() => navigate(`/quiz/${disasterId}`)}
                >
                  Take Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card emergency-card">
          <h3>🚨 Emergency Numbers (India)</h3>
          <div className="emergency-numbers">
            <div className="emergency-item">
              <span className="emergency-icon">👮</span>
              <div>
                <strong>Police</strong>
                <div className="number">100</div>
              </div>
            </div>
            <div className="emergency-item">
              <span className="emergency-icon">🚒</span>
              <div>
                <strong>Fire</strong>
                <div className="number">101</div>
              </div>
            </div>
            <div className="emergency-item">
              <span className="emergency-icon">🚑</span>
              <div>
                <strong>Ambulance</strong>
                <div className="number">102</div>
              </div>
            </div>
            <div className="emergency-item">
              <span className="emergency-icon">📞</span>
              <div>
                <strong>Emergency</strong>
                <div className="number">112</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisasterInfoPage;
