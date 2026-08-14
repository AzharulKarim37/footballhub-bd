import { useState } from "react";
import PlayerProfileModal from "./PlayerProfileModal";

function PlayerCard({ player }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          overflow: "hidden",
          color: "white",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          transition: "0.3s",
        }}
      >
        <img
          src={player.image}
          alt={player.name}
          style={{
            width: "100%",
            height: "250px",
            objectFit: "cover",
          }}
        />

        <div style={{ padding: "20px" }}>
          <h2>{player.name}</h2>

          <p><strong>Club:</strong> {player.club}</p>

          <p><strong>Position:</strong> {player.position}</p>

          <p><strong>Jersey:</strong> #{player.number}</p>

          <button
            onClick={() => setShowProfile(true)}
            style={{
              marginTop: "10px",
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "opacity 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            View Profile
          </button>
        </div>
      </div>

      {/* PLAYER PROFILE MODAL */}
      {showProfile && (
        <PlayerProfileModal
          player={player}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}

export default PlayerCard;