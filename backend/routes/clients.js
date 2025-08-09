const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { Client, clients } = require('../models/client');
const { getErrorMessage } = require('../services/errorMessages');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  res.json(clients);
});

router.get('/:id', authMiddleware, (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: getErrorMessage('CLIENT_NOT_FOUND', req.headers['accept-language']) });
  }
  res.json(client);
});

router.post('/', authMiddleware, (req, res) => {
  const { name, email, phone, history = [] } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: getErrorMessage('MISSING_CLIENT_DETAILS', req.headers['accept-language']) });
  }
  const client = new Client({ name, email, phone, history });
  clients.push(client);
  res.status(201).json(client);
});

router.put('/:id', authMiddleware, (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ error: getErrorMessage('CLIENT_NOT_FOUND', req.headers['accept-language']) });
  }
  const { name, email, phone, history } = req.body;
  if (name !== undefined) client.name = name;
  if (email !== undefined) client.email = email;
  if (phone !== undefined) client.phone = phone;
  if (history !== undefined) client.history = history;
  res.json(client);
});

router.delete('/:id', authMiddleware, (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: getErrorMessage('CLIENT_NOT_FOUND', req.headers['accept-language']) });
  }
  const removed = clients.splice(index, 1)[0];
  res.json(removed);
});

module.exports = router;
