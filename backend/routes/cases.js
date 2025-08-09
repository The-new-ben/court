const express = require('express');
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
