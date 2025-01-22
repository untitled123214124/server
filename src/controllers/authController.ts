import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { BadRequestError } from '../errors/httpError';

dotenv.config();

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET_KEY,
  GITHUB_CALLBACK_URL,
  JWT_SECRET_KEY,
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
    return next(new BadRequestError('Authorization code is missing'));
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

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      throw new Error('Failed to obtain access token');
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userEmailResponse = await axios.get(
      'https://api.github.com/user/emails',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const userInfo = {
      id: userResponse.data.id,
      username: userResponse.data.login,
      email: userEmailResponse.data.find((email: any) => email.primary)?.email,
    };

    if (!userInfo.email) {
      throw new Error('Primary email not found');
    }

    const token = jwt.sign(userInfo, JWT_SECRET_KEY!, { expiresIn: '1h' });

    res.status(200).json({
      message: 'GitHub 로그인 성공',
      token,
      user: userInfo,
    });
  } catch (error) {
    next(error); // 에러를 에러 핸들링 미들웨어로 전달
  }
};
