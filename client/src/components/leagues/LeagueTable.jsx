import "./LeagueTable.css";

function LeagueTable({ standings }) {
  return (
    <section className="league-table-section">

      <h2 className="section-title">
        League Standings
      </h2>

      <div className="table-container">

        <table className="league-table">

          <thead>

            <tr>

              <th>Pos</th>

              <th>Club</th>

              <th>P</th>

              <th>W</th>

              <th>D</th>

              <th>L</th>

              <th>GF</th>

              <th>GA</th>

              <th>GD</th>

              <th>Pts</th>

              <th>Form</th>

            </tr>

          </thead>

          <tbody>

            {standings.map((team) => (

              <tr key={team.position}>

                <td>{team.position}</td>

                <td className="club-name">

                  {team.club}

                </td>

                <td>{team.played}</td>

                <td>{team.won}</td>

                <td>{team.draw}</td>

                <td>{team.lost}</td>

                <td>{team.gf}</td>

                <td>{team.ga}</td>

                <td
                  style={{
                    color: team.gd >= 0 ? "#2ecc71" : "#e74c3c",
                    fontWeight: "700"
                  }}
                >
                  {team.gd > 0 ? `+${team.gd}` : team.gd}
                </td>

                <td className="points">

                  {team.points}

                </td>

                <td>

                  <div className="form-column">

                    {team.form.map((result, index) => (

                      <span
                        key={index}
                        className={`form ${result}`}
                      >

                        {result}

                      </span>

                    ))}

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default LeagueTable;