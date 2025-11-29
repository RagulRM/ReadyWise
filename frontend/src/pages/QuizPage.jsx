import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuiz } from '../services/api';
import './QuizPage.css';

function QuizPage({ user }) {
  const { disasterType } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [disasterType]);

  const loadQuiz = async () => {
    try {
      const response = await getQuiz(disasterType);
      setQuiz(response);
    } catch (error) {
      console.error('Failed to load quiz:', error);
      alert('Failed to load quiz. Please try again.');
      navigate('/dashboard');
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

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeQuiz([...answers, selectedAnswer]);
    }
  };

  const completeQuiz = async (finalAnswers) => {
    try {
      const response = await submitQuiz({
        disasterType,
        answers: finalAnswers,
        userId: user?.id
      });
      
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
    return (
      <div className="quiz-page">
        <div className="container">
          <div className="card result-card fade-in">
            <h1>✅ Quiz Complete!</h1>
            
            <div className="quiz-score">
              <div className="score-circle">
                <div className="score-number">{result.percentage}%</div>
                <div className="score-details">
                  {result.score} / {result.totalQuestions} Correct
                </div>
              </div>
            </div>

            <div className="result-message">
              <p>{result.message}</p>
            </div>

            {result.badge && (
              <div className="badge-display">
                <span className="badge-large">{result.badge.toUpperCase()}</span>
              </div>
            )}

            <div className="answers-review">
              <h3>📋 Review Your Answers:</h3>
              {result.results.map((item, idx) => (
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
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard 🏠
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

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h2>{disasterType.charAt(0).toUpperCase() + disasterType.slice(1)} Safety Quiz</h2>
        <div className="quiz-progress">
          Question {currentQuestionIndex + 1} of {quiz.totalQuestions}
        </div>
      </div>

      <div className="container">
        <div className="card question-card fade-in">
          <div className="question-number">
            Question {currentQuestionIndex + 1}
          </div>

          <h3 className="question-text">{currentQuestion.question}</h3>

          <div className="options-list">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                className={`option-item ${selectedAnswer === option.id ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(option.id)}
              >
                <div className="option-icon">{option.icon}</div>
                <div className="option-content">
                  <span className="option-label">Option {option.id.toUpperCase()}</span>
                  <span className="option-text">{option.text}</span>
                </div>
                {selectedAnswer === option.id && (
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
            {currentQuestionIndex + 1 === quiz.totalQuestions ? 'Submit Quiz ✅' : 'Next Question →'}
          </button>

          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.totalQuestions) * 100}%` }}
            >
              {Math.round(((currentQuestionIndex + 1) / quiz.totalQuestions) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
