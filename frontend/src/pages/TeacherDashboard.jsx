/**
 * Teacher Dashboard
 * Monitor student progress in assigned class
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/teacher`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      if (error.response?.status === 401) {
        navigate('/auth/teacher');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const viewStudentDetails = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/teacher/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSelectedStudent(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
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

  const { teacher, stats, students } = dashboardData;

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header teacher-header">
        <div className="header-content">
          <div className="header-left">
            <h1>👨‍🏫 {teacher.name}</h1>
            <p className="subtitle">
              {teacher.subject} Teacher | Class {teacher.class.grade}{teacher.class.section}
            </p>
            <p className="organization">{teacher.organization.organizationName}</p>
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
          <div className="stat-icon teacher-icon">👨‍🎓</div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon teacher-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.activeStudents}</h3>
            <p>Active Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon teacher-icon">📊</div>
          <div className="stat-content">
            <h3>{Math.round(stats.averageScore)}</h3>
            <p>Average Score</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon teacher-icon">🎯</div>
          <div className="stat-content">
            <h3>{Math.round(stats.completionRate)}%</h3>
            <p>Completion Rate</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="students-section">
          <h2>Class {teacher.class.grade}{teacher.class.section} - Student Progress</h2>
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Total Score</th>
                  <th>Badges</th>
                  <th>Modules</th>
                  <th>Quizzes</th>
                  <th>Games</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td><strong>{student.rollNumber}</strong></td>
                    <td>
                      <div className="student-name">
                        <span className="avatar">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                        {student.name}
                      </div>
                    </td>
                    <td>{student.email}</td>
                    <td><strong className="score">{student.progress?.totalScore || 0}</strong></td>
                    <td>
                      <span className="badge-count">
                        🏆 {student.progress?.badges?.length || 0}
                      </span>
                    </td>
                    <td>{student.progress?.modulesCompleted?.length || 0}</td>
                    <td>{student.progress?.quizzesCompleted?.length || 0}</td>
                    <td>{student.progress?.gamesCompleted?.length || 0}</td>
                    <td>
                      <span className={`status-badge ${student.isActive ? 'active' : 'inactive'}`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="view-btn"
                        onClick={() => viewStudentDetails(student._id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📊 {selectedStudent.student.name} - Detailed Progress</h2>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="student-info">
                <p><strong>Class:</strong> {selectedStudent.student.class.grade}{selectedStudent.student.class.section}</p>
                <p><strong>Roll Number:</strong> {selectedStudent.student.rollNumber}</p>
              </div>
              <div className="progress-summary">
                <h3>Progress Summary</h3>
                <p>Total Score: <strong>{selectedStudent.progress.totalScore}</strong></p>
                <p>Badges Earned: <strong>{selectedStudent.progress.badges?.length || 0}</strong></p>
              </div>
              {selectedStudent.progressDetails && selectedStudent.progressDetails.length > 0 && (
                <div className="recent-activities">
                  <h3>Recent Activities</h3>
                  <ul>
                    {selectedStudent.progressDetails.slice(0, 5).map((activity, index) => (
                      <li key={index}>
                        {activity.activityType} - Score: {activity.score} 
                        ({new Date(activity.completedAt).toLocaleDateString()})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;