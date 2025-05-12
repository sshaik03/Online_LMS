const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// Get all assignments (with filtering options)
exports.getAllAssignments = async (req, res) => {
  try {
    const { courseId, type } = req.query;
    const filter = {};
    
    // Apply filters if provided
    if (courseId) filter.courseId = courseId;
    if (type) filter.type = type;
    
    // Handle role-based access
    if (req.user.role === 'student') {
      // Students should only see assignments from courses they're enrolled in
      const enrolledCourses = await Course.find({ students: req.user.id }).select('_id');
      const courseIds = enrolledCourses.map(course => course._id);
      filter.courseId = { $in: courseIds };
    } else if (req.user.role === 'instructor') {
      // Instructors should only see assignments they created
      filter.createdBy = req.user.id;
    }
    
    const assignments = await Assignment.find(filter)
      .populate('courseId', 'title')
      .sort({ dueDate: 1 });
      
    // For students, also fetch their submission status for each assignment
    if (req.user.role === 'student') {
      const assignmentIds = assignments.map(assignment => assignment._id);
      const submissions = await AssignmentSubmission.find({
        assignmentId: { $in: assignmentIds },
        studentId: req.user.id
      });
      
      // Map submissions to assignments
      const submissionMap = {};
      submissions.forEach(submission => {
        submissionMap[submission.assignmentId.toString()] = submission;
      });
      
      // Add submission status to each assignment
      const assignmentsWithStatus = assignments.map(assignment => {
        const assignmentObj = assignment.toObject();
        const submission = submissionMap[assignment._id.toString()];
        
        assignmentObj.status = submission ? submission.status : 'Not Started';
        if (submission && submission.grade) {
          assignmentObj.grade = submission.grade;
        }
        
        return assignmentObj;
      });
      
      return res.json(assignmentsWithStatus);
    }
    
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Error fetching assignments' });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('courseId', 'title')
      .populate('createdBy', 'username');
      
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Check if the user has access to this assignment
    if (req.user.role === 'student') {
      const course = await Course.findById(assignment.courseId);
      if (!course.students.includes(req.user.id)) {
        return res.status(403).json({ message: 'You do not have access to this assignment' });
      }
      
      // Get student's submission if it exists
      const submission = await AssignmentSubmission.findOne({
        assignmentId: assignment._id,
        studentId: req.user.id
      });
      
      const assignmentObj = assignment.toObject();
      assignmentObj.submission = submission || { status: 'Not Started' };
      
      return res.json(assignmentObj);
    }
    
    // For instructors, check if they created the assignment
    if (req.user.role === 'instructor' && assignment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have access to this assignment' });
    }
    
    res.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ message: 'Error fetching assignment' });
  }
};

// Create new assignment
exports.createAssignment = async (req, res) => {
  try {
    // Only instructors and admins can create assignments
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only instructors can create assignments' });
    }
    
    const { title, description, courseId, points, dueDate, type, attachments } = req.body;
    
    // Validate course exists and user is the instructor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (req.user.role === 'instructor' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only create assignments for courses you teach' });
    }
    
    const assignment = new Assignment({
      title,
      description,
      courseId,
      points: points || 100,
      dueDate,
      type,
      attachments: attachments || [],
      createdBy: req.user.id
    });
    
    await assignment.save();
    
    // Create "Not Started" submission entries for all enrolled students
    const studentIds = course.students;
    const submissionPromises = studentIds.map(studentId => {
      return new AssignmentSubmission({
        assignmentId: assignment._id,
        studentId,
        status: 'Not Started'
      }).save();
    });
    
    await Promise.all(submissionPromises);
    
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Error creating assignment' });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, points, dueDate, type, attachments } = req.body;
    
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Check permissions - only the creator or admin can update
    if (req.user.role === 'instructor' && assignment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own assignments' });
    }
    
    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.points = points || assignment.points;
    assignment.dueDate = dueDate || assignment.dueDate;
    assignment.type = type || assignment.type;
    
    // Handle attachments separately - don't overwrite unless explicitly provided
    if (attachments) {
      assignment.attachments = attachments;
    }
    
    await assignment.save();
    
    res.json(assignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Error updating assignment' });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Check permissions - only the creator or admin can delete
    if (req.user.role === 'instructor' && assignment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own assignments' });
    }
    
    // Delete the assignment
    await Assignment.findByIdAndDelete(id);
    
    // Also delete all submissions for this assignment
    await AssignmentSubmission.deleteMany({ assignmentId: id });
    
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ message: 'Error deleting assignment' });
  }
};