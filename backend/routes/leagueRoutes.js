import express from "express";
import {
  getAllLeagues,
  getLeagueById,
  getLeagueStandings,
  getTopScorers,
  createLeague,
  updateLeague,
  deleteLeague,
  addStanding,
  updateStanding,
  deleteStanding,
  addTopScorer,
  updateTopScorer,
  deleteTopScorer
} from "../controllers/leagueController.js";

import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllLeagues);
router.get("/:id", getLeagueById);
router.get("/:id/standings", getLeagueStandings);
router.get("/:id/top-scorers", getTopScorers);

// Admin protected routes - League
router.post("/", authenticate, requireAdmin, createLeague);
router.put("/:id", authenticate, requireAdmin, updateLeague);
router.delete("/:id", authenticate, requireAdmin, deleteLeague);

// Admin protected routes - Standings
router.post("/:id/standings", authenticate, requireAdmin, addStanding);
router.put("/:id/standings/:standingId", authenticate, requireAdmin, updateStanding);
router.delete("/:id/standings/:standingId", authenticate, requireAdmin, deleteStanding);

// Admin protected routes - Top Scorers
router.post("/:id/top-scorers", authenticate, requireAdmin, addTopScorer);
router.put("/:id/top-scorers/:scorerId", authenticate, requireAdmin, updateTopScorer);
router.delete("/:id/top-scorers/:scorerId", authenticate, requireAdmin, deleteTopScorer);

export default router;
