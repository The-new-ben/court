const express = require('express');
const { authMiddleware, users } = require('../middleware/auth');
const { getLeaderboard } = require('../models/proBonoLog');

const router = express.Router();

router.get('/pro-bono', authMiddleware, (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const leaderboard = getLeaderboard(limit).map(entry => {
    const user = users.find(u => u.id === entry.userId);
    return {
      userId: entry.userId,
      name: user ? user.name : 'Unknown',
      hours: entry.hours
    };
  });
  res.json(leaderboard);
});

module.exports = router;
