const proBonoLogs = [];

function logProBonoHours(userId, hours, details = '') {
  const parsedHours = Number(hours);
  if (!userId || Number.isNaN(parsedHours) || parsedHours <= 0) {
    return;
  }
  proBonoLogs.push({
    userId,
    hours: parsedHours,
    details,
    timestamp: new Date().toISOString()
  });
}

function getUserTotalHours(userId) {
  return proBonoLogs
    .filter(log => log.userId === userId)
    .reduce((sum, log) => sum + log.hours, 0);
}

function getLeaderboard(limit = 10) {
  const totals = {};
  for (const log of proBonoLogs) {
    totals[log.userId] = (totals[log.userId] || 0) + log.hours;
  }
  return Object.entries(totals)
    .map(([userId, hours]) => ({ userId, hours }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, limit);
}

module.exports = {
  proBonoLogs,
  logProBonoHours,
  getUserTotalHours,
  getLeaderboard
};
