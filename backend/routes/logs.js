const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { queryLogs } = require('../middleware/auditLogger');

const router = express.Router();

router.get('/', authMiddleware, requireRole(['admin']), (req, res) => {
  const { user, action } = req.query;
  const logs = queryLogs({ user, action });
  res.json(logs);
});

module.exports = router;
