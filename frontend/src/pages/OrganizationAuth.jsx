/**
 * Organization Authentication Page
 * Registration and Login for Schools/Organizations
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAllStates, getCitiesByState } from '../data/indianStatesAndCities';
import './AuthPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const OrganizationAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // Step 1: Basic Info, Step 2: Location Setup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    password: '',
    organizationType: 'school'
  });

  const [locationData, setLocationData] = useState({
    state: '',
    city: '',
    district: '',
    pincode: ''
  });

  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    // Load all Indian states on component mount
    const states = getAllStates();
    setAvailableStates(states);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    
    setLocationData({
      ...locationData,
      [name]: value
    });
    
    // If state is changed, update available cities
    if (name === 'state') {
      const cities = getCitiesByState(value);
      setAvailableCities(cities);
      // Reset city when state changes
      setLocationData(prev => ({
        ...prev,
        state: value,
        city: '' // Clear city selection
      }));
    }
    
    setError('');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    
    // Validate step 1 fields
    if (!formData.organizationName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Combine form data and location data for registration
      const registrationData = {
        ...formData,
        state: locationData.state,
        city: locationData.city,
        district: locationData.district,
        pincode: locationData.pincode
      };

      const response = await axios.post(`${API_URL}/auth/organization/register`, registrationData);

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', 'organization');
        localStorage.setItem('userData', JSON.stringify(response.data.data.user));
        
        // Redirect to dashboard
        navigate('/dashboard/organization');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = '/auth/organization/login';
      const payload = { email: formData.email, password: formData.password };

      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', 'organization');
        localStorage.setItem('userData', JSON.stringify(response.data.data.user));
        
        // Redirect to dashboard
        navigate('/dashboard/organization');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!formData.email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/organization/login`, {
        email: formData.email
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', 'organization');
        localStorage.setItem('userData', JSON.stringify(response.data.data.user));
        navigate('/dashboard/organization');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="back-btn" onClick={() => navigate('/auth')}>
        ← Back to Role Selection
      </button>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🏫</div>
          <h1>Organization/School</h1>
          <p>
            {isLogin 
              ? 'Welcome back!' 
              : step === 1 
                ? 'Register your institution' 
                : '📍 Setup your location for personalized content'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => {
              setIsLogin(true);
              setStep(1);
              setError('');
            }}
          >
            Login
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => {
              setIsLogin(false);
              setStep(1);
              setError('');
            }}
          >
            Register
          </button>
        </div>

        {/* LOGIN FORM */}
        {isLogin && (
          <form onSubmit={handleLogin} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <button
              type="button"
              className="email-login-btn"
              onClick={handleEmailLogin}
              disabled={loading}
            >
              🔐 Quick Login with Email Only
            </button>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Please wait...' : 'Login'}
            </button>
          </form>
        )}

        {/* REGISTRATION FORM - STEP 1: Basic Information */}
        {!isLogin && step === 1 && (
          <form onSubmit={handleNextStep} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="step-indicator">
              <span className="step active">1</span>
              <span className="step-line"></span>
              <span className="step">2</span>
            </div>

            <h3 style={{ marginBottom: '20px', color: '#667eea' }}>Step 1: Basic Information</h3>

            <div className="form-group">
              <label>Organization Name *</label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Enter school/organization name"
                required
              />
            </div>

            <div className="form-group">
              <label>Organization Type</label>
              <select
                name="organizationType"
                value={formData.organizationType}
                onChange={handleChange}
              >
                <option value="school">School</option>
                <option value="organization">Organization</option>
                <option value="institution">Institution</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (min 6 characters)"
                minLength="6"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Next: Location Setup →
            </button>
          </form>
        )}

        {/* REGISTRATION FORM - STEP 2: Location Setup */}
        {!isLogin && step === 2 && (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="step-indicator">
              <span className="step completed">✓</span>
              <span className="step-line"></span>
              <span className="step active">2</span>
            </div>

            <h3 style={{ marginBottom: '10px', color: '#667eea' }}>Step 2: Location Setup</h3>
            <p style={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
              This helps personalize disaster preparedness modules for your students based on regional risks 🗺️
            </p>

            <div className="info-box" style={{ 
              background: 'linear-gradient(135deg, #667eea15, #764ba215)',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px',
              borderLeft: '4px solid #667eea'
            }}>
              <span style={{ fontSize: '1.5rem' }}>💡</span>
              <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', lineHeight: '1.5' }}>
                <strong>Why location matters:</strong><br />
                Students in coastal areas → Learn about <strong>cyclones & tsunamis</strong> 🌊<br />
                Students in seismic zones → Focus on <strong>earthquakes</strong> 🌍<br />
                Students in flood-prone regions → Prepare for <strong>floods</strong> 💧
              </p>
            </div>

            <div className="form-group">
              <label>🗺️ State *</label>
              <select
                name="state"
                value={locationData.state}
                onChange={handleLocationChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s ease'
                }}
              >
                <option value="">-- Select State --</option>
                {availableStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>🏙️ City *</label>
              <select
                name="city"
                value={locationData.city}
                onChange={handleLocationChange}
                required
                disabled={!locationData.state}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: locationData.state ? 'pointer' : 'not-allowed',
                  backgroundColor: locationData.state ? 'white' : '#f5f5f5',
                  transition: 'all 0.3s ease'
                }}
              >
                <option value="">
                  {locationData.state ? '-- Select City --' : '-- Select State First --'}
                </option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>📌 District (Optional)</label>
              <input
                type="text"
                name="district"
                value={locationData.district}
                onChange={handleLocationChange}
                placeholder="Enter district name"
              />
            </div>

            <div className="form-group">
              <label>📮 Pincode (Optional)</label>
              <input
                type="text"
                name="pincode"
                value={locationData.pincode}
                onChange={handleLocationChange}
                placeholder="6-digit pincode"
                maxLength="6"
                pattern="[0-9]{6}"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#e0e0e0',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                ← Back
              </button>
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={loading}
                style={{ flex: 2 }}
              >
                {loading ? 'Creating Account...' : '🚀 Complete Registration'}
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : 'Already registered? '}
            <span onClick={() => {
              setIsLogin(!isLogin);
              setStep(1);
              setError('');
            }}>
              {isLogin ? 'Register here' : 'Login here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationAuth;