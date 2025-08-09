const userPoints = new Map();

function getPoints(userId) {
  return userId ? (userPoints.get(userId) || 0) : 0;
}

function addPoints(userId, amount) {
  if (!userId || typeof amount !== 'number') {
    throw new Error('Invalid parameters');
  }
  const newTotal = getPoints(userId) + amount;
  userPoints.set(userId, newTotal);
  return newTotal;
}

module.exports = { getPoints, addPoints };
