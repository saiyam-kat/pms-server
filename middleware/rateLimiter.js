const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { msg: 'Too many requests, please try again later' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // sirf 10 login attempts per 15 min
  message: { msg: 'Too many login attempts, please try again later' }
});

module.exports = { limiter, authLimiter };