const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get a student's own submissions
router.get('/submissions', submissionController.getStudentSubmissions);

// Get another student's submissions (for teachers)
router.get('/:studentId/submissions', submissionController.getStudentSubmissions);

module.exports = router;