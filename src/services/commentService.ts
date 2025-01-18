import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByPostId,
  getRepliesByParentId,
} from '../repositories/commentRepository';

export const createCommentService = async (
  userId: string,
  postId: string,
  content: string,
  parentId?: string
) => {
  const createdComment = await createComment(userId, postId, content, parentId);
  return {
    success: true,
    createdComment,
  };
};

export const updateCommentService = async (
  commentId: string,
  content: string
) => {
  const updatedComment = await updateComment(commentId, content);
  return {
    success: true,
    updatedComment,
  };
};

export const deleteCommentService = async (commentId: string) => {
  await deleteComment(commentId);
  return {
    success: true,
  };
};

export const getCommentsByPostService = async (
  postId: string,
  currentPage: number,
  limit: number
) => {
  const skip = (currentPage - 1) * limit;
  const comments = await getCommentsByPostId(postId, skip, limit);
  return {
    success: true,
    comments,
  };
};

export const getRepliesByParentService = async (parentId: string) => {
  const replies = await getRepliesByParentId(parentId);
  return {
    success: true,
    replies,
  };
};
