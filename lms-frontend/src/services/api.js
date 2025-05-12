import axios from 'axios';

const API_URL = 'http://localhost:3001/api';  // Ensure this is 3001 to match server.js

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Discussion API calls
export const discussionApi = {
  // Get all discussions
  getAll: () => api.get('/discussions'),
  
  // Get discussions by course
  getByCourse: (courseId) => api.get(`/discussions/course/${courseId}`),
  
  // Get a single discussion
  getById: (id) => api.get(`/discussions/${id}`),
  
  // Create a new discussion
  create: (discussionData) => api.post('/discussions', discussionData),
  
  // Add a reply to a discussion
  addReply: (id, replyData) => api.post(`/discussions/${id}/reply`, replyData),
  
  // Delete a discussion
  delete: (id) => api.delete(`/discussions/${id}`),
};

// Auth API calls
export const authApi = {
  // Login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register
  register: (userData) => api.post('/auth/register', userData),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
};

export default api;