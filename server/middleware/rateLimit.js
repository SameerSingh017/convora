const rateLimit = require('express-rate-limit');

const reportLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: 'Too many reports submitted. Please wait before trying again.' },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests. Slow down.' },
});

module.exports = { reportLimiter, apiLimiter };
