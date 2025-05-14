const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const User = require('../models/User');
require('dotenv').config();

describe('Assignment Model Test', () => {
    // Keep track of all created test entities for cleanup
    const testUserIDs = [];
    const testCourseIDs = [];
    const testAssignmentIDs = [];
    
    let testInstructor;
    let testStudent;
    let testCourse;
    
    beforeAll(async () => {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        // Create test users
        testInstructor = new User({
            username: 'assignmentinstructor',
            email: 'assignmentinstructor@test.com',
            password: 'password123',
            role: 'instructor'
        });
        await testInstructor.save();
        testUserIDs.push(testInstructor._id);
        
        testStudent = new User({
            username: 'assignmentstudent',
            email: 'assignmentstudent@test.com',
            password: 'password123',
            role: 'student'
        });
        await testStudent.save();
        testUserIDs.push(testStudent._id);
        
        // Create a test course
        testCourse = new Course({
            title: 'Test Course for Assignments',
            description: 'This course is used for testing assignments',
            instructor: testInstructor._id,
            enrollmentCode: 'ASSIGN101',
            category: 'Testing'
        });
        await testCourse.save();
        testCourseIDs.push(testCourse._id);
    });

    afterAll(async () => {
        // Only delete the test entities we created
        await User.deleteMany({ _id: { $in: testUserIDs } });
        await Course.deleteMany({ _id: { $in: testCourseIDs } });
        await Assignment.deleteMany({ _id: { $in: testAssignmentIDs } });
        await mongoose.connection.close().then(() => {
            console.log('MongoDB connection closed');
        });    
    });

});