import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getAssignments = async () => {
  try {
    console.log("Auth headers:", authHeader());
    const response = await axios.get(`${API_URL}/assignments`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};

export const createAssignment = async (assignmentData) => {
  try {
    const response = await axios.post(`${API_URL}/assignments`, assignmentData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

export const completeAssignment = async (assignmentId) => {
  try {
    const response = await axios.put(`${API_URL}/assignments/${assignmentId}/complete`, {}, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error completing assignment:', error);
    throw error;
  }
};