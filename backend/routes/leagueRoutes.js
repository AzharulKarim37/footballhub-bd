import express from "express";
import {
  getAllLeagues,
  getLeagueById,
  getLeagueStandings,
  getTopScorers,
  createLeague,
  updateLeague,
  deleteLeague,
} from "../controllers/leagueController.js";

import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllLeagues);
router.get("/:id", getLeagueById);
router.get("/:id/standings", getLeagueStandings);
router.get("/:id/top-scorers", getTopScorers);

// Admin protected routes
router.post("/", authenticate, requireAdmin, createLeague);
router.put("/:id", authenticate, requireAdmin, updateLeague);
router.delete("/:id", authenticate, requireAdmin, deleteLeague);

export default router;
