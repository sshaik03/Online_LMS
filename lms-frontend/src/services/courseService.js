// lms-frontend/src/services/courseService.js
import axios from 'axios';
import { getCurrentUser } from './authService';

const API_URL = 'http://localhost:3001/api';

// Get auth header
const authHeader = () => {
  const user = getCurrentUser();
  return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

// Create a new course
export const createCourse = async (courseData) => {
  const token = localStorage.getItem('token');
  console.log('Token being used:', token); // Add this for debugging
  
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
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Get all courses (public)
export const getAllCourses = async () => {
  const response = await axios.get(`${API_URL}/courses`);
  return response.data;
};

// Get course by ID
export const getCourseById = async (id) => {
  const response = await axios.get(`${API_URL}/courses/${id}`);
  return response.data;
};

// Update course
export const updateCourse = async (id, courseData) => {
  const response = await axios.put(`${API_URL}/courses/${id}`, courseData, {
    headers: authHeader()
  });
  return response.data;
};

// Delete course (instructor only)
// Update the deleteCourse function to properly include the authentication token
export const deleteCourse = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.delete(`${API_URL}/courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Update the updateCourseActiveStatus function to properly include the authentication token
export const updateCourseActiveStatus = async (courseId, isActive) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.patch(`${API_URL}/courses/${courseId}/status`, 
      { isActive },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error updating course status:', error);
    throw error;
  }
};

// Get courses taught by instructor
// Add this console log to debug the API call
export const getInstructorCourses = async () => {
  try {
    console.log('Fetching instructor courses...');
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_URL}/courses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch courses');
    }
    
    const data = await response.json();
    console.log('Instructor courses fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    throw error;
  }
};

// Get enrolled students for a course (instructor only)
export const getCourseStudents = async (courseId) => {
  const response = await axios.get(`${API_URL}/enrollments/course/${courseId}`, {
    headers: authHeader()
  });
  return response.data;
};

// Enroll in course
export const enrollInCourse = async (courseId) => {
  const response = await axios.post(`${API_URL}/enrollments/courses/${courseId}/enroll`, {}, {
    headers: authHeader()
  });
  return response.data;
};

// Add this function to verify and enroll with a course code
export const enrollWithCode = async (enrollmentCode) => {
  try {
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