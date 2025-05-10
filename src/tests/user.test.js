const mongoose = require('mongoose');
const User = require('../models/User');

describe('User Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should hash the password before saving', async () => {
        const userData = {
            username: 'testuser',
            email: 'test@test.com',
            password: 'password123'
        };

        const validUser = new User(userData);
        await validUser.save();

        expect(validUser.password).not.toBe(userData.password);
    });
});