import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation rules를 정의합니다.
export const userValidationRules = [
  body('username').notEmpty().withMessage('사용자 이름은 필수입니다.'),
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
];

// 에러를 처리하는 미들웨어 함수
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
