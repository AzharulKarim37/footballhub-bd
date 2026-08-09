import express from "express";
import {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
} from "../controllers/matchController.js";

import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllMatches);
router.get("/:id", getMatchById);

// Admin protected routes
router.post("/", authenticate, requireAdmin, createMatch);
router.put("/:id", authenticate, requireAdmin, updateMatch);
router.delete("/:id", authenticate, requireAdmin, deleteMatch);

export default router;
