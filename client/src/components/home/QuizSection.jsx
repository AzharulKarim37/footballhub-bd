import { Link } from "react-router-dom";
import { Sparkles, Trophy, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import "./QuizSection.css";

function QuizSection() {
  return (
    <section className="quiz-home-section">
      <div className="quiz-home-container">
        {/* Left Side Content */}
        <div className="quiz-home-content">
          <div className="quiz-pill-badge">
            <Sparkles size={15} />
            <span>INTERACTIVE FOOTBALL TRIVIA</span>
          </div>

          <h2>
            How well do you <span>know the game?</span>
          </h2>

          <p className="quiz-home-description">
            Test your knowledge across Bangladesh football history, world cup
            moments, iconic players, and current season statistics. Compete
            with fans and earn leaderboard glory.
          </p>

          <div className="quiz-perks-list">
            <div className="quiz-perk-item">
              <CheckCircle2 size={18} className="quiz-perk-icon" />
              <span>Real-time timed questions</span>
            </div>
            <div className="quiz-perk-item">
              <CheckCircle2 size={18} className="quiz-perk-icon" />
              <span>Global &amp; season leaderboard</span>
            </div>
            <div className="quiz-perk-item">
              <CheckCircle2 size={18} className="quiz-perk-icon" />
              <span>Exclusive fan badges</span>
            </div>
          </div>

          <Link to="/quiz" className="quiz-home-btn">
            <span>Enter Quiz Arena</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Right Side Card Preview Graphic */}
        <div className="quiz-home-visual">
          <div className="quiz-preview-card">
            <div className="quiz-preview-header">
              <span className="quiz-preview-category">
                <Zap size={13} /> BPL Special Trivia
              </span>
              <span className="quiz-preview-timer">⏱️ 0:15</span>
            </div>

            <p className="quiz-preview-q">
              Who was the top goalscorer for Bashundhara Kings in the 2024/25 season?
            </p>

            <div className="quiz-preview-options">
              <div className="quiz-preview-opt correct">
                <span>A. Dorielton</span>
                <span className="opt-check">✓ Correct</span>
              </div>
              <div className="quiz-preview-opt">
                <span>B. Rakib Hossain</span>
              </div>
              <div className="quiz-preview-opt">
                <span>C. Robson Robinho</span>
              </div>
            </div>

            <div className="quiz-preview-footer">
              <span className="quiz-preview-reward">
                <Trophy size={14} /> +100 Fan Points
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuizSection;