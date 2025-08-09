const { Server } = require('ws');

class AnalyticsService {
  constructor() {
    this.stats = { viewers: 0, votes: 0, comments: 0 };
    this.wss = null;
  }

  attach(server) {
    server.on('connection', (socket) => {
      this.stats.viewers++;
      this.broadcast();
      socket.on('close', () => {
        this.stats.viewers--;
        this.broadcast();
      });
    });

    this.wss = new Server({ server });
  }

  incrementVotes() {
    this.stats.votes++;
    this.broadcast();
  }

  incrementComments() {
    this.stats.comments++;
    this.broadcast();
  }

  broadcast() {
    if (!this.wss) return;
    const data = JSON.stringify(this.stats);
    for (const client of this.wss.clients) {
      if (client.readyState === client.OPEN) {
        client.send(data);
      }
    }
  }

  getStats() {
    return this.stats;
  }
}

module.exports = new AnalyticsService();
