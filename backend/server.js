const express = require('express');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const scheduleRoutes = require('./routes/schedule');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/ai', aiRoutes);
app.use('/schedule', scheduleRoutes);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

module.exports = app;
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const caseRoutes = require('./routes/cases');
const logRoutes = require('./routes/logs');
const User = require('./models/User');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', users: require('./middleware/auth').users.length });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
connectDB().catch(err => console.error('DB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/logs', logRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ status: 'ok', users: count });
  } catch (err) {
    res.json({ status: 'ok', users: 0 });
  }
});

const PORT = process.env.PORT || 5001;
if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET environment variable. Set it before starting the server.');
  process.exit(1);
}
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
