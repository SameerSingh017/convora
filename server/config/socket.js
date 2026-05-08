const { Server } = require('socket.io');
const { handleMatchmaking } = require('../sockets/matchmaking');
const { handleChat } = require('../sockets/chat');
const { handleWebRTC } = require('../sockets/webrtc');

let io;

const broadcastOnlineCount = () => {
  if (!io) return;
  const count = io.engine.clientsCount;
  io.emit('online_count', { count });
};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`[Convora] Socket connected: ${socket.id} | Online: ${io.engine.clientsCount}`);

    // Send current count immediately to this socket, then broadcast to all
    socket.emit('online_count', { count: io.engine.clientsCount });
    broadcastOnlineCount();

    handleMatchmaking(io, socket);
    handleChat(io, socket);
    handleWebRTC(io, socket);

    socket.on('disconnect', () => {
      console.log(`[Convora] Socket disconnected: ${socket.id} | Online: ${io.engine.clientsCount}`);
      setTimeout(broadcastOnlineCount, 100);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { initSocket, getIO };
