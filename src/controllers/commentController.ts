import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/commentService';

// 댓글 생성 (대댓글 포함)
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { postId, content, parentId } = req.body; // parentId는 대댓글을 위한 optional 필드
  const userId = req.body.userId; // Assume user ID is available from authentication middleware

  try {
    const createdComment = await commentService.createCommentService(
      userId,
      postId,
      content,
      parentId
    );
    await commentService.createNotification(createdComment);
    res.status(201).json(createdComment);
  } catch (error) {
    next(error);
  }
};

// 댓글 수정
export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await commentService.updateCommentService(
      commentId,
      content
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

// 댓글 삭제
export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { commentId } = req.params;

  try {
    await commentService.deleteCommentService(commentId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// 특정 게시글의 댓글을 가져오기 (대댓글 포함)
export const getCommentsByPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { postId } = req.params;
  const { currentPage, limit } = req.query;

  try {
    const comments = await commentService.getCommentsByPostService(
      postId,
      Number(currentPage),
      Number(limit)
    );
    res.status(200).json({ success: true, comments });
  } catch (error) {
    next(error);
  }
};

// 부모 댓글을 기준으로 대댓글 가져오기
export const getRepliesByParent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { parentId } = req.params;

  try {
    const replies = await commentService.getRepliesByParentService(parentId);
    res.status(200).json({ success: true, replies });
  } catch (error) {
    next(error);
  }
};

// 알림을 본 것으로 처리
export const updateNotificationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { notificationId } = req.params;

  try {
    const updatedNotification =
      await commentService.updateNotificationStatusService(notificationId);
    res.status(200).json({ success: true, updatedNotification });
  } catch (error) {
    next(error);
  }
};

// 사용자 ID로 알림 정보 가져오기
export const getNotificationsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;

  try {
    const notifications =
      await commentService.getNotificationsByUserIdService(userId);
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};
