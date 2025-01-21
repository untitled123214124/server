import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../repositories/userRepository';
import { BadRequestError } from '../errors/httpError';

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<void> => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new BadRequestError('이미 사용 중인 이메일입니다.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser({ username, email, password: hashedPassword });
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new BadRequestError('이메일 또는 비밀번호가 잘못되었습니다.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError('이메일 또는 비밀번호가 잘못되었습니다.');
  }

  return user;
};
