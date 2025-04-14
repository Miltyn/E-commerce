import express from "express";
import connectDB from './config/db';
import { rootRouter } from './routes/index';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import config from './config/config';
import { errorHandler, notFound } from './middleware/errorHandler';
import { sanitizeData } from './middleware/validation';

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Add security headers
app.use(morgan('dev')); // Logging middleware
app.use(compression()); // Compress responses
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(sanitizeData); // Custom data sanitization

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Connect to database
connectDB();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// Use root router for all API routes
app.use("/api", rootRouter);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = config.port || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${config.env}`);
});

export default app;