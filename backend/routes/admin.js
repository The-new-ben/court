const express = require('express');
const { authMiddleware, requireRole, users, VALID_ROLES } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and admin role requirement to all admin routes
router.use(authMiddleware);
router.use(requireRole(['admin']));

// List all users without exposing passwords
router.get('/users', (req, res) => {
  const sanitized = users.map(({ password, ...u }) => u);
  res.json(sanitized);
});

// Update a user's role
router.put('/users/:id/role', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: 'תפקיד לא תקין' });
  }

  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'משתמש לא נמצא' });
  }

  user.role = role;
  res.json({
    message: 'תפקיד עודכן',
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

module.exports = router;
