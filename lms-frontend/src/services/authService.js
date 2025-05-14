import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Add auth header helper function
// Update authHeader function to include Bearer token properly
const authHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

// Register new user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

// Login user
// Update login function to store user role
// In your authService.js or wherever you handle login
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    
    // Check if response.data and response.data.token exist before storing
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Make sure user data exists before storing
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Add course creation function
// Update createCourse function with better error handling
export const createCourse = async (courseData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.post(`${API_URL}/courses`, courseData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Auth token:', token);
    console.error('Error details:', error.response?.data);
    throw error.response?.data || error;
  }
};

// Logout user
// Update logout function to remove both user and token
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Update getCurrentUser to check for both user and token
// Check if this function is correctly retrieving the user token
export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};