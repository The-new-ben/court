const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const caseRoutes = require('./routes/cases');
const logRoutes = require('./routes/logs');
const { users } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/logs', logRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', users: users.length });
});

const PORT = process.env.PORT || 5001;
if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET environment variable. Set it before starting the server.');
  process.exit(1);
}
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
