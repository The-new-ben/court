const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'viewer_points.json');

function loadDb() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch {
    return {};
  }
}

function saveDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function getPoints(viewerId) {
  const db = loadDb();
  return db[viewerId]?.points || 0;
}

const ACTION_POINTS = { vote: 1, comment: 2, share: 3 };

function incrementPoints(viewerId, action) {
  const db = loadDb();
  const current = db[viewerId]?.points || 0;
  const points = current + (ACTION_POINTS[action] || 0);
  db[viewerId] = { points };
  saveDb(db);
  return { points, badge: getBadge(points) };
}

function getBadge(points) {
  if (points >= 100) return 'gold';
  if (points >= 50) return 'silver';
  if (points >= 10) return 'bronze';
  return null;
}

module.exports = { getPoints, incrementPoints, getBadge };

const { addPoints, getPoints } = require('../models/userPoints');

function awardPoints(userId, amount) {
  return addPoints(userId, amount);
}

module.exports = { awardPoints, getPoints };
