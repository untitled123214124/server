import { body, param } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const createCommentValidator = [
  body('content').notEmpty().withMessage('댓글 내용을 입력하세요.'),
  body('parentId')
    .optional()
    .isMongoId()
    .withMessage('유효한 부모 댓글 ID가 아닙니다.'),
  body('userId').notEmpty().withMessage('userId가 필요합니다.'), // userId 필드 검증 추가
  body('postId').notEmpty().withMessage('postId가 필요합니다.'), // postId 필드 검증 추가
];

export const updateCommentValidator = [
  param('commentId').isMongoId().withMessage('유효한 댓글 ID가 아닙니다.'),
  body('content').notEmpty().withMessage('댓글 내용을 입력하세요.'),
];

export const deleteCommentValidator = [
  param('commentId').isMongoId().withMessage('유효한 댓글 ID가 아닙니다.'),
];

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        message: error.msg,
      })),
    });
  } else {
    next();
  }
};
