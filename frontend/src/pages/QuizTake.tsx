import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { resultService } from '../services/resultService';
import { Quiz, Answer } from '../types';
import './QuizTake.css';

function QuizTake() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      if (id) {
        const data = await quizService.getQuizById(id);
        setQuiz(data);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = () => {
    if (!userAnswer.trim()) return;

    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    const newAnswer: Answer = {
      questionIndex: currentQuestion,
      userAnswer: userAnswer.trim(),
      timeTaken
    };

    setAnswers([...answers, newAnswer]);
    setUserAnswer('');
    
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestionStartTime(Date.now());
    } else {
      submitQuiz([...answers, newAnswer]);
    }
  };

  const submitQuiz = async (finalAnswers: Answer[]) => {
    if (!quiz) return;

    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      const result = await resultService.submitResult({
        quizId: quiz._id,
        answers: finalAnswers,
        timeTaken: totalTime
      });
      setResult(result);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="loading">Quiz not found</div>;
  }

  if (submitted && result) {
    return (
      <div className="quiz-result">
        <div className="container">
          <div className="result-card">
            <h1>Quiz Completed!</h1>
            <div className="score-display">
              <div className="score-circle">
                <span className="score">{result.percentageScore?.toFixed(1) || 0}%</span>
              </div>
            </div>
            <div className="result-stats">
              <div className="result-stat">
                <span className="stat-label">Correct Answers:</span>
                <span className="stat-value">{result.score}/{result.totalQuestions}</span>
              </div>
              <div className="result-stat">
                <span className="stat-label">Time Taken:</span>
                <span className="stat-value">{Math.floor(result.timeTaken / 60)}:{(result.timeTaken % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
            <div className="result-actions">
              <Link to="/quizzes" className="btn btn-primary">Back to Quizzes</Link>
              <Link to="/leaderboard" className="btn btn-secondary">View Leaderboard</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-take">
      <div className="container">
        <div className="quiz-header">
          <h1>{quiz.title}</h1>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
          <p className="question-counter">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>

        <div className="question-card">
          <h2>{question.questionText}</h2>
          
          {question.questionType === 'multiple-choice' && question.options && (
            <div className="options">
              {question.options.map((option, index) => (
                <label key={index} className="option">
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={userAnswer === option}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.questionType === 'true-false' && (
            <div className="options">
              <label className="option">
                <input
                  type="radio"
                  name="answer"
                  value="True"
                  checked={userAnswer === 'True'}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                <span>True</span>
              </label>
              <label className="option">
                <input
                  type="radio"
                  name="answer"
                  value="False"
                  checked={userAnswer === 'False'}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                <span>False</span>
              </label>
            </div>
          )}

          {question.questionType === 'fill-in-blank' && (
            <input
              type="text"
              className="fill-in-input"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer..."
            />
          )}

          <button 
            className="btn btn-primary submit-answer" 
            onClick={handleAnswer}
            disabled={!userAnswer.trim()}
          >
            {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizTake;
