import express from 'express';
import {
  createProduct,
  getAllProducts,
  updateProduct,
  updateProductStock
} from '../controllers/product';
import { admin } from '../middleware/auth';
import { protect } from '../middleware/auth';

const routerProduct = express.Router();

// Product routes
routerProduct.post('/', createProduct);
routerProduct.get('/', getAllProducts);
routerProduct.put('/:id', updateProduct);

// Update product stock
routerProduct.patch('/:id/stock', updateProductStock);

export default routerProduct;
