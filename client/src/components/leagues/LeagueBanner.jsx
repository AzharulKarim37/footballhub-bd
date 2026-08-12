import "./LeagueBanner.css";
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

function LeagueBanner({ league, availableSeasons, currentSeason, onSeasonChange }) {
  return (
    <div className="league-banner">

      <div className="league-banner-left">

        <img
          src={getLeagueLogo(league.name) || league.logo}
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

          <div className="season-selector-wrapper">
            <span>Season</span>
            <strong>
              <select 
                value={currentSeason || league.season}
                onChange={(e) => onSeasonChange && onSeasonChange(e.target.value)}
                style={{
                  background: 'transparent', 
                  color: 'inherit', 
                  border: 'none', 
                  outline: 'none', 
                  fontWeight: 'inherit', 
                  fontSize: 'inherit',
                  cursor: 'pointer'
                }}
              >
                {availableSeasons && availableSeasons.length > 0 ? (
                  availableSeasons.map(s => <option key={s} value={s} style={{color: 'black'}}>{s}</option>)
                ) : (
                  <option value={league.season} style={{color: 'black'}}>{league.season}</option>
                )}
              </select>
            </strong>
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