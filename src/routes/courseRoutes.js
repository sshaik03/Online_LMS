const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');

// Create a new course (Instructor only)
router.post('/', auth, async (req, res) => {
  try {
    console.log('User from token:', req.user);
    
    if (!req.user || req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can create courses' });
    }

    // Generate a simple enrollment code if not provided
    const enrollmentCode = req.body.enrollmentCode || 
      Math.random().toString(36).substring(2, 8).toUpperCase();

    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'Other',
      instructor: req.user.id,
      enrollmentCode: enrollmentCode,
      isActive: true
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all courses (different views for students and instructors)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'instructor') {
      // Instructors see their own courses
      const courses = await Course.find({ instructor: req.user.id });
      res.json(courses);
    } else {
      // Students see all available courses or enrolled courses
      const courses = await Course.find();
      res.json(courses);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll in a course (Student only)
router.post('/enroll', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }

    const { enrollmentCode } = req.body;
    
    if (!enrollmentCode) {
      return res.status(400).json({ message: 'Enrollment code is required' });
    }

    // Find course by enrollment code
    const course = await Course.findOne({ enrollmentCode });
    
    if (!course) {
      return res.status(404).json({ message: 'Invalid enrollment code' });
    }

    if (!course.isActive) {
      return res.status(400).json({ message: 'This course is currently inactive' });
    }

    // Check if already enrolled
    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Add student to course
    course.students.push(req.user.id);
    await course.save();
    
    res.status(200).json({ message: 'Successfully enrolled in course', course });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a course (Instructor only)
router.delete('/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }

    await course.remove();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this route to get enrolled courses for a student
router.get('/enrolled', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const courses = await Course.find({ students: req.user.id });
    console.log(`Found ${courses.length} courses for student ${req.user.id}`);
    
    res.json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;