import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import "./Login.css";

import logo from "../assets/logos/logo.png";

const API_URL = "http://localhost:5001/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reset password"
        );
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      console.error("Reset password error:", error);

      if (
        error instanceof TypeError &&
        error.message === "Failed to fetch"
      ) {
        setError(
          "Cannot connect to the server. Make sure the backend is running on port 5001."
        );
      } else {
        setError(
          error.message || "Unable to connect to server"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="ticket">
        <div className="ticket-stub">
          <img className="crest" src={logo} alt="Football Hub BD" />

          <span className="ticket-eyebrow">HUB PASS</span>

          <div className="ticket-stub-mid">
            <span>NEW PASSWORD &middot; FOOTBALL HUB BD &middot; SEASON 2025/26</span>
          </div>

          <div className="ticket-meta">
            <div>
              GATE
              <b>07</b>
            </div>
            <div>
              SEC
              <b>BPL</b>
            </div>
          </div>

          <div className="ticket-barcode" />
        </div>

        <div className="ticket-perforation" />

        <div className="ticket-form-panel">
          <div className="auth-brand">
            <h1>Reset Password</h1>

            <p>
              {success
                ? "Your password has been updated"
                : "Choose a new password for your account"}
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {success ? (
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                background: "rgba(183,255,0,0.08)",
                border: "1px solid rgba(183,255,0,0.25)",
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <CheckCircle2
                size={20}
                style={{ color: "#b7ff00", flexShrink: 0, marginTop: 2 }}
              />
              <span style={{ fontSize: 13.5, color: "#cfe8d8" }}>
                Password updated. Redirecting you to sign in...
              </span>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>New Password</label>

                <div className="field-wrapper password-wrapper">
                  <Lock className="field-icon" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter a new password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>

                <div className="field-wrapper">
                  <Lock className="field-icon" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter the new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
                style={{ marginTop: 8 }}
              >
                {loading ? "Updating..." : "Update Password"}
                {!loading && <ArrowRight />}
              </button>

              <p className="auth-switch" style={{ marginTop: 20 }}>
                <Link to="/login">Back to sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;