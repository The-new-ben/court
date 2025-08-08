const express = require('express');
const router = express.Router();
const { addEntry, popEntry } = require('../db');
const { sendWaitlistEmail } = require('../services/notifications');

const LOBBY_CAPACITY = 10;
let currentParticipants = 0;

router.post('/join', (req, res) => {
  if (currentParticipants >= LOBBY_CAPACITY) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    const entry = addEntry(email);
    return res.status(200).json({ waitlisted: true, entry });
  }
  currentParticipants += 1;
  res.json({ waitlisted: false });
});

router.post('/leave', async (req, res) => {
  if (currentParticipants > 0) {
    currentParticipants -= 1;
  }
  const next = popEntry();
  if (next) {
    await sendWaitlistEmail(next.email);
  }
  res.json({ success: true });
});

module.exports = router;
