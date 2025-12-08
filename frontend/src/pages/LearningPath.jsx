import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api.config';
import './LearningPath.css';

// Video Player Component with YouTube API support
const VideoPlayer = ({ video, index, moduleId, totalVideos, onVideoEnded }) => {
  const playerRef = useRef(null);
  const isYouTube = video.mediaUrl?.includes('youtube.com') || video.mediaUrl?.includes('youtu.be');
  const getVideoIdentifier = () => {
    const raw = video._id || video.id;
    if (!raw) return `video-${index}`;
    if (typeof raw === 'object') {
      if (raw.$oid) return raw.$oid;
      if (typeof raw.toString === 'function') return raw.toString();
      try {
        return JSON.stringify(raw);
      } catch (error) {
        console.warn('⚠️ Unable to stringify video id object', error);
        return `video-${index}`;
      }
    }
    return String(raw);
  };
  
  const embedUrl = (() => {
    if (!video.mediaUrl) return '';
    if (!isYouTube) return video.mediaUrl;
    try {
      const url = new URL(video.mediaUrl);
      if (url.hostname.includes('youtu.be')) {
        return `https://www.youtube.com/embed/${url.pathname.replace('/', '')}`;
      }
      const videoId = url.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : video.mediaUrl;
    } catch (e) {
      return video.mediaUrl;
    }
  })();

  // Grade level badge color
  const gradeLevelColors = {
    'FOUNDATIONAL': '#4CAF50',
    'BASIC': '#2196F3',
    'INTERMEDIATE': '#FF9800',
    'COMMUNITY': '#9C27B0',
    'ANALYTICAL': '#E91E63'
  };
  const gradeLevelLabels = {
    'FOUNDATIONAL': 'Beginner',
    'BASIC': 'Basic',
    'INTERMEDIATE': 'Intermediate',
    'COMMUNITY': 'Community',
    'ANALYTICAL': 'Advanced'
  };

  const constantVideoId = getVideoIdentifier();
  const playerId = `youtube-player-${constantVideoId}`;

  const handleVideoEnded = async (videoId) => {
    if (!moduleId) {
      console.warn('⚠️ No moduleId - cannot track video progress');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ No auth token - cannot track video progress');
        return;
      }

      const normalizedVideoId = videoId ? String(videoId) : constantVideoId;

      console.log('📹 Video ended:', { videoId: normalizedVideoId, moduleId, totalVideos });
      
      const response = await axios.post(
        `${API_BASE_URL}/module-progress/${moduleId}/video/${normalizedVideoId}`,
        { totalVideos },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Video progress recorded:', response.data);

      const updatedProgress = response.data?.data || response.data;

      if (onVideoEnded) {
        onVideoEnded(updatedProgress);
      }
    } catch (error) {
      console.error('❌ Failed to record video watch:', error.response?.data || error.message);
    }
  };

  // Initialize YouTube player when API is ready
  useEffect(() => {
    if (!isYouTube) return;

    let timeoutId;
    
    console.log('🎬 Initializing YouTube player for:', playerId);
    
    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        const playerElement = document.getElementById(playerId);
        console.log('🔍 Player element found:', !!playerElement, 'Already initialized:', playerElement?.dataset.initialized);
        
        if (playerElement && !playerElement.dataset.initialized) {
          playerElement.dataset.initialized = 'true';
          try {
            // Small delay to ensure iframe is ready
            timeoutId = setTimeout(() => {
              console.log('⏰ Creating YouTube Player instance for:', playerId);
              playerRef.current = new window.YT.Player(playerId, {
                events: {
                  'onReady': (event) => {
                    console.log('✅ YouTube player ready:', playerId);
                  },
                  'onStateChange': (event) => {
                    console.log('🔄 YouTube player state changed:', event.data);
                    if (event.data === 0) { // Video ended
                      console.log('📹 YouTube video ended - calling handleVideoEnded with:', constantVideoId);
                      handleVideoEnded(constantVideoId);
                    }
                  },
                  'onError': (event) => {
                    console.error('❌ YouTube player error:', event.data);
                  }
                }
              });
            }, 500);
          } catch (error) {
            console.error('❌ Error initializing YouTube player:', error);
          }
        }
      } else {
        console.warn('⚠️ YouTube API not ready yet');
      }
    };

    if (window.YT && window.YT.Player) {
      console.log('✅ YouTube API already loaded');
      initPlayer();
    } else {
      console.log('⏳ Waiting for YouTube API to load...');
      // Wait for YouTube API to load
      const originalCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        console.log('✅ YouTube API loaded via callback');
        if (originalCallback) originalCallback();
        initPlayer();
      };
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      // Cleanup player on unmount
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying YouTube player:', error);
        }
      }
    };
  }, []);

  return (
    <div className="video-card">
      <div className="video-player">
        {isYouTube ? (
          <iframe
            id={playerId}
            src={`${embedUrl}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video 
            controls 
            src={embedUrl}
            onEnded={() => handleVideoEnded(constantVideoId)}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="video-meta">
        <div className="video-header">
          <h4>{video.title}</h4>
          {video.gradeLevel && (
            <span 
              className="grade-badge"
              style={{ backgroundColor: gradeLevelColors[video.gradeLevel] || '#666' }}
            >
              {gradeLevelLabels[video.gradeLevel] || video.gradeLevel}
            </span>
          )}
        </div>
        <p>{video.description || 'Watch and follow the safety steps shown.'}</p>
        <div className="video-info">
          {video.duration && <span className="video-duration">⏱️ {video.duration} min</span>}
          {video.ageGroup && <span className="video-age">👤 Ages {video.ageGroup}</span>}
        </div>
      </div>
    </div>
  );
};

function LearningPath() {
  const { moduleId, disasterId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [moduleProgress, setModuleProgress] = useState(null);
  const [markingVideosComplete, setMarkingVideosComplete] = useState(false);
  const learnStepCompleted = useRef(false);

  const videoLessons = module?.lessons?.filter((lesson) => lesson.mediaType === 'video' && lesson.mediaUrl) || [];
  const videoProgress = moduleProgress?.stepCompletions?.videos || {};
  const videosWatchedCount = videoProgress?.watchedVideos?.length || 0;
  const totalVideoCount = videoLessons.length;
  const videosCompleted = Boolean(videoProgress?.completed);

  useEffect(() => {
    loadModuleData();
    loadModuleProgress();
  }, [moduleId, disasterId]);

  // Reload progress when component mounts (e.g., navigating back from game/quiz)
  useEffect(() => {
    console.log('🔄 LearningPath mounted, reloading progress');
    if (moduleId) {
      loadModuleProgress();
    }
    
    // Also reload when window gains focus (switching tabs)
    const handleFocus = () => {
      console.log('👁️ Window focused, reloading progress');
      if (moduleId) {
        loadModuleProgress();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Auto-complete Learning Content step when viewed
  useEffect(() => {
    if (currentStep === 0 && module && moduleId && !learnStepCompleted.current) {
      learnStepCompleted.current = true;
      completeStep('learn');
    }
  }, [currentStep, module, moduleId]);

  // Auto-complete Interactive Learning step when viewed
  useEffect(() => {
    if (currentStep === 3 && module && moduleId) {
      completeStep('practice');
    }
  }, [currentStep, module, moduleId]);

  const loadModuleProgress = async () => {
    if (!moduleId) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      console.log('🔄 Loading module progress for moduleId:', moduleId);

      const response = await axios.get(`${API_BASE_URL}/module-progress/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Progress loaded:', response.data.data);
      console.log('📊 Step completions:', response.data.data?.stepCompletions);

      const progressData = response.data.data;
      setModuleProgress(progressData);
    } catch (error) {
      console.error('❌ Failed to load progress:', error);
    }
  };

  const completeStep = async (stepName, additionalData = {}) => {
    if (!moduleId) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.post(
        `${API_BASE_URL}/module-progress/${moduleId}/step/${stepName}`,
        additionalData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reload progress after completion
      loadModuleProgress();
    } catch (error) {
      console.error('Failed to complete step:', error);
    }
  };

  const handleVideoProgressUpdate = (updatedProgress) => {
    if (updatedProgress?.stepCompletions) {
      const videoProgress = updatedProgress.stepCompletions.videos;
      console.log('📈 Setting progress from video update:', videoProgress);
      setModuleProgress(updatedProgress);
    } else {
      console.log('🔄 No progress in video update response, reloading manually');
      loadModuleProgress();
    }
  };

  const handleManualVideosComplete = async () => {
    if (!moduleId || markingVideosComplete) return;

    try {
      setMarkingVideosComplete(true);

      const videoProgress = moduleProgress?.stepCompletions?.videos;
      const watchedCount = videoProgress?.watchedVideos?.length || 0;

      await completeStep('videos', {
        manual: true,
        watchedCount,
        totalVideos: videoLessons.length
      });
    } catch (error) {
      console.error('❌ Failed to manually mark videos complete:', error);
    } finally {
      setMarkingVideosComplete(false);
    }
  };

  const loadModuleData = async () => {
    try {
      const token = localStorage.getItem('token');
      let response;

      if (moduleId) {
        if (!token) {
          throw new Error('AUTH_REQUIRED');
        }

        response = await axios.get(`${API_BASE_URL}/disasters/module/${moduleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (disasterId) {
        response = await axios.get(`${API_BASE_URL}/disasters/${disasterId}`);
      } else {
        throw new Error('MODULE_NOT_SPECIFIED');
      }

      const moduleData = response.data.data || response.data;

      if (!moduleData) {
        throw new Error('MODULE_DATA_EMPTY');
      }

      const normalizedModule = moduleData.module
        ? { ...moduleData.module, regionalContent: moduleData.regionalContent }
        : moduleData;

      setModule(normalizedModule);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load module:', error);
      setLoading(false);

      if (error.message === 'AUTH_REQUIRED' || error.response?.status === 401) {
        alert('Session expired. Please log in to access this content.');
        navigate('/');
      } else if (error.response?.status === 404) {
        alert('Learning module not found. Please try a different module.');
        navigate('/disaster-modules');
      } else {
        alert('Failed to load learning content. Please check your connection and try again.');
        navigate('/disaster-modules');
      }
    }
  };

  const steps = [
    { id: 0, title: 'Learn', icon: '📚', description: 'Understand the basics' },
    { id: 1, title: 'Videos', icon: '🎥', description: 'Watch safety explainers' },
    { id: 2, title: 'Quiz', icon: '📝', description: 'Test your knowledge' },
    { id: 3, title: 'Practice', icon: '🎯', description: 'Apply what you learned' },
    { id: 4, title: 'Game', icon: '🎮', description: 'Interactive scenarios' }
  ];

  if (loading) {
    return (
      <div className="learning-path">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading learning content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!module && !loading) {
    return (
      <div className="learning-path">
        <div className="error-container">
          <h2>Content Not Found</h2>
          <p>The requested learning module could not be found.</p>
          <p>Module ID: {moduleId || 'Not provided'}</p>
          <p>Disaster ID: {disasterId || 'Not provided'}</p>
          <button className="btn-primary" onClick={() => navigate('/disaster-modules')}>
            Back to Modules
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-path">
      {/* Header */}
      <div className="learning-header">
        <button className="back-button" onClick={() => navigate('/disaster-modules')}>← Back to Modules</button>
        <div className="header-content">
          <div className="breadcrumb">
            <span onClick={() => navigate('/dashboard')}>Dashboard</span>
            <span className="separator">›</span>
            <span onClick={() => navigate('/disaster-modules')}>Modules</span>
            <span className="separator">›</span>
            <span>{module?.name || 'Loading...'}</span>
          </div>
          <h1 className="module-title">{module?.name || 'Loading Module...'}</h1>
          <p className="module-description">{module?.description || 'Loading description...'}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="progress-container">
        <div className="progress-steps">
          {steps.map((step) => {
            // Map step IDs to progress keys
            const progressKey = ['learn', 'videos', 'quiz', 'practice', 'game'][step.id];
            const isCompleted = moduleProgress?.stepCompletions?.[progressKey]?.completed || false;
            
            return (
              <div
                key={step.id}
                className={`step ${currentStep === step.id ? 'active' : ''} ${
                  isCompleted ? 'completed' : ''
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className="step-icon">{step.icon}</div>
                <div className="step-info">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {isCompleted && <div className="step-check">✓</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="content-area">
        {/* Learning Step */}
        {currentStep === 0 && (
          <div className="step-content learning-content">
            <h2 className="step-main-title">📚 Learning Content</h2>
            <p className="step-intro">Understand the key concepts and safety measures</p>
            
            <div className="stacked-content">
              <div className="content-card">
                <h3>📋 Safety Steps</h3>
                <div className="safety-steps-grid">
                  {module?.safetySteps && module.safetySteps.length > 0 ? (
                    module.safetySteps.map((step, idx) => (
                      <div key={idx} className="safety-step-card">
                        <div className="step-number">{idx + 1}</div>
                        <div className="step-icon">{step?.icon || '🔸'}</div>
                        <div className="step-content">
                          <h4>{step?.title || `Step ${idx + 1}`}</h4>
                          <p>{step?.action || 'Safety step description'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="safety-step-card">
                      <div className="step-number">1</div>
                      <div className="step-icon">🛡️</div>
                      <div className="step-content">
                        <h4>Stay Alert</h4>
                        <p>Be aware of your surroundings and potential dangers</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Step */}
        {currentStep === 1 && (
          <div className="step-content video-content">
            <h2 className="step-main-title">🎥 Video-Based Learning</h2>
            <p className="step-intro">Watch quick, age-appropriate videos to see the safety actions in motion</p>

            <div className="stacked-content">
              <div className="content-card">
                <h3>▶️ Videos selected for your grade level</h3>
                <p>These videos are curated for your age group. Watch each one to learn important safety skills!</p>

                {videoLessons.length > 0 ? (
                  <>
                    <div className="video-grid">
                      {videoLessons.map((video, index) => (
                        <VideoPlayer
                          key={video._id || video.title || index}
                          video={video}
                          index={index}
                          moduleId={moduleId}
                          totalVideos={videoLessons.length}
                          onVideoEnded={handleVideoProgressUpdate}
                        />
                      ))}
                    </div>

                    <div className="video-progress-footer">
                      <div className="video-progress-summary">
                        {`${videosWatchedCount} of ${totalVideoCount} videos watched${videosCompleted ? ' - Completed' : ''}`}
                      </div>
                      <button
                        className="btn-primary"
                        onClick={handleManualVideosComplete}
                        disabled={videosCompleted || markingVideosComplete}
                      >
                        {markingVideosComplete
                          ? 'Marking...'
                          : videosCompleted
                            ? 'Videos Marked Complete'
                            : 'Mark Videos as Complete'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🎞️</div>
                    <h4>Video lessons coming soon</h4>
                    <p>We are adding safety walkthrough videos for this disaster. Meanwhile, review the learning content above.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quiz Step */}
        {currentStep === 2 && (
          <div className="step-content quiz-content">
            <h2 className="step-main-title">📝 Quiz-Based Learning</h2>
            <p className="step-intro">Test and reinforce your knowledge through interactive quizzes tailored to your grade level</p>
            
            <div className="stacked-content">
              {/* Quiz Overview */}
              <div className="content-card">
                <h3>📊 Personalized Quiz Ready</h3>
                <p>Your quiz has been automatically customized based on your grade level for the best learning experience.</p>
                <div className="quiz-stats-simplified">
                  <div className="quiz-stat-item">
                    <span className="stat-icon">❓</span>
                    <div className="stat-details">
                      <span className="stat-value">5</span>
                      <span className="stat-label">Questions</span>
                    </div>
                  </div>
                  <div className="quiz-stat-item">
                    <span className="stat-icon">🎯</span>
                    <div className="stat-details">
                      <span className="stat-value">Auto</span>
                      <span className="stat-label">Grade Level</span>
                    </div>
                  </div>
                  <div className="quiz-stat-item">
                    <span className="stat-icon">📚</span>
                    <div className="stat-details">
                      <span className="stat-value">Smart</span>
                      <span className="stat-label">Difficulty</span>
                    </div>
                  </div>
                </div>
                
                <div className="quiz-features">
                  <h4>✨ What makes this quiz special?</h4>
                  <ul className="feature-list">
                    <li>📈 Questions matched to your grade level</li>
                    <li>🧠 Adaptive difficulty based on your class</li>
                    <li>💡 Detailed explanations for each answer</li>
                    <li>🏆 Grade-appropriate feedback and scoring</li>
                  </ul>
                </div>
                
                <button 
                  className="btn-primary btn-large"
                  onClick={() => {
                    if (moduleId) {
                      navigate(`/module/${moduleId}/quiz`);
                    } else {
                      navigate(`/quiz/${disasterId}`);
                    }
                  }}
                >
                  {moduleProgress?.stepCompletions?.quiz?.completed 
                    ? '🔄 Retake Quiz →' 
                    : 'Start Your Personalized Quiz →'
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Learning Step */}
        {currentStep === 3 && (
          <div className="step-content interactive-content">
            <h2 className="step-main-title">🎯 Interactive Learning</h2>
            <p className="step-intro">Engage with hands-on activities and real-world scenarios</p>
            
            <div className="stacked-content">
              <div className="content-card">
                <h3>🔍 Safety Steps Exploration</h3>
                <p>Learn step-by-step safety procedures</p>
                <div className="lessons-list">
                  {module?.safetySteps && module.safetySteps.length > 0 ? (
                    module.safetySteps.slice(0, 3).map((step, idx) => (
                      <div key={idx} className="lesson-item">
                        <div className="lesson-number">{idx + 1}</div>
                        <div className="lesson-icon">{step?.icon || '🔸'}</div>
                        <div className="lesson-text">{step?.action || 'Safety procedure'}</div>
                      </div>
                    ))
                  ) : (
                    <div className="lesson-item">
                      <div className="lesson-number">1</div>
                      <div className="lesson-icon">🛡️</div>
                      <div className="lesson-text">Interactive safety procedures will be available here</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="content-card">
                <h3>💡 Interactive Scenarios</h3>
                <div className="scenario-grid">
                  <div className="scenario-card">
                    <span className="scenario-icon">🏠</span>
                    <h4>At Home</h4>
                    <p>Learn what to do when disaster strikes at home</p>
                  </div>
                  <div className="scenario-card">
                    <span className="scenario-icon">🏫</span>
                    <h4>At School</h4>
                    <p>Emergency procedures in educational settings</p>
                  </div>
                  <div className="scenario-card">
                    <span className="scenario-icon">🌆</span>
                    <h4>In Public</h4>
                    <p>Stay safe in public spaces during emergencies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Step */}
        {currentStep === 4 && (
          <div className="step-content game-content">
            <h2 className="step-main-title">🎮 Interactive Game</h2>
            <p className="step-intro">Test your skills in realistic disaster scenarios</p>
            
            <div className="stacked-content">
              <div className="content-card">
                <h3>🚨 Emergency Response Game</h3>
                <p>Put your knowledge to the test in interactive emergency scenarios</p>
                
                <div className="game-features">
                  <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <div>
                      <h4>Realistic Scenarios</h4>
                      <p>Experience emergency situations in a safe environment</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⏱️</span>
                    <div>
                      <h4>Time Challenges</h4>
                      <p>Make quick decisions under pressure</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🏆</span>
                    <div>
                      <h4>Score & Progress</h4>
                      <p>Track your performance and improvement</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="btn-primary btn-large"
                  onClick={() => {
                    if (moduleId) {
                      // Navigate to game for this specific module
                      navigate(`/game/${moduleId}`);
                    } else {
                      // Navigate to general game
                      navigate('/game');
                    }
                  }}
                >
                  {moduleProgress?.stepCompletions?.game?.completed 
                    ? '🔄 Play Again →' 
                    : 'Start Emergency Game →'
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="navigation-footer">
        <button
          className="nav-btn prev"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          ← Previous
        </button>
        <div className="progress-indicator">
          Step {currentStep + 1} of {steps.length}
        </div>
        <button
          className="nav-btn next"
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default LearningPath;