import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProgress } from '../services/api';
import './ProgressPage.css';

const badgesList = [
  { id: 'earthquake-expert', name: 'Earthquake Expert', icon: '🌟', color: '#667eea' },
  { id: 'fire-hero', name: 'Fire Safety Hero', icon: '🚒', color: '#eb3349' },
  { id: 'flood-wise', name: 'Flood Wise', icon: '🌊', color: '#11998e' },
  { id: 'cyclone-champion', name: 'Cyclone Champion', icon: '🌀', color: '#764ba2' },
  { id: 'safety-star', name: 'Safety Star', icon: '⭐', color: '#f2994a' },
  { id: 'quiz-master', name: 'Quiz Master', icon: '🏆', color: '#f2c94c' },
  { id: 'game-champion', name: 'Game Champion', icon: '🎮', color: '#38ef7d' },
  { id: 'learning-hero', name: 'Learning Hero', icon: '📚', color: '#f093fb' }
];

function ProgressPage({ user }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadProgress();
  }, [user, navigate]);

  const loadProgress = async () => {
    try {
      const response = await getProgress(user.id);
      setProgress(response);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="progress-page">
        <div className="loading">Loading your progress... 📊</div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="progress-page">
        <div className="container">
          <div className="card">
            <h2>No progress data found</h2>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { statistics } = progress;

  return (
    <div className="progress-page">
      <div className="progress-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>📊 My Learning Journey</h1>
        <p>Track your progress and achievements!</p>
      </div>

      <div className="container">
        {/* User Profile Card */}
        <div className="card profile-card fade-in">
          <div className="profile-avatar">
            <span className="avatar-emoji">
              {user.age < 10 ? '👶' : user.age < 13 ? '👦' : '👨'}
            </span>
          </div>
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>Age: {user.age} | Class: {user.grade}</p>
            {user.school && <p>School: {user.school}</p>}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card card fade-in">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{statistics.totalModulesCompleted}</div>
            <div className="stat-label">Modules Completed</div>
          </div>

          <div className="stat-card card fade-in">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{statistics.totalScore}</div>
            <div className="stat-label">Total Points</div>
          </div>

          <div className="stat-card card fade-in">
            <div className="stat-icon">📈</div>
            <div className="stat-value">{statistics.averageScore}%</div>
            <div className="stat-label">Average Score</div>
          </div>

          <div className="stat-card card fade-in">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{Math.round(statistics.totalTimeLearning / 60)}</div>
            <div className="stat-label">Minutes Learning</div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="card badges-card fade-in">
          <h2>🏆 Your Badges & Achievements</h2>
          <p className="section-intro">
            Collect badges by completing games, quizzes, and learning modules!
          </p>

          <div className="badges-grid">
            {badgesList.map((badge) => {
              const earned = Math.random() > 0.5; // Replace with actual logic
              return (
                <div 
                  key={badge.id} 
                  className={`badge-item ${earned ? 'earned' : 'locked'}`}
                  style={{ borderColor: earned ? badge.color : '#ccc' }}
                >
                  <div className="badge-icon" style={{ opacity: earned ? 1 : 0.3 }}>
                    {badge.icon}
                  </div>
                  <div className="badge-name">{badge.name}</div>
                  {!earned && <div className="badge-status">🔒 Locked</div>}
                  {earned && <div className="badge-status earned">✅ Earned!</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card activity-card fade-in">
          <h2>📅 Recent Activity</h2>
          
          {progress.progress && progress.progress.length > 0 ? (
            <div className="activity-list">
              {progress.progress.slice(0, 10).map((item, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-icon">
                    {item.moduleType === 'game' ? '🎮' : 
                     item.moduleType === 'quiz' ? '📝' : 
                     item.moduleType === 'video' ? '🎥' : '📖'}
                  </div>
                  <div className="activity-details">
                    <div className="activity-name">
                      {item.moduleType.charAt(0).toUpperCase() + item.moduleType.slice(1)}: {item.moduleId}
                    </div>
                    <div className="activity-meta">
                      Score: {item.score} points | 
                      {item.completed ? ' ✅ Completed' : ' ⏳ In Progress'}
                    </div>
                  </div>
                  <div className="activity-date">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-activity">
              <p>No activities yet! Start learning to see your progress here. 🚀</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Start Learning
              </button>
            </div>
          )}
        </div>

        {/* Motivational Section */}
        <div className="card motivation-card fade-in">
          <h2>💪 Keep Going!</h2>
          <div className="motivation-content">
            <p className="motivation-text">
              {statistics.totalModulesCompleted === 0 
                ? "You're just getting started! Complete your first module today! 🌟"
                : statistics.totalModulesCompleted < 5
                ? "Great start! Keep learning to become a Disaster Safety Expert! 🎯"
                : statistics.totalModulesCompleted < 10
                ? "You're doing amazing! You're on your way to becoming a Safety Hero! 🦸"
                : "Wow! You're a true Disaster Response Champion! Keep it up! 🏆"}
            </p>
            
            <div className="next-goals">
              <h3>🎯 Next Goals:</h3>
              <ul>
                <li>Complete 3 more games to unlock "Game Champion" badge 🎮</li>
                <li>Score 90%+ on a quiz to earn "Quiz Master" badge 📝</li>
                <li>Learn about all disaster types in your area 🗺️</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;
