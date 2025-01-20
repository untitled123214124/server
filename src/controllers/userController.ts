import { Request, Response, NextFunction } from 'express';
import { registerUser } from '../services/userService';
import {
  generateAccessToken,
  generateRefreshToken,
  ExtendedJwtPayload,
} from '../middlewares/authMiddleware';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    await registerUser(username, email, password);
    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request & { user?: ExtendedJwtPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const accessToken = generateAccessToken(userId as string);
    const refreshToken = generateRefreshToken(userId as string);

    res.status(200).json({
      accessToken,
      refreshToken,
      message: '로그인 되었습니다.',
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (
  req: Request & { user?: ExtendedJwtPayload },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const newAccessToken = generateAccessToken(userId as string);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};
