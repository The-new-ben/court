const express = require('express');

const router = express.Router();

const caseVotes = {};

router.get('/cases/:id/vote', (req, res) => {
  const { id } = req.params;
  if (!caseVotes[id]) {
    caseVotes[id] = { plaintiff: 0, defendant: 0 };
  }
  res.json(caseVotes[id]);
});

router.post('/cases/:id/vote', (req, res) => {
  const { id } = req.params;
  const { side } = req.body;
  if (!['plaintiff', 'defendant'].includes(side)) {
    return res.status(400).json({ error: 'Invalid vote side' });
  }
  if (!caseVotes[id]) {
    caseVotes[id] = { plaintiff: 0, defendant: 0 };
  }
  caseVotes[id][side] += 1;
  res.json(caseVotes[id]);
});

module.exports = router;
