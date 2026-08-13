import "./MatchModal.css";
import { Trophy, Calendar, Clock, MapPin, Shield } from "lucide-react";

function MatchModal({ match, onClose }) {
  if (!match) return null;

  const homeScore = match.homeScore ?? match.home_score ?? "-";
  const awayScore = match.awayScore ?? match.away_score ?? "-";
  const venue = match.stadium || match.venue || "National Stadium";
  const stage = match.stage || "Regular Season";
  const leagueName = match.league || "Competition";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="match-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-league">
            <Trophy size={14} className="modal-trophy-icon" />
            <span>{leagueName}</span>
          </div>

          <div className="modal-teams-head">
            <div className="modal-team home">
              <h3>{match.home}</h3>
            </div>
            <div className="modal-score-head">
              <h2>
                {homeScore} <span className="colon">:</span> {awayScore}
              </h2>
            </div>
            <div className="modal-team away">
              <h3>{match.away}</h3>
            </div>
          </div>

          <div className="modal-status-badge">
            <span className={`status-pill ${match.status?.toLowerCase()}`}>
              {match.status === "LIVE" ? `🔴 LIVE ${match.minute || "In Play"}` : match.status}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="modal-info">
          <div>
            <h4><Calendar size={13} /> Date</h4>
            <p>{match.date || "TBD"}</p>
          </div>
          <div>
            <h4><Clock size={13} /> Kick Off</h4>
            <p>{match.time || "TBD"}</p>
          </div>
          <div>
            <h4><Shield size={13} /> Stage</h4>
            <p>{stage}</p>
          </div>
          <div>
            <h4><MapPin size={13} /> Venue</h4>
            <p>{venue}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="statistics">
          <h3>Match Statistics</h3>

          <div className="stat-row">
            <div className="stat-labels">
              <span>Possession</span>
              <strong>62% - 38%</strong>
            </div>
            <div className="stat-bar-track">
              <div className="stat-bar-fill" style={{ width: "62%" }}></div>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-labels">
              <span>Shots (Target)</span>
              <strong>18 (8) - 9 (3)</strong>
            </div>
            <div className="stat-bar-track">
              <div className="stat-bar-fill" style={{ width: "67%" }}></div>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-labels">
              <span>Corners</span>
              <strong>7 - 2</strong>
            </div>
            <div className="stat-bar-track">
              <div className="stat-bar-fill" style={{ width: "78%" }}></div>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-labels">
              <span>Yellow Cards</span>
              <strong>2 - 4</strong>
            </div>
            <div className="stat-bar-track">
              <div className="stat-bar-fill" style={{ width: "35%" }}></div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline">
          <h3>Matchday Timeline</h3>
          <ul className="timeline-list">
            <li>
              <span className="timeline-min">18'</span>
              <span className="timeline-desc">⚽ Goal scored by Home Team</span>
            </li>
            <li>
              <span className="timeline-min">32'</span>
              <span className="timeline-desc">🟨 Yellow Card issued</span>
            </li>
            <li>
              <span className="timeline-min">44'</span>
              <span className="timeline-desc">⚽ Goal scored by Away Team</span>
            </li>
            <li className="timeline-break">
              <span>HT • Half Time</span>
            </li>
            <li>
              <span className="timeline-min">73'</span>
              <span className="timeline-desc">⚽ Winning Goal scored</span>
            </li>
            <li className="timeline-break">
              <span>90+4' • Full Time</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MatchModal;