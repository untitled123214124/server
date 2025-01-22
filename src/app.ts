import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import postRoute from './routes/postRoute';
import userRoutes from './routes/userRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const initializeServer = async () => {
  try {
    await connectDB();
    console.log('Database connected. Starting server');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server : ', error);
  }
};
app.use('/auth', authRoutes);
app.use('/comments', commentRoutes);
app.use('/boards/:boardId/posts', postRoute);
app.use('/api/users', userRoutes);

initializeServer();
