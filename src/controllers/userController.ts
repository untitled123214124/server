import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/httpError';
import * as userService from '../services/userService';

dotenv.config();

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET_KEY,
  GITHUB_CALLBACK_URL,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
} = process.env;

export const redirectToGitHub = (req: Request, res: Response): void => {
  const redirectURI = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&scope=user:email`;
  res.redirect(redirectURI);
};

export const handleGitHubCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const code = req.query.code as string;

  if (!code) {
    throw new BadRequestError('Authorization code is missing');
  }

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET_KEY,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const githubAccessToken = tokenResponse.data.access_token;
    if (!githubAccessToken) {
      throw new NotFoundError('Failed to obtain access token');
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${githubAccessToken}` },
    });

    const providerId = userResponse.data.id;
    const checkUserExists = await userService.checkUser(
      'providerId',
      providerId
    );

    if (!checkUserExists) {
      const userEmailResponse = await axios.get(
        'https://api.github.com/user/emails',
        {
          headers: { Authorization: `Bearer ${githubAccessToken}` },
        }
      );

      const avatar_url = userResponse.data.avatar_url;
      const username = userResponse.data.login;
      const email = userEmailResponse.data.find(
        (email: any) => email.primary
      )?.email;

      if (!email) {
        throw new NotFoundError('깃허브에 등록된 이메일이 없습니다');
      }

      await userService.registerUser(username, email, avatar_url, providerId);
    }

    const user = await userService.getUser('providerId', providerId);
    const refreshToken = jwt.sign(
      { userId: user._id, tokenType: 'refresh' },
      JWT_REFRESH_SECRET_KEY!,
      { expiresIn: '7d' }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    const accessToken = jwt.sign(
      { userId: user._id, tokenType: 'access' },
      JWT_ACCESS_SECRET_KEY!,
      {
        expiresIn: '1h',
      }
    );
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    res.status(200).json({
      message: 'GitHub 로그인 성공',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { refreshToken } = req.cookies;
  try {
    if (!refreshToken) {
      throw new UnauthorizedError('리프레시 토큰이 없습니다');
    }

    const tokenPayload = jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY!) as {
      userId: string;
      tokenType: string;
    };

    const user = await userService.getUser('id', tokenPayload.userId);
    const newAccessToken = jwt.sign(
      { userId: user._id, tokenType: 'access' },
      JWT_ACCESS_SECRET_KEY!,
      {
        expiresIn: '1h',
      }
    );
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    res.status(200).json({
      message: '액세스 토큰이 재발급되었습니다',
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};
