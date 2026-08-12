import "./LeagueCard.css";
import { Link } from "react-router-dom";

import bplLogo from "../../assets/logos/bpl.jpg";
import uclLogo from "../../assets/logos/ucl.webp";
import fedCupLogo from "../../assets/logos/federation-cup.jpg";

const getLeagueLogo = (leagueName) => {
  if (!leagueName) return null;
  const name = leagueName.toLowerCase();
  if (name.includes('bpl') || name.includes('bangladesh premier league')) return bplLogo;
  if (name.includes('ucl') || name.includes('champions league')) return uclLogo;
  if (name.includes('federation')) return fedCupLogo;
  return null;
};

function LeagueCard({ league }) {
  return (
    <div className="league-card">

      <div className="league-logo-wrapper">
        <img src={getLeagueLogo(league.name) || league.logo} alt={league.name} className="league-logo" />
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