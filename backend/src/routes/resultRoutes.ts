import { Router } from 'express';
import { quizResultController } from '../controllers/quizResultController';
import { auth } from '../middlewares/auth';
import { apiLimiter } from '../middlewares/rateLimiter';

const router = Router();

// All routes require authentication
router.use(auth);

// Submit quiz result
router.post('/', apiLimiter, quizResultController.submitQuizResult.bind(quizResultController));

// Get user results
router.get('/user/:userId?', apiLimiter, quizResultController.getUserResults.bind(quizResultController));

// Get user statistics
router.get('/stats/:userId?', apiLimiter, quizResultController.getUserStats.bind(quizResultController));

// Get quiz leaderboard
router.get('/leaderboard/quiz/:quizId', apiLimiter, quizResultController.getQuizLeaderboard.bind(quizResultController));

// Get global leaderboard
router.get('/leaderboard/global', apiLimiter, quizResultController.getGlobalLeaderboard.bind(quizResultController));

export default router;
