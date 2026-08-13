import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Flame, PlayCircle, ShieldCheck } from "lucide-react";
import "./Hero.css";
import football from "../../assets/images/Football.png";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Column Content */}
        <div className="hero-left">
          <div className="hero-pill-badge">
            <span className="live-dot" />
            <span>BANGLADESH'S PREMIER FOOTBALL HUB</span>
          </div>

          <h1 className="hero-title">
            The Heartbeat of <br />
            <span className="hero-highlight">Bangladesh Football.</span>
          </h1>

          <p className="hero-description">
            Your all-in-one destination for Bangladesh Premier League updates,
            real-time live scores, tournament standings, player stories, and
            community football quizzes.
          </p>

          {/* Call to Actions */}
          <div className="hero-actions">
            <Link to="/matches" className="hero-btn-primary">
              <span>Match Center</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/leagues" className="hero-btn-secondary">
              <Trophy size={18} />
              <span>Browse Leagues</span>
            </Link>
          </div>

          {/* Quick Stat Strip */}
          <div className="hero-stat-strip">
            <div className="hero-stat-item">
              <Flame size={18} className="hero-stat-icon" />
              <div>
                <strong>Live Scores</strong>
                <span>Real-time action</span>
              </div>
            </div>

            <div className="hero-stat-divider" />

            <div className="hero-stat-item">
              <ShieldCheck size={18} className="hero-stat-icon" />
              <div>
                <strong>10+ Clubs</strong>
                <span>Domestic &amp; Cups</span>
              </div>
            </div>

            <div className="hero-stat-divider" />

            <div className="hero-stat-item">
              <PlayCircle size={18} className="hero-stat-icon" />
              <div>
                <strong>Quiz Arena</strong>
                <span>Weekly rewards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Visual Graphic */}
        <div className="hero-right">
          <div className="hero-image-wrapper">
            <div className="hero-glow-backdrop" />
            <img
              src={football}
              alt="Football Hub Action"
              className="hero-image"
            />

            {/* Floating Live Match Pulse Card */}
            <div className="hero-floating-card">
              <div className="floating-card-top">
                <span className="floating-live-badge">
                  <span className="pulse-circle" /> LIVE 78'
                </span>
                <span className="floating-league">BPL Season 25/26</span>
              </div>
              <div className="floating-match-row">
                <span className="floating-team">Bashundhara Kings</span>
                <span className="floating-score">2 - 1</span>
                <span className="floating-team text-right">Abahani Ltd</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;