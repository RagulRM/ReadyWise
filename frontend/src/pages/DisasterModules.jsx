/**
 * Disaster Modules Page
 * Displays personalized disaster preparedness modules based on student location
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api.config';
import './DisasterModules.css';

const DisasterModules = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, primary, recommended
  const [moduleProgress, setModuleProgress] = useState({});

  useEffect(() => {
    fetchPersonalizedModules();
    fetchAllProgress();
  }, []);

  const fetchAllProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/module-progress/student/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const progressData = response.data.data;
        const progressMap = {};
        progressData.forEach(p => {
          progressMap[p.module._id || p.module] = p;
        });
        setModuleProgress(progressMap);
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  const fetchPersonalizedModules = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/disasters/personalized/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const { modules, location } = response.data.data;
        setModules(modules);
        setLocation(location);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load modules');
      console.error('Error fetching modules:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredModules = () => {
    switch (selectedFilter) {
      case 'primary':
        return modules.filter(m => m.locationPriority === 'PRIMARY');
      case 'recommended':
        return modules.filter(m => m.recommended);
      default:
        return modules;
    }
  };

  const getRiskLevelClass = (riskLevel) => {
    const classes = {
      VERY_HIGH: 'risk-very-high',
      HIGH: 'risk-high',
      MODERATE_HIGH: 'risk-moderate-high',
      MODERATE: 'risk-moderate'
    };
    return classes[riskLevel] || 'risk-moderate';
  };

  if (loading) {
    return (
      <div className="disaster-modules-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading personalized modules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="disaster-modules-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const filteredModules = getFilteredModules();

  return (
    <div className="disaster-modules-container">
      {/* Header Section */}
      <div className="modules-header">
        <button className="back-button" onClick={() => navigate('/dashboard/student')}>← Back to Dashboard</button>
        <h1>Disaster Preparedness Modules</h1>
        <p className="subtitle">Learn how to stay safe during disasters</p>
      </div>

      {/* Location Info Card */}
      {location && (
        <div className={`location-info-card ${getRiskLevelClass(location.riskLevel)}`}>
          <div className="location-header">
            <h2>📍 Your Location</h2>
            <span className={`risk-badge ${getRiskLevelClass(location.riskLevel)}`}>
              {location.riskLevel.replace(/_/g, ' ')}
            </span>
          </div>
          
          <div className="location-details">
            <div className="location-item">
              <span className="label">State:</span>
              <span className="value">{location.state}</span>
            </div>
            {location.city && (
              <div className="location-item">
                <span className="label">City:</span>
                <span className="value">{location.city}</span>
              </div>
            )}
            <div className="location-item">
              <span className="label">Region:</span>
              <span className="value">{location.region}</span>
            </div>
            <div className="location-item">
              <span className="label">Earthquake Zone:</span>
              <span className="value">Zone {location.earthquakeZone}</span>
            </div>
          </div>

          {location.specialNotes && (
            <div className="special-notes">
              <strong>⚠️ Important:</strong> {location.specialNotes}
            </div>
          )}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="filter-section">
        <h3>Filter Modules:</h3>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            All Modules ({modules.length})
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'primary' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('primary')}
          >
            High Priority ({modules.filter(m => m.locationPriority === 'PRIMARY').length})
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'recommended' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('recommended')}
          >
            Recommended ({modules.filter(m => m.recommended).length})
          </button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="modules-grid">
        {filteredModules.map((module, index) => {
          const progress = moduleProgress[module._id] || null;
          const completionPercentage = progress?.completionPercentage || 0;
          const isComplete = progress?.overallComplete || false;
          
          return (
            <div
              key={module._id}
              className={`module-card ${module.urgent ? 'urgent-module' : ''} ${module.recommended ? 'recommended-module' : ''} ${isComplete ? 'completed-module' : ''}`}
              style={{ borderLeftColor: module.color }}
            >
              {/* Completion Badge */}
              {isComplete && (
                <div className="completion-badge">
                  ✅ Completed
                </div>
              )}

              {/* Module Header */}
              <div className="module-header">
                <div className="module-icon" style={{ backgroundColor: `${module.color}20` }}>
                  <span style={{ fontSize: '2.5rem' }}>{module.icon}</span>
                </div>
                <div className="module-title-section">
                  <h3>{module.name}</h3>
                  <span className="module-order">Module #{module.displayOrder}</span>
                </div>
              </div>

              {/* Module Description */}
              <p className="module-description">{module.description}</p>

              {/* Progress Bar */}
              {progress && (
                <div className="module-progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Progress</span>
                    <span className="progress-percentage">{completionPercentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="step-indicators">
                    <div className={`step-indicator ${progress.stepCompletions.learn.completed ? 'completed' : ''}`} title="Learning Content">
                      📚
                    </div>
                    <div className={`step-indicator ${progress.stepCompletions.videos.completed ? 'completed' : ''}`} title="Videos">
                      🎥
                    </div>
                    <div className={`step-indicator ${progress.stepCompletions.quiz.completed ? 'completed' : ''}`} title="Quiz">
                      📝
                    </div>
                    <div className={`step-indicator ${progress.stepCompletions.practice.completed ? 'completed' : ''}`} title="Practice">
                      🎯
                    </div>
                    <div className={`step-indicator ${progress.stepCompletions.game.completed ? 'completed' : ''}`} title="Game">
                      🎮
                    </div>
                  </div>
                </div>
              )}

              {/* Module Stats */}
              <div className="module-stats">
                <div className="stat-item">
                  <span className="stat-icon">📖</span>
                  <span>{module.totalLessons} Lessons</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">❓</span>
                  <span>{module.totalQuestions} Questions</span>
                </div>
              </div>

              {/* Regional Content Indicator */}
              {module.regionalContent && (
                <div className="regional-indicator">
                  📍 Customized for {location.state}
                </div>
              )}

              {/* Action Buttons */}
              <div className="module-actions">
                <button 
                  className="btn-primary"
                  onClick={() => navigate(`/learning-path/module/${module._id}`)}
                >
                  Start Learning
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate(`/disaster/${module.disasterType}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="no-modules">
          <p>No modules found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default DisasterModules;
