const express = require('express');
const crypto = require('crypto');
const { authMiddleware, users } = require('../middleware/auth');

const router = express.Router();

// In-memory storage for invites
const invites = [];

// Create a unique invitation link
router.post('/create', authMiddleware, (req, res) => {
  const code = crypto.randomBytes(8).toString('hex');
  const invite = { code, inviterId: req.user.userId, used: false };
  invites.push(invite);
  const link = `${req.protocol}://${req.get('host')}/signup?invite=${code}`;
  res.json({ link });
});

// Redeem an invitation link and credit referral points
router.post('/use/:code', (req, res) => {
  const { code } = req.params;
  const { userId } = req.body;
  const invite = invites.find(i => i.code === code);
  if (!invite) {
    return res.status(404).json({ error: 'Invalid invite code' });
  }
  if (invite.used) {
    return res.status(400).json({ error: 'Invite already used' });
  }
  invite.used = true;
  invite.usedBy = userId;
  const inviter = users.find(u => u.id === invite.inviterId);
  if (inviter) {
    inviter.referralPoints = (inviter.referralPoints || 0) + 1;
  }
  res.json({ message: 'Invite accepted' });
});

module.exports = router;
