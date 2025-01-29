import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoute from './routes/userRoute';
import postRoute from './routes/postRoute';
import commentRoutes from './routes/commentRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import alarmRoute from './routes/alarmRoute';
import { sendSSE } from './utils/sse';
import { userConnections } from './utils/sse';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    allowedHeaders:
      'Authorization, Content-Type, authtoken, accessToken, refreshToken ',
    credentials: true,
  })
);
app.use(cookieParser());

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
app.use('/alarm', alarmRoute);
app.use('/auth', userRoute);
app.use('/comments', commentRoutes);
app.use('/boards/:boardId/posts', postRoute);

app.get('/events/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const sendEvent = sendSSE(req, res, userId); // userId에 맞는 SSE 연결 설정
  sendEvent('SSE 연결 성공!'); // 연결 후 초기 메시지 전송
});

// @ts-ignore
app.post('/test/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { msg } = req.body;

  // 연결이 끊어진 경우 새로 연결 설정
  if (!userConnections[userId]) {
    return res
      .status(404)
      .json({ error: 'No active SSE connection for userId' });
  }

  // 연결이 살아있는 경우에만 메시지 전송
  userConnections[userId].write(`data: ${msg}\n\n`);
  console.log(`${userId} 에게 메시지 전송: ${msg}`);

  res.json({ success: true });
});

initializeServer();
