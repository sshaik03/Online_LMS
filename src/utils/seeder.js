const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Seed data
const seedData = async () => {
  try {
    // Clean existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await AssignmentSubmission.deleteMany({});
    
    console.log('Database cleaned');
    
    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    
    const teacher = await User.create({
      username: 'teacher',
      email: 'teacher@example.com',
      password: teacherPassword,
      role: 'teacher'
    });
    
    const student1 = await User.create({
      username: 'student1',
      email: 'student1@example.com',
      password: studentPassword,
      role: 'student'
    });
    
    const student2 = await User.create({
      username: 'student2',
      email: 'student2@example.com',
      password: studentPassword,
      role: 'student'
    });
    
    console.log('Users created');
    
    // Create courses
    const course1 = await Course.create({
      title: 'Introduction to Computer Science',
      description: 'Learn the fundamental concepts of computer science including algorithms, data structures, and programming basics.',
      teacher: teacher._id,
      enrollmentCode: 'CS101',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-05-15'),
      isActive: true,
      students: [student1._id, student2._id],
      colorScheme: 'from-blue-500 to-indigo-600'
    });
    
    const course2 = await Course.create({
      title: 'Advanced Mathematics',
      description: 'Explore complex mathematical concepts including calculus, linear algebra, and differential equations.',
      teacher: teacher._id,
      enrollmentCode: 'MATH201',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-05-15'),
      isActive: true,
      students: [student1._id],
      colorScheme: 'from-purple-500 to-pink-600'
    });
    
    console.log('Courses created');
    
    // Create assignments
    const assignment1 = await Assignment.create({
      title: 'Research Paper',
      description: 'Write a 5-page research paper on any topic related to computer science history.',
      courseId: course1._id,
      points: 100,
      dueDate: new Date('2025-03-15'),
      type: 'Paper',
      createdBy: teacher._id
    });
    
    const assignment2 = await Assignment.create({
      title: 'Programming Project',
      description: 'Build a simple web application using HTML, CSS, and JavaScript.',
      courseId: course1._id,
      points: 150,
      dueDate: new Date('2025-04-10'),
      type: 'Project',
      createdBy: teacher._id
    });
    
    const assignment3 = await Assignment.create({
      title: 'Calculus Quiz',
      description: 'Quiz covering topics from chapters 3-5.',
      courseId: course2._id,
      points: 50,
      dueDate: new Date('2025-02-05'),
      type: 'Quiz',
      createdBy: teacher._id
    });
    
    console.log('Assignments created');
    
    // Create submissions
    await AssignmentSubmission.create({
      assignmentId: assignment1._id,
      studentId: student1._id,
      status: 'Completed',
      submissionDate: new Date('2025-03-10'),
      submissionText: 'This is my submission for the research paper.',
      grade: 95,
      feedback: 'Excellent work! Very thorough research.'
    });
    
    await AssignmentSubmission.create({
      assignmentId: assignment1._id,
      studentId: student2._id,
      status: 'Not Started'
    });
    
    await AssignmentSubmission.create({
      assignmentId: assignment2._id,
      studentId: student1._id,
      status: 'In Progress'
    });
    
    await AssignmentSubmission.create({
      assignmentId: assignment2._id,
      studentId: student2._id,
      status: 'Not Started'
    });
    
    await AssignmentSubmission.create({
      assignmentId: assignment3._id,
      studentId: student1._id,
      status: 'Completed',
      submissionDate: new Date('2025-02-04'),
      grade: 85,
      feedback: 'Good work, but more attention needed to derivatives.'
    });
    
    console.log('Submissions created');
    
    console.log('Data seeding complete!');
    console.log('\nTest Users:');
    console.log('- Admin: username=admin, password=admin123');
    console.log('- teacher: username=teacher, password=teacher123');
    console.log('- Student: username=student1, password=student123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
seedData();