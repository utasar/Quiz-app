export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'parent' | 'teacher';
}

export interface Question {
  questionText: string;
  questionType: 'multiple-choice' | 'true-false' | 'fill-in-blank';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  category: 'general-knowledge' | 'cultural' | 'political' | 'historical' | 'current-affairs' | 'custom';
  createdBy: User | string;
  questions: Question[];
  timeLimit?: number;
  isPublic: boolean;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  questionIndex: number;
  userAnswer: string;
  isCorrect?: boolean;
  timeTaken?: number;
}

export interface QuizResult {
  _id: string;
  userId: User | string;
  quizId: Quiz | string;
  answers: Answer[];
  score: number;
  totalQuestions: number;
  percentageScore: number;
  timeTaken: number;
  completedAt: string;
}

export interface LeaderboardEntry {
  _id: string;
  userName: string;
  totalScore: number;
  quizzesTaken: number;
  averageScore: number;
}

export interface UserStats {
  totalQuizzes: number;
  totalScore: number;
  averageScore: number;
  totalTimeTaken: number;
}
