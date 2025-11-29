/**
 * Teacher Authentication Page
 * Registration and Login for Teachers
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const TeacherAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: '',
    name: '',
    email: '',
    password: '',
    subject: '',
    grade: '',
    section: 'A',
    phone: '',
    qualification: ''
  });

  // Fetch organizations list when component mounts
  useEffect(() => {
    if (!isLogin) {
      fetchOrganizations();
    }
  }, [isLogin]);

  const fetchOrganizations = async () => {
    setLoadingOrgs(true);
    try {
      const response = await axios.get(`${API_URL}/organizations/list`);
      if (response.data.success) {
        setOrganizations(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('Failed to load organizations. Please refresh the page.');
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSchoolSubmit = (e) => {
    e.preventDefault();
    if (formData.organizationName) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/teacher/login' : '/auth/teacher/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', 'teacher');
        localStorage.setItem('userData', JSON.stringify(response.data.data.user));
        navigate('/dashboard/teacher');
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
      const response = await axios.post(`${API_URL}/auth/teacher/login`, {
        email: formData.email
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', 'teacher');
        localStorage.setItem('userData', JSON.stringify(response.data.data.user));
        navigate('/dashboard/teacher');
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
          <div className="auth-icon" style={{backgroundColor: '#7c3aed20'}}>
            <span style={{color: '#7c3aed'}}>👨‍🏫</span>
          </div>
          <h1 style={{color: '#7c3aed'}}>Teacher Account</h1>
          <p>{isLogin ? 'Welcome back!' : 'Create your teacher account'}</p>
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

        {!isLogin && step === 1 ? (
          <form onSubmit={handleSchoolSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="step-indicator">Step 1 of 2: Select Your School</div>
            
            <div className="form-group">
              <label>School/Organization *</label>
              {loadingOrgs ? (
                <div className="loading-orgs">Loading schools...</div>
              ) : (
                <select
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your school</option>
                  {organizations.map((org) => (
                    <option key={org._id} value={org.organizationName}>
                      {org.organizationName} ({org.organizationType})
                    </option>
                  ))}
                </select>
              )}
              <small>Select your school from the list. If not found, ask your admin to register first.</small>
            </div>

            <button type="submit" className="submit-btn" disabled={loadingOrgs}>
              Continue to Details →
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            {!isLogin && <div className="step-indicator">Step 2 of 2: Personal Details</div>}

            {!isLogin && (
              <>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Mathematics, Science"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Class Teacher (Grade) *</label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Grade</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Section</label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                    >
                      {[...Array(26)].map((_, i) => {
                        const letter = String.fromCharCode(65 + i);
                        return (
                          <option key={letter} value={letter}>
                            {letter}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </>
            )}

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

            {isLogin && (
              <button
                type="button"
                className="email-login-btn"
                onClick={handleEmailLogin}
                disabled={loading}
              >
                🔐 Quick Login with Email Only
              </button>
            )}

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

            <div className="form-actions">
              {!isLogin && step === 2 && (
                <button type="button" className="back-step-btn" onClick={() => setStep(1)}>
                  ← Back
                </button>
              )}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
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
            }}>
              {isLogin ? 'Register here' : 'Login here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherAuth;