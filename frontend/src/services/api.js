import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Location API
export const getDisastersByLocation = async (locationData) => {
  const response = await api.post('/location/disasters', locationData);
  return response.data;
};

export const getStates = async () => {
  const response = await api.get('/location/states');
  return response.data;
};

// Disaster API
export const getAllDisasters = async () => {
  const response = await api.get('/disasters');
  return response.data;
};

export const getDisasterDetails = async (disasterId) => {
  const response = await api.get(`/disasters/${disasterId}`);
  return response.data;
};

export const getSafetySteps = async (disasterId) => {
  const response = await api.get(`/disasters/${disasterId}/safety-steps`);
  return response.data;
};

// User API
export const registerUser = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getUserProgress = async (userId) => {
  const response = await api.get(`/users/${userId}/progress`);
  return response.data;
};

// Quiz API
export const getQuiz = async (disasterType) => {
  const response = await api.get(`/quiz/${disasterType}`);
  return response.data;
};

export const submitQuiz = async (quizData) => {
  const response = await api.post('/quiz/submit', quizData);
  return response.data;
};

// Game API
export const getAllGames = async () => {
  const response = await api.get('/games');
  return response.data;
};

export const getGame = async (gameId) => {
  const response = await api.get(`/games/${gameId}`);
  return response.data;
};

export const submitGameResults = async (gameId, results) => {
  const response = await api.post(`/games/${gameId}/submit`, results);
  return response.data;
};

// Progress API
export const saveProgress = async (progressData) => {
  const response = await api.post('/progress', progressData);
  return response.data;
};

export const getProgress = async (userId) => {
  const response = await api.get(`/progress/${userId}`);
  return response.data;
};

export const awardBadge = async (badgeData) => {
  const response = await api.post('/progress/badge', badgeData);
  return response.data;
};

export default api;
