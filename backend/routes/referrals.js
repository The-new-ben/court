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
});

module.exports = router;
