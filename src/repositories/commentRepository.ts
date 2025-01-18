import { Comment } from '../models/commentModel';
import { NotFoundError } from '../errors/httpError';

export const createComment = async (
  userId: string,
  postId: string,
  content: string,
  parentId?: string
) => {
  const comment = await Comment.create({
    userId,
    postId,
    content,
    parentId: parentId || null,
  });
  return comment;
};

export const updateComment = async (commentId: string, content: string) => {
  const comment = await Comment.findOneAndUpdate(
    { _id: commentId },
    { $set: { content } },
    { new: true }
  );

  if (!comment) {
    throw new NotFoundError('댓글을 찾을 수 없습니다.');
  }
  return comment;
};

export const deleteComment = async (commentId: string) => {
  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    throw new NotFoundError('삭제할 댓글을 찾을 수 없습니다.');
  }
};

export const getCommentsByPostId = async (
  postId: string,
  skip: number,
  limit: number
) => {
  const comments = await Comment.find({ postId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return comments;
};

export const getRepliesByParentId = async (parentId: string) => {
  const replies = await Comment.find({ parentId });
  return replies;
};
