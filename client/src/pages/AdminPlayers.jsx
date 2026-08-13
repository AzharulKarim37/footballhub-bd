import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPlayers.css";
import "./AdminMatches.css";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5001/api/players";

function AdminPlayers() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    club: "Bashundhara Kings",
    position: "Midfielder",
    number: 10,
    nationality: "Bangladesh",
    goals: 0,
    assists: 0,
    image: "/src/assets/players/jamal-bhuyanjpg.webp",
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setPlayers(res.data || []);
    } catch (err) {
      console.error("Error fetching players:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (player = null) => {
    if (player) {
      setEditingPlayer(player);
      setFormData({
        name: player.name || "",
        club: player.club || "Bashundhara Kings",
        position: player.position || "Midfielder",
        number: player.number || 10,
        nationality: player.nationality || "Bangladesh",
        goals: player.goals || 0,
        assists: player.assists || 0,
        image: player.image || "/src/assets/players/jamal-bhuyanjpg.webp",
      });
    } else {
      setEditingPlayer(null);
      setFormData({
        name: "",
        club: "Bashundhara Kings",
        position: "Midfielder",
        number: 10,
        nationality: "Bangladesh",
        goals: 0,
        assists: 0,
        image: "/src/assets/players/jamal-bhuyanjpg.webp",
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = getToken();

    const payload = {
      ...formData,
      number: Number(formData.number),
      goals: Number(formData.goals),
      assists: Number(formData.assists),
    };

    try {
      if (editingPlayer) {
        await axios.put(`${API_URL}/${editingPlayer.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      fetchPlayers();
    } catch (err) {
      alert("Failed to save player: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete player profile for "${name}"?`)) return;
    const token = getToken();
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPlayers();
    } catch (err) {
      alert("Failed to delete player: " + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredPlayers = players.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.club.toLowerCase().includes(search.toLowerCase()) ||
      p.position.toLowerCase().includes(search.toLowerCase())
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
          <Link to="/admin/leagues" className="admin-nav-link">🏆 Leagues</Link>
          <Link to="/admin/players" className="admin-nav-link active">🏃 Players</Link>
          <Link to="/admin/quizzes" className="admin-nav-link">📝 Quiz Management</Link>
          <Link to="/" className="admin-nav-link">🌐 View Website</Link>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>Player Management</h1>
            <p>Add, update, and remove player statistics and profiles</p>
          </div>
          <div className="admin-user">
            <div className="admin-avatar">{(user?.name || "A").charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.name || "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>

        <div className="admin-player-controls">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search player name, club, or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-primary" onClick={() => handleOpenModal()}>
            + Add New Player
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#176b43" }}>
            Loading Players...
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Club</th>
                  <th>Position</th>
                  <th>Squad #</th>
                  <th>Nationality</th>
                  <th>Goals</th>
                  <th>Assists</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#888" }}>
                      No players found.
                    </td>
                  </tr>
                ) : (
                  filteredPlayers.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name}</strong>
                      </td>
                      <td>{p.club}</td>
                      <td>{p.position}</td>
                      <td>#{p.number}</td>
                      <td>{p.nationality}</td>
                      <td>{p.goals}</td>
                      <td>{p.assists}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" onClick={() => handleOpenModal(p)}>
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(p.id, p.name)}>
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
              <h2>{editingPlayer ? "Edit Player" : "Add New Player"}</h2>
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Club</label>
                    <input
                      type="text"
                      required
                      value={formData.club}
                      onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Position</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    >
                      <option value="Forward">Forward</option>
                      <option value="Winger">Winger</option>
                      <option value="Midfielder">Midfielder</option>
                      <option value="Defender">Defender</option>
                      <option value="Goalkeeper">Goalkeeper</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Squad Number</label>
                    <input
                      type="number"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Nationality</label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Goals</label>
                    <input
                      type="number"
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Assists</label>
                    <input
                      type="number"
                      value={formData.assists}
                      onChange={(e) => setFormData({ ...formData, assists: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Image URL / Path</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingPlayer ? "Save Changes" : "Create Player"}
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

export default AdminPlayers;
