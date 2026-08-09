import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Quiz.css";

const API_BASE = "http://localhost:5001/api";

function Quiz() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  
  // Quiz progress state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzesAndAttempts();
  }, []);

  const getToken = () => localStorage.getItem("token");

  const fetchQuizzesAndAttempts = async () => {
    setLoading(true);
    const token = getToken();

    try {
      const [quizzesRes, attemptsRes] = await Promise.all([
        axios.get(`${API_BASE}/quizzes/published`),
        token 
          ? axios.get(`${API_BASE}/quizzes/my-attempts`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { attempts: [] } })) 
          : Promise.resolve({ data: { attempts: [] } })
      ]);

      setQuizzes(quizzesRes.data || []);
      setMyAttempts(attemptsRes.data.attempts || []);
    } catch (err) {
      console.error("Could not fetch quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  const getAttemptForQuiz = (quizId) => {
    return myAttempts.find(a => a.quiz_id === quizId);
  };

  const handleStartQuiz = async (quiz) => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const attempt = getAttemptForQuiz(quiz.id);
    if (attempt && attempt.completed_at) {
      alert("You have already completed this quiz.");
      return;
    }

    try {
      if (!attempt) {
        await axios.post(`${API_BASE}/quizzes/${quiz.id}/start`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // We need to fetch the quiz WITH questions. 
      // The `/api/quizzes/published/:id` route should return the quiz and questions.
      const res = await axios.get(`${API_BASE}/quizzes/published/${quiz.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSelectedQuiz({ ...res.data.quiz, questions: res.data.questions || [] });
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setIsSubmitted(false);
      setScoreData(null);
    } catch (err) {
      if (err.response?.status === 409) {
         // They already started it, fetch it anyway to let them finish
         const res = await axios.get(`${API_BASE}/quizzes/published/${quiz.id}`, {
            headers: { Authorization: `Bearer ${token}` }
         });
         setSelectedQuiz({ ...res.data.quiz, questions: res.data.questions || [] });
         setCurrentQuestionIndex(0);
         setUserAnswers({});
         setIsSubmitted(false);
         setScoreData(null);
      } else {
         alert("Failed to start quiz.");
      }
    }
  };

  const handleAnswerSelect = (optionKey) => {
    if (isSubmitted) return;
    const currentQ = selectedQuiz.questions[currentQuestionIndex];
    setUserAnswers({
      ...userAnswers,
      [currentQ.id]: optionKey,
    });
  };

  const handleNext = async () => {
    if (!selectedQuiz || !selectedQuiz.questions) return;
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit the answers to backend
      const token = getToken();
      const answersArray = Object.keys(userAnswers).map(qId => ({
        question_id: qId,
        answer: userAnswers[qId]
      }));

      try {
        const res = await axios.post(`${API_BASE}/quizzes/${selectedQuiz.id}/complete`, {
          answers: answersArray
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setIsSubmitted(true);
        setScoreData(res.data.attempt);
        // Refresh attempts list so it shows as completed
        fetchQuizzesAndAttempts();
      } catch (err) {
        alert("Failed to complete quiz. " + (err.response?.data?.message || ""));
      }
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
                {quizzes.map((quiz) => {
                  const attempt = getAttemptForQuiz(quiz.id);
                  const isCompleted = attempt && attempt.completed_at;

                  return (
                    <div key={quiz.id} className="quiz-selection-card" style={isCompleted ? { opacity: 0.8 } : {}}>
                      <div className="quiz-card-icon">🏆</div>
                      <div className="quiz-card-content">
                        <h3>{quiz.title}</h3>
                        <p>{quiz.description}</p>
                        <div className="quiz-card-meta">
                          <span>⏱️ {quiz.time_limit || 10} Mins</span>
                          <span>❓ {quiz.question_count || 0} Questions</span>
                        </div>
                        {isCompleted && (
                          <div style={{ marginTop: '10px', color: '#176b43', fontWeight: 'bold' }}>
                            Score: {attempt.score}/{attempt.total_questions} ({Math.round((attempt.score/attempt.total_questions)*100)}%)
                          </div>
                        )}
                      </div>
                      
                      <div className="quiz-card-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                        {!isCompleted ? (
                          <button onClick={() => handleStartQuiz(quiz)} className="next-btn" style={{ padding: '8px 15px', fontSize: '14px' }}>Start Quiz</button>
                        ) : (
                          <button disabled className="next-btn" style={{ padding: '8px 15px', fontSize: '14px', background: '#ccc', color: '#666', cursor: 'not-allowed' }}>Completed</button>
                        )}
                        {quiz.leaderboard_published === 1 && (
                          <Link to={`/quiz/${quiz.id}/leaderboard`} className="next-btn" style={{ padding: '8px 15px', fontSize: '14px', background: '#fff', color: '#176b43', border: '1px solid #176b43', textAlign: 'center', textDecoration: 'none' }}>
                            Leaderboard
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
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
              {!isSubmitted && (
                <div className="question-counter">
                  <span>{currentQuestionIndex + 1}</span>
                  <small>/ {selectedQuiz.questions?.length || 0}</small>
                </div>
              )}
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
                    <h2>{selectedQuiz.questions[currentQuestionIndex].question}</h2>
                  </div>

                  <div className="options">
                    {["A", "B", "C", "D"].map((opt) => {
                      const currentQ = selectedQuiz.questions[currentQuestionIndex];
                      const optionText = currentQ[`option_${opt.toLowerCase()}`];
                      if (!optionText) return null;
                      const isSelected = userAnswers[currentQ.id] === opt;
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
                      disabled={!userAnswers[selectedQuiz.questions[currentQuestionIndex].id]}
                      onClick={handleNext}
                    >
                      {currentQuestionIndex < selectedQuiz.questions.length - 1
                        ? "Next Question →"
                        : "Submit Quiz ✓"}
                    </button>
                  </div>
                </div>
              ) : (
                <p>No questions found.</p>
              )
            ) : (
              /* Quiz Results */
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "60px", marginBottom: "15px" }}>🎉</div>
                <h2 style={{ fontSize: "32px", color: "#123d2a", marginBottom: "10px" }}>
                  Quiz Completed!
                </h2>
                {scoreData && (
                  <>
                    <p style={{ fontSize: "20px", color: "#176b43", fontWeight: "700" }}>
                      Your Score: {scoreData.score} / {scoreData.total_questions}
                    </p>
                    <p style={{ fontSize: "24px", color: "#e67e22", fontWeight: "bold", marginTop: "10px" }}>
                      Percentage: {Math.round((scoreData.score / scoreData.total_questions) * 100)}%
                    </p>
                  </>
                )}
                
                <div style={{ marginTop: "25px", display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button
                    className="next-btn"
                    onClick={() => setSelectedQuiz(null)}
                  >
                    Back to Quizzes
                  </button>
                  {selectedQuiz.leaderboard_published === 1 && (
                     <Link to={`/quiz/${selectedQuiz.id}/leaderboard`} className="next-btn" style={{ background: '#fff', color: '#176b43', border: '1px solid #176b43', textDecoration: 'none' }}>
                        View Leaderboard
                     </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
