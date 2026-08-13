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

dotenv.config();

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS policy violation: Origin not allowed"), false);
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