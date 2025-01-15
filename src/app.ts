import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config(); // .env 파일 로드

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
const initializeServer = async () => {
  try {
    await connectDB(); // 데이터베이스 연결
    console.log('Database connected. Starting server...');

    // Routes
    app.get('/', (req: Request, res: Response) => {
      res.send('Hello, TypeScript with Express!');
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

initializeServer();
