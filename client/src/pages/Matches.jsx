import { useState, useEffect } from "react";
import "./Matches.css";

import { fetchMatches } from "../services/api";

import MatchCard from "../components/matches/MatchCard";
import MatchFilter from "../components/matches/MatchFilter";
import MatchModal from "../components/matches/MatchModal";

function Matches() {
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [search, setSearch] = useState("");
  const [league, setLeague] = useState("ALL");
  const [matchList, setMatchList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchMatches({ status: selectedFilter, search, league })
      .then((data) => {
        if (isMounted) {
          setMatchList(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedFilter, search, league]);

  const liveMatches = matchList.filter((m) => m.status === "LIVE");
  const todayMatches = matchList.filter((m) => m.status === "TODAY");
  const upcomingMatches = matchList.filter((m) => m.status === "UPCOMING");
  const finishedMatches = matchList.filter((m) => m.status === "FT");

  return (
    <div className="matches-page">
      {/* Hero */}
      <div className="match-hero">
        <h1>Match Center</h1>
        <p>Follow Live Scores, Fixtures & Results</p>
      </div>

      {/* Search + League */}
      <div className="match-tools">
        <input
          type="text"
          placeholder="Search Team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={league}
          onChange={(e) => setLeague(e.target.value)}
        >
          <option value="ALL">All Competitions</option>
          <option value="Bangladesh Premier League">Bangladesh Premier League</option>
          <option value="Federation Cup">Federation Cup</option>
          <option value="UEFA Champions League">UEFA Champions League</option>
        </select>
      </div>

      {/* Filter */}
      <MatchFilter
        selected={selectedFilter}
        setSelected={setSelectedFilter}
      />

      {loading ? (
        <div style={{ textAlign: "center", color: "#00ff87", padding: "40px 0", fontSize: "18px" }}>
          Loading Matches...
        </div>
      ) : matchList.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", padding: "40px 0", fontSize: "18px" }}>
          No matches found matching your filters.
        </div>
      ) : (
        <>
          {/* LIVE */}
          {liveMatches.length > 0 && (
            <>
              <h2 className="match-section-title">🔴 Live Matches</h2>
              <div className="match-grid">
                {liveMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={setSelectedMatch}
                  />
                ))}
              </div>
            </>
          )}

          {/* TODAY */}
          {todayMatches.length > 0 && (
            <>
              <h2 className="match-section-title">📅 Today's Matches</h2>
              <div className="match-grid">
                {todayMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={setSelectedMatch}
                  />
                ))}
              </div>
            </>
          )}

          {/* UPCOMING */}
          {upcomingMatches.length > 0 && (
            <>
              <h2 className="match-section-title">⏳ Upcoming Matches</h2>
              <div className="match-grid">
                {upcomingMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={setSelectedMatch}
                  />
                ))}
              </div>
            </>
          )}

          {/* FINISHED */}
          {finishedMatches.length > 0 && (
            <>
              <h2 className="match-section-title">✅ Finished Matches</h2>
              <div className="match-grid">
                {finishedMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={setSelectedMatch}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Modal */}
      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}

export default Matches;