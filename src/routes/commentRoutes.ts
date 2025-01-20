import express from 'express';
import * as commentController from '../controllers/commentController';
import {
  createCommentValidator,
  updateCommentValidator,
  deleteCommentValidator,
  getCommentsByPostValidator,
  getRepliesByParentValidator,
  updateNotificationStatusValidator,
  getNotificationsByUserIdValidator,
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
router.get(
  '/:postId',
  getCommentsByPostValidator,
  validate,
  commentController.getCommentsByPost
);

// 부모 댓글을 기준으로 대댓글 가져오기
router.get(
  '/replies/:parentId',
  getRepliesByParentValidator,
  validate,
  commentController.getRepliesByParent
);

// 알림 본 것으로 처리
router.patch(
  '/alarm/:notificationId',
  updateNotificationStatusValidator,
  validate,
  commentController.updateNotificationStatus
);

// 사용자 ID로 알림 정보 가져오기
router.get(
  '/alarm/:userId',
  getNotificationsByUserIdValidator,
  validate,
  commentController.getNotificationsByUserId
);

export default router;
