/**
 * Express Application Setup
 * Description: Configures Express middleware, CORS, static files,
 *              health check, API routes, 404 handler, and error handler.
 * Author: SchoolMap Dev Team
 * Date: 2026-05-10
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const { addSchool, listSchools } = require('./src/controllers/schoolController');
const {
  addSchoolRules,
  listSchoolsRules,
  validate,
} = require('./src/validators/schoolValidator');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Manual CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Request logger (for debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'School Management API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      addSchool: 'POST /addSchool',
      listSchools: 'GET /listSchools?latitude=&longitude=',
    },
  });
});

// API routes (defined directly on app for reliability)
app.post('/addSchool', addSchoolRules, validate, addSchool);
app.get('/listSchools', listSchoolsRules, validate, listSchools);

// Static files (serves frontend assets like css, js, and index.html for /)
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/postman', express.static(path.join(__dirname, 'postman')));

// 404 API handler — returns JSON for API paths, otherwise fall through
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.originalUrl} — Route not found`);
  // If request accepts HTML, serve the frontend (SPA fallback)
  if (req.accepts('html')) {
    return res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  }
  return res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
