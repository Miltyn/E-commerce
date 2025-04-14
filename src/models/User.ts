import mongoose, { Document, Schema } from 'mongoose';

// Define interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create User schema
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: true // Include password by default, but exclude it in queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  {
    timestamps: true // Automatically create createdAt and updatedAt fields
  }
);

// Add index for faster queries
/*UserSchema.index({ email: 1 });*/

// Remove password from JSON responses
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Create and export User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;