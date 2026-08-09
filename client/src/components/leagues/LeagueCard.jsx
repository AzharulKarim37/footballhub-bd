import "./LeagueCard.css";
import { Link } from "react-router-dom";

function LeagueCard({ league }) {
  return (
    <div className="league-card">

      <div className="league-logo-wrapper">
        <img src={league.logo} alt={league.name} className="league-logo" />
      </div>

      <h2>{league.name}</h2>

      <p className="league-description">
        {league.description}
      </p>

      <div className="league-info">

        <div>
          <span>🌍 Country</span>
          <strong>{league.country}</strong>
        </div>

        <div>
          <span>⚽ Clubs</span>
          <strong>{league.clubs}</strong>
        </div>

        <div>
          <span>📅 Season</span>
          <strong>{league.season}</strong>
        </div>

        <div>
          <span>🏆 Champion</span>
          <strong>{league.champion}</strong>
        </div>

      </div>

      <Link
    to={`/leagues/${league.id}`}
    className="league-btn"
>
    View Competition →
</Link>

    </div>
  );
}

export default LeagueCard;