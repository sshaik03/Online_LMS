// At the top of your courseRoutes.js file
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const authMiddleware = require('../middleware/authMiddleware');

// Add this route for enrolling with a code
router.post('/enroll-by-code', authMiddleware, async (req, res) => {
  try {
    const { enrollmentCode } = req.body;
    const userId = req.user.id;
    
    // Find the course with the given enrollment code
    const course = await Course.findOne({ enrollmentCode });
    
    if (!course) {
      return res.status(404).json({ message: 'Invalid enrollment code' });
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
    
    // Add student to course's students array
    course.students.push(userId);
    await course.save();
    
    return res.status(201).json({ 
      message: 'Successfully enrolled in course',
      course: {
        id: course._id,
        title: course.title,
        description: course.description
      }
    });
  } catch (error) {
    console.error('Error enrolling with code:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});