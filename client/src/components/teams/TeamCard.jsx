function TeamCard({ team }) {
  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        overflow: "hidden",
        color: "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      }}
    >
      <img
        src={team.logo}
        alt={team.name}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "contain",
          backgroundColor: "white",
          padding: "20px",
        }}
      />

      <div style={{ padding: "20px" }}>
        <h2>{team.name}</h2>

        <p><strong>League:</strong> {team.league}</p>

        <p><strong>Coach:</strong> {team.coach}</p>

        <p><strong>Stadium:</strong> {team.stadium}</p>

        <p><strong>Founded:</strong> {team.founded}</p>

        <button
          style={{
            marginTop: "10px",
            background: "#16a34a",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          View Club
        </button>
      </div>
    </div>
  );
}

export default TeamCard;