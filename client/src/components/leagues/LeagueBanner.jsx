import "./LeagueBanner.css";
import bpl from "../../assets/logos/bpl.jpg";
import federation from "../../assets/logos/federation-cup.jpg";
import ucl from "../../assets/logos/ucl.webp";
import bangladesh from "../../assets/logos/bangladesh.png";

const logoMap = {
  bpl,
  "federation-cup": federation,
  ucl,
  bangladesh,
};

function LeagueBanner({ league }) {
  const logoSrc =
    league.logo && typeof league.logo === "string" && (league.logo.startsWith("data:") || league.logo.startsWith("blob:") || league.logo.startsWith("http"))
      ? league.logo
      : logoMap[league.id] || league.logo || bpl;

  return (
    <div className="league-banner">
      <div className="league-banner-left">
        <img
          src={logoSrc}
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
            <strong>{league.country || "Bangladesh"}</strong>
          </div>

          <div>
            <span>Season</span>
            <strong>{league.season || "2025-26"}</strong>
          </div>

          <div>
            <span>Clubs</span>
            <strong>{league.clubs || 0}</strong>
          </div>

          <div>
            <span>Champion</span>
            <strong>{league.champion || "TBD"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeagueBanner;