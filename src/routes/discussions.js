const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');
const auth = require('../middleware/auth');

// Get all discussions
router.get('/', async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .populate('author', 'username')
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    
    res.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get discussions by course ID
router.get('/course/:courseId', async (req, res) => {
  try {
    const discussions = await Discussion.find({ course: req.params.courseId })
      .populate('author', 'username')
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    
    res.json(discussions);
  } catch (error) {
    console.error('Error fetching course discussions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single discussion by ID
router.get('/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author', 'username')
      .populate('course', 'title')
      .populate('replies.author', 'username');
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    res.json(discussion);
  } catch (error) {
    console.error('Error fetching discussion:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new discussion - remove auth middleware
router.post('/', async (req, res) => {
  try {
    const { title, content, course, tags, isAnnouncement } = req.body;
    
    const newDiscussion = new Discussion({
      title,
      content,
      course,
      // Don't require author field
      tags: tags || [],
      isAnnouncement: isAnnouncement || false
    });
    
    const savedDiscussion = await newDiscussion.save();
    
    res.status(201).json(savedDiscussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a reply to a discussion
router.post('/:id/reply', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    discussion.replies.push({
      content,
      author: req.userId
    });
    
    discussion.updatedAt = Date.now();
    
    await discussion.save();
    
    res.status(201).json(discussion);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a discussion
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, tags, isAnnouncement } = req.body;
    
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Check if user is the author
    if (discussion.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this discussion' });
    }
    
    discussion.title = title || discussion.title;
    discussion.content = content || discussion.content;
    discussion.tags = tags || discussion.tags;
    discussion.isAnnouncement = isAnnouncement !== undefined ? isAnnouncement : discussion.isAnnouncement;
    discussion.updatedAt = Date.now();
    
    await discussion.save();
    
    res.json(discussion);
  } catch (error) {
    console.error('Error updating discussion:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a discussion
router.delete('/:id', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Check if user is the author or an admin
    if (discussion.author.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this discussion' });
    }
    
    await discussion.remove();
    
    res.json({ message: 'Discussion removed' });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;