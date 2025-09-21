// API Configuration
const API_CONFIG = {
  // Use environment variable for production, fallback to localhost for development
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    CHAT: '/api/chat/message',
    SUGGESTIONS: '/api/chat/suggestions',
    ROADMAP: '/api/roadmaps/generate',
    QUIZ: '/api/quizzes/chapter',
    ANALYTICS: '/api/analytics/market',
    YOUTUBE_SEARCH: '/api/youtube/search',
    YOUTUBE_SKILL_RECOMMENDATIONS: '/api/youtube/recommendations/skill',
    YOUTUBE_TRENDING: '/api/youtube/trending'
  }
};

export const API_ENDPOINTS = API_CONFIG.ENDPOINTS;

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint] || endpoint}`;
};

export default API_CONFIG;
