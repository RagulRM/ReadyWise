import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getQuiz, submitQuiz } from '../services/api';
import API_BASE_URL from '../config/api.config';
import './QuizPage.css';

function QuizPage({ user }) {
  const { disasterType, moduleId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [disasterType, moduleId]);

  const loadQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      let response;
      
      if (moduleId) {
        // Module-based quiz (grade-based automatically)
        const result = await axios.get(`${API_BASE_URL}/disasters/module/${moduleId}/quiz`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        response = result.data;
        
        // Handle nested response structure
        if (response.data) {
          response = response.data;
        }
        if (response.quiz) {
          response = response.quiz;
        }
      } else if (disasterType) {
        // Legacy disaster type quiz
        response = await getQuiz(disasterType);
      }
      
      // Ensure questions array exists
      if (!response || !response.questions || response.questions.length === 0) {
        throw new Error('No quiz questions available');
      }
      
      setQuiz(response);
    } catch (error) {
      console.error('Failed to load quiz:', error);
      alert('Failed to load quiz. Please try again.');
      navigate('/disaster-modules');
    }
  };

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswer(optionId);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      alert('Please select an answer!');
      return;
    }

    setAnswers([...answers, selectedAnswer]);
    setSelectedAnswer(null);

    const totalQuestions = quiz.questions?.length || quiz.totalQuestions || 0;
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeQuiz([...answers, selectedAnswer]);
    }
  };

  const completeQuiz = async (finalAnswers) => {
    try {
      const token = localStorage.getItem('token');
      let response;
      
      if (moduleId) {
        // Submit module-based quiz (automatic grade level)
        const axios = (await import('axios')).default;
        const submissionData = {
          answers: finalAnswers.map((answer, index) => ({
            questionId: quiz.questions[index]?._id,
            selectedOption: answer
          }))
        };
        
        const result = await axios.post(
          `${API_BASE_URL}/disasters/module/${moduleId}/quiz/submit`,
          submissionData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        response = result.data;

        // Record quiz completion if score is 4/5 or higher
        const resultData = response.data || response;
        
        // Convert percentage to out of 5 scale for progress tracking
        // Backend returns: score (raw points), totalPoints (max points), percentage (0-100)
        let scoreOutOf5;
        if (resultData.percentage !== undefined) {
          // Use percentage to calculate out of 5
          scoreOutOf5 = Math.round((resultData.percentage / 100) * 5);
        } else if (resultData.score !== undefined && resultData.totalPoints !== undefined) {
          // Calculate percentage from raw score
          const calculatedPercentage = (resultData.score / resultData.totalPoints) * 100;
          scoreOutOf5 = Math.round((calculatedPercentage / 100) * 5);
        } else if (resultData.correctAnswers !== undefined) {
          scoreOutOf5 = resultData.correctAnswers;
        } else {
          scoreOutOf5 = 0;
        }
        
        console.log('Quiz completion tracking:', { 
          percentage: resultData.percentage, 
          score: resultData.score, 
          totalPoints: resultData.totalPoints,
          scoreOutOf5,
          willTrack: scoreOutOf5 >= 4
        });
        
        if (scoreOutOf5 >= 4) {
          await axios.post(
            `${API_BASE_URL}/module-progress/${moduleId}/step/quiz`,
            { score: scoreOutOf5 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('✅ Quiz progress recorded successfully');
        } else {
          console.log(`ℹ️ Score ${scoreOutOf5}/5 is below threshold (need 4/5 to pass)`);
        }
      } else {
        // Legacy quiz submission
        response = await submitQuiz({
          disasterType,
          answers: finalAnswers,
          userId: user?.id
        });
      }
      
      setResult(response);
      setQuizCompleted(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  if (!quiz) {
    return (
      <div className="quiz-page">
        <div className="loading">Loading quiz... 📝</div>
      </div>
    );
  }

  if (quizCompleted && result) {
    const resultData = result.data || result; // Handle nested response structure
    
    return (
      <div className="quiz-page">
        <div className="container">
          <div className="card result-card fade-in">
            <h1>✅ Quiz Complete!</h1>
            
            <div className="grade-level-info">
              <span className="grade-badge">📚 Grade Level: {resultData.gradeLevel || 'Auto-Selected'}</span>
              {resultData.gradeFeedback && (
                <div className="grade-feedback">
                  {resultData.gradeFeedback}
                </div>
              )}
            </div>
            
            <div className="quiz-score">
              <div className="score-circle">
                <div className="score-number">{resultData.percentage || result.percentage}%</div>
                <div className="score-details">
                  {resultData.score || result.score} / {resultData.totalPoints || result.totalQuestions} Points
                </div>
              </div>
            </div>

            <div className="result-message">
              <p>{resultData.passed ? '🎉 Great job! You passed!' : '🔄 Keep practicing to improve!'}</p>
              {result.message && <p>{result.message}</p>}
            </div>

            {result.badge && (
              <div className="badge-display">
                <span className="badge-large">{result.badge.toUpperCase()}</span>
              </div>
            )}

            <div className="answers-review">
              <h3>📋 Review Your Answers:</h3>
              {result.results?.map((item, idx) => (
                <div key={idx} className={`answer-item ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="answer-header">
                    <span className="question-num">Q{idx + 1}</span>
                    <span className={`answer-status ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                      {item.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                    </span>
                  </div>
                  <p className="question-text">{item.question}</p>
                  {!item.isCorrect && (
                    <div className="correct-answer-info">
                      <strong>Correct Answer:</strong> Option {item.correctAnswer.toUpperCase()}
                    </div>
                  )}
                  <p className="explanation">{item.explanation}</p>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  if (moduleId) {
                    navigate(`/learning-path/module/${moduleId}`);
                  } else {
                    navigate('/disaster-modules');
                  }
                }}
              >
                Back to Module 📚
              </button>
              <button 
                className="btn btn-success"
                onClick={() => window.location.reload()}
              >
                Retake Quiz 🔄
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions?.[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <div className="quiz-page">
        <div className="loading">Loading question... 📝</div>
      </div>
    );
  }

  const totalQuestions = quiz.questions?.length || quiz.totalQuestions || 0;
  const quizTitle = quiz.disasterType || disasterType || 'Safety';

  return (
    <div className="quiz-page">
      <button className="back-button" onClick={() => moduleId ? navigate(`/learning-path/module/${moduleId}`) : navigate('/disaster-modules')}>← Back to Module</button>
      <div className="quiz-header">
        <h2>{quizTitle.charAt(0).toUpperCase() + quizTitle.slice(1)} Safety Quiz</h2>
        <div className="quiz-info">
          <div className="grade-level-badge">
            📚 Grade Level: Auto-Selected
          </div>
          <div className="quiz-progress">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="card question-card fade-in">
          <div className="question-number">
            Question {currentQuestionIndex + 1}
          </div>

          <h3 className="question-text">{currentQuestion.question}</h3>

          <div className="options-list">
            {currentQuestion.options?.map((option, idx) => (
              <button
                key={option.id || idx}
                className={`option-item ${selectedAnswer === (option.id || idx) ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(option.id || idx)}
              >
                <div className="option-icon">{option.icon || '📌'}</div>
                <div className="option-content">
                  <span className="option-label">
                    Option {option.id ? option.id.toUpperCase() : String.fromCharCode(65 + idx)}
                  </span>
                  <span className="option-text">{option.text}</span>
                </div>
                {selectedAnswer === (option.id || idx) && (
                  <div className="selected-indicator">✓</div>
                )}
              </button>
            ))}
          </div>

          <button 
            className="btn btn-primary btn-large"
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
          >
            {currentQuestionIndex + 1 === totalQuestions ? 'Submit Quiz ✅' : 'Next Question →'}
          </button>

          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            >
              {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
