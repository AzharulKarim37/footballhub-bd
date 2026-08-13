import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "http://localhost:5001/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email:
              formData.email.trim(),
            password:
              formData.password,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from server"
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Login failed"
        );
      }

      // ==================================================
      // SAVE LOGIN INFORMATION
      // ==================================================

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // ==================================================
      // REDIRECT BASED ON ROLE
      // ==================================================

      if (
        data.user &&
        data.user.role === "admin"
      ) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      // This specifically handles actual
      // connection/CORS/server problems.
      if (
        error instanceof TypeError &&
        error.message ===
          "Failed to fetch"
      ) {
        setError(
          "Cannot connect to the server. Make sure the backend is running on port 5001."
        );
      } else {
        setError(
          error.message ||
            "Unable to connect to server"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-brand">
        <img
          src="/src/assets/logos/logo.png"
          alt="Football Hub BD"
        />

        <h1>Welcome Back</h1>

        <p>
          Sign in to continue to Football Hub BD
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "#ffe8e8",
            color: "#c62828",
            padding: "10px 12px",
            borderRadius: "8px",
            marginBottom: "18px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <div className="password-wrapper">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>
        </div>

        <div className="auth-options">
          <label className="remember-me">
            <input type="checkbox" />
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading
            ? "Signing In..."
            : "Sign In"}
        </button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/signup">
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;