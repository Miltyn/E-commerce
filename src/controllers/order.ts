import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import { ApiError, asyncHandler, ApiResponse } from '../utils/ApiError';
import mongoose from 'mongoose';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role?: string;
            }
        }
    }
}

/**
 * @desc Create a new order
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = req.body;
  
  // Check if user is authenticated
  if (!req.user) {
    return next(new ApiError(401, 'User not authenticated'));
  }
  const userId = req.user.id;

  // Validate order items
  if (!orderItems || orderItems.length === 0) {
    return next(new ApiError(400, 'No order items found'));
  }

  // Create a new order
  const order = await Order.create({
    user: userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
    status: 'Pending'
  });

  // Send response
  return res.status(201).json(new ApiResponse(201, order, 'Order created successfully'));
});

/**
 * @desc Update order to paid
 * @route PUT /api/orders/:id/pay
 * @access Private
 */
export const updateOrderToPaid = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { paymentResult } = req.body; // Payment details from payment gateway

  // Validate order ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, 'Invalid order ID format'));
  }

  // Find the order by ID
  const order = await Order.findById(id);

  // Check if order exists
  if (!order) {
    return next(new ApiError(404, 'Order not found'));
  }

  // Update order to paid
  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = paymentResult;

  // Save the updated order
  await order.save();

  // Send response
  return res.status(200).json(new ApiResponse(200, order, 'Order marked as paid successfully'));
});

/**
 * @desc Update order to delivered
 * @route PUT /api/orders/:id/deliver
 * @access Private/Admin
 */
export const updateOrderToDelivered = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Validate order ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, 'Invalid order ID format'));
  }

  // Find the order by ID
  const order = await Order.findById(id);

  // Check if order exists
  if (!order) {
    return next(new ApiError(404, 'Order not found'));
  }

  // Update order to delivered
  order.isDelivered = true;
  order.deliveredAt = new Date();
  order.status = 'Delivered';

  // Save the updated order
  await order.save();

  // Send response
  return res.status(200).json(new ApiResponse(200, order, 'Order marked as delivered successfully'));
});

/**
 * @desc Cancel an order
 * @route PUT /api/orders/:id/cancel
 * @access Private
 */
export const cancelOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  // Check if user is authenticated
  if (!req.user) {
    return next(new ApiError(401, 'User not authenticated'));
  }
  const userId = req.user.id;

  // Validate order ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, 'Invalid order ID format'));
  }

  // Find the order by ID
  const order = await Order.findById(id);

  // Check if order exists
  if (!order) {
    return next(new ApiError(404, 'Order not found'));
  }

  // Check if the user is authorized to cancel the order
  if (order.user.toString() !== userId.toString()) {
    return next(new ApiError(403, 'Not authorized to cancel this order'));
  }

  // Check if the order is already paid
  if (order.isPaid) {
    return next(new ApiError(400, 'Cannot cancel a paid order'));
  }

  // Update order status to cancelled
  order.status = 'Cancelled';
  await order.save();

  // Send response
  return res.status(200).json(new ApiResponse(200, order, 'Order cancelled successfully'));
});
