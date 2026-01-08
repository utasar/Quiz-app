import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswer {
  questionIndex: number;
  userAnswer: string;
  isCorrect: boolean;
  timeTaken?: number; // in seconds
}

export interface IQuizResult extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  totalQuestions: number;
  percentageScore: number;
  timeTaken: number; // total time in seconds
  completedAt: Date;
  createdAt: Date;
}

const AnswerSchema: Schema = new Schema({
  questionIndex: { type: Number, required: true },
  userAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number }
});

const QuizResultSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [AnswerSchema],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentageScore: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for leaderboard queries
QuizResultSchema.index({ quizId: 1, score: -1 });
QuizResultSchema.index({ userId: 1, completedAt: -1 });

export default mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);
