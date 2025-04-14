import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config/config';

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
      return;
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
    });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { 
        expiresIn: config.jwtExpiresIn.toString()
      },
      (err: Error | null, token: string | undefined) => {
        if (err) throw err;
        if (!token) throw new Error('Token generation failed');
        res.status(200).json({
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Login a user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn.toString() },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Get currently logged in user
 * @route GET /api/auth/me
 * @access Private
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user.id comes from the auth middleware
    const user = await User.findById(req.user?.id).select('-password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Forgot password - send reset email
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    // Generate reset token
    const resetToken = jwt.sign(
      { id: user.id },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
    
    // Store reset token in database (or you could use a dedicated reset token field)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save({ validateBeforeSave: false });
    
    // In a real app, you would send an email with the reset link
    // For now, just return the token (in production, don't do this)
    res.status(200).json({
      success: true,
      message: 'Password reset token generated',
      resetToken, // In production, remove this and send via email only
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Reset password
 * @route POST /api/auth/reset-password/:token
 * @access Public
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    
    // Find user with matching token and token not expired
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
      return;
    }
    
    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password has been reset',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Update password (when logged in)
 * @route PUT /api/auth/update-password
 * @access Private
 */
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user by ID (from auth middleware)
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
      return;
    }
    
    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Logout user (client-side)
 * @route POST /api/auth/logout
 * @access Public
 * Note: This endpoint is mainly for documentation as JWT authentication
 * requires client-side token removal
 */
export const logout = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};