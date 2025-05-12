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
  const response = await axios.post(`${API_URL}/courses`, courseData, {
    headers: authHeader()
  });
  return response.data;
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
export const deleteCourse = async (id) => {
  const response = await axios.delete(`${API_URL}/courses/${id}`, {
    headers: authHeader()
  });
  return response.data;
};

// Get courses taught by instructor
export const getInstructorCourses = async () => {
  const response = await axios.get(`${API_URL}/courses/teaching/me`, {
    headers: authHeader()
  });
  return response.data;
};

// Update course active status
export const updateCourseActiveStatus = async (id, isActive) => {
  const response = await axios.patch(`${API_URL}/courses/${id}/status`, 
    { isActive }, 
    { headers: authHeader() }
  );
  return response.data;
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