import { IUser } from '../models/userModel';
import {
  checkUserById,
  createUser,
  findUserById,
} from '../repositories/userRepository';

export const checkUser = async (
  objectType: 'providerId' | 'id',
  id: string
): Promise<boolean> => {
  const userExists = await checkUserById(objectType, id);
  return userExists;
};

export const getUser = async (
  objectType: 'providerId' | '_id',
  id: string
): Promise<IUser> => {
  const user = await findUserById(objectType, id);
  return user;
};

export const registerUser = async (
  username: string,
  email: string,
  avatar_url: string,
  providerId: number
): Promise<void> => {
  await createUser(username, email, avatar_url, providerId);
};
