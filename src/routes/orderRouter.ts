import { Router } from 'express';
import {
  createOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder
} from '../controllers/order';
import {  admin } from '../middleware/auth';

const routerOrder = Router();

routerOrder.post('/', createOrder);
routerOrder.put('/:id/pay',  updateOrderToPaid);
routerOrder.put('/:id/deliver' , updateOrderToDelivered);
routerOrder.put('/:id/cancel',  cancelOrder);

export default routerOrder;
