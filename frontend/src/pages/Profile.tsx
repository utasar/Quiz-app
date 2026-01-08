import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { resultService } from '../services/resultService';
import { QuizResult, UserStats } from '../types';
import './Profile.css';

function Profile() {
  const [user] = useState(authService.getCurrentUser());
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentResults, setRecentResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [userStats, results] = await Promise.all([
        resultService.getUserStats(),
        resultService.getUserResults()
      ]);
      setStats(userStats);
      setRecentResults(results.slice(0, 10)); // Show last 10 results
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
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
        <h1>My Profile</h1>

        <div className="profile-grid">
          <div className="card profile-info">
            <h3>Account Information</h3>
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{user?.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value role-badge">{user?.role}</span>
            </div>
          </div>

          <div className="card stats-summary">
            <h3>Performance Summary</h3>
            <div className="stat-grid">
              <div className="stat-box">
                <div className="stat-number">{stats?.totalQuizzes || 0}</div>
                <div className="stat-text">Quizzes Taken</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{stats?.totalScore || 0}</div>
                <div className="stat-text">Total Score</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{stats?.averageScore?.toFixed(1) || 0}%</div>
                <div className="stat-text">Average Score</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{Math.round((stats?.totalTimeTaken || 0) / 60)}</div>
                <div className="stat-text">Minutes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card recent-results">
          <h3>Recent Quiz Results</h3>
          {recentResults.length === 0 ? (
            <p className="no-results">No quiz results yet. <Link to="/quizzes">Take a quiz</Link> to get started!</p>
          ) : (
            <div className="results-list">
              {recentResults.map((result) => (
                <div key={result._id} className="result-item">
                  <div className="result-quiz">
                    <h4>{typeof result.quizId === 'object' ? result.quizId.title : 'Quiz'}</h4>
                    <span className="result-date">
                      {new Date(result.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="result-score">
                    <span className="score-percent">{result.percentageScore.toFixed(1)}%</span>
                    <span className="score-fraction">{result.score}/{result.totalQuestions}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
