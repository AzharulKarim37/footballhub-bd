import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, User, Menu, X, Shield, Sparkles } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import logo from "../../assets/logos/logo.png";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobile = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <nav className="navbar">
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMobile}>
          <div className="logo-img-wrapper">
            <img src={logo} alt="Football Hub BD" />
          </div>
          <div className="logo-text">
            <span className="logo-brand">FOOTBALL HUB</span>
            <span className="logo-sub">BANGLADESH</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/matches">Matches</NavLink>
          </li>
          <li>
            <NavLink to="/leagues">Leagues</NavLink>
          </li>
          <li>
            <NavLink to="/teams">Teams</NavLink>
          </li>
          <li>
            <NavLink to="/players">Players</NavLink>
          </li>
          <li>
            <NavLink to="/news">News</NavLink>
          </li>
          <li>
            <NavLink to="/quiz" className="nav-quiz-link">
              <Sparkles size={14} className="quiz-spark" />
              Quiz
            </NavLink>
          </li>
        </ul>

        {/* Right Action Controls */}
        <div className="nav-right">
          {isAuthenticated ? (
            <div className="nav-auth-group">
              <Link
                to={user?.role === "admin" ? "/admin/dashboard" : "/profile"}
                className="user-chip"
                title={user?.name || "Account"}
              >
                <div className="user-avatar-badge">
                  {user?.role === "admin" ? (
                    <Shield size={14} />
                  ) : (
                    <User size={14} />
                  )}
                </div>
                <span className="user-name-text">{user?.name || "Profile"}</span>
              </Link>

              <button
                className="logout-btn"
                onClick={handleLogout}
                title="Sign out"
              >
                <LogOut size={16} />
                <span className="logout-text">Logout</span>
              </button>
            </div>
          ) : (
            <div className="nav-guest-group">
              <Link to="/login" className="login-btn">
                Sign In
              </Link>
              <Link to="/signup" className="signup-btn">
                Join Hub
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <ul className="mobile-nav-links">
            <li>
              <NavLink to="/" end onClick={closeMobile}>
                ⚽ Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/matches" onClick={closeMobile}>
                📅 Match Center
              </NavLink>
            </li>
            <li>
              <NavLink to="/leagues" onClick={closeMobile}>
                🏆 Leagues &amp; Cups
              </NavLink>
            </li>
            <li>
              <NavLink to="/teams" onClick={closeMobile}>
                🛡️ Teams
              </NavLink>
            </li>
            <li>
              <NavLink to="/players" onClick={closeMobile}>
                🏃 Players
              </NavLink>
            </li>
            <li>
              <NavLink to="/news" onClick={closeMobile}>
                📰 Latest News
              </NavLink>
            </li>
            <li>
              <NavLink to="/quiz" onClick={closeMobile}>
                ✨ Football Quiz
              </NavLink>
            </li>
          </ul>

          <div className="mobile-drawer-footer">
            {isAuthenticated ? (
              <div className="mobile-user-box">
                <Link
                  to={user?.role === "admin" ? "/admin/dashboard" : "/profile"}
                  className="mobile-profile-link"
                  onClick={closeMobile}
                >
                  <User size={18} />
                  <span>{user?.name}</span>
                </Link>
                <button className="mobile-logout-btn" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/login" className="mobile-login-btn" onClick={closeMobile}>
                  Sign In
                </Link>
                <Link to="/signup" className="mobile-signup-btn" onClick={closeMobile}>
                  Join Hub
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;