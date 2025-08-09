const { addPoints, getPoints } = require('../models/userPoints');

function awardPoints(userId, amount) {
  return addPoints(userId, amount);
}

module.exports = { awardPoints, getPoints };
