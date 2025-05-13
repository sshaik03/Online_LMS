const mongoose = require('mongoose');
const Discussion = require('../models/Discussion');
const User = require('../models/User');
require('dotenv').config();

describe('Discussion Model Test', () => {
    const testUserIDs = [];
    const testDiscussionIDs = [];
    let testUser;
    
    beforeAll(async () => {
        mongoose.connect(process.env.MONGODB_URI, {
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
        testUserIDs.push(testUser._id);
    });

    afterAll(async () => {
        await User.deleteMany({_id: { $in: testUserIDs } });
        await Discussion.deleteMany({_id: { $in: testDiscussionIDs } });
        await mongoose.connection.close().then(() => {
            console.log('MongoDB connection closed');
        });
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
        testDiscussionIDs.push(savedDiscussion._id);

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
        testDiscussionIDs.push(discussion._id);
        
        discussion.replies.push({
            content: 'This is a test reply',
            author: testUser._id
        });
        
        const updatedDiscussion = await discussion.save();
        testDiscussionIDs.push(updatedDiscussion._id);
        
        expect(updatedDiscussion.replies.length).toBe(1);
        expect(updatedDiscussion.replies[0].content).toBe('This is a test reply');
        expect(updatedDiscussion.replies[0].author).toEqual(testUser._id);
    });
});