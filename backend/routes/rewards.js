const express = require('express');
const { authMiddleware, users } = require('../middleware/auth');
const { rewardItems } = require('../models/rewardItem');
const { rewardRedemptions } = require('../models/rewardRedemption');

const router = express.Router();

// List available rewards and current user points
router.get('/', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  res.json({ rewards: rewardItems, points: user?.points || 0 });
});

// Redeem a reward using points
router.post('/redeem', authMiddleware, (req, res) => {
  const { rewardId } = req.body;
  const reward = rewardItems.find(r => r.id === rewardId);
  if (!reward) {
    return res.status(404).json({ error: 'Reward not found' });
  }

  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.points = user.points || 0;
  if (user.points < reward.cost) {
    return res.status(400).json({ error: 'Not enough points' });
  }

  user.points -= reward.cost;
  rewardRedemptions.push({
    userId: user.id,
    rewardId: reward.id,
    timestamp: new Date().toISOString()
  });

  res.json({ message: 'Reward redeemed', points: user.points });
});

module.exports = router;
