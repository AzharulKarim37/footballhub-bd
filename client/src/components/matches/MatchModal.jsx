import "./MatchModal.css";

function MatchModal({ match, onClose }) {

  if (!match) return null;

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

        <div className="statistics">

          <h3>Match Statistics</h3>

          <div className="stat">

            <span>Possession</span>

            <span>62% - 38%</span>

          </div>

          <div className="bar">

            <div style={{ width: "62%" }}></div>

          </div>

          <div className="stat">

            <span>Shots</span>

            <span>18 - 9</span>

          </div>

          <div className="bar">

            <div style={{ width: "67%" }}></div>

          </div>

          <div className="stat">

            <span>Shots on Target</span>

            <span>8 - 3</span>

          </div>

          <div className="bar">

            <div style={{ width: "72%" }}></div>

          </div>

          <div className="stat">

            <span>Corners</span>

            <span>7 - 2</span>

          </div>

          <div className="bar">

            <div style={{ width: "78%" }}></div>

          </div>

          <div className="stat">

            <span>Yellow Cards</span>

            <span>2 - 4</span>

          </div>

          <div className="bar">

            <div style={{ width: "35%" }}></div>

          </div>

        </div>

        <div className="timeline">

          <h3>Timeline</h3>

          <ul>

            <li>18' ⚽ Goal</li>

            <li>32' 🟨 Yellow Card</li>

            <li>44' ⚽ Goal</li>

            <li>HT</li>

            <li>73' ⚽ Goal</li>

            <li>90+4' Full Time</li>

          </ul>

        </div>

      </div>

    </div>

  );

}

export default MatchModal;