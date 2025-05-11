import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Register new user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};