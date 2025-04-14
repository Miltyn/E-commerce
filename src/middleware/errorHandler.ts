import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Custom error response interface
interface ErrorResponse {
  success: boolean;
  error: {
    message: string;
    stack?: string;
    details?: any;
  };
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Set default error values
  let statusCode = 500;
  let errorMessage = 'Server Error';
  let errorDetails = undefined;
  let isOperational = false;

  // Log the error
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  // Handle custom AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
    isOperational = err.isOperational;
  }

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    errorMessage = 'Validation Error';
    errorDetails = Object.values(err.errors).map(val => val.message);
    isOperational = true;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    errorMessage = `Invalid ${err.path}: ${err.value}`;
    isOperational = true;
  }

  // Handle duplicate key errors
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    statusCode = 400;
    errorMessage = 'Duplicate field value entered';
    errorDetails = (err as any).keyValue;
    isOperational = true;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorMessage = 'Invalid token';
    isOperational = true;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorMessage = 'Token expired';
    isOperational = true;
  }

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: errorMessage,
    },
  };

  // Add details if they exist
  if (errorDetails) {
    errorResponse.error.details = errorDetails;
  }

  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development' && !isOperational) {
    errorResponse.error.stack = err.stack;
  }

  // Send the error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Async error handler wrapper to avoid try-catch blocks
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found error handler middleware
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};