import { useState } from "react";
import "./LeagueTable.css";

function LeagueTable({ standings, leagueName }) {
  const [activeGroup, setActiveGroup] = useState("Group 1");
  const isUcl = leagueName && (leagueName.toLowerCase().includes('ucl') || leagueName.toLowerCase().includes('champions league'));
  
  const getRowClass = (position) => {
    if (!leagueName) return '';
    const name = leagueName.toLowerCase();
    if (name.includes('ucl') || name.includes('champions league')) {
      if (position <= 8) return 'ucl-ro16';
      if (position <= 24) return 'ucl-playoff';
      return 'ucl-eliminated';
    }
    return '';
  };

  return (
    <section className="league-table-section">

      <h2 className="section-title">
        League Standings
      </h2>

      {/* GROUP TABS */}
      {!isUcl && (
        <div style={{display:'flex', gap:'8px', marginBottom:'16px'}}>
          {['Group 1','Group 2'].map(g => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              style={{
                padding: '6px 18px',
                borderRadius: '20px',
                border: '1px solid',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.2s',
                background: activeGroup === g ? '#C8FF2E' : 'transparent',
                color: activeGroup === g ? '#102417' : '#C8FF2E',
                borderColor: '#C8FF2E',
              }}
            >{g}</button>
          ))}
        </div>
      )}

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


            </tr>

          </thead>

          <tbody>

            {standings
              .filter(team => isUcl || (team.group_name || 'Group 1') === activeGroup)
              .map((team, index) => (

              <tr key={team.id || index} className={getRowClass(team.position)}>

                <td>{team.position || index + 1}</td>

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

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {isUcl && (
        <div className="ucl-legend">
          <div className="legend-item">
            <span className="legend-color ucl-ro16-bg"></span>
            <span>1-8: Direct Qualification to Round of 16</span>
          </div>
          <div className="legend-item">
            <span className="legend-color ucl-playoff-bg"></span>
            <span>9-24: Knockout Round Play-offs</span>
          </div>
          <div className="legend-item">
            <span className="legend-color ucl-eliminated-bg"></span>
            <span>25-36: Eliminated</span>
          </div>
        </div>
      )}

    </section>
  );
}

export default LeagueTable;