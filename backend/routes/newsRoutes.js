import express from "express";
import {
    getNews,
    getLocalArticles,
    createArticle,
    updateArticle,
    deleteArticle,
} from "../controllers/newsController.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getNews);

// Admin-only routes (protected by token verification + admin check)
router.get("/local", authenticate, requireAdmin, getLocalArticles);
router.post("/", authenticate, requireAdmin, createArticle);
router.put("/:id", authenticate, requireAdmin, updateArticle);
router.delete("/:id", authenticate, requireAdmin, deleteArticle);

export default router;