import { User, IUser } from '../models/userModel';

export const findUserById = async (
  providerId: number
): Promise<IUser | null> => {
  return await User.findOne({ providerId });
};

export const createOrUpdateUser = async (
  username: string,
  email: string,
  avatar_url: string,
  providerId: number
): Promise<void> => {
  await User.findOneAndUpdate(
    { providerId },
    {
      username,
      email,
      avatar_url,
      provider: 'github',
      providerId,
      lastLoginAt: new Date(),
    },
    { upsert: true, new: true }
  );
};
