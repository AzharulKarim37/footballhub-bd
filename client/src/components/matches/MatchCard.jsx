import "./MatchCard.css";

function MatchCard({ match, onClick }) {

  const getBadge = () => {

    switch (match.status) {

      case "LIVE":
        return <span className="badge live">LIVE</span>;

      case "TODAY":
        return <span className="badge today">TODAY</span>;

      case "UPCOMING":
        return <span className="badge upcoming">UPCOMING</span>;

      default:
        return <span className="badge ft">FT</span>;

    }

  };

  return (

    <div
      className="match-card"
      onClick={() => onClick(match)}
    >

      {/* Top */}

      <div className="match-top">

        <span className="league-name">
          {match.league}
        </span>

        {getBadge()}

      </div>

      {/* Teams */}

      <div className="teams-score">

        <div className="team">

          <h4>{match.home}</h4>

        </div>

        <div className="score">

          {

          match.status === "LIVE" ||

          match.status === "FT"

          ?

          <>

            <h2>

              {match.homeScore}

              {" - "}

              {match.awayScore}

            </h2>

            <p>

              {

              match.status === "LIVE"

              ?

              match.minute

              :

              "Full Time"

              }

            </p>

          </>

          :

          <>

            <h2>VS</h2>

            <p>{match.time}</p>

          </>

          }

        </div>

        <div className="team">

          <h4>{match.away}</h4>

        </div>

      </div>

      {/* Bottom */}

      <div className="match-bottom">

        <span>{match.stage}</span>

        <span>•</span>

        <span>{match.stadium}</span>

      </div>

      {/* Click Hint */}

      <div className="match-footer">

        <span>📊 Click to view match details</span>

      </div>

    </div>

  );

}

export default MatchCard;