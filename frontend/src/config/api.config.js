/**
 * API Configuration
 * Centralized API base URL configuration
 */

// Default to local development with correct backend port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export default API_BASE_URL;
