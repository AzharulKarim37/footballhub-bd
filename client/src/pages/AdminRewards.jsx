import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";
import "./AdminRewards.css";

const API_BASE = "http://localhost:5001/api";

function AdminRewards() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await axios.get(`${API_BASE}/messages/claims`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClaims(res.data);
      } catch (error) {
        console.error("Failed to fetch claims:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchClaims();
  }, [token]);

  if (loading) return <div>Loading...</div>;

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
          <Link to="/admin/players" className="admin-nav-link">🏃 Players</Link>
          <Link to="/admin/quizzes" className="admin-nav-link">📝 Quiz Management</Link>
          <Link to="/admin/rewards" className="admin-nav-link active">🎁 Reward Claims</Link>
          <Link to="/" className="admin-nav-link">🌐 View Website</Link>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>Reward Claims</h1>
            <p>Manage and process user reward claims from quizzes</p>
          </div>

          <div className="admin-user">
            <div className="admin-avatar">{(user?.name || "A").charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.name || "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>

        <div className="admin-content">
          {claims.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎁</div>
              <p>No rewards claimed yet.</p>
            </div>
          ) : (
            <div className="reward-table-container">
              <table className="reward-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Quiz Title</th>
                    <th>Status</th>
                    <th>Claim Details (Shipping Info)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.id}>
                      <td className="user-cell">
                        <strong>{claim.user_name}</strong>
                        <br />
                        <span>{claim.user_email}</span>
                      </td>
                      <td className="quiz-cell">{claim.quiz_title}</td>
                      <td>
                        <span className={`reward-status-badge ${claim.status === 'CLAIMED' ? 'active' : 'pending'}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="details-cell">
                        {claim.status === 'CLAIMED' && claim.claim_data ? (
                          <div className="claim-details-box">
                            {Object.entries(typeof claim.claim_data === 'string' ? JSON.parse(claim.claim_data) : claim.claim_data).map(([key, value]) => (
                              <div key={key} className="detail-row">
                                <span className="detail-label">{key}:</span> 
                                <span className="detail-value">{value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="no-details">-</span>
                        )}
                      </td>
                      <td className="date-cell">{new Date(claim.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminRewards;
