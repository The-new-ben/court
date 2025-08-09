const jwt = require('jsonwebtoken');

// In-memory user storage (replace with database in production)
const users = [];

// Supported roles in the system
const VALID_ROLES = ['admin', 'judge', 'lawyer', 'litigant', 'clerk'];

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'לא מחובר - נדרש טוקן אימות' });
  }

  const token = authHeader.substring(7);

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

module.exports = { authMiddleware, requireRole, users, VALID_ROLES };
module.exports = { authMiddleware, requireRole };
