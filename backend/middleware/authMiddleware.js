import jwt from "jsonwebtoken";
import db from "../config/db.js";


// ======================================================
// AUTHENTICATE USER
// ======================================================

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const token = parts[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        is_verified
      FROM users
      WHERE id = ?
      `,
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = users[0];

    next();

  } catch (error) {

    console.error("Authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


// ======================================================
// ADMIN ONLY
// ======================================================

export const requireAdmin = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};