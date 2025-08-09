const subscriptionPackages = [
  { id: 'basic', name: 'Basic', price: 50, interval: 'month' },
  { id: 'pro', name: 'Pro', price: 100, interval: 'month' },
  { id: 'enterprise', name: 'Enterprise', price: 250, interval: 'month' }
];

const clientSubscriptions = [];

module.exports = { subscriptionPackages, clientSubscriptions };
