const mongoose = require('mongoose');

async function connect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}

module.exports = connect;
const subscriptionPackages = [
  { id: 'basic', name: 'Basic', price: 50, interval: 'month' },
  { id: 'pro', name: 'Pro', price: 100, interval: 'month' },
  { id: 'enterprise', name: 'Enterprise', price: 250, interval: 'month' }
];

const clientSubscriptions = [];

module.exports = { subscriptionPackages, clientSubscriptions };
