import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resultService } from '../services/resultService';
import { authService } from '../services/authService';
import { LeaderboardEntry } from '../types';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await resultService.getGlobalLeaderboard(50);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard-page">
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
        <h1>Global Leaderboard</h1>
        <p className="subtitle">Top performers across all quizzes</p>

        <div className="card leaderboard-card">
          {leaderboard.length === 0 ? (
            <p className="no-data">No leaderboard data available yet.</p>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Total Score</th>
                  <th>Quizzes Taken</th>
                  <th>Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry._id} className={index < 3 ? 'top-three' : ''}>
                    <td className="rank">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index >= 3 && `#${index + 1}`}
                    </td>
                    <td className="name">{entry.userName}</td>
                    <td>{entry.totalScore}</td>
                    <td>{entry.quizzesTaken}</td>
                    <td>{entry.averageScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
