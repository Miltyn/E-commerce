import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    orderItems: [{
      product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
      }
    }],
    shippingAddress: {
      street: {
        type: String,
        required: [true, 'Street address is required']
      },
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      postalCode: {
        type: String,
        required: [true, 'Postal code is required']
      },
      country: {
        type: String,
        required: [true, 'Country is required']
      }
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['Credit Card', 'PayPal', 'Bank Transfer']
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative']
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      required: true,
      default: false
    },
    deliveredAt: Date,
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;