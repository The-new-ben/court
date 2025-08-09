const { subscriptionPackages, clientSubscriptions } = require('../db');

function processBilling(subscription) {
  const pkg = subscriptionPackages.find(p => p.id === subscription.packageId);
  if (!pkg) return;
  console.log(`Billing client ${subscription.clientId} for ${pkg.name} - ${pkg.price}`);
  const next = new Date(subscription.nextBillingDate);
  next.setMonth(next.getMonth() + 1);
  subscription.nextBillingDate = next.toISOString();
}

function startBillingScheduler() {
  setInterval(() => {
    const now = new Date();
    clientSubscriptions.forEach(sub => {
      if (new Date(sub.nextBillingDate) <= now) {
        processBilling(sub);
      }
    });
  }, 24 * 60 * 60 * 1000);
}

module.exports = { startBillingScheduler };
