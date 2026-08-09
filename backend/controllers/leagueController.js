import db from "../config/db.js";

// Get all leagues
export const getAllLeagues = async (req, res) => {
  try {
    const [leagues] = await db.query("SELECT * FROM leagues");
    res.json(leagues);
  } catch (error) {
    console.error("Error fetching leagues:", error);
    res.status(500).json({ message: "Server error fetching leagues" });
  }
};

// Get single league by ID (including standings and top scorers)
export const getLeagueById = async (req, res) => {
  const { id } = req.params;
  try {
    const [leagues] = await db.query("SELECT * FROM leagues WHERE id = ?", [id]);
    if (leagues.length === 0) {
      return res.status(404).json({ message: "League not found" });
    }

    const league = leagues[0];

    // Fetch standings
    const [standings] = await db.query(
      "SELECT * FROM league_standings WHERE league_id = ? ORDER BY position ASC",
      [id]
    );

    // Parse form string "W,W,D,W,W" to array
    const formattedStandings = standings.map((item) => ({
      ...item,
      form: item.form ? item.form.split(",") : ["W", "W", "D", "W", "W"],
    }));

    // Fetch top scorers
    const [scorers] = await db.query(
      "SELECT * FROM top_scorers WHERE league_id = ? ORDER BY rank_no ASC",
      [id]
    );

    // Fetch recent matches
    const [recentMatches] = await db.query(
      "SELECT * FROM matches WHERE (league_id = ? OR LOWER(league) LIKE ?) AND status = 'FT' ORDER BY id DESC LIMIT 5",
      [id, `%${league.name.toLowerCase()}%`]
    );

    // Fetch upcoming fixtures
    const [upcomingFixtures] = await db.query(
      "SELECT * FROM matches WHERE (league_id = ? OR LOWER(league) LIKE ?) AND status IN ('UPCOMING', 'TODAY', 'LIVE') ORDER BY id ASC LIMIT 5",
      [id, `%${league.name.toLowerCase()}%`]
    );

    res.json({
      league,
      standings: formattedStandings,
      topScorers: scorers,
      recentMatches,
      upcomingFixtures,
    });
  } catch (error) {
    console.error("Error fetching league details:", error);
    res.status(500).json({ message: "Server error fetching league details" });
  }
};

// Get league standings
export const getLeagueStandings = async (req, res) => {
  const { id } = req.params;
  try {
    const [standings] = await db.query(
      "SELECT * FROM league_standings WHERE league_id = ? ORDER BY position ASC",
      [id]
    );
    const formattedStandings = standings.map((item) => ({
      ...item,
      form: item.form ? item.form.split(",") : ["W", "W", "D", "W", "W"],
    }));
    res.json(formattedStandings);
  } catch (error) {
    console.error("Error fetching standings:", error);
    res.status(500).json({ message: "Server error fetching standings" });
  }
};

// Get top scorers for a league
export const getTopScorers = async (req, res) => {
  const { id } = req.params;
  try {
    const [scorers] = await db.query(
      "SELECT * FROM top_scorers WHERE league_id = ? ORDER BY rank_no ASC",
      [id]
    );
    res.json(scorers);
  } catch (error) {
    console.error("Error fetching top scorers:", error);
    res.status(500).json({ message: "Server error fetching top scorers" });
  }
};

// Create new league
export const createLeague = async (req, res) => {
  try {
    const { id, name, logo, country, season, clubs, champion, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "League name is required" });
    }

    const leagueId = id || name.toLowerCase().replace(/[^a-z0-9]/g, "-");

    await db.query(
      `INSERT INTO leagues (id, name, logo, country, season, clubs, champion, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        leagueId,
        name,
        logo || "/assets/logos/bpl.jpg",
        country || "Global",
        season || "2025-26",
        clubs || 10,
        champion || "TBD",
        description || "Official football competition.",
      ]
    );

    const [newLeague] = await db.query("SELECT * FROM leagues WHERE id = ?", [leagueId]);
    res.status(201).json({ message: "League created successfully", league: newLeague[0] });
  } catch (error) {
    console.error("Error creating league:", error);
    res.status(500).json({ message: "Server error creating league" });
  }
};

// Update existing league
export const updateLeague = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, logo, country, season, clubs, champion, description } = req.body;

    const [existing] = await db.query("SELECT * FROM leagues WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "League not found" });
    }

    await db.query(
      `UPDATE leagues 
       SET name = ?, logo = ?, country = ?, season = ?, clubs = ?, champion = ?, description = ?
       WHERE id = ?`,
      [
        name || existing[0].name,
        logo || existing[0].logo,
        country || existing[0].country,
        season || existing[0].season,
        clubs !== undefined ? clubs : existing[0].clubs,
        champion || existing[0].champion,
        description || existing[0].description,
        id,
      ]
    );

    const [updated] = await db.query("SELECT * FROM leagues WHERE id = ?", [id]);
    res.json({ message: "League updated successfully", league: updated[0] });
  } catch (error) {
    console.error("Error updating league:", error);
    res.status(500).json({ message: "Server error updating league" });
  }
};

// Delete league
export const deleteLeague = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query("SELECT * FROM leagues WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "League not found" });
    }

    await db.query("DELETE FROM leagues WHERE id = ?", [id]);
    await db.query("DELETE FROM league_standings WHERE league_id = ?", [id]);
    await db.query("DELETE FROM top_scorers WHERE league_id = ?", [id]);

    res.json({ message: "League and related statistics deleted successfully" });
  } catch (error) {
    console.error("Error deleting league:", error);
    res.status(500).json({ message: "Server error deleting league" });
  }
};
