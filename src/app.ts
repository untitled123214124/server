import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import postRoute from './routes/postRoute';

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

app.use('/boards/:boardId/posts', postRoute);

initializeServer();
