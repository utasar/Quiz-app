import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  questionType: 'multiple-choice' | 'true-false' | 'fill-in-blank';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface IQuiz extends Document {
  title: string;
  description: string;
  category: 'general-knowledge' | 'cultural' | 'political' | 'historical' | 'current-affairs' | 'custom';
  createdBy: mongoose.Types.ObjectId;
  questions: IQuestion[];
  timeLimit?: number; // in minutes
  isPublic: boolean;
  source?: string; // book link, news article, or custom
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema({
  questionText: { type: String, required: true },
  questionType: { 
    type: String, 
    enum: ['multiple-choice', 'true-false', 'fill-in-blank'], 
    required: true 
  },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
});

const QuizSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['general-knowledge', 'cultural', 'political', 'historical', 'current-affairs', 'custom'],
    required: true 
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [QuestionSchema],
  timeLimit: { type: Number },
  isPublic: { type: Boolean, default: true },
  source: { type: String }
}, { timestamps: true });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
