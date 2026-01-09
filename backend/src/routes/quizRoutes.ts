import { Router } from 'express';
import { quizController } from '../controllers/quizController';
import { auth, authorize } from '../middlewares/auth';
import { createLimiter, apiLimiter } from '../middlewares/rateLimiter';

const router = Router();

// All routes require authentication and rate limiting
router.use(apiLimiter, auth);

// Get all quizzes
router.get('/', quizController.getQuizzes.bind(quizController));

// Get quiz by ID
router.get('/:id', quizController.getQuizById.bind(quizController));

// Create quiz (parents and teachers only)
router.post('/', authorize('parent', 'teacher'), createLimiter, quizController.createQuiz.bind(quizController));

// Generate quiz from book link (parents and teachers only)
router.post('/generate/book', authorize('parent', 'teacher'), createLimiter, quizController.generateFromBook.bind(quizController));

// Generate quiz from news (parents and teachers only)
router.post('/generate/news', authorize('parent', 'teacher'), createLimiter, quizController.generateFromNews.bind(quizController));

// Update quiz (parents and teachers only)
router.put('/:id', authorize('parent', 'teacher'), quizController.updateQuiz.bind(quizController));

// Delete quiz (parents and teachers only)
router.delete('/:id', authorize('parent', 'teacher'), quizController.deleteQuiz.bind(quizController));

export default router;
