import express from 'express';
import { register } from '../controllers/userController';
import { userValidationRules, validate } from '../validators/userValidator';

const router = express.Router();

router.post('/register', [...userValidationRules, validate], register);

export default router;
