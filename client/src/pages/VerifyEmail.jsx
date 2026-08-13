import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import "./Login.css";

import logo from "../assets/logos/logo.png";

const API_URL = "http://localhost:5001/api";

function VerifyEmail() {
  const { token } = useParams();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(
          `${API_URL}/auth/verify-email/${token}`
        );

        let data;

        try {
          data = await response.json();
        } catch {
          throw new Error("Invalid response from server");
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Verification failed"
          );
        }

        setStatus("success");
        setMessage(
          data.message || "Email verified successfully"
        );
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");

        if (
          error instanceof TypeError &&
          error.message === "Failed to fetch"
        ) {
          setMessage(
            "Cannot connect to the server. Make sure the backend is running on port 5001."
          );
        } else {
          setMessage(
            error.message || "This verification link is invalid or has expired."
          );
        }
      }
    };

    if (token) {
      verify();
    } else {
      setStatus("error");
      setMessage("No verification token provided.");
    }
  }, [token]);

  return (
    <div className="auth-page">
      <div className="ticket">
        <div className="ticket-stub">
          <img className="crest" src={logo} alt="Football Hub BD" />

          <span className="ticket-eyebrow">HUB PASS</span>

          <div className="ticket-stub-mid">
            <span>EMAIL VERIFICATION &middot; FOOTBALL HUB BD &middot; SEASON 2025/26</span>
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
            <h1>Verify Email</h1>

            <p>Confirming your account</p>
          </div>

          {status === "loading" && (
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                color: "#93a89b",
                fontSize: 14,
                padding: "10px 0",
              }}
            >
              <Loader2
                size={20}
                style={{
                  animation: "spin 1s linear infinite",
                }}
              />
              Verifying your email address...
            </div>
          )}

          {status === "success" && (
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
                {message}
              </span>
            </div>
          )}

          {status === "error" && (
            <div className="auth-error">{message}</div>
          )}

          {status !== "loading" && (
            <p className="auth-switch">
              <Link to="/login">Go to sign in</Link>
            </p>
          )}
        </div>
      </div>

      <style>
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}

export default VerifyEmail;