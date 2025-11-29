import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import './HomePage.css';

function HomePage({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    school: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await registerUser(formData);
      if (response.success) {
        setUser(response.user);
        navigate('/setup');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="main-title bounce">
          🌟 Stay Safe, Learn Smart! 🌟
        </h1>
        <p className="subtitle">
          Learn how to stay safe during disasters with fun games and activities!
        </p>
        
        <div className="character-container">
          <div className="character">
            <span className="emoji">👦</span>
            <p>Hi! I'm Ravi!</p>
          </div>
          <div className="character">
            <span className="emoji">👧</span>
            <p>I'm Meera!</p>
          </div>
        </div>
        
        <p className="welcome-text">
          We'll teach you how to be a <strong>Disaster Safety Hero</strong>! 🦸
        </p>
      </div>

      <div className="registration-card card fade-in">
        <h2>Let's Get Started! 🚀</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📛 Your Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>🎂 Your Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="How old are you?"
              min="5"
              max="15"
              required
            />
          </div>

          <div className="form-group">
            <label>📚 Your Class/Grade:</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              placeholder="E.g., Class 5"
              required
            />
          </div>

          <div className="form-group">
            <label>🏫 School Name:</label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="Your school name (optional)"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-large">
            Start Learning! 🎓
          </button>
        </form>
      </div>

      <div className="features-section">
        <h2>What You'll Learn 🎮</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <span className="emoji">🎮</span>
            <h3>Interactive Games</h3>
            <p>Play fun games and learn safety skills!</p>
          </div>
          
          <div className="feature-card card">
            <span className="emoji">📍</span>
            <h3>Your Location</h3>
            <p>Learn about disasters in YOUR area!</p>
          </div>
          
          <div className="feature-card card">
            <span className="emoji">🏆</span>
            <h3>Earn Badges</h3>
            <p>Collect cool badges and rewards!</p>
          </div>
          
          <div className="feature-card card">
            <span className="emoji">📖</span>
            <h3>Fun Quizzes</h3>
            <p>Test your knowledge and learn more!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
