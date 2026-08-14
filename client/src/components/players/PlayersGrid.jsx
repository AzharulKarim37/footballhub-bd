import { useState, useEffect } from "react";
import PlayerCard from "./PlayerCard";
import { fetchPlayers } from "../../services/api";

import jamal from "../../assets/players/jamal-bhuyanjpg.webp";
import rakib from "../../assets/players/rakib.webp";
import topu from "../../assets/players/Topu-Barman.webp";
import sohel from "../../assets/players/Shohel rana.webp";

const playerImageMap = {
  "Jamal Bhuyan": jamal,
  "Rakib Hossain": rakib,
  "Topu Barman": topu,
  "Sohel Rana": sohel,
};

function PlayersGrid({ search = "" }) {
  const [playerList, setPlayerList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers()
      .then((data) => {
        if (data) {
          const formatted = data.map((p) => ({
            ...p,
            image: playerImageMap[p.name] || p.image || jamal,
          }));
          setPlayerList(formatted);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  /* Filter by name, club, or position */
  const query = search.trim().toLowerCase();
  const filtered = query
    ? playerList.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.club?.toLowerCase().includes(query) ||
          p.position?.toLowerCase().includes(query)
      )
    : playerList;

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
          Loading Players...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: "16px",
            paddingTop: "40px",
          }}
        >
          No players found for &ldquo;<strong style={{ color: "#94a3b8" }}>{search}</strong>&rdquo;.
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
          {filtered.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </section>
  );
}

export default PlayersGrid;