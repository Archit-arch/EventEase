const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/authRoutes');         // Public: login, register
const clubRoutes = require('./routes/clubRoutes');         // Organizer routes
const studentRoutes = require('./routes/studentRoutes');   // Public: student event views
const adminRoutes = require('./routes/adminRoutes');       // Admin dashboard & logs
const protectedRoutes = require('./routes/protectedRoutes'); // Routes that require JWT
const errorHandler = require('./middleware/errorHandler'); // Global error handler

const app = express();

// ✅ 1. Helmet for security headers
app.use(helmet());

// ✅ 2. Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
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
      'wss://eventease.centralindia.cloudapp.azure.com:5173',
    ],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));

// ✅ 3. CORS – Allow only known frontend origins with credentials (cookies)
const allowedOrigins = [
  'https://eventease.centralindia.cloudapp.azure.com:5173',
  'https://4.213.127.173:5173',
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

// ✅ 4. Body & Cookie Parsing
app.use(express.json());
app.use(cookieParser());

// ✅ 5. Cache Control for dynamic pages
app.use((req, res, next) => {
  if (!req.url.match(/\.(js|css|png|jpg|jpeg|svg|woff|woff2)$/)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// ✅ 6. Static Asset Serving (with long-term caching)
app.use('/static', express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

// ✅ 7. Public Routes
app.use('/api/auth', authRoutes);        // Login/Register
app.use('/api/students', studentRoutes); // Public: students view events
app.use('/api/admin', adminRoutes);      // Admin dashboard/logs
app.use('/api', clubRoutes);             // Organizer/club routes

// ✅ 8. Protected Routes (require JWT via cookie)
app.use('/api/auth', protectedRoutes);

// ✅ 9. Global Error Handling
app.use(errorHandler);

module.exports = app;
