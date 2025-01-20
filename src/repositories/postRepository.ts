import { NotFoundError } from '../errors/httpError';
import { IPost, Post } from '../models/postModel';

export const create = async (
  userId: string,
  boardId: string,
  title: string,
  content: string
): Promise<IPost> => {
  const post = await Post.create({
    userId,
    boardId,
    title,
    content,
  });
  return post;
};

export const update = async (
  postId: string,
  title: string,
  content: string
): Promise<IPost> => {
  const post = await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { title: title, content: content } },
    { new: true }
  );

  if (!post) {
    throw new NotFoundError('게시글을 찾을 수 없습니다.');
  }
  return post;
};

export const deleteP = async (postId: string): Promise<void> => {
  const post = await Post.findByIdAndDelete(postId);

  if (!post) {
    throw new NotFoundError('삭제할 게시글을 찾을 수 없습니다.');
  }
};

export const getPostById = async (postId: string): Promise<IPost> => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError('게시글을 찾을 수 없습니다.');
  }
  return post;
};

export const getPostsByBoard = async (
  currentPage: number,
  limit: number,
  boardId: string
): Promise<IPost[]> => {
  const skip = (currentPage - 1) * limit;
  const posts = await Post.find({ boardId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (posts.length === 0) {
    throw new NotFoundError('게시글을 찾을 수 없습니다.');
  }
  return posts;
};

export const getCountByBoard = async (boardId: string): Promise<number> => {
  const count = await Post.countDocuments({ boardId });
  return count;
};
