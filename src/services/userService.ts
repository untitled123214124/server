import {
  createOrUpdateUser,
  findUserById,
} from '../repositories/userRepository';

export const checkUser = async (providerId: number) => {
  const existingUser = await findUserById(providerId);
  return existingUser;
};

export const registerUser = async (
  username: string,
  email: string,
  avatar_url: string,
  providerId: number
): Promise<void> => {
  console.log(username, email, avatar_url, providerId);
  await createOrUpdateUser(username, email, avatar_url, providerId);
};
