const jwt = require('jsonwebtoken');
const connect = require('../db');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'לא מחובר - נדרש טוקן אימות' });
  }
  const token = authHeader.substring(7);
function authMiddleware(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'לא מחובר - נדרש טוקן אימות' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'לא מחובר - נדרש טוקן אימות' });
  }

  const token = authHeader.substring(7);

  try {
    await connect();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'לא מחובר - נדרש טוקן אימות' });
    }
    req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ error: 'טוקן לא תקין או פג תוקף' });
  }
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'לא מחובר' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'אין הרשאה לפעולה זו' });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };
module.exports = { authMiddleware, requireRole };
