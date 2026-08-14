import { Link } from "react-router-dom";
import "./QuizSection.css";

function QuizSection() {
  return (
    <section className="quiz-home-section">

      <div className="quiz-home-container">

        {/* Left Side */}

        <div className="quiz-home-content">

          <p className="quiz-home-label">
            TEST YOUR FOOTBALL KNOWLEDGE
          </p>

          <h2>
            How well do you
            <span> know football?</span>
          </h2>

          <p className="quiz-home-description">
            Challenge yourself with our football quiz.
            Test your knowledge about world football,
            Bangladesh football, famous players,
            competitions and the beautiful game.
          </p>

          <Link
            to="/quiz"
            className="quiz-home-btn"
          >
            Take the Quiz →
          </Link>

        </div>


        {/* Right Side */}

        <div className="quiz-home-visual">

          <div className="quiz-ball">
            ⚽
          </div>



        </div>

      </div>

    </section>
  );
}

export default QuizSection;