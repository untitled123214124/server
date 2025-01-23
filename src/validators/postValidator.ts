import { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/httpError';

export const createPostValidationRules = () => {
  return [
    param('boardId').notEmpty().withMessage('게시판 아이디는 필수입니다'),
    body('title').notEmpty().withMessage('게시글 제목은 필수입니다'),
    body('content').notEmpty().withMessage('게시글 내용은 필수입니다'),
  ];
};

export const updatePostValidationRules = () => {
  return [
    param('postId').notEmpty().withMessage('게시글 아이디는 필수입니다'),
    body('title').notEmpty().withMessage('게시글 제목은 필수입니다'),
    body('content').notEmpty().withMessage('게시글 내용은 필수입니다'),
  ];
};

export const deletePostValidationRules = () => {
  return [param('postId').notEmpty().withMessage('게시글 아이디는 필수입니다')];
};

export const getPostValidationRules = () => {
  return [param('postId').notEmpty().withMessage('게시글 아이디는 필수입니다')];
};

export const getPostsValidationRules = () => {
  return [
    param('boardId').notEmpty().withMessage('게시판 아이디는 필수입니다'),
  ];
};

export const validatePost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((err) => err.msg)
      .join(', ');

    next(new BadRequestError(errorMessage));
  }
  next();
};
