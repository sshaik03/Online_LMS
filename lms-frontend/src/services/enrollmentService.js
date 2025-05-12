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
  const response = await axios.get(`${API_URL}/enrollments/student`, {
    headers: authHeader()
  });
  return response.data;
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