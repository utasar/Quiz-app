import { config } from '../config/config';
import { IQuestion } from '../models/Quiz';
import OpenAI from 'openai';

export class QuizGenerationService {
  private openai: OpenAI | null = null;

  constructor() {
    if (config.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: config.openaiApiKey
      });
    }
  }

  async generateFromBookLink(bookLink: string, topic: string, numberOfQuestions: number = 10): Promise<IQuestion[]> {
    if (!this.openai) {
      console.warn('OpenAI API key not configured, using mock questions');
      return this.generateMockQuestions(topic, numberOfQuestions);
    }

    try {
      const prompt = `Generate ${numberOfQuestions} quiz questions about "${topic}" from the book at ${bookLink}. 
      Create a mix of multiple-choice (with 4 options), true-false, and fill-in-the-blank questions.
      Return the response as a JSON array with this structure:
      [{
        "questionText": "question here",
        "questionType": "multiple-choice" or "true-false" or "fill-in-blank",
        "options": ["option1", "option2", "option3", "option4"] (only for multiple-choice),
        "correctAnswer": "correct answer",
        "explanation": "brief explanation",
        "difficulty": "easy" or "medium" or "hard"
      }]`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          return this.generateMockQuestions(topic, numberOfQuestions);
        }
      }
      return this.generateMockQuestions(topic, numberOfQuestions);
    } catch (error) {
      console.error('Error generating quiz from AI:', error);
      return this.generateMockQuestions(topic, numberOfQuestions);
    }
  }

  async generateFromNews(newsContent: string, numberOfQuestions: number = 5): Promise<IQuestion[]> {
    if (!this.openai) {
      return this.generateMockNewsQuestions(numberOfQuestions);
    }

    try {
      const prompt = `Based on this news article, generate ${numberOfQuestions} quiz questions:
      
      ${newsContent}
      
      Create multiple-choice questions with 4 options each.
      Return as JSON array with structure:
      [{
        "questionText": "question here",
        "questionType": "multiple-choice",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": "correct answer",
        "explanation": "brief explanation",
        "difficulty": "medium"
      }]`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          return this.generateMockNewsQuestions(numberOfQuestions);
        }
      }
      return this.generateMockNewsQuestions(numberOfQuestions);
    } catch (error) {
      console.error('Error generating quiz from news:', error);
      return this.generateMockNewsQuestions(numberOfQuestions);
    }
  }

  private generateMockQuestions(topic: string, count: number): IQuestion[] {
    const questions: IQuestion[] = [];
    
    for (let i = 0; i < count; i++) {
      if (i % 3 === 0) {
        questions.push({
          questionText: `What is a key concept in ${topic}?`,
          questionType: 'multiple-choice',
          options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
          correctAnswer: 'Concept A',
          explanation: `This is a fundamental concept in ${topic}`,
          difficulty: 'medium'
        });
      } else if (i % 3 === 1) {
        questions.push({
          questionText: `${topic} is important in modern education.`,
          questionType: 'true-false',
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: `${topic} plays a vital role in education`,
          difficulty: 'easy'
        });
      } else {
        questions.push({
          questionText: `The main principle of ${topic} is _____.`,
          questionType: 'fill-in-blank',
          correctAnswer: 'knowledge',
          explanation: 'Knowledge is a core principle',
          difficulty: 'medium'
        });
      }
    }
    
    return questions;
  }

  private generateMockNewsQuestions(count: number): IQuestion[] {
    const questions: IQuestion[] = [];
    
    for (let i = 0; i < count; i++) {
      questions.push({
        questionText: `What was the main topic of the recent news article?`,
        questionType: 'multiple-choice',
        options: ['Climate Change', 'Technology', 'Politics', 'Sports'],
        correctAnswer: 'Climate Change',
        explanation: 'The article focused on climate-related developments',
        difficulty: 'medium'
      });
    }
    
    return questions;
  }
}

export const quizGenerationService = new QuizGenerationService();
