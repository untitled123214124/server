import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  avatar_url: string;
  provider: 'github';
  providerId: number;
  lastLoginAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar_url: { type: String },
    provider: { type: String, enum: ['github'], required: true },
    providerId: { type: Number, unique: true, required: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
