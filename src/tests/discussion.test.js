const mongoose = require('mongoose');
const Discussion = require('../models/Discussion');
const User = require('../models/User');

describe('Discussion Model Test', () => {
    let testUser;
    
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        // Create a test user
        testUser = new User({
            username: 'discussiontest',
            email: 'discussiontest@test.com',
            password: 'password123'
        });
        await testUser.save();
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    it('should create and save a discussion successfully', async () => {
        const discussionData = {
            title: 'Test Discussion',
            content: 'This is a test discussion content',
            course: new mongoose.Types.ObjectId(),
            author: testUser._id,
            tags: ['test', 'discussion']
        };

        const validDiscussion = new Discussion(discussionData);
        const savedDiscussion = await validDiscussion.save();

        expect(savedDiscussion._id).toBeDefined();
        expect(savedDiscussion.title).toBe(discussionData.title);
        expect(savedDiscussion.content).toBe(discussionData.content);
        expect(savedDiscussion.author).toEqual(testUser._id);
        expect(savedDiscussion.tags).toEqual(expect.arrayContaining(discussionData.tags));
        expect(savedDiscussion.createdAt).toBeDefined();
    });

    it('should fail to create a discussion without required fields', async () => {
        const invalidDiscussion = new Discussion({
            content: 'Missing title and other required fields'
        });
        
        let err;
        try {
            await invalidDiscussion.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should add a reply to a discussion', async () => {
        const discussionData = {
            title: 'Discussion with Reply',
            content: 'This is a test discussion that will have a reply',
            course: new mongoose.Types.ObjectId(),
            author: testUser._id
        };

        const discussion = new Discussion(discussionData);
        await discussion.save();
        
        discussion.replies.push({
            content: 'This is a test reply',
            author: testUser._id
        });
        
        const updatedDiscussion = await discussion.save();
        
        expect(updatedDiscussion.replies.length).toBe(1);
        expect(updatedDiscussion.replies[0].content).toBe('This is a test reply');
        expect(updatedDiscussion.replies[0].author).toEqual(testUser._id);
    });
});