require('dotenv').config();
const mongoose = require('mongoose');
const { createLogger, format, transports } = require('winston');

// Configure logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/db.log' })
  ]
});

// Connection options with production tuning
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 50,
  minPoolSize: 10,
  retryWrites: true,
  retryReads: true,
  connectTimeoutMS: 30000,
  heartbeatFrequencyMS: 10000,
  appName: 'med-tracker-api'
};

// Connection state management
let isConnected = false;
let retryAttempts = 0;
const MAX_RETRY_ATTEMPTS = 5;

const connectWithRetry = async () => {
  try {
    if (isConnected) return;
    
    logger.info('Attempting MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    
    isConnected = true;
    retryAttempts = 0;
    logger.info('MongoDB connected successfully');
    
    // Configure connection events
    mongoose.connection.on('connected', () => {
      isConnected = true;
      logger.info('Mongoose connected to DB cluster');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err.message}`);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from DB');
      isConnected = false;
      if (retryAttempts < MAX_RETRY_ATTEMPTS) {
        retryAttempts++;
        logger.info(`Attempting reconnect (${retryAttempts}/${MAX_RETRY_ATTEMPTS})...`);
        setTimeout(connectWithRetry, 5000);
      }
    });

  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    isConnected = false;
    
    if (retryAttempts < MAX_RETRY_ATTEMPTS) {
      retryAttempts++;
      logger.info(`Retrying connection (${retryAttempts}/${MAX_RETRY_ATTEMPTS}) in 5 seconds...`);
      setTimeout(connectWithRetry, 5000);
    } else {
      logger.error('Max retry attempts reached. Exiting...');
      process.exit(1);
    }
  }
};

// Health check function
const checkDBHealth = () => {
  return {
    status: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy',
    readyState: mongoose.connection.readyState,
    dbStats: mongoose.connection.db ? 'available' : 'unavailable'
  };
};

// Graceful shutdown handler
const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Mongoose connection closed through app termination');
    process.exit(0);
  } catch (err) {
    logger.error(`Error closing MongoDB connection: ${err.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = {
  connectDB: connectWithRetry,
  checkDBHealth,
  isConnected: () => isConnected
};