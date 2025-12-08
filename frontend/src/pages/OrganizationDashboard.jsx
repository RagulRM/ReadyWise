/**
 * Organization Dashboard
 * Admin dashboard for monitoring teachers and students
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrganizationDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherStudents, setTeacherStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [teacherDetail, setTeacherDetail] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/organization`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      if (error.response?.status === 401) {
        navigate('/auth/organization');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const handleTeacherClick = async (teacher) => {
    setSelectedTeacher(teacher);
    setLoadingStudents(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/organizations/teacher/${teacher._id}/students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setTeacherStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching teacher students:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const closeStudentModal = () => {
    setSelectedTeacher(null);
    setTeacherStudents([]);
  };

  const openTeacherDetails = (event, teacher) => {
    event.stopPropagation();
    setTeacherDetail(teacher);
  };

  const closeTeacherDetails = () => {
    setTeacherDetail(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Not provided';
    }

    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) {
      return 'Not provided';
    }

    return parsed.toLocaleDateString();
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

  const { organization, stats, teachers, studentsByClass } = dashboardData;

  return (
    <div className="org-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🏫 {organization.name}</h1>
            <p className="location">
              📍 {organization.location.city}, {organization.location.state}
            </p>
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
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <h3>{stats.totalTeachers}</h3>
            <p>Total Teachers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏛️</div>
          <div className="stat-content">
            <h3>{stats.totalClasses}</h3>
            <p>Total Classes</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="teachers-section">
          <h2>Teachers & Class Management</h2>
          <div className="teachers-table-container">
            <table className="teachers-table">
              <thead>
                <tr>
                  <th>Teacher Name</th>
                  <th>Class</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr 
                    key={teacher._id} 
                    onClick={() => handleTeacherClick(teacher)}
                    style={{ cursor: 'pointer' }}
                    className="teacher-row"
                  >
                    <td>
                      <div className="teacher-name">
                        <span className="avatar">
                          {teacher.name.charAt(0).toUpperCase()}
                        </span>
                        {teacher.name}
                      </div>
                    </td>
                    <td>
                      <span className="class-badge">
                        Class {teacher.classTeacher.grade}{teacher.classTeacher.section}
                      </span>
                    </td>
                    <td>{teacher.email}</td>
                    <td>
                      <button
                        type="button"
                        className="view-btn"
                        onClick={(event) => openTeacherDetails(event, teacher)}
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

        <div className="classes-section">
          <h2>Students by Class</h2>
          <div className="classes-grid">
            {studentsByClass.map((classData) => (
              <div key={`${classData._id.grade}-${classData._id.section}`} className="class-card">
                <div className="class-header">
                  <h3>Class {classData._id.grade}{classData._id.section}</h3>
                  <span className="student-count">{classData.count} students</span>
                </div>
                <div className="class-teacher">
                  {teachers.find(t => 
                    t.classTeacher.grade === classData._id.grade && 
                    t.classTeacher.section === classData._id.section
                  )?.name || 'No teacher assigned'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student List Modal */}
      {selectedTeacher && (
        <div className="modal-overlay" onClick={closeStudentModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Students under {selectedTeacher.name}</h2>
              <button className="close-btn" onClick={closeStudentModal}>×</button>
            </div>
            
            <div className="modal-body">
              <p className="teacher-info">
                <strong>Subject:</strong> {selectedTeacher.subject} | 
                <strong> Class:</strong> {selectedTeacher.classTeacher.grade}{selectedTeacher.classTeacher.section}
              </p>

              {loadingStudents ? (
                <div className="loading-students">
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading students...</p>
                  </div>
                </div>
              ) : teacherStudents.length === 0 ? (
                <div className="no-students">
                  <p>No students assigned to this teacher yet.</p>
                </div>
              ) : (
                <div className="students-table-container">
                  <table className="students-table">
                    <thead>
                      <tr>
                        <th>Roll Number</th>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Class</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherStudents.map((student) => (
                        <tr key={student._id}>
                          <td><strong>{student.rollNumber}</strong></td>
                          <td>
                            <div className="student-name">
                              <span className="avatar-small">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                              {student.name}
                            </div>
                          </td>
                          <td>{student.email}</td>
                          <td>
                            <span className="class-badge-small">
                              {student.class.grade}{student.class.section}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${student.isActive ? 'active' : 'inactive'}`}>
                              {student.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="student-count-footer">
                    Total Students: <strong>{teacherStudents.length}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {teacherDetail && (
        <div className="modal-overlay" onClick={closeTeacherDetails}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>👩‍🏫 {teacherDetail.name} - Profile</h2>
              <button className="close-btn" onClick={closeTeacherDetails}>×</button>
            </div>
            <div className="modal-body">
              <div className="student-detail-section">
                <div className="student-details-header">
                  <div className="avatar large">
                    {teacherDetail.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{teacherDetail.name}</h3>
                    <p className="detail-subtitle">Subject: {teacherDetail.subject || 'Not provided'}</p>
                    <p className="detail-subtitle">
                      Class Teacher: Class {teacherDetail.classTeacher?.grade ?? 'N/A'}
                      {teacherDetail.classTeacher?.section ?? ''}
                    </p>
                  </div>
                </div>

                <div className="student-detail-section">
                  <h3>Contact Information</h3>
                  <div className="student-detail-grid">
                    <div className="student-detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{teacherDetail.email}</span>
                    </div>
                    <div className="student-detail-item">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{teacherDetail.phone || 'Not provided'}</span>
                    </div>
                    <div className="student-detail-item">
                      <span className="detail-label">Date of Joining</span>
                      <span className="detail-value">{formatDate(teacherDetail.dateOfJoining)}</span>
                    </div>
                    <div className="student-detail-item">
                      <span className="detail-label">Last Login</span>
                      <span className="detail-value">{formatDate(teacherDetail.lastLogin)}</span>
                    </div>
                  </div>
                </div>

                <div className="student-detail-section">
                  <h3>Professional Details</h3>
                  <div className="student-detail-grid">
                    <div className="student-detail-item">
                      <span className="detail-label">Qualification</span>
                      <span className="detail-value">{teacherDetail.qualification || 'Not provided'}</span>
                    </div>
                    <div className="student-detail-item">
                      <span className="detail-label">Experience (Years)</span>
                      <span className="detail-value">{typeof teacherDetail.experience === 'number' ? teacherDetail.experience : 'Not provided'}</span>
                    </div>
                    <div className="student-detail-item">
                      <span className="detail-label">Account Status</span>
                      <span className="detail-value">{teacherDetail.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="student-detail-item">
                      <span className="detail-label">Email Verified</span>
                      <span className="detail-value">{teacherDetail.emailVerified ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {teacherDetail.bio && (
                  <div className="student-detail-section">
                    <h3>About</h3>
                    <div className="student-detail-item">
                      <span className="detail-value">{teacherDetail.bio}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationDashboard;