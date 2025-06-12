const { rateLimit } = require('express-rate-limit');
const logSecurityEvent = require('../utils/logSecurityEvent');

const basicRateLimiter = rateLimit({
  windowMs: 10* 60 * 1000, // 10 minutes
  max: 150, // Max 50 requests in 10 mins (all endpoints)

  handler: async (req, res) => {
    console.log(`Rate limit hit by IP: ${req.ip}`);

    await logSecurityEvent('GLOBAL_RATE_LIMIT_HIT', 'Too many requests from single IP', {
      ip: req.ip,
      path: req.originalUrl,
      userAgent: req.headers['user-agent']
    });

    return res.status(429).json({
      error: 'Too many requests from this IP, please try again later.'
    });
  },

  standardHeaders: true,
  legacyHeaders: false,
});

const bookingRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 booking attempts per IP in 15 minutes
  handler: async (req, res) => {
    console.log(`Booking rate limit hit by IP: ${req.ip}`);
    
    await logSecurityEvent('BOOKING_RATE_LIMIT_HIT', 'Too many booking attempts from single IP', {
      ip: req.ip,
      path: req.originalUrl,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id || 'anonymous'
    });

    return res.status(429).json({
      error: 'Too many booking attempts. Please wait before trying again.',
      message: 'Rate limit exceeded for booking requests'
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP address as the key for rate limiting
    return req.ip;
  }
});



// 2. Export map to track failed login attempts
const failedLoginAttempts = new Map();

const loginAttemptLimiter = async (req, res, next) => {
  const ip = req.ip;
  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 10 * 60 * 1000; // 10 minutes

  const record = failedLoginAttempts.get(ip);

  if (record) {
    const { count, lastAttempt } = record;
    const timeElapsed = Date.now() - lastAttempt;

    if (count >= MAX_FAILED_ATTEMPTS && timeElapsed < LOCKOUT_DURATION) {
  await logSecurityEvent('LOGIN_BLOCKED', 'Blocked IP attempted login', {
    ip:req.ip,
    path: req.originalUrl,
    userAgent: req.headers['user-agent'],
  });

      return res.status(429).json({
        message: 'Too many failed login attempts. Try again after 10 minutes.',
      });
    }

    if (timeElapsed >= LOCKOUT_DURATION) {
      failedLoginAttempts.delete(ip);
    }
  }

  next();
};

module.exports = {
  basicRateLimiter,
  bookingRateLimiter,
  loginAttemptLimiter,
  failedLoginAttempts,
};
