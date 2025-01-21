import express from 'express';
import {
  login,
  refreshAccessToken,
  register,
} from '../controllers/userController';
import {
  validateLogin,
  validate,
  validateRegister,
} from '../validators/userValidator';
import { checkAccessToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', [...validateRegister, validate], register);
router.post('/login', [...validateLogin, validate], login);
router.post('/refresh', checkAccessToken, refreshAccessToken);

export default router;
