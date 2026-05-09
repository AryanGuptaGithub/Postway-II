/**
 * Mongoose Configuration
 * Establishes connection to MongoDB using the connection string from .env
 * Exports a connect function for app startup.
 */

import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
export const connectToMongoDB = async () => {
  const mongoURI = process.env.MONGODB_URL;
  if (!mongoURI) {
    throw new Error('MONGODB_URL not defined in environment');
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};