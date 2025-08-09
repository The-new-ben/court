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
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'waitlist.json');

function readWaitlist() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeWaitlist(entries) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
}

function addEntry(email) {
  const entries = readWaitlist();
  const entry = { email, timestamp: new Date().toISOString() };
  entries.push(entry);
  writeWaitlist(entries);
  return entry;
}

function popEntry() {
  const entries = readWaitlist();
  const entry = entries.shift();
  writeWaitlist(entries);
  return entry;
}

module.exports = { addEntry, popEntry };
const subscriptionPackages = [
  { id: 'basic', name: 'Basic', price: 50, interval: 'month' },
  { id: 'pro', name: 'Pro', price: 100, interval: 'month' },
  { id: 'enterprise', name: 'Enterprise', price: 250, interval: 'month' }
];

const clientSubscriptions = [];

module.exports = { subscriptionPackages, clientSubscriptions };
