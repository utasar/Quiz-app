import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { resultService } from '../services/resultService';
import { UserStats } from '../types';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const userStats = await resultService.getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
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
        <h1>Welcome, {user?.name}!</h1>
        <p className="role-badge">Role: {user?.role}</p>

        <div className="dashboard-grid">
          <div className="card stats-card">
            <h3>Your Statistics</h3>
            <div className="stat-item">
              <span className="stat-label">Total Quizzes Taken:</span>
              <span className="stat-value">{stats?.totalQuizzes || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Score:</span>
              <span className="stat-value">{stats?.totalScore || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Score:</span>
              <span className="stat-value">{stats?.averageScore?.toFixed(1) || 0}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Time:</span>
              <span className="stat-value">{Math.round((stats?.totalTimeTaken || 0) / 60)} minutes</span>
            </div>
          </div>

          <div className="card quick-actions">
            <h3>Quick Actions</h3>
            <Link to="/quizzes" className="btn btn-primary action-btn">
              Browse Quizzes
            </Link>
            {(user?.role === 'parent' || user?.role === 'teacher') && (
              <>
                <Link to="/create-quiz" className="btn btn-success action-btn">
                  Create Custom Quiz
                </Link>
              </>
            )}
            <Link to="/leaderboard" className="btn btn-secondary action-btn">
              View Leaderboard
            </Link>
          </div>
        </div>

        <div className="card info-section">
          <h3>About Quiz App</h3>
          <p>
            This comprehensive quiz application is designed for educational, cultural, and competitive purposes.
            It helps students prepare for quiz competitions locally and globally.
          </p>
          <h4>Features:</h4>
          <ul>
            <li>Multiple quiz categories: General Knowledge, Cultural, Political, Historical, Current Affairs</li>
            <li>AI-powered quiz generation from book links and news articles</li>
            <li>Multiple question types: Multiple Choice, True/False, Fill in the Blank</li>
            <li>Real-time leaderboards and performance tracking</li>
            <li>Role-based access for Students, Parents, and Teachers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
