// API Configuration
// Backend deployed on Render: https://lifelink-klk2.onrender.com

// Production API (Render)
const PRODUCTION_API_URL = 'https://lifelink-klk2.onrender.com';

// Local Development API (for testing with Expo Go)
const DEVELOPMENT_API_URL = 'http://10.239.103.96:3000';

// Use production URL for APK builds, development URL for Expo Go
const API_BASE_URL = PRODUCTION_API_URL;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  
  // Emergency
  EMERGENCY_REQUEST: `${API_BASE_URL}/api/emergency/request`,
  
  // Health Check
  HEALTH: `${API_BASE_URL}/health`,
};

export const API_URL = API_BASE_URL;
export default API_BASE_URL;

// Note: To switch between development and production:
// - For APK builds: Use PRODUCTION_API_URL (current setting)
// - For local testing: Change API_BASE_URL to DEVELOPMENT_API_URL
