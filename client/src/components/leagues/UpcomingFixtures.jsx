import "./UpcomingFixtures.css";

function UpcomingFixtures({ fixtures }) {

  return (

    <div className="upcoming-fixtures">

      <h2 className="section-title">

        Upcoming Fixtures

      </h2>

      <div className="fixture-list">

        {fixtures?.map((fixture,index)=>(

          <div
            className="fixture-card"
            key={index}
          >

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

              {fixture.venue}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default UpcomingFixtures;