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

    it('should create and save an assignment successfully', async () => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // Assignment due in a week
        
        const assignmentData = {
            title: 'Test Assignment',
            courseId: testCourse._id,
            instructor: testInstructor._id,
            type: 'Quiz',
            points: 10,
            dueDate: dueDate,
            status: 'Not Started'
        };

        const validAssignment = new Assignment(assignmentData);
        const savedAssignment = await validAssignment.save();
        testAssignmentIDs.push(savedAssignment._id);

        expect(savedAssignment.title).toBe(assignmentData.title);
        expect(savedAssignment.courseId).toEqual(testCourse._id);
        expect(savedAssignment.instructor).toEqual(testInstructor._id);
        expect(savedAssignment.type).toBe(assignmentData.type);
        expect(savedAssignment.points).toBe(assignmentData.points);
        expect(savedAssignment.status).toBe('Not Started'); // Default status
        expect(savedAssignment.createdAt).toBeDefined();
    });

});