import { NotFoundError } from '../errors/httpError';
import { User, IUser } from '../models/userModel';

export const findUserById = async (providerId: number): Promise<IUser> => {
  const user = await User.findOne({ providerId });
  if (!user) {
    throw new NotFoundError('사용자 정보를 찾을 수 없습니다');
  }
  return user;
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
