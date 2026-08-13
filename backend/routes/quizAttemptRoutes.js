import express from "express";

import {
  submitQuizAttempt,
  getMyQuizAttempts,
  getMyBestQuizAttempt,
} from "../controllers/quizAttemptController.js";

import {
  authenticate,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// SUBMIT QUIZ ATTEMPT
// ======================================================

router.post(
  "/",
  authenticate,
  submitQuizAttempt
);

// ======================================================
// GET MY QUIZ HISTORY
// ======================================================

router.get(
  "/my",
  authenticate,
  getMyQuizAttempts
);

// ======================================================
// GET MY BEST ATTEMPT
// ======================================================

router.get(
  "/my/:quizId/best",
  authenticate,
  getMyBestQuizAttempt
);

export default router;