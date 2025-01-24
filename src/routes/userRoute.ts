import express from 'express';
import {
  redirectToGitHub,
  handleGitHubCallback,
  refreshToken,
} from '../controllers/userController';

const router = express.Router();

router.get('/github', redirectToGitHub);
router.get('/github/callback', handleGitHubCallback);
router.get('/refresh-token', refreshToken);

export default router;
