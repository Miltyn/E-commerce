import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errorHandler';

/**
 * Middleware to validate request using express-validator
 * @param validations Array of validation chains from express-validator
 * @returns Middleware function that runs validations and handles errors
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check if there are validation errors
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors
    const extractedErrors = errors.mapped();

    // Create formatted error message
    const errorMessage = Object.entries(extractedErrors)
      .map(([field, message]) => `${field}: ${message}`)
      .join(', ');

    // Throw custom error with validation details
    next(new AppError(errorMessage, 400));
  };
};

/**
 * Middleware to sanitize request data
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const sanitizeData = (req: Request, _res: Response, next: NextFunction): void => {
  // Basic sanitization for common fields
  if (req.body) {
    // Trim string inputs
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  
  next();
};

/**
 * Middleware to parse query parameters to appropriate types
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const parseQueryParams = (req: Request, _res: Response, next: NextFunction): void => {
  const query = req.query;
  
  // Parse pagination parameters
  if (query.page) {
    req.query.page = (parseInt(query.page as string, 10) || 1).toString();
  }
  
  if (query.limit) {
    req.query.limit = (parseInt(query.limit as string, 10) || 10).toString();
  }
  
  // Parse price range parameters
  if (query.minPrice) {
    req.query.minPrice = (parseFloat(query.minPrice as string) || 0).toString();
  }
  
  if (query.maxPrice) {
    req.query.maxPrice = (parseFloat(query.maxPrice as string) || 0).toString();
  }
  
  // Parse boolean parameters
  if (query.inStock) {
    req.query.inStock = ((query.inStock as string).toLowerCase() === 'true').toString();
  }
  
  next();
};

/**
 * Common validation error messages
 */
export const errorMessages = {
  required: (field: string) => `${field} is required`,
  email: 'Please provide a valid email address',
  minLength: (field: string, length: number) => `${field} must be at least ${length} characters`,
  maxLength: (field: string, length: number) => `${field} cannot exceed ${length} characters`,
  numeric: (field: string) => `${field} must be a number`,
  boolean: (field: string) => `${field} must be true or false`,
  positiveNumber: (field: string) => `${field} must be a positive number`,
  invalidObjectId: (field: string) => `Invalid ${field} format`,
  invalidEnum: (field: string, values: string[]) => `${field} must be one of: ${values.join(', ')}`,
  dateFormat: (field: string) => `${field} must be a valid date format (YYYY-MM-DD)`,
  passwordMatch: 'Passwords do not match',
  invalidFileType: 'File type not supported',
  maxFileSize: (size: number) => `File size cannot exceed ${size}MB`,
};