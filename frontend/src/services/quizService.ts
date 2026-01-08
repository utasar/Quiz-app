import api from './api';
import { Quiz, Question } from '../types';

export interface CreateQuizData {
  title: string;
  description: string;
  category: string;
  questions: Question[];
  timeLimit?: number;
  isPublic?: boolean;
  source?: string;
}

export interface GenerateFromBookData {
  bookLink: string;
  topic: string;
  numberOfQuestions?: number;
  title: string;
  description: string;
}

export const quizService = {
  async getQuizzes(category?: string): Promise<Quiz[]> {
    const params = category ? { category } : {};
    const response = await api.get('/quizzes', { params });
    return response.data;
  },

  async getQuizById(id: string): Promise<Quiz> {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  async createQuiz(data: CreateQuizData): Promise<Quiz> {
    const response = await api.post('/quizzes', data);
    return response.data.quiz;
  },

  async generateFromBook(data: GenerateFromBookData): Promise<Quiz> {
    const response = await api.post('/quizzes/generate/book', data);
    return response.data.quiz;
  },

  async generateFromNews(numberOfQuestions: number = 5): Promise<Quiz> {
    const response = await api.post('/quizzes/generate/news', { numberOfQuestions });
    return response.data.quiz;
  },

  async updateQuiz(id: string, data: Partial<CreateQuizData>): Promise<Quiz> {
    const response = await api.put(`/quizzes/${id}`, data);
    return response.data.quiz;
  },

  async deleteQuiz(id: string): Promise<void> {
    await api.delete(`/quizzes/${id}`);
  }
};
