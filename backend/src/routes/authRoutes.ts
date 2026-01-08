import { Router } from 'express';
import { authController } from '../controllers/authController';
import { auth } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', authLimiter, authController.register.bind(authController));
router.post('/login', authLimiter, authController.login.bind(authController));
router.get('/profile', auth, authController.getProfile.bind(authController));

export default router;
