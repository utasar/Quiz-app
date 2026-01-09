import { Response } from 'express';
import Quiz from '../models/Quiz';
import { AuthRequest } from '../middlewares/auth';
import { quizGenerationService } from '../services/quizGenerationService';
import { newsService } from '../services/newsService';

export class QuizController {
  async createQuiz(req: AuthRequest, res: Response) {
    try {
      const { title, description, category, questions, timeLimit, isPublic, source } = req.body;

      if (!title || !description || !category || !questions) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      const quiz = new Quiz({
        title,
        description,
        category,
        createdBy: req.user!.id,
        questions,
        timeLimit,
        isPublic: isPublic !== undefined ? isPublic : true,
        source
      });

      await quiz.save();
      res.status(201).json({ message: 'Quiz created successfully', quiz });
    } catch (error) {
      console.error('Create quiz error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async generateFromBook(req: AuthRequest, res: Response) {
    try {
      const { bookLink, topic, numberOfQuestions, title, description } = req.body;

      if (!bookLink || !topic || !title || !description) {
        return res.status(400).json({ error: 'Book link, topic, title, and description are required' });
      }

      const questions = await quizGenerationService.generateFromBookLink(
        bookLink,
        topic,
        numberOfQuestions || 10
      );

      const quiz = new Quiz({
        title,
        description,
        category: 'custom',
        createdBy: req.user!.id,
        questions,
        isPublic: true,
        source: bookLink
      });

      await quiz.save();
      res.status(201).json({ message: 'Quiz generated successfully from book', quiz });
    } catch (error) {
      console.error('Generate from book error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async generateFromNews(req: AuthRequest, res: Response) {
    try {
      const { numberOfQuestions } = req.body;

      // Fetch latest news
      const articles = await newsService.getTopHeadlines();
      
      if (!articles || articles.length === 0) {
        return res.status(404).json({ error: 'No news articles found' });
      }

      // Use the first article
      const article = articles[0];
      const newsContent = `${article.title}\n${article.description}\n${article.content}`;

      const questions = await quizGenerationService.generateFromNews(
        newsContent,
        numberOfQuestions || 5
      );

      const quiz = new Quiz({
        title: `Current Affairs: ${article.title}`,
        description: article.description || 'Quiz based on latest news',
        category: 'current-affairs',
        createdBy: req.user!.id,
        questions,
        isPublic: true,
        source: article.url
      });

      await quiz.save();
      res.status(201).json({ message: 'Quiz generated from news', quiz });
    } catch (error) {
      console.error('Generate from news error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getQuizzes(req: AuthRequest, res: Response) {
    try {
      const { category, createdBy } = req.query;
      const filter: any = { isPublic: true };

      if (category) {
        filter.category = category;
      }

      if (createdBy) {
        filter.createdBy = createdBy;
      }

      const quizzes = await Quiz.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      res.json(quizzes);
    } catch (error) {
      console.error('Get quizzes error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getQuizById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findById(id).populate('createdBy', 'name email');

      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      res.json(quiz);
    } catch (error) {
      console.error('Get quiz error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async updateQuiz(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findById(id);

      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      if (quiz.createdBy.toString() !== req.user!.id && req.user!.role !== 'teacher') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
      res.json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
    } catch (error) {
      console.error('Update quiz error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async deleteQuiz(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findById(id);

      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      if (quiz.createdBy.toString() !== req.user!.id && req.user!.role !== 'teacher') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await Quiz.findByIdAndDelete(id);
      res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      console.error('Delete quiz error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export const quizController = new QuizController();
