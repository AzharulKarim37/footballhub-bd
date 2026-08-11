import express from "express";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";
import { getMyMessages, submitRewardClaim, getAllRewardClaims } from "../controllers/messageController.js";

const router = express.Router();

// User Routes
router.get("/my-messages", authenticate, getMyMessages);
router.post("/:id/submit-claim", authenticate, submitRewardClaim);

// Admin Routes
router.get("/claims", authenticate, requireAdmin, getAllRewardClaims);

export default router;
