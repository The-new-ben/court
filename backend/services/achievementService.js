const ACHIEVEMENTS = [
  { id: 'rookie', name: 'Rookie Attorney', minCases: 5, minSuccessRate: 0.5 },
  { id: 'seasoned', name: 'Seasoned Counsel', minCases: 20, minSuccessRate: 0.7 },
  { id: 'veteran', name: 'Veteran Litigator', minCases: 50, minSuccessRate: 0.85 }
];

function calculateAchievements(caseCount, successRate) {
  return ACHIEVEMENTS.filter(
    a => caseCount >= a.minCases && successRate >= a.minSuccessRate
  );
}

function assignAchievements(attorney) {
  const achievements = calculateAchievements(
    attorney.caseCount,
    attorney.successRate
  );
  return { ...attorney, achievements };
}

module.exports = {
  ACHIEVEMENTS,
  calculateAchievements,
  assignAchievements
};
