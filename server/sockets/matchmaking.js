const { enqueue, dequeue, removeFromQueue, isInQueue } = require('../utils/matchQueue');
const { createRoom, getRoomBySocket, getPartner, destroyRoom } = require('../utils/roomManager');

const handleMatchmaking = (io, socket) => {
  socket.on('find_match', async ({ mode = 'both' }) => {
    try {
      const alreadyInRoom = await getRoomBySocket(socket.id);
      if (alreadyInRoom) return;

      const alreadyQueued = await isInQueue(socket.id);
      if (alreadyQueued) return;

      const waiting = await dequeue();

      if (waiting && waiting.socketId !== socket.id) {
        const partnerSocket = io.sockets.sockets.get(waiting.socketId);
        if (!partnerSocket) {
          await enqueue(socket.id, mode);
          return;
        }

        const roomId = await createRoom(socket.id, waiting.socketId, mode);

        socket.join(roomId);
        partnerSocket.join(roomId);

        const matchData = { roomId, mode };
        socket.emit('match_found', matchData);
        partnerSocket.emit('match_found', matchData);

        console.log(`[Convora] Matched ${socket.id} <-> ${waiting.socketId} in room ${roomId}`);
      } else {
        await enqueue(socket.id, mode);
        socket.emit('waiting');
        console.log(`[Convora] ${socket.id} added to queue`);
      }
    } catch (err) {
      console.error('[Matchmaking error]', err);
      socket.emit('error', { message: 'Matchmaking failed. Please try again.' });
    }
  });

  socket.on('skip', async () => {
    try {
      const room = await getRoomBySocket(socket.id);
      if (!room) return;

      const partnerId = await getPartner(socket.id);
      const partnerSocket = partnerId ? io.sockets.sockets.get(partnerId) : null;

      io.to(room.id).emit('partner_left', { reason: 'skipped' });

      socket.leave(room.id);
      if (partnerSocket) partnerSocket.leave(room.id);

      await destroyRoom(room.id, socket.id, partnerId || '');

      if (partnerSocket) {
        await enqueue(partnerId, room.mode);
        partnerSocket.emit('waiting');
      }
    } catch (err) {
      console.error('[Skip error]', err);
    }
  });

  socket.on('disconnect', async () => {
    try {
      await removeFromQueue(socket.id);

      const room = await getRoomBySocket(socket.id);
      if (!room) return;

      const partnerId = await getPartner(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('partner_left', { reason: 'disconnected' });
      }

      await destroyRoom(room.id, socket.id, partnerId || '');
    } catch (err) {
      console.error('[Disconnect cleanup error]', err);
    }
  });
};

module.exports = { handleMatchmaking };
