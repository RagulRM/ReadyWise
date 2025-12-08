/**
 * Student Dashboard
 * Learning platform with modules, quizzes, and games
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [personalizedModules, setPersonalizedModules] = useState([]);
  const [locationInfo, setLocationInfo] = useState(null);
  const [moduleProgress, setModuleProgress] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchPersonalizedModules();
    fetchModuleProgress();
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

  const fetchPersonalizedModules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/disasters/personalized/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const { modules, location } = response.data.data;
        setPersonalizedModules(modules); // Show all modules prioritized by location
        setLocationInfo(location);
      }
    } catch (error) {
      console.error('Error fetching personalized modules:', error);
    }
  };

  const fetchModuleProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/module-progress/student/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setModuleProgress(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching module progress:', error);
    }
  };

  const completedModulesFromProgress = useMemo(() => {
    return moduleProgress.filter(progress => progress?.overallComplete || progress?.completionPercentage === 100).length;
  }, [moduleProgress]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>Error loading dashboard</div>;
  }

  const { student, stats, badges, recentProgress } = dashboardData;
  const totalModulesAssigned = personalizedModules.length || moduleProgress.length;
  const highPriorityModules = personalizedModules.filter(module => module?.urgent).length;

  const modulesCompleted = completedModulesFromProgress || stats?.modulesCompleted || 0;

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

        {/* Learning Modules - Quick Access */}
        <div className="quick-access-section">
          <div className="section-header">
            <h2>🌍 Disaster Safety Learning</h2>
            <p className="section-description">
              Start your personalized disaster preparedness journey
            </p>
          </div>
          
          <div className="quick-access-card">
            {locationInfo && (
              <div className="location-summary">
                <div className="location-info">
                  <span className="location-text">📍 {locationInfo.city}, {locationInfo.state}</span>
                  <span className={`risk-level-compact ${locationInfo.riskLevel.toLowerCase().replace('_', '-')}`}>
                    {locationInfo.riskLevel.replace('_', ' ')} Risk
                  </span>
                </div>
                <p className="location-note">
                  Your modules are prioritized based on local disaster risks
                </p>
              </div>
            )}
            
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-number">{modulesCompleted}</span>
                <span className="stat-label">Modules Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{totalModulesAssigned}</span>
                <span className="stat-label">Assigned Modules</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{highPriorityModules}</span>
                <span className="stat-label">High Priority</span>
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn-primary-large"
                onClick={() => navigate('/disaster-modules')}
              >
                🚀 Start Learning Modules
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