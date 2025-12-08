import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Authentication Pages
import RoleSelection from './pages/RoleSelection';
import OrganizationAuth from './pages/OrganizationAuth';
import TeacherAuth from './pages/TeacherAuth';
import StudentAuth from './pages/StudentAuth';

// Dashboard Pages
import OrganizationDashboard from './pages/OrganizationDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

// Learning Pages
import QuizPage from './pages/QuizPage';
import DisasterInfoPage from './pages/DisasterInfoPage';
import DisasterModules from './pages/DisasterModules';
import LearningPath from './pages/LearningPath';
import GamePage from './pages/GamePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route - Redirect to Auth */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          
          {/* Authentication Routes */}
          <Route path="/auth" element={<RoleSelection />} />
          <Route path="/auth/organization" element={<OrganizationAuth />} />
          <Route path="/auth/teacher" element={<TeacherAuth />} />
          <Route path="/auth/student" element={<StudentAuth />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard/organization" element={<OrganizationDashboard />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          
          {/* Disaster Learning Routes */}
          <Route path="/disaster-modules" element={<DisasterModules />} />
          <Route path="/learning-path/module/:moduleId" element={<LearningPath />} />
          <Route path="/learning-path/disaster/:disasterId" element={<LearningPath />} />
          <Route path="/module/:moduleId/quiz" element={<QuizPage />} />
          <Route path="/quiz/:disasterType" element={<QuizPage />} />
          <Route path="/disaster/:disasterId" element={<DisasterInfoPage />} />
          <Route path="/game/:moduleId" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
