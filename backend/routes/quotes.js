const express = require('express');
const { createQuote, setStatus, activateQuote } = require('../models/quote');

const router = express.Router();

router.post('/', (req, res) => {
  const { client, details, amount, status } = req.body;
  const quote = createQuote({ client, details, amount, status });
  res.status(201).json(quote);
});

router.post('/:id/send', (req, res) => {
  const quote = setStatus(req.params.id, 'sent');
  if (!quote) {
    return res.status(404).json({ error: 'Quote not found' });
  }
  res.json(quote);
});

router.post('/:id/activate', (req, res) => {
  const client = activateQuote(req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Quote not found' });
  }
  res.json({ message: 'Quote converted to active client', client });
});

module.exports = router;

