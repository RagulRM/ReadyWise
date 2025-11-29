/**
 * Role Selection Page
 * Choose user type: Organization, Teacher, or Student
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'organization',
      title: 'Organization/School',
      icon: '🏫',
      description: 'Admin account for schools and organizations',
      features: ['Manage teachers', 'Monitor classes', 'Location-based setup', 'View analytics'],
      color: '#2563eb'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      icon: '👨‍🏫',
      description: 'Monitor student progress and performance',
      features: ['View student progress', 'Track completion', 'Class management', 'Individual reports'],
      color: '#7c3aed'
    },
    {
      id: 'student',
      title: 'Student',
      icon: '👨‍🎓',
      description: 'Learn disaster response and earn badges',
      features: ['Interactive modules', 'Fun quizzes', 'Exciting games', 'Earn badges'],
      color: '#059669'
    }
  ];

  const handleRoleSelect = (roleId) => {
    navigate(`/auth/${roleId}`);
  };

  return (
    <div className="role-selection-container">
      <div className="role-header">
        <h1>🚨 Disaster Response Training Platform</h1>
        <p>Select your account type to continue</p>
      </div>

      <div className="roles-grid">
        {roles.map((role) => (
          <div
            key={role.id}
            className="role-card"
            onClick={() => handleRoleSelect(role.id)}
            style={{ borderColor: role.color }}
          >
            <div className="role-icon" style={{ backgroundColor: `${role.color}20` }}>
              <span style={{ color: role.color }}>{role.icon}</span>
            </div>
            
            <h2 style={{ color: role.color }}>{role.title}</h2>
            <p className="role-description">{role.description}</p>
            
            <ul className="role-features">
              {role.features.map((feature, index) => (
                <li key={index}>
                  <span>✓</span> {feature}
                </li>
              ))}
            </ul>
            
            <button 
              className="role-select-btn"
              style={{ backgroundColor: role.color }}
            >
              Continue as {role.title}
            </button>
          </div>
        ))}
      </div>

      <div className="role-footer">
        <p>Not sure which account type? Contact your school administrator</p>
      </div>
    </div>
  );
};

export default RoleSelection;