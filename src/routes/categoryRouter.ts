import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  
} from '../controllers/category';

const routerCategory = express.Router();

// Category Routes
routerCategory.post('/', createCategory); // Create a new category
routerCategory.get('/', getAllCategories); // Get all categories
routerCategory.get('/:id', getCategoryById); // Get a single category by ID
routerCategory.put('/:id', updateCategory); // Update category details
routerCategory.delete('/:id', deleteCategory); // Delete a category

export default routerCategory;
