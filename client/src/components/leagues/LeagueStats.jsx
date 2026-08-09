import "./LeagueStats.css";

function LeagueStats({ league }) {
  return (
    <div className="league-stats">

      <div className="stat-card">
        <h2>{league.matchesPlayed}</h2>
        <p>Matches Played</p>
      </div>

      <div className="stat-card">
        <h2>{league.totalGoals}</h2>
        <p>Total Goals</p>
      </div>

      <div className="stat-card">
        <h2>{league.avgGoals}</h2>
        <p>Goals / Match</p>
      </div>

      <div className="stat-card">
        <h2>{league.yellowCards}</h2>
        <p>Yellow Cards</p>
      </div>

      <div className="stat-card">
        <h2>{league.redCards}</h2>
        <p>Red Cards</p>
      </div>

      <div className="stat-card">
        <h2>{league.cleanSheets}</h2>
        <p>Clean Sheets</p>
      </div>

    </div>
  );
}

export default LeagueStats;