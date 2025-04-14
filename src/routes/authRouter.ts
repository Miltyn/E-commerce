import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout
} from '../controllers/auth';
import { auth  } from '../middleware/auth';

const authrouter = express.Router();

// Public routes
authrouter.post('/register', register);
authrouter.post('/login', login);
authrouter.post('/forgot-password', forgotPassword);
authrouter.post('/reset-password/:token', resetPassword);
authrouter.post('/logout', logout);

// Protected routes (require authentication)
authrouter.get('/me', auth, getCurrentUser );
authrouter.put('/update-password', auth, updatePassword);

export default authrouter;