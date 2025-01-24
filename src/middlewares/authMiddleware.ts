import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/httpError';
import { getUserByPostId } from '../repositories/postRepository';

export interface JwtRequest extends Request {
  user?: string;
}

export interface ExtendedJwtPayload extends JwtPayload {
  userId: string;
}

const isUserPayload = (
  decoded: jwt.JwtPayload
): decoded is ExtendedJwtPayload => {
  return 'userId' in decoded && typeof decoded.userId === 'string';
};

const parseAndDecode = (
  cookieHeader: Record<string, string> | undefined
): ExtendedJwtPayload => {
  if (!cookieHeader) {
    throw new UnauthorizedError('헤더에 쿠키가 없습니다');
  }

  const accessToken = cookieHeader['accessToken'];
  const decoded = jwt.decode(accessToken);
  if (!decoded) {
    throw new UnauthorizedError('토큰이 유효하지 않습니다');
  }

  if (typeof decoded === 'string') {
    throw new UnauthorizedError('토큰이 잘못된 형식입니다');
  }

  if (decoded.tokenType != 'access') {
    throw new UnauthorizedError('엑세스 토큰이 아닙니다');
  }

  if (decoded.exp && Date.now() / 1000 > decoded.exp) {
    throw new UnauthorizedError('토큰이 만료되었습니다');
  }

  if (!isUserPayload(decoded)) {
    throw new UnauthorizedError('토큰에 필요한 정보가 없습니다');
  }

  return decoded;
};

export const authOnlyLoggedIn = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const cookies = req.cookies;
  try {
    const tokenContent = parseAndDecode(cookies);
    if (!tokenContent || !tokenContent.userId) {
      throw new UnauthorizedError('토큰에 유효한 사용자 정보가 없습니다');
    }
    const tokenUserId = tokenContent.userId;
    req.user = tokenUserId;
    next();
  } catch (error) {
    next(error);
  }
};

export const authWithPostId = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const cookies = req.cookies;
  const postId = req.params.postId;
  try {
    const tokenContent = parseAndDecode(cookies);
    if (!tokenContent || !tokenContent.userId) {
      throw new UnauthorizedError('토큰에 유효한 사용자 정보가 없습니다');
    }
    const tokenUserId = tokenContent.userId;

    const requestedUserId = await getUserByPostId(postId);
    if (tokenUserId !== requestedUserId) {
      throw new ForbiddenError('이 작업을 수행할 권한이 없습니다');
    }
    req.user = tokenUserId;
    next();
  } catch (error) {
    next(error);
  }
};
