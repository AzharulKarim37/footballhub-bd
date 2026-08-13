import { useEffect, useState } from "react";
import { fetchLeagues } from "../services/api";
import LeagueCard from "../components/leagues/LeagueCard";
import { Trophy, Globe, Flame } from "lucide-react";
import "./Leagues.css";

function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  useEffect(() => {
    const loadLeagues = async () => {
      setLoading(true);
      try {
        const data = await fetchLeagues();
        setLeagues(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading leagues:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLeagues();
  }, []);

  const filteredLeagues = leagues.filter((league) => {
    if (selectedFilter === "BANGLADESH") {
      return league.country === "Bangladesh";
    }
    if (selectedFilter === "INTERNATIONAL") {
      return league.country !== "Bangladesh";
    }
    return true;
  });

  return (
    <div className="leagues-page">
      {/* Hero Header */}
      <div className="leagues-hero">
        <div className="leagues-hero-badge">
          <Trophy size={16} />
          <span>MAJOR COMPETITIONS</span>
        </div>
        <h1>
          Football Leagues &amp; <span>Tournaments</span>
        </h1>
        <p className="leagues-hero-sub">
          Explore complete league standings, fixtures, top goalscorers, team forms, and comprehensive statistics across domestic and international competitions.
        </p>

        {/* Filter Pills */}
        <div className="leagues-filter-bar">
          <button
            className={`leagues-filter-btn ${selectedFilter === "ALL" ? "active" : ""}`}
            onClick={() => setSelectedFilter("ALL")}
          >
            <Flame size={16} /> All Competitions ({leagues.length})
          </button>
          <button
            className={`leagues-filter-btn ${selectedFilter === "BANGLADESH" ? "active" : ""}`}
            onClick={() => setSelectedFilter("BANGLADESH")}
          >
            🇧🇩 Bangladesh Domestic
          </button>
          <button
            className={`leagues-filter-btn ${selectedFilter === "INTERNATIONAL" ? "active" : ""}`}
            onClick={() => setSelectedFilter("INTERNATIONAL")}
          >
            <Globe size={16} /> International
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="leagues-content-container">
        {loading ? (
          <div className="leagues-loading">
            <div className="leagues-spinner" />
            <p>Loading Competitions...</p>
          </div>
        ) : filteredLeagues.length === 0 ? (
          <div className="leagues-empty">
            <h3>No Competitions Found</h3>
            <p>No leagues match the current filter.</p>
          </div>
        ) : (
          <div className="league-grid">
            {filteredLeagues.map((league) => (
              <LeagueCard key={league.id} league={league} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leagues;