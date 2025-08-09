const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { CommunityThread, threads } = require('../models/CommunityThread');

const router = express.Router();

// Get all threads
router.get('/threads', (req, res) => {
  res.json(threads);
});

// Create a new thread linked to a case
router.post('/threads', authMiddleware, (req, res) => {
  const { caseId, title } = req.body;
  if (!caseId || !title) {
    return res.status(400).json({ error: 'caseId and title are required' });
  }
  const thread = new CommunityThread({
    id: Date.now().toString(),
    caseId,
    title,
  });
  threads.push(thread);
  res.status(201).json(thread);
});

// Add a comment to a thread
router.post('/threads/:id/comments', authMiddleware, (req, res) => {
  const thread = threads.find(t => t.id === req.params.id);
  if (!thread) {
    return res.status(404).json({ error: 'Thread not found' });
  }
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'content is required' });
  }
  const comment = {
    id: Date.now().toString(),
    author: req.user ? req.user.email : 'anonymous',
    content,
    createdAt: new Date().toISOString(),
  };
  thread.comments.push(comment);
  res.status(201).json(comment);
});

module.exports = router;
