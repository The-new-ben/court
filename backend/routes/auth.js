const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { users } = require('../middleware/auth');

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
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'יותר מדי ניסיונות התחברות, נסה שוב בעוד 15 דקות',
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration endpoint
router.post('/register', 
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
      const existingUser = users.find(u => u.email === email);
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
      } while (users.find(u => u.referralCode === referralCode));

      // Create user with referral fields
      const user = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        name,
        role,
        createdAt: new Date().toISOString(),
        points: 0,
        referralCode,
        referrerId: null
      };

      users.push(user);

      const { accessToken, refreshToken } = generateTokens(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 604800000
      });

      console.log(`New user registered: ${email} (${role})`);

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
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'שגיאה ביצירת משתמש' });
    }
  }
);

// Login endpoint
router.post('/login',
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
      const user = users.find(u => u.email === email);
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
  res.json({ message: 'התנתקת בהצלחה' });
});

module.exports = router;