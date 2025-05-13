// lms-frontend/src/services/enrollmentService.js
import axios from 'axios';
import { getCurrentUser } from './authService';

const API_URL = 'http://localhost:3001/api';

// Get auth header
const authHeader = () => {
  const user = getCurrentUser();
  return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

// Enroll in a course
export const enrollInCourse = async (courseId) => {
  const response = await axios.post(`${API_URL}/enrollments/courses/${courseId}/enroll`, {}, {
    headers: authHeader()
  });
  return response.data;
};

// Get available courses for enrollment
export const getAvailableCourses = async () => {
  const response = await axios.get(`${API_URL}/enrollments/available`, {
    headers: authHeader()
  });
  return response.data;
};

export const getCourseById = async (courseId) => {
  const response = await axios.get(`${API_URL}/${courseId}`);
  return response.data;
};

// Get student enrollments
export const getStudentEnrollments = async () => {
  try {
    // Get token directly from localStorage for consistency
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.get(`${API_URL}/enrollments/student`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching student enrollments:', error);
    throw error;
  }
};

// Get course enrollments (for instructors)
export const getCourseEnrollments = async (courseId) => {
  const response = await axios.get(`${API_URL}/enrollments/course/${courseId}`, {
    headers: authHeader()
  });
  return response.data;
};

// Update enrollment status
export const updateEnrollmentStatus = async (enrollmentId, status) => {
  const response = await axios.put(`${API_URL}/enrollments/${enrollmentId}/status`, 
    { status }, 
    { headers: authHeader() }
  );
  return response.data;
};

// Update enrollment progress
export const updateEnrollmentProgress = async (enrollmentId, progressData) => {
  const response = await axios.put(`${API_URL}/enrollments/${enrollmentId}/progress`, 
    progressData, 
    { headers: authHeader() }
  );
  return response.data;
};

// Add this function to your enrollmentService.js file

// Enroll in a course using an enrollment code
export const enrollWithCode = async (enrollmentCode) => {
  try {
    // Get token directly from localStorage for consistency
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.post(
      `${API_URL}/enrollments/enroll-by-code`, 
      { enrollmentCode },
      { 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error enrolling with code:', error);
    throw error;
  }
};

// Add this function to withdraw from a course
export const withdrawFromCourse = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.delete(
      `${API_URL}/enrollments/courses/${courseId}/withdraw`, 
      { 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error withdrawing from course:', error);
    throw error;
  }
};