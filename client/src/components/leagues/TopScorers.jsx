import "./TopScorers.css";

function TopScorers({ players }) {

  return (

    <section className="top-scorers">

      <h2 className="section-title">
        Top Scorers
      </h2>

      <div className="scorer-list">

        {players.map(player => (

          <div
            className="scorer-card"
            key={player.rank_no}
          >

            <div className="rank">
              #{player.rank_no}
            </div>

            <div className="player-info">

              <h3>{player.player}</h3>

              <p>{player.club}</p>

            </div>

            <div className="goals">

              ⚽ {player.goals}

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}

export default TopScorers;