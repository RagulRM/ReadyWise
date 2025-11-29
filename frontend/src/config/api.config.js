/**
 * API Configuration
 * Centralized API base URL configuration
 */

// Default to local development, can be overridden by environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// For production, set VITE_API_BASE_URL in your build environment
// Example: VITE_API_BASE_URL=https://your-backend-domain.com/api

console.log('🌐 API Base URL:', API_BASE_URL);

export default API_BASE_URL;
