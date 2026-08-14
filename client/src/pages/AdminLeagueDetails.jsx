import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./AdminLeagueDetails.css";

const API_URL = "http://localhost:5001/api/leagues";
import bplLogo from "../assets/logos/bpl.jpg";
import uclLogo from "../assets/logos/ucl.webp";
import fedCupLogo from "../assets/logos/federation-cup.jpg";

const getLeagueLogo = (leagueName) => {
  if (!leagueName) return null;
  const name = leagueName.toLowerCase();
  if (name.includes('bpl') || name.includes('bangladesh premier league')) return bplLogo;
  if (name.includes('ucl') || name.includes('champions league')) return uclLogo;
  if (name.includes('federation')) return fedCupLogo;
  return null;
};


function AdminLeagueDetails() {
  const { leagueId } = useParams();
  const [leagueData, setLeagueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState("");

  // Modals state
  const [showStandingModal, setShowStandingModal] = useState(false);
  const [showScorerModal, setShowScorerModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showMatchStatsModal, setShowMatchStatsModal] = useState(false);
  
  const [editingStanding, setEditingStanding] = useState(null);
  const [editingScorer, setEditingScorer] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);
  const [editingMatchStats, setEditingMatchStats] = useState(null);

  const [standingForm, setStandingForm] = useState({ position: "", club: "", played: "", won: "", drawn: "", lost: "", gf: "", ga: "", gd: "", points: "", form: "W,W,D,W,W", group_name: "Group 1" });
  const [activeGroup, setActiveGroup] = useState("Group 1");
  const [scorerForm, setScorerForm] = useState({ rank_no: "", player: "", club: "", goals: "" });
  const [statsForm, setStatsForm] = useState({});
  const [matchForm, setMatchForm] = useState({ home: "", away: "", homeScore: "", awayScore: "", minute: "", stadium: "", date: "", time: "", status: "UPCOMING", stage: "Regular Stage" });
  const [matchStatsData, setMatchStatsData] = useState({
    possession_home: 50, possession_away: 50,
    shots_home: 0, shots_away: 0,
    shots_on_target_home: 0, shots_on_target_away: 0,
    corners_home: 0, corners_away: 0,
    corners_home: 0, corners_away: 0,
    yellows_home: 0, yellows_away: 0,
    timeline: []
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchLeagueDetails(selectedSeason);
  }, [leagueId, selectedSeason]);

  const fetchLeagueDetails = async (seasonParam) => {
    try {
      const res = await axios.get(`${API_URL}/${leagueId}${seasonParam ? `?season=${seasonParam}` : ""}`);
      setLeagueData(res.data);
      if (!seasonParam && res.data.currentSeason) {
        setSelectedSeason(res.data.currentSeason);
      }
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
      setStandingForm({ ...standing, form: Array.isArray(standing.form) ? standing.form.join(",") : standing.form, group_name: standing.group_name || "Group 1" });
    } else {
      setEditingStanding(null);
      setStandingForm({ position: "", club: "", played: "0", won: "0", drawn: "0", lost: "0", gf: "0", ga: "0", gd: "0", points: "0", form: "W,W,W,W,W", group_name: activeGroup });
    }
    setShowStandingModal(true);
  };

  const saveStanding = async (e) => {
    e.preventDefault();
    try {
      if (editingStanding) {
        await axios.put(`${API_URL}/${leagueId}/standings/${editingStanding.id}`, { ...standingForm, season: selectedSeason }, { headers: { Authorization: `Bearer ${getToken()}` } });
      } else {
        await axios.post(`${API_URL}/${leagueId}/standings`, { ...standingForm, season: selectedSeason }, { headers: { Authorization: `Bearer ${getToken()}` } });
      }
      setShowStandingModal(false);
      fetchLeagueDetails(selectedSeason);
    } catch (err) {
      alert("Error saving standing");
    }
  };

  const deleteStanding = async (id) => {
    if(!window.confirm("Delete this standing?")) return;
    try {
      await axios.delete(`${API_URL}/${leagueId}/standings/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      fetchLeagueDetails(selectedSeason);
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
        await axios.put(`${API_URL}/${leagueId}/top-scorers/${editingScorer.id}`, { ...scorerForm, season: selectedSeason }, { headers: { Authorization: `Bearer ${getToken()}` } });
      } else {
        await axios.post(`${API_URL}/${leagueId}/top-scorers`, { ...scorerForm, season: selectedSeason }, { headers: { Authorization: `Bearer ${getToken()}` } });
      }
      setShowScorerModal(false);
      fetchLeagueDetails(selectedSeason);
    } catch (err) {
      alert("Error saving top scorer");
    }
  };

  const deleteScorer = async (id) => {
    if(!window.confirm("Delete this top scorer?")) return;
    try {
      await axios.delete(`${API_URL}/${leagueId}/top-scorers/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      fetchLeagueDetails(selectedSeason);
    } catch (err) {
      alert("Error deleting scorer");
    }
  };

  /* --- LEAGUE STATS --- */
  const openStatsModal = () => {
    setStatsForm({
      matches_played: leagueData.league.matches_played || 0,
      total_goals: leagueData.league.total_goals || 0,
      yellow_cards: leagueData.league.yellow_cards || 0,
      red_cards: leagueData.league.red_cards || 0,
      clean_sheets: leagueData.league.clean_sheets || 0,
      champion: leagueData.league.champion || "",
    });
    setShowStatsModal(true);
  };

  const saveStats = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${leagueId}`, { ...statsForm, season: selectedSeason }, { headers: { Authorization: `Bearer ${getToken()}` } });
      setShowStatsModal(false);
      fetchLeagueDetails(selectedSeason);
    } catch (err) {
      alert("Error saving stats");
    }
  };

  /* --- MATCHES CRUD --- */
  const MATCHES_API = "http://localhost:5001/api/matches";

  const openMatchModal = (match = null) => {
    if (match) {
      setEditingMatch(match);
      setMatchForm(match);
    } else {
      setEditingMatch(null);
      setMatchForm({ home: "", away: "", homeScore: "", awayScore: "", minute: "", stadium: "", date: "Today", time: "20:00", status: "UPCOMING", stage: "Regular Stage" });
    }
    setShowMatchModal(true);
  };

  const saveMatch = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...matchForm, league_id: leagueId, league: leagueData.league.name };
      if (editingMatch) {
        await axios.put(`${MATCHES_API}/${editingMatch.id}`, payload, { headers: { Authorization: `Bearer ${getToken()}` } });
      } else {
        await axios.post(MATCHES_API, payload, { headers: { Authorization: `Bearer ${getToken()}` } });
      }
      setShowMatchModal(false);
      fetchLeagueDetails(selectedSeason);
    } catch (err) {
      alert("Error saving match");
    }
  };

  const deleteMatch = async (id) => {
    if(!window.confirm("Delete this match?")) return;
    try {
      await axios.delete(`${MATCHES_API}/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      fetchLeagueDetails(selectedSeason);
    } catch (err) {
      alert("Error deleting match");
    }
  };

  const openMatchStatsModal = (match) => {
    setEditingMatchStats(match);
    let stats = match.stats || {};
    if (typeof stats === 'string') {
      try { stats = JSON.parse(stats); } catch(e) {}
    }
    let timeline = match.timeline || [];
    if (typeof timeline === 'string') {
      try { timeline = JSON.parse(timeline); } catch(e) {}
    }
    
    setMatchStatsData({
      possession_home: stats.possession_home ?? 50,
      possession_away: stats.possession_away ?? 50,
      shots_home: stats.shots_home ?? 0,
      shots_away: stats.shots_away ?? 0,
      shots_on_target_home: stats.shots_on_target_home ?? 0,
      shots_on_target_away: stats.shots_on_target_away ?? 0,
      corners_home: stats.corners_home ?? 0,
      corners_away: stats.corners_away ?? 0,
      yellows_home: stats.yellows_home ?? 0,
      yellows_away: stats.yellows_away ?? 0,
      timeline: Array.isArray(timeline) ? timeline : []
    });
    setShowMatchStatsModal(true);
  };

  const saveMatchStats = async (e) => {
    e.preventDefault();
    const token = getToken();
    const timelineArray = matchStatsData.timeline.filter(t => t.minute && t.type && t.player);
    const payload = {
      stats: {
        possession_home: Number(matchStatsData.possession_home),
        possession_away: Number(matchStatsData.possession_away),
        shots_home: Number(matchStatsData.shots_home),
        shots_away: Number(matchStatsData.shots_away),
        shots_on_target_home: Number(matchStatsData.shots_on_target_home),
        shots_on_target_away: Number(matchStatsData.shots_on_target_away),
        corners_home: Number(matchStatsData.corners_home),
        corners_away: Number(matchStatsData.corners_away),
        yellows_home: Number(matchStatsData.yellows_home),
        yellows_away: Number(matchStatsData.yellows_away),
      },
      timeline: timelineArray
    };
    
    try {
      await axios.put(`${MATCHES_API}/${editingMatchStats.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowMatchStatsModal(false);
      fetchLeagueDetails(selectedSeason);
    } catch (err) {
      alert("Error saving stats: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;
  if (!leagueData) return <div>League not found</div>;

  const { league, standings, topScorers, availableSeasons, recentMatches, upcomingFixtures } = leagueData;
  const allMatches = [...(upcomingFixtures || []), ...(recentMatches || [])];

  const getRowClass = (position) => {
    if (!leagueData || !leagueData.league || !leagueData.league.name) return '';
    const name = leagueData.league.name.toLowerCase();
    if (name.includes('ucl') || name.includes('champions league')) {
      if (position <= 8) return 'ucl-ro16';
      if (position <= 24) return 'ucl-playoff';
      return 'ucl-eliminated';
    }
    return '';
  };

  return (
    <div className="league-details-page">
      <div className="league-details-header">
        <div className="league-details-title">
          <img src={getLeagueLogo(league.name) || league.logo} alt={league.name} />
          <div>
            <h1>{league.name}</h1>
            <span>{league.country} &bull; Season 
              <input 
                list="season-options"
                value={selectedSeason} 
                onChange={(e) => setSelectedSeason(e.target.value)} 
                style={{marginLeft: '10px', padding: '4px', borderRadius: '4px', border: '1px solid #ccc', width: '100px'}}
                placeholder="New..."
              />
              <datalist id="season-options">
                {availableSeasons.map(s => <option key={s} value={s} />)}
              </datalist>
            </span>
          </div>
        </div>
        <Link to="/admin/leagues" className="btn-back">Back to Leagues</Link>
      </div>

      <div className="admin-panel" style={{marginBottom: '20px'}}>
        <div className="panel-header">
          <h2>League Global Stats</h2>
          <button className="btn-add" onClick={openStatsModal}>Edit Stats</button>
        </div>
          <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap', color: 'white'}}>
          <div style={{background: '#102417', padding: '15px', borderRadius: '8px', minWidth: '120px', border: '1px solid #1f3b2a'}}>Matches: <strong>{league.matches_played}</strong></div>
          <div style={{background: '#102417', padding: '15px', borderRadius: '8px', minWidth: '120px', border: '1px solid #1f3b2a'}}>Goals: <strong>{league.total_goals}</strong></div>
          <div style={{background: '#102417', padding: '15px', borderRadius: '8px', minWidth: '120px', border: '1px solid #1f3b2a'}}>Reds: <strong>{league.red_cards}</strong></div>
          <div style={{background: '#102417', padding: '15px', borderRadius: '8px', minWidth: '120px', border: '1px solid #1f3b2a'}}>Clean Sheets: <strong>{league.clean_sheets}</strong></div>
          <div style={{background: '#102417', padding: '15px', borderRadius: '8px', minWidth: '120px', border: '1px solid #1f3b2a'}}>Champion: <strong>{league.champion}</strong></div>
        </div>
      </div>

      <div className="panels-container">
        
        {/* STANDINGS PANEL */}
        <div className="admin-panel">
          <div className="panel-header">
            <h2>League Standings</h2>
            <button className="btn-add" onClick={() => openStandingModal()}>+ Add Club</button>
          </div>

          {/* GROUP TABS */}
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
                  background: activeGroup === g ? '#176b43' : 'transparent',
                  color: activeGroup === g ? '#fff' : '#176b43',
                  borderColor: '#176b43',
                }}
              >{g}</button>
            ))}
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
              {standings.filter(s => (s.group_name || 'Group 1') === activeGroup).map((s, i) => (
                <tr key={s.id} className={getRowClass(s.position)}>
                  <td><strong>{i + 1}</strong></td>
                  <td>{s.club}</td>
                  <td>{s.played}</td>
                  <td><strong>{s.points}</strong></td>
                  <td>
                    <button style={{marginRight: '8px', color: '#176b43', background:'none', border:'none', cursor:'pointer'}} onClick={() => openStandingModal(s)}>Edit</button>
                    <button style={{color: 'red', background:'none', border:'none', cursor:'pointer'}} onClick={() => deleteStanding(s.id)}>Del</button>
                  </td>
                </tr>
              ))}
              {standings.filter(s => (s.group_name || 'Group 1') === activeGroup).length === 0 && <tr><td colSpan="5">No standings for {activeGroup}.</td></tr>}
            </tbody>
          </table>
        </div>
        
        {leagueData && leagueData.league && (leagueData.league.name.toLowerCase().includes('ucl') || leagueData.league.name.toLowerCase().includes('champions league')) && (
          <div className="ucl-legend" style={{marginBottom: '20px', padding: '10px 15px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', display: 'flex', gap: '20px', border: '1px solid rgba(255,255,255,0.6)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: '12px', height: '12px', background: '#176b43', borderRadius: '3px'}}></span> Qualification to Round of 16</div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: '12px', height: '12px', background: '#f39c12', borderRadius: '3px'}}></span> Qualification to Play-offs</div>
          </div>
        )}

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

      {/* MATCHES PANEL */}
      <div className="admin-panel" style={{marginTop: '20px'}}>
        <div className="panel-header">
          <h2>Matches (Recent & Upcoming)</h2>
          <button className="btn-add" onClick={() => openMatchModal()}>+ Add Match</button>
        </div>
        <table className="admin-list-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Date/Time</th>
              <th>Match</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allMatches.map(m => (
              <tr key={m.id}>
                <td><span className={`status-badge ${m.status}`}>{m.status}</span></td>
                <td>{m.date} {m.time}</td>
                <td>{m.home} vs {m.away}</td>
                <td>{m.homeScore !== null ? `${m.homeScore} - ${m.awayScore}` : '-'}</td>
                <td>
                  <button style={{marginRight: '8px', color: '#176b43', background:'none', border:'none', cursor:'pointer'}} onClick={() => openMatchModal(m)}>Edit</button>
                  {m.status !== 'UPCOMING' && (
                    <button style={{marginRight: '8px', color: '#102e21', background:'none', border:'none', cursor:'pointer'}} onClick={() => openMatchStatsModal(m)}>Stats</button>
                  )}
                  <button style={{color: 'red', background:'none', border:'none', cursor:'pointer'}} onClick={() => deleteMatch(m.id)}>Del</button>
                </td>
              </tr>
            ))}
            {allMatches.length === 0 && <tr><td colSpan="5">No matches found.</td></tr>}
          </tbody>
        </table>
      </div>

      {showStandingModal && (
        <div className="modal-overlay">
          <div className="modal-content-large">
            <h2>{editingStanding ? "Edit Standing" : "Add Standing"}</h2>
            <form onSubmit={saveStanding}>
              <div className="form-grid-2">
                <div className="form-group"><label>Group</label>
                  <select value={standingForm.group_name} onChange={e => setStandingForm({...standingForm, group_name: e.target.value})} style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ccc'}}>
                    <option value="Group 1">Group 1</option>
                    <option value="Group 2">Group 2</option>
                  </select>
                </div>
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

      {/* STATS MODAL */}
      {showStatsModal && (
        <div className="modal-overlay">
          <div className="modal-content-large" style={{maxWidth: '500px'}}>
            <h2>Edit League Stats</h2>
            <form onSubmit={saveStats}>
              <div className="form-grid-2">
                <div className="form-group"><label>Matches Played</label><input type="number" required value={statsForm.matches_played} onChange={e => setStatsForm({...statsForm, matches_played: e.target.value})} /></div>
                <div className="form-group"><label>Total Goals</label><input type="number" required value={statsForm.total_goals} onChange={e => setStatsForm({...statsForm, total_goals: e.target.value})} /></div>
                <div className="form-group"><label>Yellow Cards</label><input type="number" required value={statsForm.yellow_cards} onChange={e => setStatsForm({...statsForm, yellow_cards: e.target.value})} /></div>
                <div className="form-group"><label>Red Cards</label><input type="number" required value={statsForm.red_cards} onChange={e => setStatsForm({...statsForm, red_cards: e.target.value})} /></div>
                <div className="form-group"><label>Clean Sheets</label><input type="number" required value={statsForm.clean_sheets} onChange={e => setStatsForm({...statsForm, clean_sheets: e.target.value})} /></div>
                <div className="form-group"><label>Champion</label><input type="text" required value={statsForm.champion} onChange={e => setStatsForm({...statsForm, champion: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowStatsModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save Stats</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MATCH MODAL */}
      {showMatchModal && (
        <div className="modal-overlay">
          <div className="modal-content-large">
            <h2>{editingMatch ? "Edit Match" : "Add Match"}</h2>
            <form onSubmit={saveMatch}>
              <div className="form-grid-2">
                <div className="form-group"><label>Home Team</label><input type="text" required value={matchForm.home} onChange={e => setMatchForm({...matchForm, home: e.target.value})} /></div>
                <div className="form-group"><label>Away Team</label><input type="text" required value={matchForm.away} onChange={e => setMatchForm({...matchForm, away: e.target.value})} /></div>
                <div className="form-group"><label>Home Score</label><input type="number" value={matchForm.homeScore} onChange={e => setMatchForm({...matchForm, homeScore: e.target.value})} /></div>
                <div className="form-group"><label>Away Score</label><input type="number" value={matchForm.awayScore} onChange={e => setMatchForm({...matchForm, awayScore: e.target.value})} /></div>
                <div className="form-group"><label>Date (e.g., Oct 24)</label><input type="text" required value={matchForm.date} onChange={e => setMatchForm({...matchForm, date: e.target.value})} /></div>
                <div className="form-group"><label>Time (e.g., 20:00)</label><input type="text" required value={matchForm.time} onChange={e => setMatchForm({...matchForm, time: e.target.value})} /></div>
                <div className="form-group"><label>Status (UPCOMING, FT, LIVE)</label><input type="text" required value={matchForm.status} onChange={e => setMatchForm({...matchForm, status: e.target.value})} /></div>
                <div className="form-group"><label>Stage</label><input type="text" value={matchForm.stage} onChange={e => setMatchForm({...matchForm, stage: e.target.value})} /></div>
                <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Stadium</label><input type="text" value={matchForm.stadium} onChange={e => setMatchForm({...matchForm, stadium: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowMatchModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save Match</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MATCH STATS MODAL */}
      {showMatchStatsModal && (
        <div className="modal-overlay">
          <div className="modal-content-large" style={{maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h2>Edit Match Statistics</h2>
            <form onSubmit={saveMatchStats}>
              
              <h4 style={{marginTop: '20px', marginBottom: '10px', color: '#102e21'}}>Match Statistics</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', alignItems: 'center'}}>
                <div style={{textAlign: 'center', fontWeight: 'bold'}}>{editingMatchStats.home}</div>
                <div style={{textAlign: 'center'}}>VS</div>
                <div style={{textAlign: 'center', fontWeight: 'bold'}}>{editingMatchStats.away}</div>
                
                <input type="number" required value={matchStatsData.possession_home} onChange={e => setMatchStatsData({...matchStatsData, possession_home: e.target.value})} />
                <div style={{textAlign: 'center'}}>Possession %</div>
                <input type="number" required value={matchStatsData.possession_away} onChange={e => setMatchStatsData({...matchStatsData, possession_away: e.target.value})} />
                
                <input type="number" required value={matchStatsData.shots_home} onChange={e => setMatchStatsData({...matchStatsData, shots_home: e.target.value})} />
                <div style={{textAlign: 'center'}}>Shots</div>
                <input type="number" required value={matchStatsData.shots_away} onChange={e => setMatchStatsData({...matchStatsData, shots_away: e.target.value})} />
                
                <input type="number" required value={matchStatsData.shots_on_target_home} onChange={e => setMatchStatsData({...matchStatsData, shots_on_target_home: e.target.value})} />
                <div style={{textAlign: 'center'}}>Shots on Target</div>
                <input type="number" required value={matchStatsData.shots_on_target_away} onChange={e => setMatchStatsData({...matchStatsData, shots_on_target_away: e.target.value})} />
                
                <input type="number" required value={matchStatsData.corners_home} onChange={e => setMatchStatsData({...matchStatsData, corners_home: e.target.value})} />
                <div style={{textAlign: 'center'}}>Corners</div>
                <input type="number" required value={matchStatsData.corners_away} onChange={e => setMatchStatsData({...matchStatsData, corners_away: e.target.value})} />
                
                <input type="number" required value={matchStatsData.yellows_home} onChange={e => setMatchStatsData({...matchStatsData, yellows_home: e.target.value})} />
                <div style={{textAlign: 'center'}}>Yellow Cards</div>
                <input type="number" required value={matchStatsData.yellows_away} onChange={e => setMatchStatsData({...matchStatsData, yellows_away: e.target.value})} />
              </div>

              <h4 style={{marginTop: '30px', marginBottom: '10px', color: '#102e21'}}>Timeline Events</h4>
              {matchStatsData.timeline.map((event, index) => (
                <div key={index} style={{display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center'}}>
                  <input 
                    type="text" 
                    placeholder="Min (e.g. 18')" 
                    value={event.minute} 
                    onChange={(e) => {
                      const newTimeline = [...matchStatsData.timeline];
                      newTimeline[index].minute = e.target.value;
                      setMatchStatsData({...matchStatsData, timeline: newTimeline});
                    }}
                    style={{width: '80px'}}
                  />
                  <select 
                    value={event.type}
                    onChange={(e) => {
                      const newTimeline = [...matchStatsData.timeline];
                      newTimeline[index].type = e.target.value;
                      setMatchStatsData({...matchStatsData, timeline: newTimeline});
                    }}
                  >
                    <option value="Goal">Goal ⚽</option>
                    <option value="Yellow Card">Yellow Card 🟨</option>
                    <option value="Red Card">Red Card 🟥</option>
                    <option value="Substitution">Substitution 🔄</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Player (e.g. Messi)" 
                    value={event.player} 
                    onChange={(e) => {
                      const newTimeline = [...matchStatsData.timeline];
                      newTimeline[index].player = e.target.value;
                      setMatchStatsData({...matchStatsData, timeline: newTimeline});
                    }}
                    style={{flex: 1}}
                  />
                  <button type="button" onClick={() => {
                    const newTimeline = matchStatsData.timeline.filter((_, i) => i !== index);
                    setMatchStatsData({...matchStatsData, timeline: newTimeline});
                  }} style={{color: 'red', background: 'none', border: 'none', cursor: 'pointer'}}>✖</button>
                </div>
              ))}
              
              <button type="button" onClick={() => {
                setMatchStatsData({...matchStatsData, timeline: [...matchStatsData.timeline, {minute: '', type: 'Goal', player: ''}]});
              }} style={{marginTop: '10px', padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                + Add Event
              </button>

              <div className="modal-actions" style={{marginTop: '30px'}}>
                <button type="button" className="btn-cancel" onClick={() => setShowMatchStatsModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Stats
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminLeagueDetails;
