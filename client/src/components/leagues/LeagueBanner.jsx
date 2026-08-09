import "./LeagueBanner.css";

function LeagueBanner({ league }) {
  return (
    <div className="league-banner">

      <div className="league-banner-left">

        <img
          src={league.logo}
          alt={league.name}
          className="league-banner-logo"
        />

      </div>

      <div className="league-banner-right">

        <h1>{league.name}</h1>

        <p>{league.description}</p>

        <div className="league-banner-info">

          <div>
            <span>Country</span>
            <strong>{league.country}</strong>
          </div>

          <div>
            <span>Season</span>
            <strong>{league.season}</strong>
          </div>

          <div>
            <span>Clubs</span>
            <strong>{league.clubs}</strong>
          </div>

          <div>
            <span>Champion</span>
            <strong>{league.champion}</strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default LeagueBanner;