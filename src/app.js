/**
 * Postaway-II Application Entry Point
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectToMongoDB } from './config/mongoose.config.js';

import loggerMiddleware from './middlewares/logger.middleware.js';
import errorHandlerMiddleware from './middlewares/errorHandler.middleware.js';

import userRoutes from './features/user/user.routes.js';
import postRoutes from './features/post/post.routes.js';
import commentRoutes from './features/comment/comment.routes.js';
import likeRoutes from './features/like/like.routes.js';
import friendRoutes from './features/friend/friend.routes.js';
import otpRoutes from './features/otp/otp.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/otp', otpRoutes);

// Global error handler
app.use(errorHandlerMiddleware);

connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

export default app;