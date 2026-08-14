import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyQuizAttempts() {
  const API_URL =
    "http://localhost:5001/api/quizzes";

  const [attempts, setAttempts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Please sign in to view your quiz attempts."
        );
        return;
      }

      const response =
        await fetch(
          `${API_URL}/my-attempts`,
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
            "Failed to load attempts"
        );
      }

      setAttempts(
        data.attempts || []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to load attempts"
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
            ⚽
          </div>

          <h2>
            Loading your attempts...
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
          My Quiz Attempts
        </h1>

        <p className="quiz-description">
          View the quizzes you have
          already attempted and your
          results.
        </p>
      </div>

      {error && (
        <div className="answer-feedback incorrect-feedback">
          ✕ {error}
        </div>
      )}

      {attempts.length === 0 ? (
        <div className="state-container">
          <div className="state-icon">
            📝
          </div>

          <h2>
            No Attempts Yet
          </h2>

          <p>
            You have not attempted any
            quizzes yet.
          </p>

          <Link
            to="/quiz"
            className="home-btn"
          >
            Browse Quizzes
          </Link>
        </div>
      ) : (
        <div className="quiz-selection">
          <div className="quiz-selection-grid">
            {attempts.map((attempt) => {
              const percentage =
                attempt.total_questions > 0
                  ? Math.round(
                      (attempt.score /
                        attempt.total_questions) *
                        100
                    )
                  : 0;

              return (
                <div
                  className="quiz-selection-card"
                  key={attempt.id}
                >
                  <div className="quiz-card-icon">
                    🏆
                  </div>

                  <div className="quiz-card-content">
                    <h3>
                      {attempt.title}
                    </h3>

                    <p>
                      Score:{" "}
                      <strong>
                        {attempt.score}/
                        {
                          attempt.total_questions
                        }
                      </strong>
                    </p>

                    <div className="quiz-card-meta">
                      <span>
                        {percentage}%
                      </span>

                      <span>
                        {
                          attempt.correct_answers
                        }{" "}
                        correct
                      </span>

                      <span>
                        {attempt.difficulty}
                      </span>
                    </div>

                    <div className="quiz-attempt-status">
                      <strong>
                        ✓ Attempted
                      </strong>
                    </div>

                    {Number(
                      attempt.leaderboard_published
                    ) === 1 && (
                      <Link
                        to={`/quiz/${attempt.quiz_id}/leaderboard`}
                        className="home-btn"
                        style={{ marginTop: '10px', display: 'block' }}
                      >
                        View Leaderboard
                      </Link>
                    )}

                    <Link
                      to={`/attempt/${attempt.quiz_id}/${attempt.id}`}
                      className="home-btn"
                      style={{ marginTop: '10px', display: 'block', background: '#0a1711', color: '#00ff87' }}
                    >
                      Review Answers
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="quiz-list-footer">
        <Link
          to="/quiz"
          className="home-btn"
        >
          ← Quizzes
        </Link>

        <Link
          to="/"
          className="home-btn"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default MyQuizAttempts;