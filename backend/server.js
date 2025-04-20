require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createLogger, format, transports } = require('winston'); // Added format here
const { connectDB, checkDBHealth } = require('./config/db');

// Initialize Express
const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logger configuration
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new transports.File({ filename: 'logs/server.log' })
  ]
});

// Database connection
connectDB().then(() => {
  logger.info('Database connection established');
}).catch(err => {
  logger.error(`Database connection failed: ${err.message}`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbHealth = checkDBHealth();
  const status = dbHealth.status === 'healthy' ? 200 : 503;
  
  res.status(status).json({
    status: dbHealth.status,
    database: dbHealth,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/schedules', require('./routes/schedules'));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = server;