import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./QuizLeaderboard.css";

function QuizLeaderboard() {
  const { quizId } = useParams();
  const API_URL = "http://localhost:5001/api/quizzes";
  const [quiz, setQuiz] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLeaderboard();
  }, [quizId]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please sign in to view the leaderboard.");
      }

      const response = await fetch(`${API_URL}/${quizId}/leaderboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load leaderboard");
      }

      setQuiz(data.quiz);
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const renderState = (icon, title, message, showButton = false) => (
    <div className="board-state">
      <div className="state-emoji">{icon}</div>
      <h2>{title}</h2>
      <p>{message}</p>
      {showButton && (
        <Link to="/quiz" className="action-btn">Back to Quizzes</Link>
      )}
    </div>
  );

  return (
    <div className="leaderboard-page-wrapper">
      <div className="leaderboard-board">
        
        <div className="board-header">
          <div className="board-eyebrow">Hall of Fame</div>
          <h1 className="board-title">{quiz?.title || "Quiz Leaderboard"}</h1>
          <p className="board-subtitle">The ultimate ranking of football knowledge</p>
        </div>

        {loading ? (
          renderState("⏳", "Loading Data", "Crunching the latest scores...")
        ) : error ? (
          renderState("🔒", "Access Denied", error, true)
        ) : leaderboard.length === 0 ? (
          renderState("🏆", "No Champions Yet", "Be the first to complete this quiz and claim the top spot!")
        ) : (
          <div className="elite-list">
            {leaderboard.map((player) => (
              <div 
                key={player.attempt_id} 
                className={`elite-row ${player.rank <= 3 ? `rank-${player.rank}` : ''}`}
              >
                <div className="row-position">
                  {player.rank === 1 ? "1ST" : player.rank === 2 ? "2ND" : player.rank === 3 ? "3RD" : `#${player.rank}`}
                </div>
                
                <div className="row-player">
                  <div className="player-name">{player.name}</div>
                  <div className="player-stats">
                    {player.correct_answers} correct out of {player.total_questions} questions
                  </div>
                </div>

                <div className="row-score-box">
                  <div className="score-value">{player.score}</div>
                  <div className="score-label">Points</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="board-actions">
          <Link to="/my-quiz-attempts" className="action-btn">My Attempts</Link>
          <Link to="/quiz" className="action-btn">All Quizzes</Link>
          <Link to="/" className="action-btn">Home</Link>
        </div>

      </div>
    </div>
  );
}

export default QuizLeaderboard;