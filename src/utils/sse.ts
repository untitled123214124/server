import { Response } from 'express';

export const userConnections: { [key: string]: Response } = {};

// SSE 연결을 처리하는 함수
export const sendSSE = (req: any, res: Response, userId: string) => {
  // 기존 연결이 있다면 닫고 새로 연결 설정
  if (userConnections[userId]) {
    console.log(`${userId}의 기존 연결 닫기`);
    userConnections[userId].end(); // 기존 연결 닫기
    delete userConnections[userId];
  }

  // 새 연결 설정
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  userConnections[userId] = res;

  // 연결이 끊어지면 해당 연결 삭제
  req.on('close', () => {
    delete userConnections[userId];
    console.log(`${userId} 연결 끊어짐`);
  });

  // 이벤트 전송 함수
  const sendEvent = (message: string) => {
    if (userConnections[userId]) {
      userConnections[userId].write(`data: ${message}\n\n`);
    } else {
      console.error(`No active connection for ${userId}`);
    }
  };

  return sendEvent;
};
