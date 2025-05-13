const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

describe('User Model Test', () => {
    // Keeping track of all created test entities for cleanup
    // To ensure that each test starts with a clean state
    const testUserIDs = [];

    beforeAll(async () => {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        // Only delete the test entities we created
        await User.deleteMany({ _id: { $in: testUserIDs } });
            // Close the MongoDB connection
        await mongoose.connection.close().then(() => {
            console.log('MongoDB connection closed');
        });
    });

    it('should hash the password before saving', async () => {
        const userData = {
            username: 'testuser',
            email: 'test@test.com',
            password: 'password123'
        };

        const validUser = new User(userData);
        await validUser.save();
        testUserIDs.push(validUser._id);

        expect(validUser.password).not.toBe(userData.password);
    });
    it('should not rehash the password when updating user without changing password', async () => {
    // First create a user
    const userData = {
        username: 'updateuser',
        email: 'updateuser@test.com',
        password: 'password123'
    };
    
    const user = new User(userData);
    await user.save();
    testUserIDs.push(user._id);
    
    // Store the original hashed password
    const originalPassword = user.password;
    
    // Update a field other than password
    user.username = 'updateduserName';
    await user.save();
    testUserIDs.push(user._id);
    
    // Password should remain the same
    expect(user.password).toBe(originalPassword);
});
});