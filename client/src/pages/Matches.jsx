import { useState, useEffect, useMemo } from "react";
import { Search, Trophy, Radio, RotateCcw } from "lucide-react";
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
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchMatches({ search: "", league: "ALL", status: "ALL" })
      .then((data) => {
        if (isMounted) {
          setAllMatches(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter matches locally for instant responsiveness
  const filteredMatches = useMemo(() => {
    return allMatches.filter((match) => {
      // Status filter
      if (selectedFilter !== "ALL" && match.status !== selectedFilter) {
        return false;
      }

      // League filter
      if (league !== "ALL" && match.league !== league) {
        return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const homeMatch = match.home?.toLowerCase().includes(q);
        const awayMatch = match.away?.toLowerCase().includes(q);
        const leagueMatch = match.league?.toLowerCase().includes(q);
        if (!homeMatch && !awayMatch && !leagueMatch) {
          return false;
        }
      }

      return true;
    });
  }, [allMatches, selectedFilter, league, search]);

  // Counts for filter pills
  const counts = useMemo(() => {
    const res = { ALL: allMatches.length, LIVE: 0, TODAY: 0, UPCOMING: 0, FT: 0 };
    allMatches.forEach((m) => {
      if (res[m.status] !== undefined) {
        res[m.status] += 1;
      }
    });
    return res;
  }, [allMatches]);

  const liveMatches = filteredMatches.filter((m) => m.status === "LIVE");
  const todayMatches = filteredMatches.filter((m) => m.status === "TODAY");
  const upcomingMatches = filteredMatches.filter((m) => m.status === "UPCOMING");
  const finishedMatches = filteredMatches.filter((m) => m.status === "FT");

  const resetFilters = () => {
    setSelectedFilter("ALL");
    setSearch("");
    setLeague("ALL");
  };

  return (
    <div className="matches-page">
      <div className="matches-container">
        {/* Match Center Hero Banner */}
        <div className="match-hero">
          <div className="match-hero-top">
            <div className="match-radar-chip">
              <Radio size={14} className="radar-icon" />
              <span>LIVE MATCHDAY RADAR</span>
            </div>
            <span className="season-tag">SEASON 2025/26</span>
          </div>

          <h1>
            Match Center &amp; <span>Live Scores</span>
          </h1>

          <p>
            Real-time live scores, full time results, upcoming fixtures, and
            matchday details across Bangladesh domestic and international
            competitions.
          </p>

          {/* Quick Counter Strip */}
          <div className="match-quick-stats">
            <div
              className={`stat-pill ${selectedFilter === "ALL" ? "active-stat" : ""}`}
              onClick={() => setSelectedFilter("ALL")}
            >
              <span>Total Fixtures</span>
              <strong>{counts.ALL}</strong>
            </div>
            <div
              className={`stat-pill live-stat ${selectedFilter === "LIVE" ? "active-stat" : ""}`}
              onClick={() => setSelectedFilter("LIVE")}
            >
              <span>🔴 In Play</span>
              <strong>{counts.LIVE}</strong>
            </div>
            <div
              className={`stat-pill ${selectedFilter === "TODAY" ? "active-stat" : ""}`}
              onClick={() => setSelectedFilter("TODAY")}
            >
              <span>📅 Today</span>
              <strong>{counts.TODAY}</strong>
            </div>
            <div
              className={`stat-pill ${selectedFilter === "UPCOMING" ? "active-stat" : ""}`}
              onClick={() => setSelectedFilter("UPCOMING")}
            >
              <span>⏳ Upcoming</span>
              <strong>{counts.UPCOMING}</strong>
            </div>
            <div
              className={`stat-pill ${selectedFilter === "FT" ? "active-stat" : ""}`}
              onClick={() => setSelectedFilter("FT")}
            >
              <span>✅ Finished</span>
              <strong>{counts.FT}</strong>
            </div>
          </div>
        </div>

        {/* Search & League Controls Toolbar */}
        <div className="match-toolbar">
          <div className="search-box-wrapper">
            <Search size={18} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Search club, team, or venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="search-clear-btn"
                onClick={() => setSearch("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="league-select-wrapper">
            <Trophy size={16} className="league-icon-inside" />
            <select
              value={league}
              onChange={(e) => setLeague(e.target.value)}
            >
              <option value="ALL">All Competitions</option>
              <option value="Bangladesh Premier League">
                Bangladesh Premier League
              </option>
              <option value="Federation Cup">Federation Cup</option>
              <option value="UEFA Champions League">UEFA Champions League</option>
            </select>
          </div>
        </div>

        {/* Match Filter Tabs */}
        <MatchFilter
          selected={selectedFilter}
          setSelected={setSelectedFilter}
          counts={counts}
        />

        {/* Match List Content */}
        {loading ? (
          <div className="matches-loading">
            <div className="matches-pulse-spinner" />
            <p>Loading Match Center...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="no-matches-box">
            <h3>No Matches Found</h3>
            <p>No fixtures match your selected filters or search query.</p>
            <button className="reset-filter-btn" onClick={resetFilters}>
              <RotateCcw size={15} /> Reset Filters
            </button>
          </div>
        ) : (
          <div className="match-sections-wrapper">
            {/* LIVE */}
            {liveMatches.length > 0 && (
              <section className="match-section-group">
                <div className="section-header-row">
                  <h2 className="match-section-heading">
                    <span className="live-bullet" /> 🔴 Live Now ({liveMatches.length})
                  </h2>
                </div>
                <div className="match-grid">
                  {liveMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={setSelectedMatch}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* TODAY */}
            {todayMatches.length > 0 && (
              <section className="match-section-group">
                <h2 className="match-section-heading">
                  📅 Today's Matches ({todayMatches.length})
                </h2>
                <div className="match-grid">
                  {todayMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={setSelectedMatch}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* UPCOMING */}
            {upcomingMatches.length > 0 && (
              <section className="match-section-group">
                <h2 className="match-section-heading">
                  ⏳ Upcoming Fixtures ({upcomingMatches.length})
                </h2>
                <div className="match-grid">
                  {upcomingMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={setSelectedMatch}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* FINISHED */}
            {finishedMatches.length > 0 && (
              <section className="match-section-group">
                <h2 className="match-section-heading">
                  ✅ Full Time Results ({finishedMatches.length})
                </h2>
                <div className="match-grid">
                  {finishedMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={setSelectedMatch}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Match Details Modal */}
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