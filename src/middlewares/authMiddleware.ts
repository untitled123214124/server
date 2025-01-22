import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request as ExpressRequest, Response, NextFunction } from 'express';

interface CustomRequest extends ExpressRequest {
  user?: string | JwtPayload;
}

export interface ExtendedJwtPayload extends JwtPayload {
  userId: string;
}

export const checkAccessToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: '인증 토큰이 없습니다.' });
    return;
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET!, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
      return;
    }

    req.user = decoded as ExtendedJwtPayload;
    next();
  });
};

/**
 * 액세스 토큰 생성
 * @param userId 사용자 ID
 * @returns 액세스 토큰
 */
export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * 리프레시 토큰 생성
 * @param userId 사용자 ID
 * @returns 리프레시 토큰
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

/**
 * 에러 핸들링 미들웨어
 */
export const errorHandler = (
  error: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: true,
    message,
    statusCode,
  });
};
