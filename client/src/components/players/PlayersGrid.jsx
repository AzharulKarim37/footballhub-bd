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

function PlayersGrid() {
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
          {playerList.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </section>
  );
}

export default PlayersGrid;