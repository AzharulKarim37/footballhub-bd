import "./MatchModal.css";

function MatchModal({ match, onClose }) {

  if (!match) return null;

  let stats = match.stats || {};
  if (typeof stats === 'string') {
    try { stats = JSON.parse(stats); } catch(e) {}
  }
  let timeline = match.timeline || [];
  if (typeof timeline === 'string') {
    try { timeline = JSON.parse(timeline); } catch(e) {}
  }

  const isUpcoming = match.status === 'UPCOMING';

  return (

    <div className="modal-overlay" onClick={onClose}>

      <div
        className="match-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="modal-header">

          <p className="modal-league">

            {match.league}

          </p>

          <h2>

            {match.home}

            {" "}

            {match.homeScore ?? "-"}

            {" - "}

            {match.awayScore ?? "-"}

            {" "}

            {match.away}

          </h2>

          <span className="status">

            {match.status}

          </span>

        </div>

        <div className="modal-info">

          <div>

            <h4>Date</h4>

            <p>{match.date}</p>

          </div>

          <div>

            <h4>Kick Off</h4>

            <p>{match.time}</p>

          </div>

          <div>

            <h4>Stage</h4>

            <p>{match.stage}</p>

          </div>

          <div>

            <h4>Venue</h4>

            <p>{match.stadium}</p>

          </div>

        </div>

        {!isUpcoming && (
          <>
            <div className="statistics">
              <h3>Match Statistics</h3>

              <div className="stat">
                <span>Possession</span>
                <span>{stats.possession_home ?? 50}% - {stats.possession_away ?? 50}%</span>
              </div>
              <div className="bar">
                <div style={{ width: `${stats.possession_home ?? 50}%` }}></div>
              </div>

              <div className="stat">
                <span>Shots</span>
                <span>{stats.shots_home ?? 0} - {stats.shots_away ?? 0}</span>
              </div>
              <div className="bar">
                <div style={{ width: `${((stats.shots_home ?? 0) / Math.max(((stats.shots_home ?? 0) + (stats.shots_away ?? 0)), 1)) * 100}%` }}></div>
              </div>

              <div className="stat">
                <span>Shots on Target</span>
                <span>{stats.shots_on_target_home ?? 0} - {stats.shots_on_target_away ?? 0}</span>
              </div>
              <div className="bar">
                <div style={{ width: `${((stats.shots_on_target_home ?? 0) / Math.max(((stats.shots_on_target_home ?? 0) + (stats.shots_on_target_away ?? 0)), 1)) * 100}%` }}></div>
              </div>

              <div className="stat">
                <span>Corners</span>
                <span>{stats.corners_home ?? 0} - {stats.corners_away ?? 0}</span>
              </div>
              <div className="bar">
                <div style={{ width: `${((stats.corners_home ?? 0) / Math.max(((stats.corners_home ?? 0) + (stats.corners_away ?? 0)), 1)) * 100}%` }}></div>
              </div>

              <div className="stat">
                <span>Yellow Cards</span>
                <span>{stats.yellows_home ?? 0} - {stats.yellows_away ?? 0}</span>
              </div>
              <div className="bar">
                <div style={{ width: `${((stats.yellows_home ?? 0) / Math.max(((stats.yellows_home ?? 0) + (stats.yellows_away ?? 0)), 1)) * 100}%` }}></div>
              </div>
            </div>

            <div className="timeline">
              <h3>Timeline</h3>
              {timeline.length > 0 ? (
                <ul>
                  {timeline.map((event, index) => {
                    let icon = "⚽";
                    if (event.type === "Yellow Card") icon = "🟨";
                    if (event.type === "Red Card") icon = "🟥";
                    if (event.type === "Substitution") icon = "🔄";
                    
                    return (
                      <li key={index}>
                        {event.minute} {icon} {event.player}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p style={{textAlign: 'center', color: '#666', marginTop: '10px'}}>No timeline events recorded yet.</p>
              )}
            </div>
          </>
        )}

      </div>

    </div>

  );

}

export default MatchModal;