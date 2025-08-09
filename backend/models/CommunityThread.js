class CommunityThread {
  constructor({ id, caseId, title, comments = [] }) {
    this.id = id;
    this.caseId = caseId;
    this.title = title;
    this.comments = comments;
    this.createdAt = new Date().toISOString();
  }
}

const threads = [];

module.exports = { CommunityThread, threads };
