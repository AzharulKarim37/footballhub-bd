function PlayersHero({ search, onSearch }) {
  return (
    <section
      style={{
        backgroundColor: "#0d1117",
        color: "white",
        padding: "120px 20px 60px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          marginBottom: "15px",
        }}
      >
        Bangladesh Football Players
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "#bdbdbd",
          marginBottom: "30px",
        }}
      >
        Explore the talented footballers playing in the Bangladesh Premier
        League and representing Bangladesh.
      </p>

      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Search icon */}
        <span
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "16px",
            color: "#64748b",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>

        <input
          type="text"
          placeholder="Search by name, club or position..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={{
            width: "400px",
            maxWidth: "90vw",
            padding: "13px 16px 13px 42px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.1)",
            outline: "none",
            fontSize: "15px",
            backgroundColor: "#161b22",
            color: "#e2e8f0",
            boxShadow: "0 0 0 0 transparent",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#00ff87";
            e.target.style.boxShadow = "0 0 0 3px rgba(0,255,135,0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.1)";
            e.target.style.boxShadow = "0 0 0 0 transparent";
          }}
        />

        {/* Clear button */}
        {search && (
          <button
            onClick={() => onSearch("")}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#64748b",
              fontSize: "16px",
              cursor: "pointer",
              lineHeight: 1,
              padding: "2px 4px",
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </section>
  );
}

export default PlayersHero;