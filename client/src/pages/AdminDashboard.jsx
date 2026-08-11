import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchMatches, fetchLeagues, fetchPlayers } from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [stats, setStats] = useState({
    quizzes: 0,
    matches: 0,
    leagues: 0,
    players: 0,
  });

  useEffect(() => {
    // Load counts
    Promise.all([
      fetchMatches().catch(() => []),
      fetchLeagues().catch(() => []),
      fetchPlayers().catch(() => []),
      fetch("http://localhost:5001/api/quizzes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .catch(() => ({ quizzes: [] })),
    ]).then(([matches, leagues, players, quizData]) => {
      setStats({
        matches: Array.isArray(matches) ? matches.length : 0,
        leagues: Array.isArray(leagues) ? leagues.length : 0,
        players: Array.isArray(players) ? players.length : 0,
        quizzes: quizData?.quizzes ? quizData.quizzes.length : 0,
      });
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src="/src/assets/logos/logo.png" alt="Football Hub BD" />
          <h2>Football Hub BD</h2>
          <span>ADMIN PANEL</span>
        </div>

        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-nav-link active">
            📊 Dashboard
          </Link>
          <Link to="/admin/matches" className="admin-nav-link">
            ⚽ Matches
          </Link>
          <Link to="/admin/leagues" className="admin-nav-link">
            🏆 Leagues
          </Link>
          <Link to="/admin/players" className="admin-nav-link">
            🏃 Players
          </Link>
          <Link to="/admin/quizzes" className="admin-nav-link">
            📝 Quiz Management
          </Link>
          <Link to="/admin/rewards" className="admin-nav-link">
            🎁 Reward Claims
          </Link>
          <Link to="/" className="admin-nav-link">
            🌐 View Website
          </Link>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.name || "Admin"}!</p>
          </div>

          <div className="admin-user">
            <div className="admin-avatar">
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user?.name || "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="stat-icon">⚽</div>
            <div>
              <span>Total Matches</span>
              <strong>{stats.matches}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">🏆</div>
            <div>
              <span>Total Competitions</span>
              <strong>{stats.leagues}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">🏃</div>
            <div>
              <span>Total Players</span>
              <strong>{stats.players}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">📝</div>
            <div>
              <span>Total Quizzes</span>
              <strong>{stats.quizzes}</strong>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <section className="admin-section">
          <div className="section-heading">
            <h2>Management Portal</h2>
            <p>Direct control over Football Hub BD content & entities</p>
          </div>

          <div className="quick-actions">
            <Link to="/admin/matches" className="quick-action-card">
              <div className="quick-icon">⚽</div>
              <div>
                <h3>Manage Matches</h3>
                <p>Create, update scores/status (LIVE, FT), and manage fixtures</p>
              </div>
            </Link>

            <Link to="/admin/leagues" className="quick-action-card">
              <div className="quick-icon">🏆</div>
              <div>
                <h3>Manage Leagues</h3>
                <p>Add and edit league seasons, details, and competitions</p>
              </div>
            </Link>

            <Link to="/admin/players" className="quick-action-card">
              <div className="quick-icon">🏃</div>
              <div>
                <h3>Manage Players</h3>
                <p>Add, update, and remove player statistics and profiles</p>
              </div>
            </Link>

            <Link to="/admin/quizzes" className="quick-action-card">
              <div className="quick-icon">📝</div>
              <div>
                <h3>Manage Quizzes</h3>
                <p>Build questions, toggle leaderboards, and send rewards</p>
              </div>
            </Link>
          </div>
        </section>

        {/* ADMIN INFO */}
        <section className="admin-section">
          <div className="section-heading">
            <h2>Administrator Information</h2>
          </div>

          <div className="admin-info-card">
            <div className="info-row">
              <span>Name</span>
              <strong>{user?.name || "Admin User"}</strong>
            </div>
            <div className="info-row">
              <span>Email</span>
              <strong>{user?.email || "admin@footballhub.bd"}</strong>
            </div>
            <div className="info-row">
              <span>Role</span>
              <strong className="admin-role">{user?.role || "admin"}</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;