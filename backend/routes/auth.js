const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { users } = require('../middleware/auth');
const { getErrorMessage } = require('../services/errorMessages');
const User = require('../models/User');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'יותר מדי ניסיונות התחברות, נסה שוב בעוד 15 דקות',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: getErrorMessage('TOO_MANY_ATTEMPTS', req.headers['accept-language']) });
  }
});

// Registration endpoint
router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().withMessage((value, { req }) =>
      getErrorMessage('INVALID_EMAIL', req.headers['accept-language'])
    ),
    body('password').isLength({ min: 8 }).withMessage((value, { req }) =>
      getErrorMessage('PASSWORD_TOO_SHORT', req.headers['accept-language'])
    ),
    body('name').trim().isLength({ min: 2 }).withMessage((value, { req }) =>
      getErrorMessage('NAME_TOO_SHORT', req.headers['accept-language'])
    ),
    body('role').isIn(['admin', 'lawyer', 'plaintiff', 'judge']).withMessage((value, { req }) =>
      getErrorMessage('INVALID_ROLE', req.headers['accept-language'])
    )
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: getErrorMessage('INVALID_DATA', req.headers['accept-language']),
          error: 'נתונים לא תקינים',
          details: errors.array()
        });
      }

      const { email, password, name, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: getErrorMessage('USER_EXISTS', req.headers['accept-language']) });
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

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log(`New user registered: ${email} (${role})`);

      res.status(201).json({
        message: 'משתמש נוצר בהצלחה',
        token,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: getErrorMessage('USER_CREATION_ERROR', req.headers['accept-language']) });
    }
  }
);

// Login endpoint
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage((value, { req }) =>
      getErrorMessage('INVALID_EMAIL', req.headers['accept-language'])
    ),
    body('password').exists().withMessage((value, { req }) =>
      getErrorMessage('PASSWORD_REQUIRED', req.headers['accept-language'])
    )
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: getErrorMessage('INVALID_DATA', req.headers['accept-language']),
          error: 'נתונים לא תקינים',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: getErrorMessage('INVALID_CREDENTIALS', req.headers['accept-language']) });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: getErrorMessage('INVALID_CREDENTIALS', req.headers['accept-language']) });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log(`User logged in: ${email} (${user.role})`);

      res.json({
        message: 'התחברת בהצלחה',
        token,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: getErrorMessage('LOGIN_ERROR', req.headers['accept-language']) });
    }
  }
);

module.exports = router;
