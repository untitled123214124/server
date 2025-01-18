import { Request, Response } from 'express';
import * as commentService from '../services/commentService';

// 댓글 생성 (대댓글 포함)
export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId, content, parentId } = req.body; // parentId는 대댓글을 위한 optional 필드
  const userId = req.body.userid; // Assume user ID is available from authentication middleware

  try {
    const createdComment = await commentService.createCommentService(
      userId,
      postId,
      content,
      parentId
    );
    res.status(201).json(createdComment);
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ success: false, message: error.message });
  }
};

// 댓글 수정
export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await commentService.updateCommentService(commentId, content);
    res.status(200).json(updatedComment);
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ success: false, message: error.message });
  }
};

// 댓글 삭제
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { commentId } = req.params;

  try {
    await commentService.deleteCommentService(commentId);
    res.status(200).json({ success: true });
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ success: false, message: error.message });
  }
};

// 특정 게시글의 댓글을 가져오기 (대댓글 포함)
export const getCommentsByPost = async (
  req: Request,
  res: Response
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
    // @ts-ignore
    res.status(500).json({ success: false, message: error.message });
  }
};

// 부모 댓글을 기준으로 대댓글 가져오기
export const getRepliesByParent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { parentId } = req.params;

  try {
    const replies = await commentService.getRepliesByParentService(parentId);
    res.status(200).json({ success: true, replies });
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ success: false, message: error.message });
  }
};
