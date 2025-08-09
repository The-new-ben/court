const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { subscriptionPackages, clientSubscriptions } = require('../db');
const { getErrorMessage } = require('../services/errorMessages');

const router = express.Router();

router.get('/packages', (req, res) => {
  res.json(subscriptionPackages);
});

router.post('/subscribe', authMiddleware, (req, res) => {
  const { packageId } = req.body;
  const pkg = subscriptionPackages.find(p => p.id === packageId);
  if (!pkg) {
    return res.status(404).json({ error: getErrorMessage('PACKAGE_NOT_FOUND', req.headers['accept-language']) });
  }

  const existing = clientSubscriptions.find(s => s.clientId === req.user.userId);
  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  if (existing) {
    existing.packageId = packageId;
    existing.nextBillingDate = nextBillingDate.toISOString();
  } else {
    clientSubscriptions.push({
      id: Date.now().toString(),
      clientId: req.user.userId,
      packageId,
      nextBillingDate: nextBillingDate.toISOString()
    });
  }

  res.json({ message: 'נרשמת בהצלחה' });
});

module.exports = router;
