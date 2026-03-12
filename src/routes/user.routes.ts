import { Router } from 'express';
import userController from '../controllers/user.controller';
import { catchAsync } from '../utils/catchAsync';

export const router = Router();

router.post('/', catchAsync(userController.create));
