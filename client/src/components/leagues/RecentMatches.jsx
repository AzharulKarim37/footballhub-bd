import "./RecentMatches.css";

function RecentMatches({ matches = [] }) {
  return (
    <div className="recent-matches">
      <h2 className="section-title">Recent Matches</h2>

      <div className="recent-list">
        {matches.length === 0 ? (
          <p style={{ color: "#8d8d8d", textAlign: "center", padding: "20px 0" }}>
            No recent matches available.
          </p>
        ) : (
          matches.map((match, index) => {
            const homeScore = match.homeScore ?? match.home_score ?? 0;
            const awayScore = match.awayScore ?? match.away_score ?? 0;
            return (
              <div className="recent-card" key={match.id ?? index}>
                <div className="recent-top">
                  <span className="match-date">{match.date}</span>
                  <span className="match-status">{match.status || "FT"}</span>
                </div>

                <div className="teams">
                  <span>{match.home}</span>
                  <strong>
                    {homeScore} - {awayScore}
                  </strong>
                  <span>{match.away}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecentMatches;