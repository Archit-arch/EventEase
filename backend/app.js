/*
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Public routes for auth (register/login)
const clubRoutes = require('./routes/clubRoutes');
const studentRoutes = require('./routes/studentRoutes'); // Public routes for students to view events
const adminRoutes = require('./routes/adminRoutes'); // Admin routes for club management
const protectedRoutes = require('./routes/protectedRoutes'); // Routes requiring JWT + role check
const errorHandler = require('./middleware/errorHandler');   // Global error handler middleware

const app = express();

app.use(cors());
app.use(express.json());

// Add BEFORE protected routes!
app.use('/api/auth', authRoutes);
app.use('/api/organizer', clubRoutes); 
app.use('/api/admin', adminRoutes);
// Protected routes (JWT auth + role-based access)
app.use('/api/auth', protectedRoutes);
app.use('/api/students', studentRoutes);

// Global error handler middleware
app.use(errorHandler);

module.exports = app;

*/
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Public routes for auth (register/login)
const clubRoutes = require('./routes/clubRoutes');
const studentRoutes = require('./routes/studentRoutes'); // Public routes for students to view events
const adminRoutes = require('./routes/adminRoutes'); // Admin routes for club management
const protectedRoutes = require('./routes/protectedRoutes'); // Routes requiring JWT + role check
const errorHandler = require('./middleware/errorHandler');   // Global error handler middleware

const helmet = require('helmet'); 
const app = express();

const allowedOrigins = [
  'https://eventease.centralindia.cloudapp.azure.com:5173',
  'https://4.213.127.173:5173',
];

app.use(helmet());

//Add custom Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // if needed for inline scripts (prefer to avoid)
      'https://eventease.centralindia.cloudapp.azure.com:5173',
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
      'https://eventease.centralindia.cloudapp.azure.com:5173',
      'wss://eventease.centralindia.cloudapp.azure.com:5173', // for websockets if used
    ],
    objectSrc: ["'none'"], // Block Flash, plugins, etc.
    upgradeInsecureRequests: [],
  },
}));

// For secure/dynamic content
app.use((req, res, next) => {
  if (!req.url.match(/\.(js|css|png|jpg|jpeg|svg|woff|woff2)$/)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// For static assets, use express.static with cache options
const path = require('path');
app.use('/static', express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));


app.use('/api', cors({
  origin: function(origin, callback) {
    // allow requests with no origin like mobile apps or curl requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy does not allow access from this origin'), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api', clubRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);

// Protected routes (JWT auth + role-based access)
app.use('/api/auth', protectedRoutes);

// Global error handler middleware
app.use(errorHandler);

module.exports = app;
