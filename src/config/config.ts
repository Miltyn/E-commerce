import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Interface for application configuration
interface AppConfig {
  env: string;
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  mongoURI: string;
  corsOrigin: string | string[];
  logLevel: string;
  uploadPath: string;
  maxFileSize: number;
  allowedFileTypes: string[];
}

// Default configuration values
const config: AppConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'qwertyuiop',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommercee',
  corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  logLevel: process.env.LOG_LEVEL || 'info',
  uploadPath: process.env.UPLOAD_PATH || 'public/uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/webp'],
};

// Validate critical configuration
const validateConfig = (): void => {
  if (config.env === 'production') {
    // Check if important configs are set in production
    if (config.jwtSecret === 'qwertyuiop') {
      console.warn('WARNING: Using default JWT secret in production. Set JWT_SECRET in your environment variables.');
    }
    

    

  }
};

// Run validation on startup
validateConfig();

export default config;

