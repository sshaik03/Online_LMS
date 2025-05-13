const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const jwt = require('jsonwebtoken');

// Authentication middleware
const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Add this route for enrolling with a code
router.post('/enroll-by-code', auth, async (req, res) => {
  try {
    const { enrollmentCode } = req.body;
    const userId = req.user.id;
    
    console.log('Enrollment attempt:', { userId, enrollmentCode }); // Add for debugging
    
    if (!enrollmentCode) {
      return res.status(400).json({ message: 'Enrollment code is required' });
    }
    
    // Find the course with the given enrollment code
    const course = await Course.findOne({ enrollmentCode });
    
    if (!course) {
      return res.status(404).json({ message: 'Invalid enrollment code. Course not found.' });
    }
    
    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: userId,
      course: course._id
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }
    
    // Create new enrollment
    const enrollment = new Enrollment({
      student: userId,
      course: course._id,
      status: 'active',
      progress: 0
    });
    
    await enrollment.save();
    
    // Add student to course's students array if not already there
    if (!course.students.includes(userId)) {
      course.students.push(userId);
      await course.save();
    }
    
    // Update the response to include more course details
    return res.status(201).json({ 
      message: 'Successfully enrolled in course',
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        modules: course.modules?.length || 0
      }
    });
  } catch (error) {
    console.error('Error enrolling with code:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Add a route to get student enrollments
router.get('/student', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all enrollments for this student and populate course details
    const enrollments = await Enrollment.find({ student: userId })
      .populate({
        path: 'course',
        select: 'title description instructor modules'
      });
    
    // Format the response
    const courses = enrollments.map(enrollment => ({
      id: enrollment.course._id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      instructor: enrollment.course.instructor,
      modules: enrollment.course.modules?.length || 0,
      progress: enrollment.progress,
      status: enrollment.status,
      enrollmentId: enrollment._id
    }));
    
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching student enrollments:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Add this route for withdrawing from a course
router.delete('/courses/:courseId/withdraw', auth, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;
    
    // Find the enrollment
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Delete the enrollment
    await Enrollment.findByIdAndDelete(enrollment._id);
    
    // Remove student from course's students array
    await Course.findByIdAndUpdate(courseId, {
      $pull: { students: userId }
    });
    
    return res.status(200).json({ message: 'Successfully withdrawn from course' });
  } catch (error) {
    console.error('Error withdrawing from course:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;