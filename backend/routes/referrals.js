const express = require('express');
const { supabase, getUserByReferralCode } = require('../middleware/auth');

const router = express.Router();

router.post('/join', async (req, res) => {
  const { clientId, referralCode } = req.body;

  const { data: client, error: clientError } = await supabase
    .from('users')
    .select('id, referrerId')
    .eq('id', clientId)
    .single();
  if (clientError && clientError.code !== 'PGRST116') {
    return res.status(500).json({ error: 'שגיאה בשליפת לקוח' });
  }
  if (!client) {
    return res.status(404).json({ error: 'לקוח לא נמצא' });
  }
  if (client.referrerId) {
    return res.status(400).json({ error: 'הלקוח כבר שויך למפנה' });
  }

  const referrer = await getUserByReferralCode(referralCode);
  if (!referrer) {
    return res.status(404).json({ error: 'קוד הפניה לא תקין' });
  }

  const { error: updateClientError } = await supabase
    .from('users')
    .update({ referrerId: referrer.id })
    .eq('id', client.id);
  if (updateClientError) {
    return res.status(500).json({ error: 'שגיאה בשיוך לקוח' });
  }

  const { data: updatedReferrer, error: updateRefError } = await supabase
    .from('users')
    .update({ points: referrer.points + 1 })
    .eq('id', referrer.id)
    .select('points')
    .single();
  if (updateRefError) {
    return res.status(500).json({ error: 'שגיאה בעדכון נקודות' });
  }

  res.json({ message: 'הנקודות הוקצו', referrerPoints: updatedReferrer.points });
const { users } = require('../middleware/auth');
const { getErrorMessage } = require('../services/errorMessages');
const User = require('../models/User');

const router = express.Router();

// Assign points to referrer when a client joins with a referral code
router.post('/join', async (req, res) => {
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
  try {
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'לקוח לא נמצא' });
    }

    if (client.referrerId) {
      return res.status(400).json({ error: 'הלקוח כבר שויך למפנה' });
    }

    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(404).json({ error: 'קוד הפניה לא תקין' });
    }

    client.referrerId = referrer._id;
    await client.save();

    referrer.points = (referrer.points || 0) + 1;
    await referrer.save();

    res.json({ message: 'הנקודות הוקצו', referrerPoints: referrer.points });
  } catch (err) {
    console.error('Referral error:', err);
    res.status(500).json({ error: 'שגיאה בעיבוד הפניה' });
  }
});

module.exports = router;
