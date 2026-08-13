import express from "express";

import {
  signup,
  login,
  verifyEmail,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// SIGNUP
// ======================================================

router.post("/signup", signup);

// ======================================================
// LOGIN
// ======================================================

router.post("/login", login);

// ======================================================
// GET CURRENT USER
// ======================================================

router.get(
  "/me",
  authenticate,
  getCurrentUser
);

// ======================================================
// EMAIL VERIFICATION
// ======================================================

router.get(
  "/verify-email/:token",
  verifyEmail
);

// ======================================================
// PASSWORD RESET
// ======================================================

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);

export default router;