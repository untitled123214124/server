import express from 'express';
import * as commentController from '../controllers/commentController';
// @ts-ignore
import {
  createCommentValidator,
  updateCommentValidator,
  deleteCommentValidator,
  validate,
} from '../validators/commentValidator';

const router = express.Router();

// 댓글 생성 (대댓글 포함)
router.post(
  '/',
  createCommentValidator,
  validate,
  commentController.createComment
);

// 댓글 수정
router.put(
  '/:commentId',
  updateCommentValidator,
  validate,
  commentController.updateComment
);

// 댓글 삭제
router.delete(
  '/:commentId',
  deleteCommentValidator,
  validate,
  commentController.deleteComment
);

// 게시글에 달린 댓글 가져오기
router.get('/:postId', commentController.getCommentsByPost);

// 부모 댓글을 기준으로 대댓글 가져오기
router.get('/replies/:parentId', commentController.getRepliesByParent);

export default router;
