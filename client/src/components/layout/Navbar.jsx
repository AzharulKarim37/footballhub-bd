import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, LogOut, User } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";
import logo from "../../assets/logos/logo.png";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <Link to="/" className="logo">
        <img
          src={logo}
          alt="Football Hub BD"
        />
      </Link>

      {/* Navigation */}
      <ul className="nav-links">

        <li>
          <NavLink to="/">
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/news">
            News
          </NavLink>
        </li>

        <li>
          <NavLink to="/matches">
            Matches
          </NavLink>
        </li>

        <li>
          <NavLink to="/leagues">
            Leagues
          </NavLink>
        </li>

        <li>
          <NavLink to="/players">
            Players
          </NavLink>
        </li>

        <li>
          <NavLink to="/teams">
            Teams
          </NavLink>
        </li>

        <li>
          <NavLink to="/quiz">
            Quiz
          </NavLink>
        </li>

      </ul>

      {/* Right side */}
      <div className="nav-right">

        <Search
          className="search-icon"
          size={22}
        />

        {isAuthenticated ? (
          <>

            <Link to={user?.role === "admin" ? "/admin/dashboard" : "/profile"} className="user-info">
              <User size={18} />

              <span>
                {user?.name}
              </span>
            </Link>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>

          </>
        ) : (
          <>

            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="signup-btn"
            >
              Sign Up
            </Link>

          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;