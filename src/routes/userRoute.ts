import express from 'express';
import {
  redirectToGitHub,
  handleGitHubCallback,
} from '../controllers/userController';

const router = express.Router();

router.get('/github', redirectToGitHub);
router.get('/github/callback', handleGitHubCallback);

export default router;
