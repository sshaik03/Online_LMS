const Course = require('../models/Course');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    let courses;
    
    // Filter courses based on user role
    if (req.user.role === 'student') {
      // Students see courses they're enrolled in
      courses = await Course.find({ students: req.user.id, isActive: true })
        .populate('teacher', 'username');
    } else if (req.user.role === 'teacher') {
      // teachers see courses they teach
      courses = await Course.find({ teacher: req.user.id })
        .populate('teacher', 'username');
    } else {
      // Admins see all courses
      courses = await Course.find()
        .populate('teacher', 'username');
    }
    
    // Add student count to each course
    const coursesWithCounts = courses.map(course => {
      const courseObj = course.toObject();
      courseObj.enrolled = course.students.length;
      
      // Don't send the full student list in the response
      delete courseObj.students;
      
      return courseObj;
    });
    
    res.json(coursesWithCounts);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'username email')
      .populate('students', 'username email');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user has access to the course
    if (req.user.role === 'student' && !course.students.some(student => student._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }
    
    if (req.user.role === 'teacher' && course.teacher._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not the teacher of this course' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course' });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    // Only teachers and admins can create courses
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only teachers can create courses' });
    }
    
    const { title, description, startDate, endDate, thumbnail, colorScheme } = req.body;
    
    // Generate a unique enrollment code
    const enrollmentCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const course = new Course({
      title,
      description,
      teacher: req.user.id,
      startDate,
      endDate,
      thumbnail,
      colorScheme,
      enrollmentCode,
      students: []
    });
    
    await course.save();
    
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course' });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Only the teacher of the course or an admin can update it
    if (req.user.role === 'teacher' && course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own courses' });
    }
    
    const { title, description, startDate, endDate, isActive, thumbnail, colorScheme } = req.body;
    
    if (title) course.title = title;
    if (description) course.description = description;
    if (startDate) course.startDate = startDate;
    if (endDate) course.endDate = endDate;
    if (isActive !== undefined) course.isActive = isActive;
    if (thumbnail) course.thumbnail = thumbnail;
    if (colorScheme) course.colorScheme = colorScheme;
    
    await course.save();
    
    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Only the teacher of the course or an admin can delete it
    if (req.user.role === 'teacher' && course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own courses' });
    }
    
    // Remove course
    await Course.findByIdAndDelete(req.params.id);
    
    // Remove associated assignments
    const assignments = await Assignment.find({ courseId: req.params.id });
    const assignmentIds = assignments.map(a => a._id);
    
    await Assignment.deleteMany({ courseId: req.params.id });
    
    // Remove associated submissions
    await AssignmentSubmission.deleteMany({ assignmentId: { $in: assignmentIds } });
    
    res.json({ message: 'Course and all associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
};

// Enroll a student in a course
exports.enrollStudent = async (req, res) => {
  try {
    const { enrollmentCode } = req.body;
    
    // Only students can enroll in courses
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }
    
    // Find the course by enrollment code
    const course = await Course.findOne({ enrollmentCode });
    
    if (!course) {
      return res.status(404).json({ message: 'Invalid enrollment code' });
    }
    
    // Check if student is already enrolled
    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }
    
    // Add student to the course
    course.students.push(req.user.id);
    await course.save();
    
    // Create "Not Started" submissions for all assignments in the course
    const assignments = await Assignment.find({ courseId: course._id });
    
    const submissionPromises = assignments.map(assignment => {
      return new AssignmentSubmission({
        assignmentId: assignment._id,
        studentId: req.user.id,
        status: 'Not Started'
      }).save();
    });
    
    await Promise.all(submissionPromises);
    
    res.json({ message: 'Successfully enrolled in the course' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
};

// Remove a student from a course
exports.removeStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Only the teacher of the course or an admin can remove students
    if (req.user.role === 'teacher' && course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only remove students from your own courses' });
    }
    
    // Students can remove themselves
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'You can only unenroll yourself from a course' });
    }
    
    // Check if student is enrolled
    if (!course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student is not enrolled in this course' });
    }
    
    // Remove student from course
    course.students = course.students.filter(id => id.toString() !== studentId);
    await course.save();
    
    // Remove student's submissions for assignments in this course
    const assignments = await Assignment.find({ courseId });
    const assignmentIds = assignments.map(a => a._id);
    
    await AssignmentSubmission.deleteMany({
      assignmentId: { $in: assignmentIds },
      studentId
    });
    
    res.json({ message: 'Student removed from course successfully' });
  } catch (error) {
    console.error('Error removing student from course:', error);
    res.status(500).json({ message: 'Error removing student from course' });
  }
};

// Get course assignments
exports.getCourseAssignments = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user has access to the course
    if (req.user.role === 'student' && !course.students.some(studentId => studentId.toString() === req.user.id)) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }
    
    if (req.user.role === 'teacher' && course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not the teacher of this course' });
    }
    
    const assignments = await Assignment.find({ courseId: id })
      .sort({ dueDate: 1 });
    
    // For students, add submission status
    if (req.user.role === 'student') {
      const submissions = await AssignmentSubmission.find({
        assignmentId: { $in: assignments.map(a => a._id) },
        studentId: req.user.id
      });
      
      const submissionMap = {};
      submissions.forEach(sub => {
        submissionMap[sub.assignmentId.toString()] = sub;
      });
      
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
    console.error('Error fetching course assignments:', error);
    res.status(500).json({ message: 'Error fetching course assignments' });
  }
};