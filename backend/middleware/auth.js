const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

function authMiddleware(req, res, next) {
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
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
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

async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('id,email,password,name,role,points,referralCode,referrerId,createdAt')
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function getUserByReferralCode(code) {
  const { data, error } = await supabase
    .from('users')
    .select('id,email,password,name,role,points,referralCode,referrerId,createdAt')
    .eq('referralCode', code)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function insertUser(user) {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select('id,email,name,role,points,referralCode,referrerId,createdAt')
    .single();
  if (error) throw error;
  return data;
}

async function getUserCount() {
  const { count, error } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true });
  if (error) throw error;
  return count;
}

module.exports = {
  authMiddleware,
  requireRole,
  getUserByEmail,
  getUserByReferralCode,
  insertUser,
  getUserCount,
  supabase
};
module.exports = { authMiddleware, requireRole };
