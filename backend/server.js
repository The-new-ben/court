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
