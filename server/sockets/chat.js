const { getPartner, getRoomBySocket } = require('../utils/roomManager');

const handleChat = (io, socket) => {
  socket.on('send_message', async ({ message }) => {
    try {
      if (!message || typeof message !== 'string') return;
      const trimmed = message.trim().slice(0, 500);
      if (!trimmed) return;

      const room = await getRoomBySocket(socket.id);
      if (!room) return;

      const partnerId = await getPartner(socket.id);
      if (!partnerId) return;

      io.to(partnerId).emit('receive_message', {
        message: trimmed,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('[Chat error]', err);
    }
  });

  socket.on('typing_start', async () => {
    try {
      const partnerId = await getPartner(socket.id);
      if (partnerId) io.to(partnerId).emit('partner_typing', { typing: true });
    } catch (err) {
      console.error('[Typing error]', err);
    }
  });

  socket.on('typing_stop', async () => {
    try {
      const partnerId = await getPartner(socket.id);
      if (partnerId) io.to(partnerId).emit('partner_typing', { typing: false });
    } catch (err) {
      console.error('[Typing stop error]', err);
    }
  });
};

module.exports = { handleChat };
