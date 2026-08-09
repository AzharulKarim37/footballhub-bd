import "./RecentMatches.css";

function RecentMatches({ matches }) {
  return (
    <div className="recent-matches">

      <h2 className="section-title">
        Recent Matches
      </h2>

      <div className="recent-list">

        {matches?.map((match, index) => (

          <div className="recent-card" key={index}>

            <div className="recent-top">

              <span className="match-date">
                {match.date}
              </span>

              <span className="match-status">
                FT
              </span>

            </div>

            <div className="teams">

              <span>{match.home}</span>

              <strong>
                {match.homeScore} - {match.awayScore}
              </strong>

              <span>{match.away}</span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RecentMatches;