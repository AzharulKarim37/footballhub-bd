import { useState, useEffect } from "react";
import TeamCard from "./TeamCard";
import { fetchTeams } from "../../services/api";
import { defaultTeams, logoMap } from "../../data/teamsData";

function TeamsGrid() {
  const [teamList, setTeamList] = useState(defaultTeams);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams()
      .then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((t) => ({
            ...t,
            logo: logoMap[t.name] || t.logo || defaultTeams[0].logo,
          }));
          setTeamList(formatted);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#0d1117",
        padding: "50px 40px",
        minHeight: "100vh",
      }}
    >
      {loading ? (
        <div style={{ textAlign: "center", color: "#00ff87", fontSize: "18px" }}>
          Loading Teams...
        </div>
      ) : (
        <div
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          {teamList.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </section>
  );
}

export default TeamsGrid;