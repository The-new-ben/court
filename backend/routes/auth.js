const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { getUserByEmail, getUserByReferralCode, insertUser } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 900000,
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'יותר מדי ניסיונות התחברות, נסה שוב בעוד 15 דקות',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register',
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

      const existingUser = await getUserByEmail(email);
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'משתמש עם אימייל זה כבר קיים' });
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      let referralCode;
      do {
        referralCode = Math.random().toString(36).slice(2, 8);
      } while (await getUserByReferralCode(referralCode));

      const newUser = await insertUser({
        referralCode = Math.random().toString(36).substring(2, 8);
      } while (await User.findOne({ referralCode }));

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        name,
        role,
        createdAt: new Date().toISOString(),
        points: 0,
        referralCode,
        referrerId: null
      });

        referralCode
      });
      await user.save();

      // Generate JWT
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'משתמש נוצר בהצלחה',
        token,
        user: newUser
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'שגיאה ביצירת משתמש' });
    }
  }
);

router.post('/login',
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

      const user = await getUserByEmail(email);
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'התחברת בהצלחה',
        token,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'שגיאה בהתחברות' });
    }
  }
);

module.exports = router;
