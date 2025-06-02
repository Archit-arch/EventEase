const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Public routes for auth (register/login)
const protectedRoutes = require('./routes/protectedRoutes'); // Routes requiring JWT + role check
const errorHandler = require('./middleware/errorHandler');   // Global error handler middleware

const app = express();

app.use(cors());
app.use(express.json());

// Add BEFORE protected routes!
app.use('/api/auth', authRoutes);

// Protected routes (JWT auth + role-based access)
app.use('/api/auth', protectedRoutes);

// Global error handler middleware
app.use(errorHandler);

module.exports = app;
