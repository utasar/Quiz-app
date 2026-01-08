import { Response } from 'express';
import QuizResult from '../models/QuizResult';
import Quiz from '../models/Quiz';
import { AuthRequest } from '../middlewares/auth';

export class QuizResultController {
  async submitQuizResult(req: AuthRequest, res: Response) {
    try {
      const { quizId, answers, timeTaken } = req.body;

      if (!quizId || !answers || !timeTaken) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      // Get the quiz to validate answers
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Calculate score
      let score = 0;
      const validatedAnswers = answers.map((answer: any, index: number) => {
        const question = quiz.questions[answer.questionIndex];
        const isCorrect = question.correctAnswer.toLowerCase().trim() === answer.userAnswer.toLowerCase().trim();
        if (isCorrect) score++;
        
        return {
          questionIndex: answer.questionIndex,
          userAnswer: answer.userAnswer,
          isCorrect,
          timeTaken: answer.timeTaken
        };
      });

      const totalQuestions = quiz.questions.length;
      const percentageScore = (score / totalQuestions) * 100;

      const result = new QuizResult({
        userId: req.user!.id,
        quizId,
        answers: validatedAnswers,
        score,
        totalQuestions,
        percentageScore,
        timeTaken
      });

      await result.save();

      res.status(201).json({
        message: 'Quiz result submitted successfully',
        result: {
          score,
          totalQuestions,
          percentageScore,
          timeTaken
        }
      });
    } catch (error) {
      console.error('Submit quiz result error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getUserResults(req: AuthRequest, res: Response) {
    try {
      const userId = req.params.userId || req.user!.id;

      // Only allow users to view their own results unless they're a teacher
      if (userId !== req.user!.id && req.user!.role !== 'teacher') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const results = await QuizResult.find({ userId })
        .populate('quizId', 'title category')
        .sort({ completedAt: -1 });

      res.json(results);
    } catch (error) {
      console.error('Get user results error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getQuizLeaderboard(req: AuthRequest, res: Response) {
    try {
      const { quizId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const leaderboard = await QuizResult.find({ quizId })
        .populate('userId', 'name')
        .sort({ score: -1, timeTaken: 1 })
        .limit(limit);

      res.json(leaderboard);
    } catch (error) {
      console.error('Get leaderboard error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getGlobalLeaderboard(req: AuthRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      // Aggregate to get top performers
      const leaderboard = await QuizResult.aggregate([
        {
          $group: {
            _id: '$userId',
            totalScore: { $sum: '$score' },
            quizzesTaken: { $sum: 1 },
            averageScore: { $avg: '$percentageScore' }
          }
        },
        {
          $sort: { totalScore: -1, averageScore: -1 }
        },
        {
          $limit: limit
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            _id: 1,
            userName: '$user.name',
            totalScore: 1,
            quizzesTaken: 1,
            averageScore: { $round: ['$averageScore', 2] }
          }
        }
      ]);

      res.json(leaderboard);
    } catch (error) {
      console.error('Get global leaderboard error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getUserStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.params.userId || req.user!.id;

      // Only allow users to view their own stats unless they're a teacher
      if (userId !== req.user!.id && req.user!.role !== 'teacher') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const stats = await QuizResult.aggregate([
        {
          $match: { userId: userId }
        },
        {
          $group: {
            _id: null,
            totalQuizzes: { $sum: 1 },
            totalScore: { $sum: '$score' },
            averageScore: { $avg: '$percentageScore' },
            totalTimeTaken: { $sum: '$timeTaken' }
          }
        }
      ]);

      if (stats.length === 0) {
        return res.json({
          totalQuizzes: 0,
          totalScore: 0,
          averageScore: 0,
          totalTimeTaken: 0
        });
      }

      res.json(stats[0]);
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export const quizResultController = new QuizResultController();
