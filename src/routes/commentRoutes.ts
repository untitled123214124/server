import express from 'express';
import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByPost,
  getRepliesByParent,
} from '../controllers/commentController';
import {
  createCommentValidator,
  updateCommentValidator,
  deleteCommentValidator,
  getCommentsByPostValidator,
  getRepliesByParentValidator,
  validate,
} from '../validators/commentValidator';

const router = express.Router();

// 댓글 생성 (대댓글 포함)
router.post('/', createCommentValidator, validate, createComment);

// 댓글 수정
router.put('/:commentId', updateCommentValidator, validate, updateComment);

// 댓글 삭제
router.delete('/:commentId', deleteCommentValidator, validate, deleteComment);

// 게시글에 달린 댓글 가져오기
router.get('/:postId', getCommentsByPostValidator, validate, getCommentsByPost);

// 부모 댓글을 기준으로 대댓글 가져오기
router.get(
  '/replies/:parentId',
  getRepliesByParentValidator,
  validate,
  getRepliesByParent
);

export default router;
