const { Server } = require('socket.io');

const bannedUsers = new Set();
const bannedWords = ['badword1', 'badword2'];

function isClean(message) {
  const regex = new RegExp(bannedWords.join('|'), 'i');
  return !regex.test(message);
}

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth?.userId;
    if (userId && bannedUsers.has(userId)) {
      return next(new Error('blocked'));
    }
    socket.userId = userId || socket.id;
    next();
  });

  io.on('connection', (socket) => {
    socket.on('chat-message', (msg) => {
      if (!isClean(msg)) {
        socket.emit('chat-error', 'Message contains prohibited content');
        return;
      }
      io.emit('chat-message', { userId: socket.userId, message: msg });
    });

    socket.on('block-user', (id) => {
      if (!id) return;
      bannedUsers.add(id);
      for (const [sid, s] of io.sockets.sockets) {
        if (s.userId === id) {
          s.disconnect(true);
        }
      }
    });
  });

  return io;
}

module.exports = { initSocket, bannedUsers };
