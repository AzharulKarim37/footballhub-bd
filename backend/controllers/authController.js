import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import db from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

// ======================================================
// SIGNUP
// ======================================================

export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
    } = req.body;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters",
      });
    }

    // --------------------------------------------------
    // NORMALIZE EMAIL
    // --------------------------------------------------

    const normalizedEmail =
      email.trim().toLowerCase();

    // --------------------------------------------------
    // CHECK EXISTING USER
    // --------------------------------------------------

    const [existingUsers] = await db.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
      `,
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message:
          "An account with this email already exists",
      });
    }

    // --------------------------------------------------
    // HASH PASSWORD
    // --------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // --------------------------------------------------
    // VERIFICATION TOKEN
    // --------------------------------------------------

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const verificationTokenExpires =
      new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );

    // --------------------------------------------------
    // CREATE USER
    // --------------------------------------------------

    const [result] = await db.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password,
        role,
        is_verified,
        verification_token,
        verification_token_expires
      )
      VALUES (?, ?, ?, 'user', 0, ?, ?)
      `,
      [
        name.trim(),
        normalizedEmail,
        hashedPassword,
        verificationToken,
        verificationTokenExpires,
      ]
    );

    // --------------------------------------------------
    // SEND VERIFICATION EMAIL
    // --------------------------------------------------

    const verificationLink = `${FRONTEND_URL}/verify-email/${verificationToken}`;

    try {
      await sendEmail(
        normalizedEmail,
        "Verify your Football Hub BD account",
        `
        <p>Hi ${name.trim()},</p>
        <p>Thanks for signing up to Football Hub BD. Click the link below to verify your email address:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>This link expires in 24 hours.</p>
        `
      );
    } catch (emailError) {
      // Don't fail signup just because the email couldn't be sent —
      // the user can still verify later, and the link is also returned below.
      console.error(
        "Failed to send verification email:",
        emailError.message
      );
    }

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(201).json({
      message: "Account created successfully",

      user: {
        id: result.insertId,
        name: name.trim(),
        email: normalizedEmail,
        role: "user",
        is_verified: false,
      },

      // Returned so the signup page can show/copy it directly —
      // useful in dev when EMAIL_USER/EMAIL_PASS aren't configured.
      verificationLink,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Server error during signup",
    });
  }
};

// ======================================================
// LOGIN
// ======================================================

export const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    // --------------------------------------------------
    // NORMALIZE EMAIL
    // --------------------------------------------------

    const normalizedEmail =
      email.trim().toLowerCase();

    // --------------------------------------------------
    // FIND USER
    // --------------------------------------------------

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        password,
        role,
        is_verified
      FROM users
      WHERE email = ?
      `,
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const user = users[0];

    // --------------------------------------------------
    // CHECK PASSWORD
    // --------------------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // --------------------------------------------------
    // CREATE JWT
    // --------------------------------------------------

    if (!process.env.JWT_SECRET) {
      console.error(
        "❌ JWT_SECRET is missing from .env"
      );

      return res.status(500).json({
        message:
          "Server configuration error",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: Boolean(
          user.is_verified
        ),
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

// ======================================================
// GET CURRENT USER
// ======================================================

export const getCurrentUser = async (
  req,
  res
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required",
      });
    }

    return res.status(200).json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        is_verified: Boolean(
          req.user.is_verified
        ),
      },
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ======================================================
// VERIFY EMAIL
// ======================================================

export const verifyEmail = async (
  req,
  res
) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message:
          "Verification token is required",
      });
    }

    // --------------------------------------------------
    // FIND USER
    // --------------------------------------------------

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        is_verified,
        verification_token_expires
      FROM users
      WHERE verification_token = ?
      `,
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({
        message:
          "Invalid verification token",
      });
    }

    const user = users[0];

    // --------------------------------------------------
    // CHECK EXPIRATION
    // --------------------------------------------------

    if (
      !user.verification_token_expires ||
      new Date(
        user.verification_token_expires
      ) < new Date()
    ) {
      return res.status(400).json({
        message:
          "Verification token has expired",
      });
    }

    // --------------------------------------------------
    // VERIFY USER
    // --------------------------------------------------

    await db.query(
      `
      UPDATE users
      SET
        is_verified = 1,
        verification_token = NULL,
        verification_token_expires = NULL
      WHERE id = ?
      `,
      [user.id]
    );

    return res.status(200).json({
      message:
        "Email verified successfully",
    });
  } catch (error) {
    console.error(
      "Email verification error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during email verification",
    });
  }
};

// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const [users] = await db.query(
      `
      SELECT id, name, email
      FROM users
      WHERE email = ?
      `,
      [normalizedEmail]
    );

    // --------------------------------------------------
    // ALWAYS RESPOND WITH THE SAME MESSAGE
    // (don't reveal whether an email exists)
    // --------------------------------------------------

    const genericResponse = {
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };

    if (users.length === 0) {
      return res.status(200).json(genericResponse);
    }

    const user = users[0];

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    const resetTokenExpires = new Date(
      Date.now() + 60 * 60 * 1000
    ); // 1 hour

    await db.query(
      `
      UPDATE users
      SET reset_token = ?, reset_token_expires = ?
      WHERE id = ?
      `,
      [resetToken, resetTokenExpires, user.id]
    );

    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail(
        user.email,
        "Reset your Football Hub BD password",
        `
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your password. Click the link below to choose a new one:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        `
      );
    } catch (emailError) {
      console.error(
        "Failed to send reset email:",
        emailError.message
      );
    }

    return res.status(200).json({
      ...genericResponse,
      // Returned so the page can show/copy it directly —
      // useful in dev when EMAIL_USER/EMAIL_PASS aren't configured.
      resetLink,
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during password reset request",
    });
  }
};

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPassword = async (
  req,
  res
) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Reset token is required",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message:
          "Password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters",
      });
    }

    const [users] = await db.query(
      `
      SELECT id, reset_token_expires
      FROM users
      WHERE reset_token = ?
      `,
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    const user = users[0];

    if (
      !user.reset_token_expires ||
      new Date(user.reset_token_expires) < new Date()
    ) {
      return res.status(400).json({
        message: "Reset token has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await db.query(
      `
      UPDATE users
      SET
        password = ?,
        reset_token = NULL,
        reset_token_expires = NULL
      WHERE id = ?
      `,
      [hashedPassword, user.id]
    );

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during password reset",
    });
  }
};