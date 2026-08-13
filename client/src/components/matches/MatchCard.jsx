import { Trophy, MapPin, Calendar, Clock, ChevronRight } from "lucide-react";
import "./MatchCard.css";

function MatchCard({ match, onClick }) {
  const homeScore = match.homeScore ?? match.home_score ?? 0;
  const awayScore = match.awayScore ?? match.away_score ?? 0;
  const venue = match.stadium || match.venue || "National Stadium";
  const stage = match.stage || "Regular Season";
  const leagueName = match.league || "Competition";

  const getBadge = () => {
    switch (match.status) {
      case "LIVE":
        return (
          <span className="match-status-badge live-pulse">
            <span className="live-radar-dot" /> LIVE {match.minute || "1st Half"}
          </span>
        );
      case "TODAY":
        return <span className="match-status-badge today">TODAY</span>;
      case "UPCOMING":
        return <span className="match-status-badge upcoming">UPCOMING</span>;
      default:
        return <span className="match-status-badge ft">FULL TIME</span>;
    }
  };

  const isLiveOrFinished = match.status === "LIVE" || match.status === "FT";

  const getInitial = (name) => {
    if (!name) return "⚽";
    const words = name.trim().split(" ");
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="match-card" onClick={() => onClick(match)}>
      {/* Top Header */}
      <div className="match-card-top">
        <div className="match-league-info">
          <Trophy size={13} className="match-league-icon" />
          <span className="league-name">{leagueName}</span>
        </div>
        {getBadge()}
      </div>

      {/* Main Scoreboard Area */}
      <div className="match-scoreboard">
        {/* Home Team */}
        <div className="team-cell home-cell">
          <div className="team-crest-badge">
            {getInitial(match.home)}
          </div>
          <h4 className="team-name">{match.home}</h4>
        </div>

        {/* Center Score / Time */}
        <div className="score-center-cell">
          {isLiveOrFinished ? (
            <div className="score-display">
              <span className="score-number">{homeScore}</span>
              <span className="score-colon">-</span>
              <span className="score-number">{awayScore}</span>
            </div>
          ) : (
            <div className="time-display">
              <span className="vs-label">VS</span>
              <span className="kickoff-time">
                <Clock size={12} /> {match.time || "TBD"}
              </span>
            </div>
          )}

          {match.date && (
            <span className="match-date-tag">
              <Calendar size={11} /> {match.date}
            </span>
          )}
        </div>

        {/* Away Team */}
        <div className="team-cell away-cell">
          <div className="team-crest-badge away-badge">
            {getInitial(match.away)}
          </div>
          <h4 className="team-name">{match.away}</h4>
        </div>
      </div>

      {/* Footer Info */}
      <div className="match-card-footer">
        <div className="match-meta-chips">
          <span className="meta-chip">{stage}</span>
          <span className="meta-chip">
            <MapPin size={11} /> {venue}
          </span>
        </div>

        <div className="match-view-details">
          <span>Match Details</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}

export default MatchCard;