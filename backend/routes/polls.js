const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');

class Poll {
  constructor(question, options, createdBy) {
    this.id = Date.now().toString();
    this.question = question;
    this.options = options.map((text, idx) => ({ id: idx.toString(), text, votes: 0 }));
    this.createdBy = createdBy;
    this.createdAt = new Date().toISOString();
  }
}

const polls = [];

const router = express.Router();

router.post('/', authMiddleware, requireRole(['admin', 'judge']), (req, res) => {
  const { question, options } = req.body;
  if (!question || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: 'invalid poll data' });
  }
  const poll = new Poll(question, options, req.user.email);
  polls.push(poll);
  res.status(201).json(poll);
});

router.get('/:id', authMiddleware, (req, res) => {
  const poll = polls.find(p => p.id === req.params.id);
  if (!poll) {
    return res.status(404).json({ error: 'poll not found' });
  }
  res.json(poll);
});

router.post('/:id/vote', authMiddleware, (req, res) => {
  const poll = polls.find(p => p.id === req.params.id);
  if (!poll) {
    return res.status(404).json({ error: 'poll not found' });
  }
  const { optionId } = req.body;
  const option = poll.options.find(o => o.id === optionId);
  if (!option) {
    return res.status(400).json({ error: 'invalid option' });
  }
  option.votes += 1;
  res.json(poll);
});

router.get('/:id/results', authMiddleware, requireRole(['admin', 'judge']), (req, res) => {
  const poll = polls.find(p => p.id === req.params.id);
  if (!poll) {
    return res.status(404).json({ error: 'poll not found' });
  }
  res.json(poll);
});

module.exports = router;
