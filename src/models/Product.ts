import mongoose, { Document, Schema, Types } from 'mongoose';

// Simplified Product interface
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: Types.ObjectId;
  stock: number;
  images: string[];
  brand: string;
  ratings: {
    userId: Types.ObjectId;
    rating: number;
    comment?: string;
  }[];
  averageRating: number;
  isActive: boolean;
  variants?: {
    _id: mongoose.Types.ObjectId;
    color?: string;
    size?: string;
    additionalPrice?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required']
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative']
    },
    images: [{
      type: String,
      validate: {
        validator: function(v: string) {
          return /\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: 'Invalid image format'
      }
    }],
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      trim: true
    },
    ratings: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
      },
      comment: {
        type: String,
        maxlength: [500, 'Comment cannot exceed 500 characters']
      }
    }],
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Average rating cannot be negative'],
      max: [5, 'Average rating cannot exceed 5']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    variants: [{
      color: String,
      size: String,
      additionalPrice: {
        type: Number,
        default: 0,
        min: [0, 'Additional price cannot be negative']
      }
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save middleware to calculate average rating
ProductSchema.pre('save', function(next) {
  const product = this as unknown as IProduct;
  if (product.ratings && product.ratings.length > 0) {
    product.averageRating = product.ratings.reduce((sum, rating) => sum + rating.rating, 0) / product.ratings.length;
  }
  next();
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;