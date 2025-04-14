import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/Product';
import mongoose from 'mongoose';
import { ApiError, asyncHandler, ApiResponse } from '../utils/ApiError';

export interface IVariant {
  _id?: string | mongoose.Types.ObjectId;
  color?: string;
  size?: string;
  additionalPrice?: number;
}

export const createProduct = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { 
    name, 
    description, 
    price, 
    category, 
    stock, 
    brand, 
    images, 
    variants
  } = req.body;

  // Check for required fields
  if (!name || !description || !price || !category || !stock || !brand) {
    return next(new ApiError(400, 'All required fields must be provided'));
  }

  // Create new product
  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    brand,
    images: images || [],
    variants: variants || []
  });

  return res.status(201).json(
    new ApiResponse(201, product, 'Product created successfully')
  );
});

export const getAllProducts = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const { 
    page = 1, 
    limit = 10, 
    category,
    brand,
    minPrice,
    maxPrice,
    sort = 'createdAt',
    sortDirection = 'desc',
    search
  } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;
  
  // Build query
  const query: any = { isActive: true };
  
  // Add search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Add filters
  if (category) {
    query.category = new mongoose.Types.ObjectId(category as string);
  }
  
  if (brand) {
    query.brand = brand;
  }
  
  // Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice as string);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
  }
  
  // Determine sort direction
  const sortOrder = (sortDirection as string) === 'asc' ? 1 : -1;
  
  // Execute query with pagination
  const products = await Product.find(query)
    .sort({ [sort as string]: sortOrder })
    .skip(skip)
    .limit(limitNumber)
    .populate('category', 'name');
  
  // Get total count for pagination
  const totalProducts = await Product.countDocuments(query);
  
  return res.status(200).json(
    new ApiResponse(200, {
      products,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
      totalProducts
    }, 'Products retrieved successfully')
  );
});

export const updateProduct = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const updateData = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, 'Invalid product ID format'));
  }
  
  // Remove fields that shouldn't be directly updated
  delete updateData.ratings;
  delete updateData.averageRating;
  
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('category', 'name');
  
  if (!updatedProduct) {
    return next(new ApiError(404, 'Product not found'));
  }
  
  return res.status(200).json(
    new ApiResponse(200, updatedProduct, 'Product updated successfully')
  );
});

export const updateProductStock = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { stockChange } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, 'Invalid product ID format'));
  }
  
  if (stockChange === undefined) {
    return next(new ApiError(400, 'Stock change value is required'));
  }
  
  const product = await Product.findById(id);
  
  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }
  
  // Calculate new stock value
  const newStock = product.stock + parseInt(stockChange as string, 10);
  
  // Validate new stock value
  if (newStock < 0) {
    return next(new ApiError(400, 'Stock cannot be negative'));
  }
  
  // Update stock
  product.stock = newStock;
  await product.save();
  
  return res.status(200).json(
    new ApiResponse(200, product, 'Product stock updated successfully')
  );
});

