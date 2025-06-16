const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const clubRoutes = require('./routes/clubRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const errorHandler = require('./middleware/errorHandler');
const { basicRateLimiter, loginAttemptLimiter } = require('./middleware/loginLimiter');

const app = express();


//Prometheus metrics
// ✅ Prometheus Monitoring Setup
const client = require('prom-client');

// Create a new Registry
const register = new client.Registry();

// Enable default system + Node.js metrics
client.collectDefaultMetrics({ register });

// Optional: custom HTTP counter
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'statusCode']
});
register.registerMetric(httpRequestCounter);

// Middleware to count requests
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.route?.path || req.path, res.statusCode).inc();
  });
  next();
});

// /metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});


// ✅ 1. Helmet for security headers
app.use(helmet());

// ✅ 2. Content Security Policy (CSP) with frame-ancestors
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://eventease.centralindia.cloudapp.azure.com',
      'https://4.213.127.173',
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.gstatic.com',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'blob:',
    ],
    connectSrc: [
      "'self'",
      'https://eventease.centralindia.cloudapp.azure.com',
      'wss://eventease.centralindia.cloudapp.azure.com',
    ],
    objectSrc: ["'none'"],
    baseUri: ["'none'"],
    frameAncestors: ["'none'"], // ✅ Prevent clickjacking
    upgradeInsecureRequests: [],
    // reportUri: ['/csp-report'], // Optional for ASVS Level 3
  }
}));

// ✅ 3. Additional Security Headers
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('X-Content-Type-Options', 'nosniff'); // Anti-MIME sniffing

  next();
});

// ✅ 4. CORS – Allow only known frontend origins
const allowedOrigins = [
  'https://eventease.centralindia.cloudapp.azure.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy does not allow this origin'), false);
    }
  },
  credentials: true, // Send cookies across origin
}));

// ✅ 5. Body & Cookie Parsing
app.use(express.json());
app.use(cookieParser());

// ✅ 6. Cache Control for dynamic pages
app.use((req, res, next) => {
  if (!req.url.match(/\.(js|css|png|jpg|jpeg|svg|woff|woff2)$/)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});
// Disable the 'X-Powered-By' header
app.disable('x-powered-by'); // hides Express version

// ✅ 7. Global Rate Limiting Middleware
app.use(basicRateLimiter);

// ✅ 8. Static Asset Serving (with long-term caching)
app.use('/static', express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

// ✅ 9. Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', clubRoutes);

// ✅ 10. Protected Routes
app.use('/api/auth', protectedRoutes);

// ✅ 11. Global Error Handling
app.use(errorHandler);

// ✅ (Optional) CSP Violation Reporting Endpoint (L3)
// app.post('/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
//   console.warn('CSP Violation:', req.body);
//   res.status(204).end();
// });

module.exports = app;