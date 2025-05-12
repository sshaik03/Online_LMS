const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Course routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// Course enrollment routes
router.post('/enroll', courseController.enrollStudent);
router.delete('/:courseId/students/:studentId', courseController.removeStudent);

// Course assignments
router.get('/:id/assignments', courseController.getCourseAssignments);

module.exports = router;