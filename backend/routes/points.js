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

