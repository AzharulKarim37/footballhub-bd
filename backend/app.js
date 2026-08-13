import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/db.js";
import { initAndSeedDatabase } from "./services/seedService.js";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import leagueRoutes from "./routes/leagueRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow localhost and 127.0.0.1 on any port during development
      const isLocalDev =
        /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

      if (isLocalDev) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ======================================================
// DATABASE TEST & SEED
// ======================================================

const testDatabaseConnection = async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ MySQL Connected");

    // Initialize & seed tables for matches, leagues, teams
    await initAndSeedDatabase();
  } catch (error) {
    console.error("❌ MySQL Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

// ======================================================
// ROUTES
// ======================================================

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/leagues", leagueRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);

// Your News Page
app.use("/api/news", newsRoutes);

// Partner's Message System
app.use("/api/messages", messageRoutes);

// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "Football Hub BD API is running",
  });
});

// ======================================================
// 404
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
  });
});

// ======================================================
// START
// ======================================================

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await testDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();