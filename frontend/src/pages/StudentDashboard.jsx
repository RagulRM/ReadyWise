/**
 * Student Dashboard
 * Learning platform with modules, quizzes, and games
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      if (error.response?.status === 401) {
        navigate('/auth/student');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>Error loading dashboard</div>;
  }

  const { student, stats, badges, recentProgress } = dashboardData;

  return (
    <div className="student-dashboard">
      <header className="dashboard-header student-header">
        <div className="header-content">
          <div className="header-left">
            <h1>👨‍🎓 Welcome, {student.name}!</h1>
            <p className="subtitle">
              Class {student.class.grade}{student.class.section} | Roll No: {student.rollNumber}
            </p>
            <p className="organization">{student.organization.organizationName}</p>
            {student.classTeacher && (
              <p className="teacher-info">
                Class Teacher: {student.classTeacher.name} ({student.classTeacher.subject})
              </p>
            )}
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon student-icon">🏆</div>
          <div className="stat-content">
            <h3>{stats.totalScore}</h3>
            <p>Total Score</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon student-icon">🎖️</div>
          <div className="stat-content">
            <h3>{stats.totalBadges}</h3>
            <p>Badges Earned</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon student-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.modulesCompleted}</h3>
            <p>Modules Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon student-icon">🎮</div>
          <div className="stat-content">
            <h3>{stats.gamesCompleted}</h3>
            <p>Games Played</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Badges Section */}
        {badges && badges.length > 0 && (
          <div className="badges-section">
            <h2>🏆 Your Badges</h2>
            <div className="badges-grid">
              {badges.map((badge) => (
                <div key={badge._id} className="badge-card">
                  <div className="badge-icon" style={{ backgroundColor: `${badge.color}20` }}>
                    <span style={{ fontSize: '2rem' }}>{badge.icon}</span>
                  </div>
                  <h3>{badge.name}</h3>
                  <p>{badge.description}</p>
                  <span className={`rarity-badge ${badge.rarity}`}>
                    {badge.rarity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Modules */}
        <div className="modules-section">
          <h2>🌍 Disaster Response Modules</h2>
          <p className="location-info">
            📍 Personalized for {student.organization.location.city}, {student.organization.location.state}
          </p>
          
          <div className="modules-grid">
            <div className="module-card earthquake">
              <div className="module-icon">🌊</div>
              <h3>Earthquake Safety</h3>
              <p>Learn how to stay safe during earthquakes</p>
              <button className="start-btn" onClick={() => navigate('/disaster/earthquake')}>
                Start Learning
              </button>
            </div>

            <div className="module-card flood">
              <div className="module-icon">💧</div>
              <h3>Flood Preparedness</h3>
              <p>Essential flood safety knowledge</p>
              <button className="start-btn" onClick={() => navigate('/disaster/flood')}>
                Start Learning
              </button>
            </div>

            <div className="module-card fire">
              <div className="module-icon">🔥</div>
              <h3>Fire Safety</h3>
              <p>Fire escape and prevention procedures</p>
              <button className="start-btn" onClick={() => navigate('/disaster/fire')}>
                Start Learning
              </button>
            </div>

            <div className="module-card cyclone">
              <div className="module-icon">🌀</div>
              <h3>Cyclone Awareness</h3>
              <p>How to prepare for cyclones</p>
              <button className="start-btn" onClick={() => navigate('/disaster/cyclone')}>
                Start Learning
              </button>
            </div>
          </div>
        </div>

        {/* Recent Progress */}
        {recentProgress && recentProgress.length > 0 && (
          <div className="recent-progress-section">
            <h2>📊 Recent Activity</h2>
            <div className="progress-list">
              {recentProgress.map((activity, index) => (
                <div key={index} className="progress-item">
                  <div className="activity-info">
                    <strong>{activity.activityType}</strong>
                    <span className="activity-score">Score: {activity.score}</span>
                  </div>
                  <span className="activity-date">
                    {new Date(activity.completedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;