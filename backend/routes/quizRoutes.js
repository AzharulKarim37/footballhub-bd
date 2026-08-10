import express from "express";

import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,

  addQuestion,
  updateQuestion,
  deleteQuestion,

  togglePublishQuiz,
  stopQuiz,
  resumeQuiz,
  toggleLeaderboard,

  getPublishedQuizzes,
  getPublishedQuizById,

  startQuizAttempt,
  completeQuizAttempt,
  getMyQuizAttempts,
  getQuizAttemptDetails,

  getQuizLeaderboard,
  getQuizAttempts,
  sendQuizRewards,
} from "../controllers/quizController.js";

import {
  authenticate,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
========================================================
PUBLIC / USER QUIZ ROUTES
========================================================
*/

// Published quizzes
router.get(
  "/published",
  getPublishedQuizzes
);

// Single published quiz
router.get(
  "/published/:id",
  getPublishedQuizById
);

/*
========================================================
USER ATTEMPTS
========================================================
*/

// User's own attempts
router.get(
  "/my-attempts",
  authenticate,
  getMyQuizAttempts
);

// Get specific attempt details (for review)
router.get(
  "/:quizId/attempt/:attemptId",
  authenticate,
  getQuizAttemptDetails
);

// Start a quiz attempt
router.post(
  "/:quizId/start",
  authenticate,
  startQuizAttempt
);

// Complete a quiz attempt
router.post(
  "/:quizId/complete",
  authenticate,
  completeQuizAttempt
);

// User leaderboard
router.get(
  "/:quizId/leaderboard",
  authenticate,
  getQuizLeaderboard
);

/*
========================================================
ADMIN QUIZ MANAGEMENT
========================================================
*/

// Create quiz
router.post(
  "/",
  authenticate,
  requireAdmin,
  createQuiz
);

// Get all quizzes
router.get(
  "/",
  authenticate,
  requireAdmin,
  getAllQuizzes
);

// Get one quiz including questions
router.get(
  "/:id",
  authenticate,
  requireAdmin,
  getQuizById
);

// Update quiz
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updateQuiz
);

// Delete quiz
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteQuiz
);

/*
========================================================
ADMIN QUESTION MANAGEMENT
========================================================
*/

// Add question
router.post(
  "/:quizId/questions",
  authenticate,
  requireAdmin,
  addQuestion
);

// Update question
router.put(
  "/:quizId/questions/:questionId",
  authenticate,
  requireAdmin,
  updateQuestion
);

// Delete question
router.delete(
  "/:quizId/questions/:questionId",
  authenticate,
  requireAdmin,
  deleteQuestion
);

/*
========================================================
ADMIN QUIZ STATUS
========================================================
*/

// Publish / unpublish
router.put(
  "/:id/publish",
  authenticate,
  requireAdmin,
  togglePublishQuiz
);

// Stop quiz
router.put(
  "/:id/stop",
  authenticate,
  requireAdmin,
  stopQuiz
);

// Resume quiz
router.put(
  "/:id/resume",
  authenticate,
  requireAdmin,
  resumeQuiz
);

/*
========================================================
ADMIN LEADERBOARD
========================================================
*/

// Publish / hide leaderboard
router.put(
  "/:id/leaderboard",
  authenticate,
  requireAdmin,
  toggleLeaderboard
);

/*
========================================================
ADMIN ATTEMPTS / LEADERBOARD
========================================================
*/

// See all attempts for a quiz
router.get(
  "/:quizId/attempts",
  authenticate,
  requireAdmin,
  getQuizAttempts
);

/*
========================================================
ADMIN REWARDS
========================================================
*/

// Send reward emails
router.post(
  "/:id/rewards",
  authenticate,
  requireAdmin,
  sendQuizRewards
);

export default router;