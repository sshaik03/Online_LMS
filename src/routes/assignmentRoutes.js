const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Assignment routes
router.get('/', assignmentController.getAllAssignments);
router.get('/:id', assignmentController.getAssignmentById);
router.post('/', assignmentController.createAssignment);
router.put('/:id', assignmentController.updateAssignment);
router.delete('/:id', assignmentController.deleteAssignment);

// Submission routes
router.get('/:assignmentId/submissions', submissionController.getSubmissionsByAssignment);
router.post('/:assignmentId/submit', submissionController.submitAssignment);
router.get('/submissions/:submissionId', submissionController.getSubmission);
router.put('/submissions/:submissionId/grade', submissionController.gradeSubmission);

module.exports = router;