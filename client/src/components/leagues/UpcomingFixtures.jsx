import "./UpcomingFixtures.css";

function UpcomingFixtures({ fixtures = [] }) {
  return (
    <div className="upcoming-fixtures">
      <h2 className="section-title">Upcoming Fixtures</h2>

      <div className="fixture-list">
        {fixtures.length === 0 ? (
          <p style={{ color: "#8d8d8d", textAlign: "center", padding: "20px 0" }}>
            No upcoming fixtures scheduled.
          </p>
        ) : (
          fixtures.map((fixture, index) => (
            <div className="fixture-card" key={fixture.id ?? index}>
              <div className="fixture-date">
                <span>{fixture.date}</span>
                <span>{fixture.time}</span>
              </div>

              <div className="fixture-teams">
                <span>{fixture.home}</span>
                <strong>vs</strong>
                <span>{fixture.away}</span>
              </div>

              <div className="fixture-venue">
                {fixture.venue || fixture.stadium || "National Stadium"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UpcomingFixtures;