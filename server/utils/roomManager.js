const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryStrategy: (times) => {
    if (times > 5) return null;
    return Math.min(times * 500, 3000);
  },
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

redis.on('error', (err) => {
  console.error('[Redis/roomManager error]', err.message);
});

const ROOM_PREFIX = 'convora:room:';

const createRoom = async (socketIdA, socketIdB, mode) => {
  const roomId = `room_${uuidv4()}`;
  const room = {
    id: roomId,
    participants: [socketIdA, socketIdB],
    mode,
    createdAt: Date.now(),
  };
  await redis.set(`${ROOM_PREFIX}${roomId}`, JSON.stringify(room), 'EX', 7200);
  await redis.set(`${ROOM_PREFIX}socket:${socketIdA}`, roomId, 'EX', 7200);
  await redis.set(`${ROOM_PREFIX}socket:${socketIdB}`, roomId, 'EX', 7200);
  return roomId;
};

const getRoomBySocket = async (socketId) => {
  const roomId = await redis.get(`${ROOM_PREFIX}socket:${socketId}`);
  if (!roomId) return null;
  const room = await redis.get(`${ROOM_PREFIX}${roomId}`);
  return room ? JSON.parse(room) : null;
};

const getPartner = async (socketId) => {
  const room = await getRoomBySocket(socketId);
  if (!room) return null;
  return room.participants.find((id) => id !== socketId) || null;
};

const destroyRoom = async (roomId, socketIdA, socketIdB) => {
  await redis.del(`${ROOM_PREFIX}${roomId}`);
  await redis.del(`${ROOM_PREFIX}socket:${socketIdA}`);
  await redis.del(`${ROOM_PREFIX}socket:${socketIdB}`);
};

module.exports = { createRoom, getRoomBySocket, getPartner, destroyRoom };
