import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  slug: string;
  parentCategory?: Schema.Types.ObjectId;
  isActive: boolean;
  products?: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    products: [{
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save middleware to generate slug
CategorySchema.pre('save', function(next) {
  const category = this as unknown as ICategory;
  if (!category.slug) {
    category.slug = category.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

// Virtual to get subcategories
CategorySchema.virtual('subCategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;