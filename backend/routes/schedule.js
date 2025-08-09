const express = require('express');
const { createDefaultService } = require('../services/scheduleService');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const service = createDefaultService();

router.post('/propose', authMiddleware, async (req, res) => {
  try {
    const { parties, timeSlots } = req.body;
    if (!Array.isArray(parties) || !Array.isArray(timeSlots) || parties.length === 0 || timeSlots.length === 0) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    const sessionId = await service.proposeTimes(parties, timeSlots);
    res.json({ sessionId });
  } catch (err) {
    console.error('Propose error:', err);
    res.status(500).json({ error: 'Failed to propose times' });
  }
});

router.post('/confirm/:sessionId', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { selectedTime } = req.body;
    if (!selectedTime) {
      return res.status(400).json({ error: 'selectedTime is required' });
    }
    await service.confirmTime(sessionId, selectedTime);
    res.json({ success: true });
  } catch (err) {
    console.error('Confirm error:', err);
    res.status(500).json({ error: 'Failed to confirm time' });
  }
});

module.exports = router;
