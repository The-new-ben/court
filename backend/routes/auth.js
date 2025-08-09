const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { users } = require('../middleware/auth');
const { getErrorMessage } = require('../services/errorMessages');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
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
          details: errors.array()
        });
      }

      const { email, password, name, role } = req.body;

      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
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
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user
      const user = users.find(u => u.email === email);
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
      res.status(500).json({ error: getErrorMessage('LOGIN_ERROR', req.headers['accept-language']) });
    }
  }
);

module.exports = router;
