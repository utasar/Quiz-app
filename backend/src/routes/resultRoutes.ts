import { Router } from 'express';
import { quizResultController } from '../controllers/quizResultController';
import { auth } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(auth);

// Submit quiz result
router.post('/', quizResultController.submitQuizResult.bind(quizResultController));

// Get user results
router.get('/user/:userId?', quizResultController.getUserResults.bind(quizResultController));

// Get user statistics
router.get('/stats/:userId?', quizResultController.getUserStats.bind(quizResultController));

// Get quiz leaderboard
router.get('/leaderboard/quiz/:quizId', quizResultController.getQuizLeaderboard.bind(quizResultController));

// Get global leaderboard
router.get('/leaderboard/global', quizResultController.getGlobalLeaderboard.bind(quizResultController));

export default router;
