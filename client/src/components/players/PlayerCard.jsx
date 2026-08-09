function PlayerCard({ player }) {
  return (
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
          style={{
            marginTop: "10px",
            background: "#0ea5e9",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

export default PlayerCard;