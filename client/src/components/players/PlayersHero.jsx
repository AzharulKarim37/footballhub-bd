function PlayersHero() {
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

      <input
        type="text"
        placeholder="Search player..."
        style={{
          width: "350px",
          maxWidth: "90%",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          outline: "none",
          fontSize: "16px",
        }}
      />
    </section>
  );
}

export default PlayersHero;