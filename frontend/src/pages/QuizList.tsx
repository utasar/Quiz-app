import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { authService } from '../services/authService';
import { Quiz } from '../types';
import './QuizList.css';

function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    loadQuizzes();
  }, [category]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuizzes(category || undefined);
      setQuizzes(data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading quizzes...</div>;
  }

  return (
    <div className="quiz-list-page">
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
        <h1>Available Quizzes</h1>

        <div className="filter-section">
          <label>Filter by Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="general-knowledge">General Knowledge</option>
            <option value="cultural">Cultural</option>
            <option value="political">Political</option>
            <option value="historical">Historical</option>
            <option value="current-affairs">Current Affairs</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {quizzes.length === 0 ? (
          <div className="no-quizzes">
            <p>No quizzes available in this category.</p>
            {(user?.role === 'parent' || user?.role === 'teacher') && (
              <Link to="/create-quiz" className="btn btn-primary">
                Create Your First Quiz
              </Link>
            )}
          </div>
        ) : (
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="quiz-card">
                <div className="quiz-category">{quiz.category}</div>
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <div className="quiz-info">
                  <span>{quiz.questions.length} questions</span>
                  {quiz.timeLimit && <span>{quiz.timeLimit} minutes</span>}
                </div>
                <Link to={`/quiz/${quiz._id}`} className="btn btn-primary">
                  Start Quiz
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizList;
