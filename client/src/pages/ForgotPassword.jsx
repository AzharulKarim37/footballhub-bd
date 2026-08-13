import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import "./Login.css";

import logo from "../assets/logos/logo.png";

const API_URL = "http://localhost:5001/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
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
          data.message || "Something went wrong"
        );
      }

      setSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);

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
            <span>PASSWORD RESET &middot; FOOTBALL HUB BD &middot; SEASON 2025/26</span>
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
            <h1>Forgot Password</h1>

            <p>
              {sent
                ? "Check your inbox for the reset link"
                : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {sent ? (
            <div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  background: "rgba(183,255,0,0.08)",
                  border: "1px solid rgba(183,255,0,0.25)",
                  borderRadius: 10,
                  padding: "14px 16px",
                  marginBottom: 22,
                }}
              >
                <CheckCircle2
                  size={20}
                  style={{ color: "#b7ff00", flexShrink: 0, marginTop: 2 }}
                />
                <span style={{ fontSize: 13.5, color: "#cfe8d8" }}>
                  If an account exists for <b>{email}</b>, a password reset
                  link is on its way. It expires in 1 hour.
                </span>
              </div>

              <p className="auth-switch">
                <Link to="/login">Back to sign in</Link>
              </p>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>

                <div className="field-wrapper">
                  <Mail className="field-icon" />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your account email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                {loading ? "Sending..." : "Send Reset Link"}
                {!loading && <ArrowRight />}
              </button>

              <p className="auth-switch" style={{ marginTop: 20 }}>
                Remembered your password?{" "}
                <Link to="/login">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;