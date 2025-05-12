const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Course = require('../models/Course');

// Get all submissions for an assignment (instructor view)
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    // Verify the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Check if the instructor has permission to view submissions
    if (req.user.role === 'instructor' && assignment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only view submissions for your own assignments' });
    }
    
    const submissions = await AssignmentSubmission.find({ assignmentId })
      .populate('studentId', 'username email');
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
};

// Get a student's submissions (student view)
exports.getStudentSubmissions = async (req, res) => {
  try {
    // If requesting other student's submissions, must be instructor or admin
    const studentId = req.params.studentId || req.user.id;
    
    if (studentId !== req.user.id && req.user.role === 'student') {
      return res.status(403).json({ message: 'You can only view your own submissions' });
    }
    
    const submissions = await AssignmentSubmission.find({ studentId })
      .populate({
        path: 'assignmentId',
        populate: { path: 'courseId', select: 'title' }
      });
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
};

// Get a specific submission
exports.getSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    
    const submission = await AssignmentSubmission.findById(submissionId)
      .populate('assignmentId')
      .populate('studentId', 'username email');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Check permissions
    if (req.user.role === 'student' && submission.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only view your own submissions' });
    }
    
    if (req.user.role === 'instructor') {
      const assignment = await Assignment.findById(submission.assignmentId);
      if (assignment.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You can only view submissions for your own assignments' });
      }
    }
    
    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Error fetching submission' });
  }
};

// Create or update a submission
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { submissionText, attachments, status } = req.body;
    const studentId = req.user.id;
    
    // Check if the assignment exists and is not past due date
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Only students can submit assignments
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit assignments' });
    }
    
    // Check if the student is enrolled in the course
    const course = await Course.findById(assignment.courseId);
    if (!course.students.includes(studentId)) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }
    
    // Check if the assignment is past due (unless the submission is just a status update to "In Progress")
    const isPastDue = new Date() > new Date(assignment.dueDate);
    if (isPastDue && (!status || status === 'Completed')) {
      return res.status(400).json({ message: 'This assignment is past due' });
    }
    
    // Find existing submission or create new one
    let submission = await AssignmentSubmission.findOne({ assignmentId, studentId });
    
    if (submission) {
      // Update existing submission
      if (submissionText) submission.submissionText = submissionText;
      if (attachments) submission.attachments = attachments;
      if (status) submission.status = status;
      
      // If the status is being set to "Completed", record the submission date
      if (status === 'Completed' && submission.status !== 'Completed') {
        submission.submissionDate = Date.now();
      }
      
      await submission.save();
    } else {
      // Create new submission
      submission = new AssignmentSubmission({
        assignmentId,
        studentId,
        submissionText,
        attachments: attachments || [],
        status: status || 'In Progress',
      });
      
      if (status === 'Completed') {
        submission.submissionDate = Date.now();
      }
      
      await submission.save();
    }
    
    res.json(submission);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ message: 'Error submitting assignment' });
  }
};

// Grade a submission (instructor only)
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;
    
    // Validate input
    if (grade === undefined) {
      return res.status(400).json({ message: 'Grade is required' });
    }
    
    // Only instructors and admins can grade submissions
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only instructors can grade submissions' });
    }
    
    const submission = await AssignmentSubmission.findById(submissionId)
      .populate('assignmentId');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Check if the instructor created the assignment
    const assignment = await Assignment.findById(submission.assignmentId);
    if (req.user.role === 'instructor' && assignment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only grade submissions for your own assignments' });
    }
    
    // Update the submission
    submission.grade = grade;
    if (feedback) submission.feedback = feedback;
    await submission.save();
    
    res.json(submission);
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ message: 'Error grading submission' });
  }
};