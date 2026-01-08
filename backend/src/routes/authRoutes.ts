import { Router } from 'express';
import { authController } from '../controllers/authController';
import { auth } from '../middlewares/auth';

const router = Router();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/profile', auth, authController.getProfile.bind(authController));

export default router;
