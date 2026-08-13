import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminMatches.css";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5001/api/matches";

function AdminMatches() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [formData, setFormData] = useState({
    league: "Bangladesh Premier League",
    stage: "Matchday 15",
    status: "TODAY",
    date: "04 Aug 2026",
    time: "20:00",
    home: "",
    away: "",
    homeScore: "",
    awayScore: "",
    minute: "",
    stadium: "Bangabandhu Stadium",
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchMatches();
  }, [statusFilter]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        params: { status: statusFilter },
      });
      setMatches(res.data || []);
    } catch (err) {
      console.error("Error fetching matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (match = null) => {
    if (match) {
      setEditingMatch(match);
      setFormData({
        league: match.league || "Bangladesh Premier League",
        stage: match.stage || "Matchday 15",
        status: match.status || "TODAY",
        date: match.date || "04 Aug 2026",
        time: match.time || "20:00",
        home: match.home || "",
        away: match.away || "",
        homeScore: match.homeScore !== null ? match.homeScore : "",
        awayScore: match.awayScore !== null ? match.awayScore : "",
        minute: match.minute || "",
        stadium: match.stadium || "",
      });
    } else {
      setEditingMatch(null);
      setFormData({
        league: "Bangladesh Premier League",
        stage: "Matchday 15",
        status: "TODAY",
        date: "04 Aug 2026",
        time: "20:00",
        home: "",
        away: "",
        homeScore: "",
        awayScore: "",
        minute: "",
        stadium: "Kings Arena",
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = getToken();

    const payload = {
      ...formData,
      homeScore: formData.homeScore !== "" ? Number(formData.homeScore) : null,
      awayScore: formData.awayScore !== "" ? Number(formData.awayScore) : null,
    };

    try {
      if (editingMatch) {
        await axios.put(`${API_URL}/${editingMatch.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      fetchMatches();
    } catch (err) {
      alert("Failed to save match: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete match "${title}"?`)) return;
    const token = getToken();
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMatches();
    } catch (err) {
      alert("Failed to delete match: " + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredMatches = matches.filter(
    (m) =>
      m.home.toLowerCase().includes(search.toLowerCase()) ||
      m.away.toLowerCase().includes(search.toLowerCase()) ||
      m.league.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src="/src/assets/logos/logo.png" alt="Football Hub BD" />
          <h2>Football Hub BD</h2>
          <span>ADMIN PANEL</span>
        </div>

        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-nav-link">📊 Dashboard</Link>
          <Link to="/admin/matches" className="admin-nav-link active">⚽ Matches</Link>
          <Link to="/admin/leagues" className="admin-nav-link">🏆 Leagues</Link>
          <Link to="/admin/players" className="admin-nav-link">🏃 Players</Link>
          <Link to="/admin/quizzes" className="admin-nav-link">📝 Quiz Management</Link>
          <Link to="/" className="admin-nav-link">🌐 View Website</Link>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>Match Management</h1>
            <p>Create, update scores, status, and edit fixtures</p>
          </div>
          <div className="admin-user">
            <div className="admin-avatar">{(user?.name || "A").charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.name || "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>

        <div className="admin-match-controls">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search teams or leagues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="admin-select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="LIVE">🔴 LIVE</option>
            <option value="TODAY">📅 TODAY</option>
            <option value="UPCOMING">⏳ UPCOMING</option>
            <option value="FT">✅ FINISHED (FT)</option>
          </select>

          <button className="btn-primary" onClick={() => handleOpenModal()}>
            + Add New Match
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#176b43" }}>
            Loading Matches...
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Match</th>
                  <th>Score</th>
                  <th>League</th>
                  <th>Stage</th>
                  <th>Stadium</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#888" }}>
                      No matches found.
                    </td>
                  </tr>
                ) : (
                  filteredMatches.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <span className={`status-badge ${m.status}`}>
                          {m.status === "LIVE" ? `🔴 ${m.minute || "LIVE"}` : m.status}
                        </span>
                      </td>
                      <td>
                        <strong>{m.home}</strong> vs <strong>{m.away}</strong>
                      </td>
                      <td>
                        {m.homeScore !== null ? `${m.homeScore} - ${m.awayScore}` : "-"}
                      </td>
                      <td>{m.league}</td>
                      <td>{m.stage}</td>
                      <td>{m.stadium}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" onClick={() => handleOpenModal(m)}>
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(m.id, `${m.home} vs ${m.away}`)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL FORM */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{editingMatch ? "Edit Match" : "Add New Match"}</h2>
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Home Team</label>
                    <input
                      type="text"
                      required
                      value={formData.home}
                      onChange={(e) => setFormData({ ...formData, home: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Away Team</label>
                    <input
                      type="text"
                      required
                      value={formData.away}
                      onChange={(e) => setFormData({ ...formData, away: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Competition / League</label>
                    <select
                      value={formData.league}
                      onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                    >
                      <option value="Bangladesh Premier League">Bangladesh Premier League</option>
                      <option value="Federation Cup">Federation Cup</option>
                      <option value="UEFA Champions League">UEFA Champions League</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Match Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="LIVE">LIVE</option>
                      <option value="TODAY">TODAY</option>
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="FT">FINISHED (FT)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Home Score</label>
                    <input
                      type="number"
                      placeholder="e.g. 2"
                      value={formData.homeScore}
                      onChange={(e) => setFormData({ ...formData, homeScore: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Away Score</label>
                    <input
                      type="number"
                      placeholder="e.g. 1"
                      value={formData.awayScore}
                      onChange={(e) => setFormData({ ...formData, awayScore: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Minute (if LIVE)</label>
                    <input
                      type="text"
                      placeholder="e.g. 67'"
                      value={formData.minute}
                      onChange={(e) => setFormData({ ...formData, minute: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Stage / Matchday</label>
                    <input
                      type="text"
                      placeholder="e.g. Matchday 15"
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Stadium / Venue</label>
                    <input
                      type="text"
                      placeholder="e.g. Kings Arena"
                      value={formData.stadium}
                      onChange={(e) => setFormData({ ...formData, stadium: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingMatch ? "Save Changes" : "Create Match"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminMatches;
