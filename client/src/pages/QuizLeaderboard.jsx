import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

function QuizLeaderboard() {
  const { quizId } = useParams();

  const API_URL =
    "http://localhost:5001/api/quizzes";

  const [quiz, setQuiz] =
    useState(null);

  const [leaderboard, setLeaderboard] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadLeaderboard();
  }, [quizId]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please sign in to view the leaderboard."
        );
      }

      const response =
        await fetch(
          `${API_URL}/${quizId}/leaderboard`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load leaderboard"
        );
      }

      setQuiz(data.quiz);
      setLeaderboard(
        data.leaderboard || []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to load leaderboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="state-container">
          <div className="state-icon">
            🏆
          </div>

          <h2>
            Loading leaderboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-list-header">
        <p className="quiz-label">
          FOOTBALL HUB BD
        </p>

        <h1>
          {quiz?.title ||
            "Quiz Leaderboard"}
        </h1>

        <p className="quiz-description">
          Quiz leaderboard
        </p>
      </div>

      {error ? (
        <div className="state-container">
          <div className="state-icon">
            🔒
          </div>

          <h2>
            Leaderboard Unavailable
          </h2>

          <p>{error}</p>

          <Link
            to="/quiz"
            className="home-btn"
          >
            Back to Quizzes
          </Link>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="state-container">
          <div className="state-icon">
            🏆
          </div>

          <h2>
            No Completed Attempts
          </h2>

          <p>
            Nobody has completed this
            quiz yet.
          </p>
        </div>
      ) : (
        <div className="quiz-selection">
          <div className="quiz-selection-grid">
            {leaderboard.map(
              (player) => (
                <div
                  className="quiz-selection-card"
                  key={
                    player.attempt_id
                  }
                >
                  <div className="quiz-card-icon">
                    {player.rank === 1
                      ? "🥇"
                      : player.rank === 2
                      ? "🥈"
                      : player.rank === 3
                      ? "🥉"
                      : `#${player.rank}`}
                  </div>

                  <div className="quiz-card-content">
                    <h3>
                      {player.name}
                    </h3>

                    <p>
                      Score:{" "}
                      <strong>
                        {player.score}/
                        {
                          player.total_questions
                        }
                      </strong>
                    </p>

                    <div className="quiz-card-meta">
                      <span>
                        {
                          player.correct_answers
                        }{" "}
                        correct
                      </span>

                      <span>
                        {player.total_questions}{" "}
                        questions
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div className="quiz-list-footer">
        <Link
          to="/my-quiz-attempts"
          className="home-btn"
        >
          My Attempts
        </Link>

        <Link
          to="/quiz"
          className="home-btn"
        >
          Quizzes
        </Link>

        <Link
          to="/"
          className="home-btn"
        >
          Home
        </Link>
      </div>
    </div>
  );
}

export default QuizLeaderboard;