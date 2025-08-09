const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();
const refreshTokens = [];

function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  refreshTokens.push({ token: refreshToken, userId: user.id });
  return { accessToken, refreshToken };
}

// Rate limiting for auth endpoints
const WINDOW_MS = parseInt(process.env.AUTH_WINDOW_MS, 10) || 15 * 60 * 1000;
const MAX_REQUESTS = parseInt(process.env.AUTH_MAX_REQUESTS, 10) || 10;
const limitMessage = `יותר מדי ניסיונות התחברות, נסה שוב בעוד ${Math.floor(WINDOW_MS / 60000)} דקות`;
const authLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: limitMessage,
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'יותר מדי ניסיונות התחברות, נסה שוב בעוד 15 דקות',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP ${req.ip} on ${req.originalUrl}`);
    res.status(429).json({ error: limitMessage });
  },
});

// Registration endpoint
router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().withMessage('כתובת אימייל לא תקינה'),
    body('password').isLength({ min: 8 }).withMessage('סיסמה חייבת להכיל לפחות 8 תווים'),
    body('name').trim().isLength({ min: 2 }).withMessage('שם חייב להכיל לפחות 2 תווים'),
    body('role').isIn(['admin', 'lawyer', 'plaintiff', 'judge']).withMessage('תפקיד לא תקין')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'נתונים לא תקינים',
          details: errors.array()
        });
      }

      const { email, password, name, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'משתמש עם אימייל זה כבר קיים' });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate unique referral code
      let referralCode;
      do {
        referralCode = Math.random().toString(36).substring(2, 8);
      } while (await User.findOne({ referralCode }));

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        name,
        role,
        referralCode
      });
      await user.save();

      const { accessToken, refreshToken } = generateTokens(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 604800000
      });

      console.log(`New user registered: ${email} (${role})`);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: 'משתמש נוצר בהצלחה',
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          points: user.points,
          referralCode: user.referralCode,
          referrerId: user.referrerId
        }
        token,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'שגיאה ביצירת משתמש' });
    }
  }
);

// Login endpoint
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('כתובת אימייל לא תקינה'),
    body('password').exists().withMessage('סיסמה נדרשת')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'נתונים לא תקינים',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
      }

      const { accessToken, refreshToken } = generateTokens(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 604800000
      });

      console.log(`User logged in: ${email} (${user.role})`);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        message: 'התחברת בהצלחה',
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          points: user.points,
          referralCode: user.referralCode,
          referrerId: user.referrerId
        }
        token,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'שגיאה בהתחברות' });
    }
  }
);

router.post('/refresh', async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ error: 'Missing refresh token' });
  }

  const stored = refreshTokens.find(t => t.token === token);
  if (!stored) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(u => u.id === payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    refreshTokens.splice(refreshTokens.indexOf(stored), 1);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 604800000
    });

    res.json({ token: accessToken, user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      points: user.points,
      referralCode: user.referralCode,
      referrerId: user.referrerId
    }});
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    const index = refreshTokens.findIndex(t => t.token === token);
    if (index !== -1) {
      refreshTokens.splice(index, 1);
    }
  }
  res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });
// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'התנתקת בהצלחה' });
});

module.exports = router;
module.exports = router;
