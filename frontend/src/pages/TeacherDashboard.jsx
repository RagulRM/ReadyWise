/**
 * Teacher Dashboard
 * Monitor student progress in assigned class
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [moduleProgressOverview, setModuleProgressOverview] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [modulesModalStudent, setModulesModalStudent] = useState(null);
  const [focusedModuleProgress, setFocusedModuleProgress] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchModuleProgressOverview();
  }, []);

  const fetchModuleProgressOverview = async () => {
    try {
      setLoadingProgress(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/module-progress/teacher/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setModuleProgressOverview(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching module progress:', error);
    } finally {
      setLoadingProgress(false);
    }
  };

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

  const openStudentModulesModal = (student) => {
    setModulesModalStudent(student);
    setFocusedModuleProgress(null);
  };

  const closeStudentModulesModal = () => {
    setModulesModalStudent(null);
    setFocusedModuleProgress(null);
  };

  const getClassLabel = (classInfo) => {
    if (!classInfo) {
      return 'Class info unavailable';
    }

    const { grade, section } = classInfo;

    if (!grade && !section) {
      return 'Class info unavailable';
    }

    if (grade && section) {
      return `Class ${grade}${section}`;
    }

    if (grade) {
      return `Class ${grade}`;
    }

    return `Class ${section}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'N/A';
    }

    const parsedDate = new Date(dateString);
    if (Number.isNaN(parsedDate.getTime())) {
      return 'N/A';
    }

    return parsedDate.toLocaleDateString();
  };

  const formatGender = (gender) => {
    if (!gender) {
      return 'N/A';
    }

    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  const moduleSummaryByStudent = useMemo(() => {
    return moduleProgressOverview.reduce((accumulator, entry) => {
      const studentId = entry.student?._id;
      if (!studentId) {
        return accumulator;
      }

      if (!accumulator[studentId]) {
        accumulator[studentId] = { total: 0, completed: 0 };
      }

      accumulator[studentId].total += 1;
      if (entry.overallComplete || entry.completionPercentage === 100) {
        accumulator[studentId].completed += 1;
      }

      return accumulator;
    }, {});
  }, [moduleProgressOverview]);

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

  const { teacher, students } = dashboardData;
  const moduleEntriesForSelectedStudent = modulesModalStudent
    ? moduleProgressOverview.filter((progress) => progress.student?._id === modulesModalStudent._id)
    : [];
  const focusedModuleQuizScore = focusedModuleProgress?.stepCompletions?.quiz?.score;
  const focusedModuleClassLabel = getClassLabel(focusedModuleProgress?.student?.class);
  const studentProfile = selectedStudent?.student;
  const studentProfileClassLabel = studentProfile ? getClassLabel(studentProfile.class) : 'Class info unavailable';
  const studentProfileName = studentProfile?.name || 'Name unavailable';

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

      <div className="dashboard-content">
        <div className="content-card students-section">
          <h2>Class {teacher.class.grade}{teacher.class.section} - Student Progress</h2>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Student Name</th>
                  <th>Modules Completed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const summary = moduleSummaryByStudent[student._id];
                  const completedModulesCount = summary?.completed ?? student.progress?.modulesCompleted?.length ?? 0;

                  return (
                    <tr
                      key={student._id}
                      className="student-row"
                      role="button"
                      tabIndex={0}
                      onClick={() => openStudentModulesModal(student)}
                      onKeyDown={(event) => {
                        if (['Enter', ' ', 'Spacebar'].includes(event.key)) {
                          event.preventDefault();
                          openStudentModulesModal(student);
                        }
                      }}
                    >
                      <td><strong>{student.rollNumber}</strong></td>
                      <td>
                        <div className="student-name">
                          <span className="avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                          {student.name}
                        </div>
                      </td>
                      <td>{completedModulesCount}</td>
                      <td>
                        <button
                          type="button"
                          className="view-btn"
                          onClick={(event) => {
                            event.stopPropagation();
                            viewStudentDetails(student._id);
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

        {modulesModalStudent && (
          <div className="modal-overlay" onClick={closeStudentModulesModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📚 Module Progress - {modulesModalStudent.name}</h2>
                <button className="close-btn" onClick={closeStudentModulesModal}>×</button>
              </div>
              <div className="modal-body">
                <p className="modal-subtitle">Select a disaster to view detailed module progress for this student.</p>
                {loadingProgress ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading module progress...</p>
                  </div>
                ) : moduleEntriesForSelectedStudent.length > 0 ? (
                  <div className="disaster-progress-list">
                    {moduleEntriesForSelectedStudent.map((progress) => (
                      <button
                        key={progress._id}
                        type="button"
                        className="disaster-progress-card"
                        onClick={() => setFocusedModuleProgress(progress)}
                      >
                        <div className="disaster-progress-header">
                          <h4>{progress.module.name}</h4>
                          <span className="disaster-progress-percentage">{progress.completionPercentage}%</span>
                        </div>
                        <p className="disaster-grade">Grade {progress.module.gradeLevel || 'N/A'}</p>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${progress.completionPercentage}%` }}
                          ></div>
                        </div>
                        <span className="card-cta">View details &gt;</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No module progress data recorded yet for this student.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {focusedModuleProgress && (
          <div className="modal-overlay nested" onClick={() => setFocusedModuleProgress(null)}>
            <div className="modal-content module-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>🎯 {focusedModuleProgress.module.name}</h2>
                <button className="close-btn" onClick={() => setFocusedModuleProgress(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="student-module-card">
                  <div className="student-header">
                    <h4>{focusedModuleProgress.student.name}</h4>
                    <span className="class-badge">
                      {focusedModuleClassLabel}
                    </span>
                  </div>
                  <div className="module-info">
                    <p className="module-name">{focusedModuleProgress.module.name}</p>
                    <span className="grade-level">Grade {focusedModuleProgress.module.gradeLevel}</span>
                  </div>
                  <div className="progress-details">
                    <div className="progress-bar-container">
                      <div className="progress-bar-label">
                        <span>Overall Progress</span>
                        <span className="percentage">{focusedModuleProgress.completionPercentage}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${focusedModuleProgress.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="step-breakdown">
                      <div className={`step-item ${focusedModuleProgress.stepCompletions?.learn?.completed ? 'completed' : ''}`}>
                        <span className="step-icon">📚</span>
                        <span className="step-name">Learn</span>
                      </div>
                      <div className={`step-item ${focusedModuleProgress.stepCompletions?.videos?.completed ? 'completed' : ''}`}>
                        <span className="step-icon">🎥</span>
                        <span className="step-name">Videos</span>
                      </div>
                      <div className={`step-item ${focusedModuleProgress.stepCompletions?.quiz?.completed ? 'completed' : ''}`}>
                        <span className="step-icon">📝</span>
                        <span className="step-name">Quiz</span>
                        {typeof focusedModuleQuizScore === 'number' && (
                          <span className="quiz-score">{focusedModuleQuizScore}/5</span>
                        )}
                      </div>
                      <div className={`step-item ${focusedModuleProgress.stepCompletions?.practice?.completed ? 'completed' : ''}`}>
                        <span className="step-icon">🎯</span>
                        <span className="step-name">Practice</span>
                      </div>
                      <div className={`step-item ${focusedModuleProgress.stepCompletions?.game?.completed ? 'completed' : ''}`}>
                        <span className="step-icon">🎮</span>
                        <span className="step-name">Game</span>
                      </div>
                    </div>
                    {focusedModuleProgress.overallComplete && (
                      <div className="completion-badge">✅ Module Completed</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Student Details Modal */}
      {selectedStudent && studentProfile && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content student-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🧍 {studentProfileName} - Personal Details</h2>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="student-details-header">
                <div className="avatar large">
                  {studentProfileName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{studentProfileName}</h3>
                  <p className="detail-subtitle">{studentProfileClassLabel}</p>
                  <p className="detail-subtitle">Roll No. {studentProfile.rollNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="student-detail-section">
                <h3>Personal Information</h3>
                <div className="student-detail-grid">
                  <div className="student-detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{studentProfile.email || 'N/A'}</span>
                  </div>
                  <div className="student-detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{studentProfile.phone || 'N/A'}</span>
                  </div>
                  <div className="student-detail-item">
                    <span className="detail-label">Date of Birth</span>
                    <span className="detail-value">{formatDate(studentProfile.dateOfBirth)}</span>
                  </div>
                  <div className="student-detail-item">
                    <span className="detail-label">Gender</span>
                    <span className="detail-value">{formatGender(studentProfile.gender)}</span>
                  </div>
                </div>
              </div>

              <div className="student-detail-section">
                <h3>Academic Information</h3>
                <div className="student-detail-grid">
                  <div className="student-detail-item">
                    <span className="detail-label">Class</span>
                    <span className="detail-value">{studentProfileClassLabel}</span>
                  </div>
                  <div className="student-detail-item">
                    <span className="detail-label">Roll Number</span>
                    <span className="detail-value">{studentProfile.rollNumber || 'N/A'}</span>
                  </div>
                  <div className="student-detail-item">
                    <span className="detail-label">Enrollment Date</span>
                    <span className="detail-value">{formatDate(studentProfile.enrollmentDate)}</span>
                  </div>
                </div>
              </div>

              <div className="student-detail-section">
                <h3>Guardian Information</h3>
                <div className="student-detail-grid">
                  <div className="student-detail-item">
                    <span className="detail-label">Parent Phone</span>
                    <span className="detail-value">{studentProfile.parentPhone || 'N/A'}</span>
                  </div>
                  <div className="student-detail-item">
                    <span className="detail-label">Parent Email</span>
                    <span className="detail-value">{studentProfile.parentEmail || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="student-detail-section">
                <h3>Account Activity</h3>
                <div className="student-detail-grid">
                  <div className="student-detail-item">
                    <span className="detail-label">Last Login</span>
                    <span className="detail-value">{formatDate(studentProfile.lastLogin)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;