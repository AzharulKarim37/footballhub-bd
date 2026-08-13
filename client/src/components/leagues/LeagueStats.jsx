import "./LeagueStats.css";

function LeagueStats({ league }) {
  const matchesPlayed = league.matches_played ?? league.matchesPlayed ?? 0;
  const totalGoals = league.total_goals ?? league.totalGoals ?? 0;
  const avgGoals = league.avg_goals ?? league.avgGoals ?? 0;
  const yellowCards = league.yellow_cards ?? league.yellowCards ?? 0;
  const redCards = league.red_cards ?? league.redCards ?? 0;
  const cleanSheets = league.clean_sheets ?? league.cleanSheets ?? 0;

  return (
    <div className="league-stats">
      <div className="stat-card">
        <h2>{matchesPlayed}</h2>
        <p>Matches Played</p>
      </div>

      <div className="stat-card">
        <h2>{totalGoals}</h2>
        <p>Total Goals</p>
      </div>

      <div className="stat-card">
        <h2>{avgGoals}</h2>
        <p>Goals / Match</p>
      </div>

      <div className="stat-card">
        <h2>{yellowCards}</h2>
        <p>Yellow Cards</p>
      </div>

      <div className="stat-card">
        <h2>{redCards}</h2>
        <p>Red Cards</p>
      </div>

      <div className="stat-card">
        <h2>{cleanSheets}</h2>
        <p>Clean Sheets</p>
      </div>
    </div>
  );
}

export default LeagueStats;