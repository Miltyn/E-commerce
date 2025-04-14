import { Request, Response, NextFunction } from 'express';
import Category, { ICategory } from '../models/Category';
import mongoose from 'mongoose';
import { ApiError, asyncHandler, ApiResponse } from '../utils/ApiError';

// Create a new category
export const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, parentCategory } = req.body;

  if (!name) {
    return next(new ApiError(400, 'Category name is required'));
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    return next(new ApiError(400, 'Category name must be unique'));
  }

  const category = await Category.create({ name, description, parentCategory });
  return res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});

// Retrieve all categories
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find().populate('parentCategory', 'name');
  return res.status(200).json(new ApiResponse(200, categories, 'Categories retrieved successfully'));
});

// Retrieve a category by ID
export const getCategoryById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, 'Invalid category ID format'));
  }

  const category = await Category.findById(id).populate('parentCategory', 'name');

  if (!category) {
    return next(new ApiError(404, 'Category not found'));
  }

  return res.status(200).json(new ApiResponse(200, category, 'Category retrieved successfully'));
});

// Update a category by ID
export const updateCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, 'Invalid category ID format'));
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

  if (!updatedCategory) {
    return next(new ApiError(404, 'Category not found'));
  }

  return res.status(200).json(new ApiResponse(200, updatedCategory, 'Category updated successfully'));
});

// Delete a category by ID
export const deleteCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, 'Invalid category ID format'));
  }

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return next(new ApiError(404, 'Category not found'));
  }

  return res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
});

// Removed the toggleCategoryStatus function
