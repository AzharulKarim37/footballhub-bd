import express from "express";
import {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../controllers/playerController.js";

import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPlayers);
router.get("/:id", getPlayerById);

// Admin protected CRUD routes
router.post("/", authenticate, requireAdmin, createPlayer);
router.put("/:id", authenticate, requireAdmin, updatePlayer);
router.delete("/:id", authenticate, requireAdmin, deletePlayer);

export default router;
