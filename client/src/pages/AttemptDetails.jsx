import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Quiz.css"; // Reuse quiz styling

const API_BASE = "http://localhost:5001/api";

function AttemptDetails() {
  const { quizId, attemptId } = useParams();
  const { token } = useAuth();
  
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await axios.get(`${API_BASE}/quizzes/${quizId}/attempt/${attemptId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAttempt(res.data.attempt);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error(err);
        setError("Failed to load attempt details.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAttempt();
  }, [quizId, attemptId, token]);

  if (loading) return <div className="quiz-page"><div className="state-container">Loading...</div></div>;
  if (error) return <div className="quiz-page"><div className="state-container"><h2 className="quiz-error">{error}</h2><Link to="/profile" className="home-btn">Back to Profile</Link></div></div>;
  if (!attempt) return null;

  const userAnswers = attempt.user_answers_json || [];

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        
        <div className="quiz-header">
          <div className="quiz-header-info">
            <h1 style={{fontSize: '28px', color: '#102e21'}}>Quiz Review</h1>
            <p className="quiz-description" style={{marginTop: '10px'}}>
              Score: <strong>{attempt.score}/{attempt.total_questions}</strong> 
              <br/>
              Completed on {new Date(attempt.completed_at).toLocaleString()}
            </p>
          </div>
          <Link to="/profile" className="back-quiz-btn">← Back</Link>
        </div>

        <div className="quiz-questions-review" style={{marginTop: '30px'}}>
          {questions.map((q, index) => {
            const userAnswerObj = userAnswers.find(ua => ua.question_id === q.id);
            const userAnswer = userAnswerObj ? userAnswerObj.answer : null;
            const isCorrect = userAnswer === q.correct_answer;
            const options = q.options_json || {};

            return (
              <div key={q.id} className="question-section" style={{marginBottom: '40px', padding: '20px', background: '#f9fbf9', borderRadius: '15px', border: '1px solid #e5ebe7'}}>
                <span className="question-number">Question {index + 1}</span>
                <h2 style={{fontSize: '20px', marginBottom: '20px'}}>{q.question_text}</h2>
                
                <div className="options">
                  {Object.entries(options).map(([letter, text]) => {
                    if (!text) return null;
                    
                    let className = "quiz-option";
                    if (letter === q.correct_answer) {
                      className += " correct";
                    } else if (letter === userAnswer && userAnswer !== q.correct_answer) {
                      className += " incorrect";
                    }

                    return (
                      <div key={letter} className={className} style={{cursor: 'default'}}>
                        <span className="option-letter">{letter}</span>
                        <span className="option-text">{text}</span>
                        {letter === userAnswer && <span style={{marginLeft: 'auto', fontWeight: 'bold'}}>{isCorrect ? '✅ Your Answer' : '❌ Your Answer'}</span>}
                        {letter === q.correct_answer && letter !== userAnswer && <span style={{marginLeft: 'auto', fontWeight: 'bold', color: '#176b43'}}>✓ Correct Answer</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default AttemptDetails;
