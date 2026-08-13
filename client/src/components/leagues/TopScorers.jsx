import "./TopScorers.css";

function TopScorers({ players = [] }) {
  return (
    <section className="top-scorers">
      <h2 className="section-title">Top Scorers</h2>

      <div className="scorer-list">
        {players.map((player, index) => {
          const rank = player.rank_no ?? player.rank ?? index + 1;
          return (
            <div className="scorer-card" key={player.id ?? `${player.player}-${rank}`}>
              <div className="rank">#{rank}</div>

              <div className="player-info">
                <h3>{player.player}</h3>
                <p>{player.club}</p>
              </div>

              <div className="goals">⚽ {player.goals}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TopScorers;