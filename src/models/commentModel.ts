import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  userId: string;
  postId: string;
  content: string;
  parentId?: string; // 부모 댓글 ID, 대댓글일 경우 참조
}

export interface IApiResponse {
  success: boolean;
  message?: string;
}

export interface ICreateCommentResponse extends IApiResponse {
  createdComment: IComment;
}

export interface IUpdateCommentResponse extends IApiResponse {
  updatedComment: IComment;
}

export interface IDeleteCommentResponse extends IApiResponse {}

const commentSchema = new Schema<IComment>(
  {
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    content: { type: String, required: true },
    parentId: { type: String, default: null }, // 기본값은 null, 부모 댓글이 없으면 null
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
