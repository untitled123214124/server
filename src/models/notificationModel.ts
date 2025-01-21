import mongoose, { Schema, Document } from 'mongoose';

// 알림 타입 열거형
export type NotificationType = 'COMMENT' | 'REPLY';

// 알림 인터페이스
export interface INotification extends Document {
  userId: string;
  type: NotificationType;
  postId: string;
  commentId?: string;
  content: string;
  isRead: boolean;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ['COMMENT', 'REPLY'], required: true },
    postId: { type: String, required: true },
    commentId: { type: String, default: null },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model<INotification>(
  'Notification',
  notificationSchema
);
