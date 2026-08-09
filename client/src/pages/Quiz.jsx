import { useState, useEffect } from "react";
import axios from "axios";
import "./Quiz.css";

const API_BASE = "http://localhost:5001/api";

function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/quizzes/published`);
      setQuizzes(res.data || []);
    } catch (err) {
      console.warn("Could not fetch published quizzes from API, fallback to default.");
      setQuizzes([
        {
          id: 1,
          title: "Bangladesh Football History",
          description: "Test your knowledge about Bangladesh national team and BPL history.",
          time_limit: 10,
          questions: [
            {
              id: 1,
              question_text: "Which club won the Bangladesh Premier League 2023-24?",
              option_a: "Abahani Limited",
              option_b: "Bashundhara Kings",
              option_c: "Mohammedan SC",
              option_d: "Sheikh Russel KC",
              correct_option: "B",
            },
            {
              id: 2,
              question_text: "What is the home stadium of Bashundhara Kings?",
              option_a: "Kings Arena",
              option_b: "Bangabandhu Stadium",
              option_c: "MA Aziz Stadium",
              option_d: "Rajshahi Stadium",
              correct_option: "A",
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const handleAnswerSelect = (optionKey) => {
    if (isSubmitted) return;
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: optionKey,
    });
  };

  const handleNext = () => {
    if (!selectedQuiz || !selectedQuiz.questions) return;
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      let calculatedScore = 0;
      selectedQuiz.questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correct_option) {
          calculatedScore += 1;
        }
      });
      setScore(calculatedScore);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        {!selectedQuiz ? (
          <div className="quiz-selection">
            <div className="quiz-list-header">
              <h1>⚽ Football Quiz Center</h1>
              <p>Select a quiz below to challenge your football knowledge!</p>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", color: "#176b43", padding: "30px" }}>
                Loading available quizzes...
              </div>
            ) : quizzes.length === 0 ? (
              <div style={{ textAlign: "center", color: "#666", padding: "30px" }}>
                No active quizzes available right now. Check back soon!
              </div>
            ) : (
              <div className="quiz-selection-grid">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="quiz-selection-card"
                    onClick={() => handleSelectQuiz(quiz)}
                  >
                    <div className="quiz-card-icon">🏆</div>
                    <div className="quiz-card-content">
                      <h3>{quiz.title}</h3>
                      <p>{quiz.description}</p>
                      <div className="quiz-card-meta">
                        <span>⏱️ {quiz.time_limit || 10} Mins</span>
                        <span>❓ {quiz.questions?.length || 0} Questions</span>
                      </div>
                    </div>
                    <div className="quiz-card-arrow">→</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Quiz In-Progress Header */}
            <div className="quiz-header">
              <button
                className="back-quiz-btn"
                onClick={() => setSelectedQuiz(null)}
              >
                ← Back to Quizzes
              </button>
              <div className="question-counter">
                <span>{currentQuestionIndex + 1}</span>
                <small>/ {selectedQuiz.questions?.length || 0}</small>
              </div>
            </div>

            <div className="quiz-selection-heading" style={{ marginTop: "20px" }}>
              <h2>{selectedQuiz.title}</h2>
            </div>

            {!isSubmitted ? (
              selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
                <div>
                  <div className="question-section">
                    <span className="question-number">
                      QUESTION {currentQuestionIndex + 1}
                    </span>
                    <h2>{selectedQuiz.questions[currentQuestionIndex].question_text}</h2>
                  </div>

                  <div className="options">
                    {["A", "B", "C", "D"].map((opt) => {
                      const optionText =
                        selectedQuiz.questions[currentQuestionIndex][`option_${opt.toLowerCase()}`];
                      if (!optionText) return null;
                      const isSelected = userAnswers[currentQuestionIndex] === opt;
                      return (
                        <button
                          key={opt}
                          className={`quiz-option ${isSelected ? "correct" : ""}`}
                          onClick={() => handleAnswerSelect(opt)}
                        >
                          <span className="option-letter">{opt}</span>
                          <span className="option-text">{optionText}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="quiz-footer">
                    <div className="score-display">
                      Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                    </div>
                    <button
                      className="next-btn"
                      disabled={!userAnswers[currentQuestionIndex]}
                      onClick={handleNext}
                    >
                      {currentQuestionIndex < selectedQuiz.questions.length - 1
                        ? "Next Question →"
                        : "Submit Quiz ✓"}
                    </button>
                  </div>
                </div>
              ) : (
                <p>No questions added to this quiz yet.</p>
              )
            ) : (
              /* Quiz Results */
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "60px", marginBottom: "15px" }}>🎉</div>
                <h2 style={{ fontSize: "32px", color: "#123d2a", marginBottom: "10px" }}>
                  Quiz Completed!
                </h2>
                <p style={{ fontSize: "20px", color: "#176b43", fontWeight: "700" }}>
                  Your Score: {score} / {selectedQuiz.questions?.length}
                </p>
                <button
                  className="next-btn"
                  style={{ marginTop: "25px" }}
                  onClick={() => setSelectedQuiz(null)}
                >
                  Try Another Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;