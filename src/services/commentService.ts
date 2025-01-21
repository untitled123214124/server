import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByPostId,
  getRepliesByParentId,
  saveAlarm,
} from '../repositories/commentRepository';
import { IComment } from '../models/commentModel';
import { Notification } from '../models/notificationModel';
import { NotFoundError } from '../errors/httpError';

export async function createNotification(createdComment: IComment) {
  await saveAlarm(createdComment);
}

export const createCommentService = async (
  userId: string,
  postId: string,
  content: string,
  parentId?: string
) => {
  const createdComment = await createComment(userId, postId, content, parentId);
  return createdComment;
};

export const updateCommentService = async (
  commentId: string,
  content: string
) => {
  const updatedComment = await updateComment(commentId, content);
  return updatedComment;
};

export const deleteCommentService = async (commentId: string) => {
  await deleteComment(commentId);
  return true;
};

export const getCommentsByPostService = async (
  postId: string,
  currentPage: number = 1, // 기본값 1
  limit: number = 10 // 기본값 10
) => {
  const skip = (currentPage - 1) * limit;
  const comments = await getCommentsByPostId(postId, skip, limit);
  return comments;
};

export const getRepliesByParentService = async (parentId: string) => {
  const replies = await getRepliesByParentId(parentId);
  return replies;
};

export const updateNotificationStatusService = async (
  notificationId: string
) => {
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    throw new NotFoundError('알림을 찾을 수 없습니다.');
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

export const getNotificationsByUserIdService = async (userId: string) => {
  const notifications = await Notification.find({ userId, isRead: false })
    .sort({ createdAt: -1 })
    .lean(); // 최신 알림부터 정렬
  return notifications;
};
