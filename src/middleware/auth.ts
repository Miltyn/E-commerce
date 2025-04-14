import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role?: string };
    }
  }
}
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Add your authentication logic here
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from header
  let token = req.header('x-auth-token');
  
  // Check Authorization header if x-auth-token is not present
  const authHeader = req.header('Authorization');
  if (!token && authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // Check if no token
  if (!token) {
    res.status(401).json({ 
      success: false, 
      message: 'No authentication token, access denied' 
    });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as { user: { id: string; role?: string } };
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

/**
 * Authentication middleware
 * Verifies JWT token and adds user data to request object
 
export const auth = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from header
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
  console.log(token)
  // Check if no token
  if (!token) {
    res.status(401).json({ success: false, message: 'No authentication token, access denied' });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as { user: { id: string; role?: string } };
    
    // Add user from payload to request
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};*/

/**
 * Admin middleware
 * Ensures the authenticated user has admin role
 * Must be used after auth middleware
 */
/*export const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Access denied, admin privileges required' });
    return;
  }
  next();
};*/


/**
 * Optional auth middleware
 * Verifies JWT token if present, but doesn't require it
 * Useful for routes that work differently for authenticated and non-authenticated users
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from header
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

  // If no token, continue without authentication
  if (!token) {
    next();
    return;
  }

  try {
    // Verify token if present
    const decoded = jwt.verify(token, config.jwtSecret) as { user: { id: string; role?: string } };
    
    // Add user from payload to request
    req.user = decoded.user;
    next();
  } catch (error) {
    // Continue even if token is invalid
    next();
  }
};