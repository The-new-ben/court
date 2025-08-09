const Challenge = require('../models/challenge');

const challenges = [];

function addChallenge(type, date, completionCondition) {
  const challenge = new Challenge(type, date, completionCondition);
  challenges.push(challenge);
  return challenge;
}

function trackProgress(type, value) {
  const challenge = challenges.find(c => c.type === type);
  if (challenge) {
    challenge.updateProgress(value);
  }
  return challenge;
}

function listChallenges() {
  return challenges;
}

module.exports = {
  addChallenge,
  trackProgress,
  listChallenges
};
