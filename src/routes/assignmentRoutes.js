const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Create Assignment model schema if it doesn't exist
const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Quiz', 'Homework', 'Project', 'Exam'],
    default: 'Quiz'
  },
  points: {
    type: Number,
    required: true,
    min: 1
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if model already exists to prevent overwriting
const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);

// Get all assignments (filtered by role)
router.get('/', auth, async (req, res) => {
  try {
    let assignments;
    
    if (req.user.role === 'instructor') {
      // Get assignments created by this instructor
      assignments = await Assignment.find({ instructor: req.user.id })
        .populate('courseId', 'title');
    } else {
      // Get assignments for courses student is enrolled in
      const enrolledCourses = await mongoose.model('Course').find({ 
        students: req.user.id 
      });
      
      const courseIds = enrolledCourses.map(course => course._id);
      
      assignments = await Assignment.find({ 
        courseId: { $in: courseIds } 
      }).populate('courseId', 'title');
    }
    
    // Format the assignments for the frontend
    const formattedAssignments = assignments.map(assignment => ({
      _id: assignment._id,
      id: assignment._id,
      title: assignment.title,
      courseName: assignment.courseId ? assignment.courseId.title : 'Unknown Course',
      course: assignment.courseId ? assignment.courseId.title : 'Unknown Course',
      courseId: assignment.courseId,
      type: assignment.type,
      points: assignment.points,
      dueDate: assignment.dueDate,
      status: assignment.status,
      createdAt: assignment.createdAt
    }));
    
    res.json(formattedAssignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create assignment (instructor only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, courseId, type, points, dueDate } = req.body;
    
    const assignment = new Assignment({
      title,
      courseId,
      instructor: req.user.id,
      type,
      points,
      dueDate,
      status: 'Not Started'
    });
    
    await assignment.save();
    
    // Populate course info for the response
    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('courseId', 'title');
    
    res.status(201).json({
      _id: populatedAssignment._id,
      id: populatedAssignment._id, // For compatibility with frontend
      title: populatedAssignment.title,
      courseName: populatedAssignment.courseId ? populatedAssignment.courseId.title : 'Unknown Course',
      course: populatedAssignment.courseId ? populatedAssignment.courseId.title : 'Unknown Course', // For compatibility
      courseId: populatedAssignment.courseId,
      type: populatedAssignment.type,
      points: populatedAssignment.points,
      dueDate: populatedAssignment.dueDate,
      status: populatedAssignment.status,
      createdAt: populatedAssignment.createdAt
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete assignment (student only)
router.put('/:id/complete', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if student is enrolled in the course
    const course = await mongoose.model('Course').findById(assignment.courseId);
    if (!course || !course.students.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    assignment.status = 'Completed';
    await assignment.save();
    
    res.json({
      _id: assignment._id,
      id: assignment._id, // For compatibility with frontend
      title: assignment.title,
      courseId: assignment.courseId,
      type: assignment.type,
      points: assignment.points,
      dueDate: assignment.dueDate,
      status: assignment.status
    });
  } catch (error) {
    console.error('Error completing assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this route to create a test assignment
router.post('/test', auth, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { courseId } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }
    
    const testAssignment = new Assignment({
      title: 'Test Assignment',
      courseId,
      instructor: req.user.id,
      type: 'Quiz',
      points: 10,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      status: 'Not Started'
    });
    
    await testAssignment.save();
    
    res.status(201).json({ message: 'Test assignment created', assignment: testAssignment });
  } catch (error) {
    console.error('Error creating test assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;