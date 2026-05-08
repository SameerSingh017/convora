const { getPartner } = require('../utils/roomManager');

const handleWebRTC = (io, socket) => {
  socket.on('webrtc_offer', async ({ offer }) => {
    try {
      const partnerId = await getPartner(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('webrtc_offer', { offer, from: socket.id });
      }
    } catch (err) {
      console.error('[WebRTC offer error]', err);
    }
  });

  socket.on('webrtc_answer', async ({ answer }) => {
    try {
      const partnerId = await getPartner(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('webrtc_answer', { answer, from: socket.id });
      }
    } catch (err) {
      console.error('[WebRTC answer error]', err);
    }
  });

  socket.on('webrtc_ice_candidate', async ({ candidate }) => {
    try {
      const partnerId = await getPartner(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('webrtc_ice_candidate', { candidate, from: socket.id });
      }
    } catch (err) {
      console.error('[ICE candidate error]', err);
    }
  });
};

module.exports = { handleWebRTC };
