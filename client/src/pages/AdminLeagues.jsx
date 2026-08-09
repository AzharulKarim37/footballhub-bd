import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLeagues.css";
import "./AdminMatches.css";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5001/api/leagues";

function AdminLeagues() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingLeague, setEditingLeague] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    country: "Bangladesh",
    season: "2025-26",
    clubs: 10,
    champion: "",
    description: "",
    logo: "/assets/logos/bpl.jpg",
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setLeagues(res.data || []);
    } catch (err) {
      console.error("Error fetching leagues:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (league = null) => {
    if (league) {
      setEditingLeague(league);
      setFormData({
        id: league.id || "",
        name: league.name || "",
        country: league.country || "Bangladesh",
        season: league.season || "2025-26",
        clubs: league.clubs || 10,
        champion: league.champion || "",
        description: league.description || "",
        logo: league.logo || "/assets/logos/bpl.jpg",
      });
    } else {
      setEditingLeague(null);
      setFormData({
        id: "",
        name: "",
        country: "Bangladesh",
        season: "2025-26",
        clubs: 10,
        champion: "",
        description: "",
        logo: "/assets/logos/bpl.jpg",
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = getToken();

    const payload = {
      ...formData,
      clubs: Number(formData.clubs),
    };

    try {
      if (editingLeague) {
        await axios.put(`${API_URL}/${editingLeague.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      fetchLeagues();
    } catch (err) {
      alert("Failed to save league: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete competition "${name}" and all its standings/scorers?`)) return;
    const token = getToken();
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLeagues();
    } catch (err) {
      alert("Failed to delete league: " + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredLeagues = leagues.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.country.toLowerCase().includes(search.toLowerCase())
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
          <Link to="/admin/matches" className="admin-nav-link">⚽ Matches</Link>
          <Link to="/admin/leagues" className="admin-nav-link active">🏆 Leagues</Link>
          <Link to="/admin/players" className="admin-nav-link">🏃 Players</Link>
          <Link to="/admin/quizzes" className="admin-nav-link">📝 Quiz Management</Link>
          <Link to="/" className="admin-nav-link">🌐 View Website</Link>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>League & Competition Management</h1>
            <p>Add, update, and manage football leagues and tournaments</p>
          </div>
          <div className="admin-user">
            <div className="admin-avatar">{(user?.name || "A").charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.name || "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>

        <div className="admin-league-controls">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search competition or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-primary" onClick={() => handleOpenModal()}>
            + Add New League
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#176b43" }}>
            Loading Competitions...
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Competition Name</th>
                  <th>Country</th>
                  <th>Season</th>
                  <th>Clubs</th>
                  <th>Current Champion</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeagues.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#888" }}>
                      No competitions found.
                    </td>
                  </tr>
                ) : (
                  filteredLeagues.map((l) => (
                    <tr key={l.id}>
                      <td><code>{l.id}</code></td>
                      <td><strong>{l.name}</strong></td>
                      <td>{l.country}</td>
                      <td>{l.season}</td>
                      <td>{l.clubs}</td>
                      <td>{l.champion}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" onClick={() => handleOpenModal(l)}>
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(l.id, l.name)}>
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
              <h2>{editingLeague ? "Edit League" : "Add New League"}</h2>
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Competition Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>League ID (Slug, e.g. bpl, ucl)</label>
                    <input
                      type="text"
                      disabled={!!editingLeague}
                      placeholder="e.g. bpl"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Country / Region</label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Season</label>
                    <input
                      type="text"
                      required
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Number of Clubs</label>
                    <input
                      type="number"
                      value={formData.clubs}
                      onChange={(e) => setFormData({ ...formData, clubs: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Reigning Champion</label>
                    <input
                      type="text"
                      value={formData.champion}
                      onChange={(e) => setFormData({ ...formData, champion: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      rows="3"
                      style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingLeague ? "Save Changes" : "Create League"}
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

export default AdminLeagues;
