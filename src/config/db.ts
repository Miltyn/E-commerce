import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string from .env file
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommercee';

// Options for Mongoose connection
const options = {
  autoIndex: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error('Unknown error connecting to MongoDB');
    }
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export default connectDB;