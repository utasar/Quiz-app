import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { authService } from '../services/authService';
import { Question } from '../types';
import './QuizCreate.css';

function QuizCreate() {
  const [mode, setMode] = useState<'manual' | 'book' | 'news'>('manual');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('custom');
  const [timeLimit, setTimeLimit] = useState('');
  const [bookLink, setBookLink] = useState('');
  const [topic, setTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState('10');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    questionText: '',
    questionType: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText || !currentQuestion.correctAnswer) {
      setError('Question text and correct answer are required');
      return;
    }

    setQuestions([...questions, currentQuestion as Question]);
    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      difficulty: 'medium'
    });
    setError('');
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleGenerateFromBook = async () => {
    if (!bookLink || !topic || !title || !description) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await quizService.generateFromBook({
        bookLink,
        topic,
        numberOfQuestions: parseInt(numberOfQuestions),
        title,
        description
      });
      navigate('/quizzes');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromNews = async () => {
    setLoading(true);
    setError('');

    try {
      await quizService.generateFromNews(parseInt(numberOfQuestions));
      navigate('/quizzes');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate quiz from news');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManualQuiz = async () => {
    if (!title || !description || questions.length === 0) {
      setError('Title, description, and at least one question are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await quizService.createQuiz({
        title,
        description,
        category,
        questions,
        timeLimit: timeLimit ? parseInt(timeLimit) : undefined
      });
      navigate('/quizzes');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  const updateQuestionOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  return (
    <div className="quiz-create-page">
      <nav className="navbar">
        <div className="navbar-brand">Quiz App</div>
        <ul className="navbar-nav">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/quizzes">Quizzes</Link></li>
          {(user?.role === 'parent' || user?.role === 'teacher') && (
            <li><Link to="/create-quiz">Create Quiz</Link></li>
          )}
          <li><Link to="/leaderboard">Leaderboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><button onClick={handleLogout} className="btn-link">Logout</button></li>
        </ul>
      </nav>

      <div className="container">
        <h1>Create Quiz</h1>

        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
            onClick={() => setMode('manual')}
          >
            Manual Creation
          </button>
          <button
            className={`mode-btn ${mode === 'book' ? 'active' : ''}`}
            onClick={() => setMode('book')}
          >
            Generate from Book
          </button>
          <button
            className={`mode-btn ${mode === 'news' ? 'active' : ''}`}
            onClick={() => setMode('news')}
          >
            Generate from News
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {mode === 'manual' && (
          <div className="manual-mode">
            <div className="card">
              <h3>Quiz Details</h3>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter quiz description"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="custom">Custom</option>
                  <option value="general-knowledge">General Knowledge</option>
                  <option value="cultural">Cultural</option>
                  <option value="political">Political</option>
                  <option value="historical">Historical</option>
                  <option value="current-affairs">Current Affairs</option>
                </select>
              </div>
              <div className="form-group">
                <label>Time Limit (minutes, optional)</label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  placeholder="e.g., 30"
                />
              </div>
            </div>

            <div className="card">
              <h3>Add Question</h3>
              <div className="form-group">
                <label>Question Type</label>
                <select
                  value={currentQuestion.questionType}
                  onChange={(e) => setCurrentQuestion({ 
                    ...currentQuestion, 
                    questionType: e.target.value as any 
                  })}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="fill-in-blank">Fill in the Blank</option>
                </select>
              </div>

              <div className="form-group">
                <label>Question Text</label>
                <textarea
                  value={currentQuestion.questionText}
                  onChange={(e) => setCurrentQuestion({ 
                    ...currentQuestion, 
                    questionText: e.target.value 
                  })}
                  placeholder="Enter your question"
                />
              </div>

              {currentQuestion.questionType === 'multiple-choice' && (
                <div className="form-group">
                  <label>Options</label>
                  {currentQuestion.options?.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => updateQuestionOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      style={{ marginBottom: '8px' }}
                    />
                  ))}
                </div>
              )}

              <div className="form-group">
                <label>Correct Answer</label>
                <input
                  type="text"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({ 
                    ...currentQuestion, 
                    correctAnswer: e.target.value 
                  })}
                  placeholder="Enter correct answer"
                />
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={currentQuestion.difficulty}
                  onChange={(e) => setCurrentQuestion({ 
                    ...currentQuestion, 
                    difficulty: e.target.value as any 
                  })}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <button onClick={handleAddQuestion} className="btn btn-secondary">
                Add Question
              </button>
            </div>

            {questions.length > 0 && (
              <div className="card">
                <h3>Questions ({questions.length})</h3>
                <div className="questions-list">
                  {questions.map((q, index) => (
                    <div key={index} className="question-item">
                      <div className="question-header">
                        <span className="question-number">Q{index + 1}</span>
                        <button 
                          onClick={() => handleRemoveQuestion(index)}
                          className="btn-remove"
                        >
                          Remove
                        </button>
                      </div>
                      <p><strong>{q.questionText}</strong></p>
                      <p className="question-meta">
                        Type: {q.questionType} | Answer: {q.correctAnswer}
                      </p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleCreateManualQuiz} 
                  className="btn btn-primary" 
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Quiz'}
                </button>
              </div>
            )}
          </div>
        )}

        {mode === 'book' && (
          <div className="book-mode">
            <div className="card">
              <h3>Generate Quiz from Book</h3>
              <div className="form-group">
                <label>Quiz Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Bhagavad Gita Quiz"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the quiz"
                />
              </div>
              <div className="form-group">
                <label>Book Link or Reference</label>
                <input
                  type="text"
                  value={bookLink}
                  onChange={(e) => setBookLink(e.target.value)}
                  placeholder="Enter book URL or reference"
                />
              </div>
              <div className="form-group">
                <label>Topic/Theme</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Karma Yoga, Chapter 2"
                />
              </div>
              <div className="form-group">
                <label>Number of Questions</label>
                <input
                  type="number"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(e.target.value)}
                  min="1"
                  max="50"
                />
              </div>
              <button 
                onClick={handleGenerateFromBook} 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Quiz'}
              </button>
            </div>
          </div>
        )}

        {mode === 'news' && (
          <div className="news-mode">
            <div className="card">
              <h3>Generate Quiz from Latest News</h3>
              <p>This will automatically fetch the latest news and generate quiz questions.</p>
              <div className="form-group">
                <label>Number of Questions</label>
                <input
                  type="number"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(e.target.value)}
                  min="1"
                  max="20"
                />
              </div>
              <button 
                onClick={handleGenerateFromNews} 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Quiz from News'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizCreate;
