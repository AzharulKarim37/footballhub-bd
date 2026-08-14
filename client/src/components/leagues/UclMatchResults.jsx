import { useState } from "react";
import { getTeamMatches, uclEliminations, uclStandings } from "../../data/uclMockData";
import "./UclMatchResults.css";

function UclMatchResults() {
  const [activeTab, setActiveTab] = useState("league"); // "league" or "elimination"
  const [selectedTeam, setSelectedTeam] = useState("Real Madrid");
  const [activeElimStage, setActiveElimStage] = useState("final"); // "playoffs", "ro16", "quarter", "semi", "final"

  const teamMatches = getTeamMatches(selectedTeam);

  return (
    <div className="ucl-results-container">
      <h2 className="section-title">UCL Match Results</h2>

      {/* Main Mode Tabs */}
      <div className="ucl-mode-tabs">
        <button
          className={`ucl-mode-btn ${activeTab === "league" ? "active" : ""}`}
          onClick={() => setActiveTab("league")}
        >
          League Phase (Pod System)
        </button>
        <button
          className={`ucl-mode-btn ${activeTab === "elimination" ? "active" : ""}`}
          onClick={() => setActiveTab("elimination")}
        >
          Elimination Phase
        </button>
      </div>

      {/* League Phase View */}
      {activeTab === "league" && (
        <div className="league-phase-view">
          <div className="team-selector-container">
            <label htmlFor="team-select">Select a Team to view their 8 Pod matches:</label>
            <select
              id="team-select"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="team-dropdown"
            >
              {uclStandings.map((t) => (
                <option key={t.id} value={t.club}>
                  {t.club} (Pos: {t.position}, Pot {t.pot})
                </option>
              ))}
            </select>
          </div>

          <div className="matches-grid">
            {teamMatches.map((m, idx) => {
              const isHome = m.home === selectedTeam;
              const opponent = isHome ? m.away : m.home;
              const teamScore = isHome ? m.homeScore : m.awayScore;
              const oppScore = isHome ? m.awayScore : m.homeScore;

              let resultClass = "draw";
              let resultLabel = "D";
              if (teamScore > oppScore) {
                resultClass = "win";
                resultLabel = "W";
              } else if (teamScore < oppScore) {
                resultClass = "loss";
                resultLabel = "L";
              }

              return (
                <div key={idx} className="ucl-match-card">
                  <div className="match-card-header">
                    <span className="matchday-badge">Matchday {m.matchday}</span>
                    <span className={`result-badge ${resultClass}`}>{resultLabel}</span>
                  </div>
                  <div className="match-card-body">
                    <div className="team-row current-team">
                      <span className="team-name">{selectedTeam}</span>
                      <span className="team-score">{teamScore}</span>
                    </div>
                    <div className="team-row opponent-team">
                      <span className="team-name">
                        {opponent} <span className="opponent-pot">Pot {uclStandings.find(t => t.club === opponent)?.pot}</span>
                      </span>
                      <span className="team-score">{oppScore}</span>
                    </div>
                  </div>
                  <div className="match-card-footer">
                    <span>{isHome ? "🏠 Home Match" : "✈️ Away Match"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Elimination Phase View */}
      {activeTab === "elimination" && (
        <div className="elimination-phase-view">
          <div className="elim-stage-tabs">
            <button
              className={`elim-stage-btn ${activeElimStage === "playoffs" ? "active" : ""}`}
              onClick={() => setActiveElimStage("playoffs")}
            >
              Knockout Playoffs
            </button>
            <button
              className={`elim-stage-btn ${activeElimStage === "ro16" ? "active" : ""}`}
              onClick={() => setActiveElimStage("ro16")}
            >
              Round of 16
            </button>
            <button
              className={`elim-stage-btn ${activeElimStage === "quarter" ? "active" : ""}`}
              onClick={() => setActiveElimStage("quarter")}
            >
              Quarter-Finals
            </button>
            <button
              className={`elim-stage-btn ${activeElimStage === "semi" ? "active" : ""}`}
              onClick={() => setActiveElimStage("semi")}
            >
              Semi-Finals
            </button>
            <button
              className={`elim-stage-btn ${activeElimStage === "final" ? "active" : ""}`}
              onClick={() => setActiveElimStage("final")}
            >
              Final
            </button>
          </div>

          <div className="elim-matches-list">
            {activeElimStage === "final" ? (
              <div className="ucl-final-showcase">
                <div className="final-header">
                  <h3>UEFA Champions League Final</h3>
                  <p>{uclEliminations.final.stadium}</p>
                </div>
                <div className="final-teams">
                  <div className="final-team">
                    <span className="name">{uclEliminations.final.home}</span>
                    <span className="score">{uclEliminations.final.homeScore}</span>
                  </div>
                  <div className="vs">VS</div>
                  <div className="final-team">
                    <span className="score">{uclEliminations.final.awayScore}</span>
                    <span className="name">{uclEliminations.final.away}</span>
                  </div>
                </div>
                <div className="final-winner-banner">
                  🏆 Champion: <strong>{uclEliminations.final.winner}</strong>
                </div>
              </div>
            ) : (
              <div className="elim-grid">
                {uclEliminations[activeElimStage === "quarter" ? "quarterFinals" : activeElimStage === "semi" ? "semiFinals" : activeElimStage].map((m, idx) => (
                  <div key={idx} className="ucl-elim-card">
                    <div className="elim-teams">
                      <div className="elim-team-row">
                        <span>{m.home}</span>
                        <span>{m.homeScore}</span>
                      </div>
                      <div className="elim-team-row">
                        <span>{m.away}</span>
                        <span>{m.awayScore}</span>
                      </div>
                    </div>
                    <div className="elim-agg">{m.agg}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UclMatchResults;
