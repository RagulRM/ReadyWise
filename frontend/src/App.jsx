import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LocationSetup from './pages/LocationSetup';
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
          <Route path="/" element={<HomePage setUser={setUser} />} />
          <Route 
            path="/setup" 
            element={<LocationSetup user={user} setLocationData={setLocationData} />} 
          />
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
