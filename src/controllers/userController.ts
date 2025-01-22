import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { BadRequestError, NotFoundError } from '../errors/httpError';
import * as userService from '../services/userService';
import { findUserById } from '../repositories/userRepository';

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

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      throw new NotFoundError('Failed to obtain access token');
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const providerId = userResponse.data.id;
    const checkUserResponse = await userService.checkUser(userResponse.data.id);
    // github 최초 로그인 시 DB에 유저 생성
    if (!checkUserResponse) {
      const userEmailResponse = await axios.get(
        'https://api.github.com/user/emails',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const avatar_url = userResponse.data.avatar_url;
      const username = userResponse.data.login;
      const email = userEmailResponse.data.find(
        (email: any) => email.primary
      )?.email;
      if (!email) {
        throw new NotFoundError('Primary email not found');
      }
      await userService.registerUser(username, email, avatar_url, providerId);
    }

    const userId = await findUserById(providerId);
    const token = jwt.sign({ userId: userId?._id }, JWT_SECRET_KEY!, {
      expiresIn: '1h',
    });

    res.cookie('authorization', token, {
      httpOnly: true,
    });
    res.status(200).json({
      message: 'GitHub 로그인 성공',
    });
  } catch (error) {
    next(error);
  }
};
