const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getPoints, incrementPoints, getBadge } = require('../services/points');

const router = express.Router();

router.get('/:viewerId', authMiddleware, (req, res) => {
  const points = getPoints(req.params.viewerId);
  res.json({ points, badge: getBadge(points) });
});

router.post('/:viewerId/:action', authMiddleware, (req, res) => {
  const { viewerId, action } = req.params;
  const result = incrementPoints(viewerId, action);
  res.json(result);
});

module.exports = router;

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
