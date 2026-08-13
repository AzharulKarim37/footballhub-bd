import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const API_BASE = "http://localhost:5001/api";

function Profile() {
  const { user, token } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (token) {
          const res = await axios.get(`${API_BASE}/quizzes/my-attempts`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAttempts(res.data.attempts || []);
        }
      } catch (err) {
        console.error("Failed to fetch user attempts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [token]);

  // Calculate some stats
  const totalQuizzes = attempts.length;
  const totalQuestions = attempts.reduce((acc, curr) => acc + curr.total_questions, 0);
  const totalCorrect = attempts.reduce((acc, curr) => acc + curr.score, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  // Something more: A user level based on correct answers
  let level = "Rookie";
  if (totalCorrect >= 50) level = "Legend";
  else if (totalCorrect >= 25) level = "Pro";
  else if (totalCorrect >= 10) level = "Amateur";

  if (loading) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* User Info Section */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="profile-info">
            <h1>{user?.name || "User"}</h1>
            <p className="profile-email">{user?.email}</p>
            <span className="profile-level-badge">🏆 {level} Level</span>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="profile-stats">
          <div className="stat-card">
            <h3>Total Quizzes</h3>
            <p>{totalQuizzes}</p>
          </div>
          <div className="stat-card">
            <h3>Total Correct</h3>
            <p>{totalCorrect}</p>
          </div>
          <div className="stat-card">
            <h3>Accuracy</h3>
            <p>{accuracy}%</p>
          </div>
        </div>

        {/* Participated Quizzes */}
        <div className="profile-quizzes-section">
          <h2>Your Recent Quiz Attempts</h2>
          {attempts.length === 0 ? (
            <div className="no-quizzes">
              <p>You haven't participated in any quizzes yet.</p>
              <Link to="/quiz" className="btn-primary">Explore Quizzes</Link>
            </div>
          ) : (
            <div className="profile-quizzes-grid">
              {attempts.map((attempt) => (
                <Link to={`/attempt/${attempt.quiz_id}/${attempt.id}`} key={attempt.id} className="profile-quiz-card-link" style={{textDecoration: 'none', color: 'inherit'}}>
                  <div className="profile-quiz-card">
                    <h4>{attempt.title}</h4>
                    <p className="quiz-meta">Difficulty: {attempt.difficulty}</p>
                    {attempt.leaderboard_published === 1 && (
                      <p className="quiz-meta" style={{color: '#176b43', fontWeight: 'bold'}}>
                        Leaderboard Rank: #{attempt.user_rank}
                      </p>
                    )}
                    <div className="quiz-score-box">
                      Score: <strong>{attempt.score}/{attempt.total_questions}</strong>
                    </div>
                    <div className="quiz-date">
                      Completed: {new Date(attempt.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
