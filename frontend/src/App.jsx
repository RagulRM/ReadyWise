import React, { useState } from 'react';
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

// Old Pages (Legacy - to be integrated)
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import GamePage from './pages/GamePage';
import QuizPage from './pages/QuizPage';
import DisasterInfoPage from './pages/DisasterInfoPage';
import ProgressPage from './pages/ProgressPage';

function App() {
  const [user, setUser] = useState(null);
  const [locationData, setLocationData] = useState(null);

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
          
          {/* Legacy Routes */}
          <Route path="/home" element={<HomePage setUser={setUser} />} />
          <Route 
            path="/dashboard" 
            element={<Dashboard user={user} locationData={locationData} />} 
          />
          <Route path="/game/:gameId" element={<GamePage user={user} />} />
          <Route path="/quiz/:disasterType" element={<QuizPage user={user} />} />
          <Route path="/disaster/:disasterId" element={<DisasterInfoPage />} />
          <Route path="/progress" element={<ProgressPage user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
