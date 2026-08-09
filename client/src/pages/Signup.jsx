import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

import logo from "../assets/logos/logo.png";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [verificationLink, setVerificationLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setVerificationLink("");
    setCopied(false);

    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!formData.password) {
      alert("Please enter a password.");
      return;
    }

    if (!formData.confirmPassword) {
      alert("Please confirm your password.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5001/api/auth/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Unable to create account."
        );
        return;
      }

      /*
        Your current backend may not return
        verificationLink yet.

        If it does return one, we display it.
      */
      setVerificationLink(
        data.verificationLink || ""
      );

      alert(
        data.message ||
          "Account created successfully!"
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Signup error:", error);

      alert(
        "Unable to connect to the server.\n\n" +
          "Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        verificationLink
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy verification link:",
        error
      );

      alert(
        "Could not copy automatically. " +
          "Please select the link and copy it manually."
      );
    }
  };

  return (
    <div className="auth-container">

      {/* BRAND */}

      <div className="auth-brand">
        <img
          src={logo}
          alt="Football Hub BD"
        />

        <h1>Create Account</h1>

        <p>
          Join the Football Hub BD community
        </p>
      </div>

      {/* SIGNUP FORM */}

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        {/* Full Name */}

        <div className="form-group">
          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}

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

        {/* Password */}

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
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

        {/* Confirm Password */}

        <div className="form-group">
          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        {/* Submit */}

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>

        {/* Login */}

        <p className="auth-switch">
          Already have an account?

          <Link to="/login">
            Sign In
          </Link>
        </p>

      </form>

      {/* VERIFICATION LINK */}

      {verificationLink && (
        <div className="verification-box">

          <div className="verification-icon">
            ✓
          </div>

          <h2>
            Account Created Successfully!
          </h2>

          <p className="verification-message">
            Your account has been created.
            Please verify your email before
            continuing.
          </p>

          <p className="development-message">
            Development Mode
          </p>

          <p className="verification-instruction">
            Since email sending is not configured
            yet, use the verification link below.
          </p>

          <div className="verification-link">
            {verificationLink}
          </div>

          <button
            type="button"
            className="copy-link-btn"
            onClick={handleCopyLink}
          >
            {copied
              ? "✓ Link Copied!"
              : "Copy Verification Link"}
          </button>

          <a
            href={verificationLink}
            className="open-verification-btn"
          >
            Open Verification Link
          </a>

        </div>
      )}

    </div>
  );
}

export default Signup;