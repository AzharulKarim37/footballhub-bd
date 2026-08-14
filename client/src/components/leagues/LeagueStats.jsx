import "./LeagueStats.css";

function LeagueStats({ league }) {
  return (
    <div className="league-stats">

      <div className="stat-card">
        <h2>{league.matches_played ?? 0}</h2>
        <p>Matches Played</p>
      </div>

      <div className="stat-card">
        <h2>{league.total_goals ?? 0}</h2>
        <p>Total Goals</p>
      </div>

      <div className="stat-card">
        <h2>{league.avg_goals ?? 0}</h2>
        <p>Goals / Match</p>
      </div>


      <div className="stat-card">
        <h2>{league.red_cards ?? 0}</h2>
        <p>Red Cards</p>
      </div>

      <div className="stat-card">
        <h2>{league.clean_sheets ?? 0}</h2>
        <p>Clean Sheets</p>
      </div>

    </div>
  );
}

export default LeagueStats;