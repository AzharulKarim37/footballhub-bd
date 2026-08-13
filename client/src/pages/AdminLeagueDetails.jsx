import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./AdminLeagueDetails.css";

const API_URL = "http://localhost:5001/api/leagues";

function AdminLeagueDetails() {
  const { leagueId } = useParams();
  const [leagueData, setLeagueData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showStandingModal, setShowStandingModal] = useState(false);
  const [showScorerModal, setShowScorerModal] = useState(false);
  
  const [editingStanding, setEditingStanding] = useState(null);
  const [editingScorer, setEditingScorer] = useState(null);

  const [standingForm, setStandingForm] = useState({ position: "", club: "", played: "", won: "", drawn: "", lost: "", gf: "", ga: "", gd: "", points: "", form: "W,W,D,W,W" });
  const [scorerForm, setScorerForm] = useState({ rank_no: "", player: "", club: "", goals: "" });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchLeagueDetails();
  }, [leagueId]);

  const fetchLeagueDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/${leagueId}`);
      setLeagueData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load league details");
    } finally {
      setLoading(false);
    }
  };

  /* --- STANDINGS CRUD --- */
  const openStandingModal = (standing = null) => {
    if (standing) {
      setEditingStanding(standing);
      setStandingForm({ ...standing, form: Array.isArray(standing.form) ? standing.form.join(",") : standing.form });
    } else {
      setEditingStanding(null);
      setStandingForm({ position: "", club: "", played: "0", won: "0", drawn: "0", lost: "0", gf: "0", ga: "0", gd: "0", points: "0", form: "W,W,W,W,W" });
    }
    setShowStandingModal(true);
  };

  const saveStanding = async (e) => {
    e.preventDefault();
    try {
      if (editingStanding) {
        await axios.put(`${API_URL}/${leagueId}/standings/${editingStanding.id}`, standingForm, { headers: { Authorization: `Bearer ${getToken()}` } });
      } else {
        await axios.post(`${API_URL}/${leagueId}/standings`, standingForm, { headers: { Authorization: `Bearer ${getToken()}` } });
      }
      setShowStandingModal(false);
      fetchLeagueDetails();
    } catch (err) {
      alert("Error saving standing");
    }
  };

  const deleteStanding = async (id) => {
    if(!window.confirm("Delete this standing?")) return;
    try {
      await axios.delete(`${API_URL}/${leagueId}/standings/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      fetchLeagueDetails();
    } catch (err) {
      alert("Error deleting standing");
    }
  };

  /* --- TOP SCORERS CRUD --- */
  const openScorerModal = (scorer = null) => {
    if (scorer) {
      setEditingScorer(scorer);
      setScorerForm(scorer);
    } else {
      setEditingScorer(null);
      setScorerForm({ rank_no: "", player: "", club: "", goals: "" });
    }
    setShowScorerModal(true);
  };

  const saveScorer = async (e) => {
    e.preventDefault();
    try {
      if (editingScorer) {
        await axios.put(`${API_URL}/${leagueId}/top-scorers/${editingScorer.id}`, scorerForm, { headers: { Authorization: `Bearer ${getToken()}` } });
      } else {
        await axios.post(`${API_URL}/${leagueId}/top-scorers`, scorerForm, { headers: { Authorization: `Bearer ${getToken()}` } });
      }
      setShowScorerModal(false);
      fetchLeagueDetails();
    } catch (err) {
      alert("Error saving top scorer");
    }
  };

  const deleteScorer = async (id) => {
    if(!window.confirm("Delete this top scorer?")) return;
    try {
      await axios.delete(`${API_URL}/${leagueId}/top-scorers/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      fetchLeagueDetails();
    } catch (err) {
      alert("Error deleting scorer");
    }
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;
  if (!leagueData) return <div>League not found</div>;

  const { league, standings, topScorers } = leagueData;

  return (
    <div className="league-details-page">
      <div className="league-details-header">
        <div className="league-details-title">
          <img src={league.logo} alt={league.name} />
          <div>
            <h1>{league.name}</h1>
            <span>{league.country} &bull; Season {league.season}</span>
          </div>
        </div>
        <Link to="/admin/leagues" className="btn-back">Back to Leagues</Link>
      </div>

      <div className="panels-container">
        
        {/* STANDINGS PANEL */}
        <div className="admin-panel">
          <div className="panel-header">
            <h2>League Standings</h2>
            <button className="btn-add" onClick={() => openStandingModal()}>+ Add Club</button>
          </div>
          <table className="admin-list-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Club</th>
                <th>P</th>
                <th>Pts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {standings.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.position}</strong></td>
                  <td>{s.club}</td>
                  <td>{s.played}</td>
                  <td><strong>{s.points}</strong></td>
                  <td>
                    <button style={{marginRight: '8px', color: '#176b43', background:'none', border:'none', cursor:'pointer'}} onClick={() => openStandingModal(s)}>Edit</button>
                    <button style={{color: 'red', background:'none', border:'none', cursor:'pointer'}} onClick={() => deleteStanding(s.id)}>Del</button>
                  </td>
                </tr>
              ))}
              {standings.length === 0 && <tr><td colSpan="5">No standings available.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* TOP SCORERS PANEL */}
        <div className="admin-panel">
          <div className="panel-header">
            <h2>Top Scorers</h2>
            <button className="btn-add" onClick={() => openScorerModal()}>+ Add Scorer</button>
          </div>
          <table className="admin-list-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Club</th>
                <th>Goals</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topScorers.map(ts => (
                <tr key={ts.id}>
                  <td><strong>{ts.rank_no}</strong></td>
                  <td>{ts.player}</td>
                  <td>{ts.club}</td>
                  <td><strong>{ts.goals}</strong></td>
                  <td>
                    <button style={{marginRight: '8px', color: '#176b43', background:'none', border:'none', cursor:'pointer'}} onClick={() => openScorerModal(ts)}>Edit</button>
                    <button style={{color: 'red', background:'none', border:'none', cursor:'pointer'}} onClick={() => deleteScorer(ts.id)}>Del</button>
                  </td>
                </tr>
              ))}
              {topScorers.length === 0 && <tr><td colSpan="5">No top scorers available.</td></tr>}
            </tbody>
          </table>
        </div>

      </div>

      {/* STANDING MODAL */}
      {showStandingModal && (
        <div className="modal-overlay">
          <div className="modal-content-large">
            <h2>{editingStanding ? "Edit Standing" : "Add Standing"}</h2>
            <form onSubmit={saveStanding}>
              <div className="form-grid-2">
                <div className="form-group"><label>Position</label><input type="number" required value={standingForm.position} onChange={e => setStandingForm({...standingForm, position: e.target.value})} /></div>
                <div className="form-group"><label>Club Name</label><input type="text" required value={standingForm.club} onChange={e => setStandingForm({...standingForm, club: e.target.value})} /></div>
                <div className="form-group"><label>Played</label><input type="number" required value={standingForm.played} onChange={e => setStandingForm({...standingForm, played: e.target.value})} /></div>
                <div className="form-group"><label>Points</label><input type="number" required value={standingForm.points} onChange={e => setStandingForm({...standingForm, points: e.target.value})} /></div>
                <div className="form-group"><label>Won</label><input type="number" value={standingForm.won} onChange={e => setStandingForm({...standingForm, won: e.target.value})} /></div>
                <div className="form-group"><label>Drawn</label><input type="number" value={standingForm.drawn} onChange={e => setStandingForm({...standingForm, drawn: e.target.value})} /></div>
                <div className="form-group"><label>Lost</label><input type="number" value={standingForm.lost} onChange={e => setStandingForm({...standingForm, lost: e.target.value})} /></div>
                <div className="form-group"><label>GF</label><input type="number" value={standingForm.gf} onChange={e => setStandingForm({...standingForm, gf: e.target.value})} /></div>
                <div className="form-group"><label>GA</label><input type="number" value={standingForm.ga} onChange={e => setStandingForm({...standingForm, ga: e.target.value})} /></div>
                <div className="form-group"><label>GD</label><input type="number" value={standingForm.gd} onChange={e => setStandingForm({...standingForm, gd: e.target.value})} /></div>
                <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Form (e.g. W,D,L,W,W)</label><input type="text" value={standingForm.form} onChange={e => setStandingForm({...standingForm, form: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowStandingModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save Standing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCORER MODAL */}
      {showScorerModal && (
        <div className="modal-overlay">
          <div className="modal-content-large" style={{maxWidth: '450px'}}>
            <h2>{editingScorer ? "Edit Top Scorer" : "Add Top Scorer"}</h2>
            <form onSubmit={saveScorer}>
              <div className="form-group"><label>Rank #</label><input type="number" required value={scorerForm.rank_no} onChange={e => setScorerForm({...scorerForm, rank_no: e.target.value})} /></div>
              <div className="form-group"><label>Player Name</label><input type="text" required value={scorerForm.player} onChange={e => setScorerForm({...scorerForm, player: e.target.value})} /></div>
              <div className="form-group"><label>Club</label><input type="text" required value={scorerForm.club} onChange={e => setScorerForm({...scorerForm, club: e.target.value})} /></div>
              <div className="form-group"><label>Goals</label><input type="number" required value={scorerForm.goals} onChange={e => setScorerForm({...scorerForm, goals: e.target.value})} /></div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowScorerModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save Scorer</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminLeagueDetails;
