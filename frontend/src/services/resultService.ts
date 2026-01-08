import api from './api';
import { QuizResult, Answer, LeaderboardEntry, UserStats } from '../types';

export interface SubmitResultData {
  quizId: string;
  answers: Answer[];
  timeTaken: number;
}

export const resultService = {
  async submitResult(data: SubmitResultData): Promise<QuizResult> {
    const response = await api.post('/results', data);
    return response.data.result;
  },

  async getUserResults(userId?: string): Promise<QuizResult[]> {
    const endpoint = userId ? `/results/user/${userId}` : '/results/user';
    const response = await api.get(endpoint);
    return response.data;
  },

  async getUserStats(userId?: string): Promise<UserStats> {
    const endpoint = userId ? `/results/stats/${userId}` : '/results/stats';
    const response = await api.get(endpoint);
    return response.data;
  },

  async getQuizLeaderboard(quizId: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    const response = await api.get(`/results/leaderboard/quiz/${quizId}`, {
      params: { limit }
    });
    return response.data;
  },

  async getGlobalLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const response = await api.get('/results/leaderboard/global', {
      params: { limit }
    });
    return response.data;
  }
};
