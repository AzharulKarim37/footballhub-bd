import { Trophy, MapPin, Calendar, Clock, ChevronRight, Activity } from "lucide-react";
import { getTeamLogo, getTeamInitials } from "../../utils/teamLogos";
import "./MatchCard.css";

function MatchCard({ match, onClick }) {
  const homeScore = match.homeScore ?? match.home_score ?? 0;
  const awayScore = match.awayScore ?? match.away_score ?? 0;
  const venue = match.stadium || match.venue || "National Stadium";
  const stage = match.stage || "Regular Season";
  const leagueName = match.league || "Competition";

  const homeLogo = getTeamLogo(match.home);
  const awayLogo = getTeamLogo(match.away);

  const getStatusBadge = () => {
    switch (match.status) {
      case "LIVE":
        return (
          <div className="card-badge badge-live">
            <span className="live-pulse-dot" />
            <span className="live-badge-text">LIVE {match.minute || "1st Half"}</span>
          </div>
        );
      case "TODAY":
        return (
          <div className="card-badge badge-today">
            <span className="badge-dot dot-today" />
            <span>TODAY</span>
          </div>
        );
      case "UPCOMING":
        return (
          <div className="card-badge badge-upcoming">
            <span className="badge-dot dot-upcoming" />
            <span>UPCOMING</span>
          </div>
        );
      default:
        return (
          <div className="card-badge badge-ft">
            <span>FULL TIME</span>
          </div>
        );
    }
  };

  const isLiveOrFinished = match.status === "LIVE" || match.status === "FT";
  const isLive = match.status === "LIVE";
  const homeWinner = isLiveOrFinished && homeScore > awayScore;
  const awayWinner = isLiveOrFinished && awayScore > homeScore;

  return (
    <div
      className={`match-broadcast-card ${isLive ? "card-is-live" : ""}`}
      onClick={() => onClick(match)}
    >
      {/* Top Header Strip */}
      <div className="broadcast-card-top">
        <div className="broadcast-league-tag">
          <Trophy size={13} className="broadcast-league-icon" />
          <span className="league-title-text">{leagueName}</span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Main Broadcast Matchup Arena */}
      <div className="broadcast-matchup">
        {/* Home Team */}
        <div className={`broadcast-team-cell home-side ${homeWinner ? "team-winner" : ""}`}>
          <div className="team-crest-container">
            {homeLogo ? (
              <img src={homeLogo} alt={match.home} className="team-crest-img" />
            ) : (
              <span className="team-crest-initials">{getTeamInitials(match.home)}</span>
            )}
          </div>
          <span className="team-title-text" title={match.home}>
            {match.home}
          </span>
        </div>

        {/* Center Scoreboard / Time Hub */}
        <div className="broadcast-score-hub">
          {isLiveOrFinished ? (
            <div className="scoreboard-pill">
              <span className={`score-digit ${homeWinner ? "digit-winner" : ""}`}>
                {homeScore}
              </span>
              <span className="score-separator">:</span>
              <span className={`score-digit ${awayWinner ? "digit-winner" : ""}`}>
                {awayScore}
              </span>
            </div>
          ) : (
            <div className="kickoff-pill">
              <span className="vs-tag">VS</span>
              <span className="kickoff-time-tag">
                <Clock size={11} /> {match.time || "TBD"}
              </span>
            </div>
          )}

          {isLive && (
            <div className="live-action-ticker">
              <Activity size={12} className="ticker-icon" />
              <span>In Play</span>
            </div>
          )}

          {match.date && !isLive && (
            <span className="fixture-date-tag">
              <Calendar size={11} /> {match.date}
            </span>
          )}
        </div>

        {/* Away Team */}
        <div className={`broadcast-team-cell away-side ${awayWinner ? "team-winner" : ""}`}>
          <div className="team-crest-container away-crest">
            {awayLogo ? (
              <img src={awayLogo} alt={match.away} className="team-crest-img" />
            ) : (
              <span className="team-crest-initials">{getTeamInitials(match.away)}</span>
            )}
          </div>
          <span className="team-title-text" title={match.away}>
            {match.away}
          </span>
        </div>
      </div>

      {/* Card Footer Metadata */}
      <div className="broadcast-card-footer">
        <div className="broadcast-meta-tags">
          <span className="meta-tag">{stage}</span>
          <span className="meta-tag venue-tag">
            <MapPin size={11} /> {venue}
          </span>
        </div>

        <div className="details-action-prompt">
          <span>Stats &amp; Timeline</span>
          <ChevronRight size={14} className="prompt-arrow" />
        </div>
      </div>
    </div>
  );
}

export default MatchCard;