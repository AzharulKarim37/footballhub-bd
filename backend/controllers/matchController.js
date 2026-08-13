import db from "../config/db.js";

// Get all matches with optional query parameters: status, search, league
export const getAllMatches = async (req, res) => {
  try {
    const { status, search, league } = req.query;

    let query = "SELECT * FROM matches WHERE 1=1";
    const queryParams = [];

    if (status && status !== "ALL") {
      query += " AND status = ?";
      queryParams.push(status);
    }

    if (league && league !== "ALL") {
      query += " AND (league = ? OR league_id = ?)";
      queryParams.push(league, league);
    }

    if (search && search.trim() !== "") {
      query += " AND (LOWER(home) LIKE ? OR LOWER(away) LIKE ? OR LOWER(stadium) LIKE ?)";
      const searchPattern = `%${search.trim().toLowerCase()}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    query += " ORDER BY id ASC";

    const [matches] = await db.query(query, queryParams);
    res.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Server error fetching matches" });
  }
};

// Get match by ID
export const getMatchById = async (req, res) => {
  const { id } = req.params;
  try {
    const [matches] = await db.query("SELECT * FROM matches WHERE id = ?", [id]);
    if (matches.length === 0) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.json(matches[0]);
  } catch (error) {
    console.error("Error fetching match:", error);
    res.status(500).json({ message: "Server error fetching match" });
  }
};

// Create new match
export const createMatch = async (req, res) => {
  try {
    const { league, league_id, stage, status, date, time, home, away, homeScore, awayScore, minute, stadium } = req.body;

    if (!league || !home || !away || !status) {
      return res.status(400).json({ message: "League, home team, away team, and status are required" });
    }

    const [result] = await db.query(
      `INSERT INTO matches (league, league_id, stage, status, date, time, home, away, homeScore, awayScore, minute, stadium)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        league,
        league_id || "bpl",
        stage || "Regular Stage",
        status || "TODAY",
        date || "Today",
        time || "20:00",
        home,
        away,
        homeScore !== undefined ? homeScore : null,
        awayScore !== undefined ? awayScore : null,
        minute || null,
        stadium || "Main Stadium",
      ]
    );

    const [newMatch] = await db.query("SELECT * FROM matches WHERE id = ?", [result.insertId]);
    res.status(201).json({ message: "Match created successfully", match: newMatch[0] });
  } catch (error) {
    console.error("Error creating match:", error);
    res.status(500).json({ message: "Server error creating match" });
  }
};

// Update existing match
export const updateMatch = async (req, res) => {
  const { id } = req.params;
  try {
    const { league, league_id, stage, status, date, time, home, away, homeScore, awayScore, minute, stadium } = req.body;

    const [existing] = await db.query("SELECT * FROM matches WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Match not found" });
    }

    await db.query(
      `UPDATE matches 
       SET league = ?, league_id = ?, stage = ?, status = ?, date = ?, time = ?, home = ?, away = ?, homeScore = ?, awayScore = ?, minute = ?, stadium = ?
       WHERE id = ?`,
      [
        league || existing[0].league,
        league_id || existing[0].league_id,
        stage || existing[0].stage,
        status || existing[0].status,
        date || existing[0].date,
        time || existing[0].time,
        home || existing[0].home,
        away || existing[0].away,
        homeScore !== undefined ? homeScore : existing[0].homeScore,
        awayScore !== undefined ? awayScore : existing[0].awayScore,
        minute !== undefined ? minute : existing[0].minute,
        stadium || existing[0].stadium,
        id,
      ]
    );

    const [updated] = await db.query("SELECT * FROM matches WHERE id = ?", [id]);
    res.json({ message: "Match updated successfully", match: updated[0] });
  } catch (error) {
    console.error("Error updating match:", error);
    res.status(500).json({ message: "Server error updating match" });
  }
};

// Delete match
export const deleteMatch = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query("SELECT * FROM matches WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Match not found" });
    }

    await db.query("DELETE FROM matches WHERE id = ?", [id]);
    res.json({ message: "Match deleted successfully" });
  } catch (error) {
    console.error("Error deleting match:", error);
    res.status(500).json({ message: "Server error deleting match" });
  }
};
