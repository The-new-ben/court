const express = require('express');
const { users } = require('../middleware/auth');
const { getErrorMessage } = require('../services/errorMessages');

const router = express.Router();

// Assign points to referrer when a client joins with a referral code
router.post('/join', (req, res) => {
  const { clientId, referralCode } = req.body;

  const client = users.find(u => u.id === clientId);
  if (!client) {
    return res.status(404).json({ error: getErrorMessage('CLIENT_NOT_FOUND', req.headers['accept-language']) });
  }

  if (client.referrerId) {
    return res.status(400).json({ error: getErrorMessage('CLIENT_ALREADY_ASSIGNED', req.headers['accept-language']) });
  }

  const referrer = users.find(u => u.referralCode === referralCode);
  if (!referrer) {
    return res.status(404).json({ error: getErrorMessage('INVALID_REFERRAL_CODE', req.headers['accept-language']) });
  }

  client.referrerId = referrer.id;
  referrer.points = (referrer.points || 0) + 1;

  res.json({ message: 'הנקודות הוקצו', referrerPoints: referrer.points });
});

module.exports = router;
