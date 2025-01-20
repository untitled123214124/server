import { NextFunction, Request, Response } from 'express';
import * as postService from '../services/postService';

const tempUser = '1';

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = tempUser;
  const boardId = req.params.boardId;
  const title = req.body.title;
  const content = req.body.content;

  try {
    const createPostResponse = await postService.createPost(
      userId,
      boardId,
      title,
      content
    );
    res.status(201).json(createPostResponse);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;

  try {
    const updatePostResponse = await postService.updatePost(
      postId,
      title,
      content
    );
    res.status(200).json(updatePostResponse);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const postId = req.params.postId;

  try {
    const deletePostResponse = await postService.deletePost(postId);
    res.status(200).json(deletePostResponse);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const postId = req.params.postId;
  try {
    const getPostResponse = await postService.getPost(postId);
    res.status(200).json(getPostResponse);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const boardId = req.params.boardId;
  const limit = parseInt(req.query.limit as string, 10) || 4;
  const currentPage = parseInt(req.query.currentPage as string, 10) || 1;
  try {
    const getPostsResponse = await postService.getPosts(
      currentPage,
      limit,
      boardId
    );
    res.status(200).json(getPostsResponse);
  } catch (error) {
    next(error);
  }
};