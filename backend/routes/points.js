const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { awardPoints, getPoints } = require('../services/points');

const router = express.Router();

router.post('/award', authMiddleware, (req, res) => {
  const { userId, amount } = req.body;
  try {
    const points = awardPoints(userId, amount);
    res.json({ points });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/:userId', authMiddleware, (req, res) => {
  const { userId } = req.params;
  const points = getPoints(userId);
  res.json({ points });
});

module.exports = router;
