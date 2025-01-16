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
