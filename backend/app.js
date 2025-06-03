const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Public routes for auth (register/login)
const clubRoutes = require('./routes/clubRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Admin routes for club management
const protectedRoutes = require('./routes/protectedRoutes'); // Routes requiring JWT + role check
const errorHandler = require('./middleware/errorHandler');   // Global error handler middleware

const app = express();

app.use(cors());
app.use(express.json());

// Add BEFORE protected routes!
app.use('/api/auth', authRoutes);
app.use('/api', clubRoutes);
app.use('/api/admin', adminRoutes);
// Protected routes (JWT auth + role-based access)
app.use('/api/auth', protectedRoutes);

// Global error handler middleware
app.use(errorHandler);

module.exports = app;
