const jwt = require('jsonwebtoken');

// In-memory user storage (replace with database in production)
const users = [];

function authMiddleware(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'לא מחובר - נדרש טוקן אימות' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ error: 'טוקן לא תקין או פג תוקף' });
  }
}

// Role-based access control
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

module.exports = { authMiddleware, requireRole, users };