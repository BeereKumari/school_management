/**
 * Global Error Handler
 * Description: Centralized Express error-handling middleware.
 *              Logs errors and returns consistent JSON response.
 * Author: SchoolMap Dev Team
 * Date: 2026-05-10
 */

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err.message);
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
