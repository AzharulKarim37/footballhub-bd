import { Trophy, Calendar, Clock, MapPin, Shield, Activity } from "lucide-react";
import { getTeamLogo, getTeamInitials } from "../../utils/teamLogos";
import "./MatchModal.css";

function MatchModal({ match, onClose }) {
  if (!match) return null;

  const homeScore = match.homeScore ?? match.home_score ?? "-";
  const awayScore = match.awayScore ?? match.away_score ?? "-";
  const venue = match.stadium || match.venue || "National Stadium";
  const stage = match.stage || "Regular Season";
  const leagueName = match.league || "Competition";

  const homeLogo = getTeamLogo(match.home);
  const awayLogo = getTeamLogo(match.away);

  const isLive = match.status === "LIVE";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="match-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Header Matchup Banner */}
        <div className="modal-header">
          <div className="modal-league-strip">
            <Trophy size={14} className="modal-trophy-icon" />
            <span>{leagueName}</span>
            <span className="dot-sep">•</span>
            <span>{stage}</span>
          </div>

          <div className="modal-teams-arena">
            {/* Home Team */}
            <div className="modal-team-block home-side">
              <div className="modal-crest-wrapper">
                {homeLogo ? (
                  <img src={homeLogo} alt={match.home} className="modal-crest-img" />
                ) : (
                  <span className="modal-crest-initials">{getTeamInitials(match.home)}</span>
                )}
              </div>
              <h3 className="modal-team-name">{match.home}</h3>
            </div>

            {/* Score Center */}
            <div className="modal-score-block">
              <div className="modal-score-box">
                <span className="modal-score-num">{homeScore}</span>
                <span className="modal-score-sep">:</span>
                <span className="modal-score-num">{awayScore}</span>
              </div>
              <div className="modal-status-tag">
                <span className={`modal-status-pill ${match.status?.toLowerCase()}`}>
                  {isLive ? `🔴 LIVE ${match.minute || "In Play"}` : match.status}
                </span>
              </div>
            </div>

            {/* Away Team */}
            <div className="modal-team-block away-side">
              <div className="modal-crest-wrapper away-crest">
                {awayLogo ? (
                  <img src={awayLogo} alt={match.away} className="modal-crest-img" />
                ) : (
                  <span className="modal-crest-initials">{getTeamInitials(match.away)}</span>
                )}
              </div>
              <h3 className="modal-team-name">{match.away}</h3>
            </div>
          </div>
        </div>

        {/* Matchday Meta Grid */}
        <div className="modal-info-grid">
          <div className="info-cell">
            <h4><Calendar size={13} /> Date</h4>
            <p>{match.date || "TBD"}</p>
          </div>
          <div className="info-cell">
            <h4><Clock size={13} /> Kick Off</h4>
            <p>{match.time || "TBD"}</p>
          </div>
          <div className="info-cell">
            <h4><Shield size={13} /> Stage</h4>
            <p>{stage}</p>
          </div>
          <div className="info-cell">
            <h4><MapPin size={13} /> Venue</h4>
            <p>{venue}</p>
          </div>
        </div>

        {/* Head to Head & Match Statistics */}
        <div className="modal-stats-section">
          <div className="section-title-strip">
            <Activity size={16} className="stat-heading-icon" />
            <h3>Match Statistics &amp; Control</h3>
          </div>

          <div className="stat-comparison-list">
            <div className="stat-row">
              <div className="stat-row-labels">
                <span>62%</span>
                <span className="stat-name">Possession</span>
                <span>38%</span>
              </div>
              <div className="stat-dual-bar">
                <div className="dual-fill-left" style={{ width: "62%" }}></div>
                <div className="dual-fill-right" style={{ width: "38%" }}></div>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-row-labels">
                <span>18 (8)</span>
                <span className="stat-name">Total Shots (On Target)</span>
                <span>9 (3)</span>
              </div>
              <div className="stat-dual-bar">
                <div className="dual-fill-left" style={{ width: "67%" }}></div>
                <div className="dual-fill-right" style={{ width: "33%" }}></div>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-row-labels">
                <span>7</span>
                <span className="stat-name">Corner Kicks</span>
                <span>2</span>
              </div>
              <div className="stat-dual-bar">
                <div className="dual-fill-left" style={{ width: "78%" }}></div>
                <div className="dual-fill-right" style={{ width: "22%" }}></div>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-row-labels">
                <span>2</span>
                <span className="stat-name">Yellow Cards</span>
                <span>4</span>
              </div>
              <div className="stat-dual-bar">
                <div className="dual-fill-left yellow-card-bar" style={{ width: "33%" }}></div>
                <div className="dual-fill-right yellow-card-bar" style={{ width: "67%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Matchday Timeline */}
        <div className="modal-timeline-section">
          <h3>Matchday Timeline</h3>
          <ul className="timeline-events-list">
            <li className="timeline-event">
              <span className="event-minute">18'</span>
              <div className="event-details">
                <span className="event-icon">⚽</span>
                <span>Goal scored for <strong>{match.home}</strong></span>
              </div>
            </li>
            <li className="timeline-event">
              <span className="event-minute">32'</span>
              <div className="event-details">
                <span className="event-icon">🟨</span>
                <span>Yellow Card issued (Tactical Foul)</span>
              </div>
            </li>
            <li className="timeline-event">
              <span className="event-minute">44'</span>
              <div className="event-details">
                <span className="event-icon">⚽</span>
                <span>Equalizer scored for <strong>{match.away}</strong></span>
              </div>
            </li>
            <li className="timeline-divider-item">
              <span>HT • Half Time Interval</span>
            </li>
            <li className="timeline-event">
              <span className="event-minute">73'</span>
              <div className="event-details">
                <span className="event-icon">⚽</span>
                <span>Decisive Goal scored</span>
              </div>
            </li>
            <li className="timeline-divider-item">
              <span>{isLive ? `CURRENT: ${match.minute || "In Progress"}` : "Full Time Whistle"}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MatchModal;