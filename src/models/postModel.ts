import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  userId: string;
  boardId: string;
  title: string;
  content: string;
}

export interface IApiResponse {
  success: boolean;
  message?: string;
}

export interface ICreatePostResponse extends IApiResponse {
  createdPost: IPost;
}

export interface IUpdatePostResponse extends IApiResponse {
  updatedPost: IPost;
}

export interface IDeletePostResponse extends IApiResponse {}
export interface IGetPostResponse extends IApiResponse {}
export interface IGetPostsResponse {
  success: boolean;
  total: number;
  posts: IPost[];
  message?: string;
}

const postSchema = new Schema<IPost>(
  {
    userId: {
      type: String,
      required: true,
    },
    boardId: {
      type: String,
      enum: ['study', 'toy', 'code'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model<IPost>('Post', postSchema);
