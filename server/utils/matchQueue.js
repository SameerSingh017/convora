const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  tls: process.env.NODE_ENV === 'production' ? {} : undefined,
  retryStrategy: (times) => {
    if (times > 5) {
      console.error('[Convora] Redis connection failed after 5 retries. Is Redis running?');
      return null;
    }
    return Math.min(times * 500, 3000);
  },
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

redis.on('error', (err) => {
  console.error('[Redis error]', err.message);
});

redis.on('connect', () => {
  console.log('[Convora] Redis connected successfully');
});

const QUEUE_KEY = 'convora:waiting_queue';

const enqueue = async (socketId, mode) => {
  const entry = JSON.stringify({ socketId, mode, joinedAt: Date.now() });
  await redis.rpush(QUEUE_KEY, entry);
};

const dequeue = async () => {
  const entry = await redis.lpop(QUEUE_KEY);
  return entry ? JSON.parse(entry) : null;
};

const removeFromQueue = async (socketId) => {
  const all = await redis.lrange(QUEUE_KEY, 0, -1);
  for (const entry of all) {
    const parsed = JSON.parse(entry);
    if (parsed.socketId === socketId) {
      await redis.lrem(QUEUE_KEY, 1, entry);
      return true;
    }
  }
  return false;
};

const getQueueLength = async () => {
  return await redis.llen(QUEUE_KEY);
};

const isInQueue = async (socketId) => {
  const all = await redis.lrange(QUEUE_KEY, 0, -1);
  return all.some((e) => JSON.parse(e).socketId === socketId);
};

module.exports = { enqueue, dequeue, removeFromQueue, getQueueLength, isInQueue };
