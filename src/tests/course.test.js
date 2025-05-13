const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');
require('dotenv').config();

describe('Course Model Test', () => {
    // Keep track of all created test entities for cleanup
    const testUsernames = [];
    const testCourseCodes = [];
    
    let testInstructor;
    let testStudent;
    
    beforeAll(async () => {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        // Create test users
        testInstructor = new User({
            username: 'testinstructor',
            email: 'testinstructor@test.com',
            password: 'password123',
            role: 'instructor'
        });
        await testInstructor.save();
        testUsernames.push(testInstructor.username);
        
        testStudent = new User({
            username: 'teststudent',
            email: 'teststudent@test.com',
            password: 'password123',
            role: 'student'
        });
        await testStudent.save();
        testUsernames.push(testStudent.username);
    });

    afterAll(async () => {
        // Only delete the test entities we created
        await User.deleteMany({ username: { $in: testUsernames } });
        await Course.deleteMany({ enrollmentCode: { $in: testCourseCodes } });
        await mongoose.connection.close();
    });

    it('should create and save a course successfully', async () => {
        const courseData = {
            title: 'Introduction to Node.js',
            description: 'Learn the basics of Node.js development',
            instructor: testInstructor._id,
            enrollmentCode: 'NODE101',
            category: 'Computer Science'
        };

        const validCourse = new Course(courseData);
        const savedCourse = await validCourse.save();
        testCourseCodes.push(savedCourse.enrollmentCode);

        expect(savedCourse.title).toBe(courseData.title);
        expect(savedCourse.description).toBe(courseData.description);
        expect(savedCourse.instructor).toEqual(testInstructor._id);
        expect(savedCourse.enrollmentCode).toBe(courseData.enrollmentCode);
        expect(savedCourse.category).toBe(courseData.category);
        expect(savedCourse.isActive).toBe(true); // Default value check
        expect(savedCourse.students.length).toBe(0); // No students initially
        expect(savedCourse.createdAt).toBeDefined();
    });

    it('should fail to create a course without required fields', async () => {
        const invalidCourse = new Course({
            description: 'Missing title and instructor field'
        });
        
        let err;
        try {
            await invalidCourse.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

});