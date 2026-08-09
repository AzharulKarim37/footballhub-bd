import { useState, useEffect } from "react";
import PageHero from "../components/common/PageHero";
import LeagueCard from "../components/leagues/LeagueCard";
import { fetchLeagues } from "../services/api";
import "./Leagues.css";

function Leagues() {
  const [search, setSearch] = useState("");
  const [leagueList, setLeagueList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeagues()
      .then((data) => {
        setLeagueList(data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filteredLeagues = leagueList.filter((league) =>
    league.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="leagues-page">
      <PageHero
        title="Football Competitions"
        subtitle="Explore Bangladesh Premier League, Federation Cup and UEFA Champions League."
        placeholder="Search Competition..."
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <div style={{ textAlign: "center", color: "#00ff87", padding: "50px", fontSize: "18px" }}>
          Loading Competitions...
        </div>
      ) : (
        <div className="league-grid">
          {filteredLeagues.map((league) => (
            <LeagueCard
              key={league.id}
              league={league}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Leagues;