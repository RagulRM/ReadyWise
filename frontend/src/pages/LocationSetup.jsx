import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStates, getDisastersByLocation } from '../services/api';
import './LocationSetup.css';

function LocationSetup({ user, setLocationData }) {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [location, setLocation] = useState({
    state: '',
    city: '',
    district: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      const response = await getStates();
      setStates(response.states);
    } catch (error) {
      console.error('Failed to load states:', error);
    }
  };

  const handleChange = (e) => {
    setLocation({
      ...location,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await getDisastersByLocation(location);
      setLocationData(response);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to get location data:', error);
      alert('Failed to load disaster information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="location-setup">
      <div className="setup-container">
        <div className="card setup-card fade-in">
          <h1>📍 Tell Us Where You're From!</h1>
          <p className="intro-text">
            This helps us show you the disasters that might happen in <strong>your area</strong> 🗺️
          </p>

          <div className="info-box">
            <span className="emoji">💡</span>
            <p>
              Students in Chennai learn about <strong>cyclones</strong> 🌀<br />
              Students in Delhi learn about <strong>earthquakes</strong> 🌍<br />
              We'll show you what YOU need to know!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="location-form">
            <div className="form-group">
              <label>🗺️ Select Your State: *</label>
              <select
                name="state"
                value={location.state}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose Your State --</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>🏙️ Your City:</label>
              <input
                type="text"
                name="city"
                value={location.city}
                onChange={handleChange}
                placeholder="E.g., Mumbai, Chennai, Delhi"
              />
            </div>

            <div className="form-group">
              <label>📌 Your District:</label>
              <input
                type="text"
                name="district"
                value={location.district}
                onChange={handleChange}
                placeholder="Your district name (optional)"
              />
            </div>

            <div className="form-group">
              <label>📮 Pincode:</label>
              <input
                type="text"
                name="pincode"
                value={location.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode (optional)"
                maxLength="6"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? '⏳ Loading...' : '🚀 Show My Disasters!'}
            </button>
          </form>
        </div>

        {user && (
          <div className="user-info card">
            <h3>👋 Hi, {user.name}!</h3>
            <p>Age: {user.age} years</p>
            <p>Class: {user.grade}</p>
            {user.school && <p>School: {user.school}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationSetup;
