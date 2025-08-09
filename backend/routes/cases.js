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
const { authMiddleware } = require('../middleware/auth');
const { createAuditLogger } = require('../middleware/auditLogger');

const router = express.Router();

let cases = [];

// Create case
router.post('/', authMiddleware, createAuditLogger('create_case'), (req, res) => {
  const caseData = { id: Date.now().toString(), ...req.body };
  cases.push(caseData);
  res.status(201).json(caseData);
});

// Edit case
router.put('/:id', authMiddleware, createAuditLogger('edit_case'), (req, res) => {
  const index = cases.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Case not found' });
  }
  cases[index] = { ...cases[index], ...req.body };
  res.json(cases[index]);
});

// Delete case
router.delete('/:id', authMiddleware, createAuditLogger('delete_case'), (req, res) => {
  const index = cases.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Case not found' });
  }
  const removed = cases.splice(index, 1)[0];
  res.json(removed);
});

module.exports = router;
