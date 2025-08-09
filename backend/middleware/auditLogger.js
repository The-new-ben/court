const auditLogs = [];

function createAuditLogger(action) {
  return (req, res, next) => {
    const user = req.user ? req.user.email || req.user.id : 'anonymous';
    auditLogs.push({
      user,
      action,
      timestamp: new Date().toISOString()
    });
    next();
  };
}

function queryLogs(filters = {}) {
  return auditLogs.filter(log => {
    if (filters.user && log.user !== filters.user) return false;
    if (filters.action && log.action !== filters.action) return false;
    return true;
  });
}

module.exports = { createAuditLogger, queryLogs, auditLogs };
