import { createUser, findUserById } from '../repositories/userRepository';

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
  await createUser(username, email, avatar_url, providerId);
};
