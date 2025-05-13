const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

describe('Course Model Test', () => {
    // Keep track of all created test entities for cleanup
    const testUserIds = [];
    const testCourseIds = [];
    
    let testInstructor;
    let testStudent;
    
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, {
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
        testUserIds.push(testInstructor._id);
        
        testStudent = new User({
            username: 'teststudent',
            email: 'teststudent@test.com',
            password: 'password123',
            role: 'student'
        });
        await testStudent.save();
        testUserIds.push(testStudent._id);
    });

    afterAll(async () => {
        // Only delete the test entities we created
        await User.deleteMany({ _id: { $in: testUserIds } });
        await Course.deleteMany({ _id: { $in: testCourseIds } });
        await mongoose.connection.close();
    });
    
});