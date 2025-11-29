import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGames } from '../services/api';
import './Dashboard.css';

const disasterIcons = {
  earthquake: '🌍',
  cyclone: '🌀',
  flood: '🌊',
  fire: '🔥',
  landslide: '⛰️',
  stampede: '👥',
  heatwave: '🌡️',
  drought: '☀️',
  tsunami: '🌊',
  avalanche: '❄️'
};

function Dashboard({ user, locationData }) {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (!locationData) {
      navigate('/setup');
      return;
    }
    loadGames();
  }, [locationData, navigate]);

  const loadGames = async () => {
    try {
      const response = await getAllGames();
      setGames(response.games);
    } catch (error) {
      console.error('Failed to load games:', error);
    }
  };

  if (!locationData) {
    return <div>Loading...</div>;
  }

  const { riskProfile, disasters } = locationData;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏠 Welcome {user?.name || 'Friend'}!</h1>
        <div className="location-badge">
          📍 {riskProfile.city || riskProfile.state}
        </div>
      </header>

      <div className="container">
        {/* Risk Profile Section */}
        <div className="card risk-profile fade-in">
          <h2>🗺️ Your Location Safety Profile</h2>
          <div className="risk-details">
            <div className="risk-item">
              <strong>State:</strong> {riskProfile.state}
            </div>
            {riskProfile.city && (
              <div className="risk-item">
                <strong>City:</strong> {riskProfile.city}
              </div>
            )}
            <div className="risk-item">
              <strong>Risk Level:</strong> 
              <span className={`risk-badge ${riskProfile.riskLevel.toLowerCase()}`}>
                {riskProfile.riskLevel}
              </span>
            </div>
            {riskProfile.isCoastal && (
              <div className="risk-item">
                <span className="badge">🌊 Coastal Area</span>
              </div>
            )}
            {riskProfile.isHimalayan && (
              <div className="risk-item">
                <span className="badge">⛰️ Himalayan Region</span>
              </div>
            )}
            {riskProfile.isMetro && (
              <div className="risk-item">
                <span className="badge">🏙️ Metro City</span>
              </div>
            )}
          </div>
        </div>

        {/* Disasters for Your Area */}
        <div className="card disasters-card fade-in">
          <h2>⚠️ Disasters You Should Learn About</h2>
          <p className="info-text">
            These are the disasters that can happen in <strong>{riskProfile.state}</strong>. 
            Let's learn how to stay safe! 🛡️
          </p>
          
          <div className="disasters-grid">
            {disasters.map((disaster) => (
              <div 
                key={disaster}
                className="disaster-card"
                onClick={() => navigate(`/disaster/${disaster}`)}
              >
                <div className="disaster-icon">
                  {disasterIcons[disaster] || '⚠️'}
                </div>
                <div className="disaster-name">
                  {disaster.charAt(0).toUpperCase() + disaster.slice(1)}
                </div>
                <button className="btn-small btn-primary">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Games */}
        <div className="card games-card fade-in">
          <h2>🎮 Play & Learn!</h2>
          <p className="info-text">
            Play these fun games to learn how to stay safe! 🌟
          </p>
          
          <div className="games-grid">
            {games.map((game) => (
              <div key={game.id} className="game-card">
                <div className="game-header">
                  <span className="game-icon">🎮</span>
                  <h3>{game.name}</h3>
                </div>
                <p className="game-description">{game.description}</p>
                <div className="game-meta">
                  <span className="badge">{game.difficulty}</span>
                  <span className="time">⏱️ {game.estimatedTime}</span>
                </div>
                <button 
                  className="btn btn-success"
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  Play Now! 🚀
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="card quizzes-card fade-in">
          <h2>📝 Test Your Knowledge!</h2>
          <p className="info-text">
            Take these quizzes and become a Safety Expert! 🏆
          </p>
          
          <div className="quiz-grid">
            {disasters.slice(0, 4).map((disaster) => (
              <div key={disaster} className="quiz-item">
                <span className="quiz-icon">{disasterIcons[disaster]}</span>
                <div className="quiz-info">
                  <h4>{disaster.charAt(0).toUpperCase() + disaster.slice(1)} Quiz</h4>
                  <p>Test what you learned!</p>
                </div>
                <button 
                  className="btn btn-warning"
                  onClick={() => navigate(`/quiz/${disaster}`)}
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Button */}
        <div className="card progress-card fade-in">
          <h2>📊 Your Learning Journey</h2>
          <button 
            className="btn btn-primary btn-large"
            onClick={() => navigate('/progress')}
          >
            View My Progress & Badges 🏆
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
