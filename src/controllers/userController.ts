import { Request, Response, NextFunction } from 'express';
import { registerUser } from '../services/userService';

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
