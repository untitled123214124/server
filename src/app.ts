import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
const initializeServer = async () => {
  try {
    await connectDB();
    console.log('Database connected. Starting server');

    app.get('/', (req: Request, res: Response) => {
      res.send('Hello, TypeScript with Express!');
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server : ', error);
  }
};

initializeServer();

app.use('/api/users', userRoutes);
