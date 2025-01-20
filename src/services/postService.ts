import {
  ICreatePostResponse,
  IDeletePostResponse,
  IGetPostResponse,
  IGetPostsResponse,
  IUpdatePostResponse,
} from '../models/postModel';
import {
  create,
  deleteP,
  getCountByBoard,
  getPostById,
  getPostsByBoard,
  update,
} from '../repositories/postRepository';

export const createPost = async (
  userId: string,
  boardId: string,
  title: string,
  content: string
): Promise<ICreatePostResponse> => {
  const createdPost = await create(userId, boardId, title, content);
  const createPostResponse = {
    success: true,
    createdPost,
  };
  return createPostResponse;
};

export const updatePost = async (
  postId: string,
  title: string,
  content: string
): Promise<IUpdatePostResponse> => {
  const updatedPost = await update(postId, title, content);
  const updatePostResponse = {
    success: true,
    updatedPost,
  };
  return updatePostResponse;
};

export const deletePost = async (
  postId: string
): Promise<IDeletePostResponse> => {
  await deleteP(postId);
  const deletePostResponse = {
    success: true,
  };
  return deletePostResponse;
};

export const getPost = async (postId: string): Promise<IGetPostResponse> => {
  const post = await getPostById(postId);
  const getPostResponse = {
    success: true,
    post,
  };
  return getPostResponse;
};

export const getPosts = async (
  currentPage: number,
  limit: number,
  boardId: string
): Promise<IGetPostsResponse> => {
  const posts = await getPostsByBoard(currentPage, limit, boardId);
  const total = await getCountByBoard(boardId);
  const getPostsResponse = {
    success: true,
    total: total,
    posts: posts,
  };
  return getPostsResponse;
};