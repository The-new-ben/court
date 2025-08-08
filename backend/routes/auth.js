const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const connect = require('../db');
const User = require('../models/User');

const router = express.Router();

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
      await connect();
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'משתמש עם אימייל זה כבר קיים' });
      }
      const user = await User.create({ email, password, name, role });
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      console.log(`New user registered: ${email} (${role})`);
      res.status(201).json({
        message: 'משתמש נוצר בהצלחה',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
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
      await connect();
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
      }
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      console.log(`User logged in: ${email} (${user.role})`);
      res.json({
        message: 'התחברת בהצלחה',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'שגיאה בהתחברות' });
    }
  }
);

module.exports = router;
