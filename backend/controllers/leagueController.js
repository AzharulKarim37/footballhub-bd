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
  const { season } = req.query;

  try {
    const [leagues] = await db.query("SELECT * FROM leagues WHERE id = ?", [id]);
    if (leagues.length === 0) {
      return res.status(404).json({ message: "League not found" });
    }

    const league = leagues[0];
    const targetSeason = season || league.season;

    // Fetch available seasons for this league from standings
    const [seasonRows] = await db.query(
      "SELECT DISTINCT season FROM league_standings WHERE league_id = ? ORDER BY season DESC",
      [id]
    );
    const availableSeasons = seasonRows.map(row => row.season);
    if (!availableSeasons.includes(league.season)) {
      availableSeasons.unshift(league.season);
    }
    const uniqueSeasons = [...new Set(availableSeasons)];

    // Fetch standings
    const [standings] = await db.query(
      "SELECT * FROM league_standings WHERE league_id = ? AND season = ? ORDER BY points DESC, gd DESC",
      [id, targetSeason]
    );

    // Parse form string "W,W,D,W,W" to array and set position
    const formattedStandings = standings.map((item, index) => ({
      ...item,
      position: index + 1,
      form: item.form ? item.form.split(",") : ["W", "W", "D", "W", "W"],
    }));

    // Fetch top scorers
    const [scorersRaw] = await db.query(
      "SELECT * FROM top_scorers WHERE league_id = ? AND season = ? ORDER BY goals DESC",
      [id, targetSeason]
    );
    const scorers = scorersRaw.map((scorer, index) => ({
      ...scorer,
      rank_no: index + 1
    }));

    // Fetch recent matches
    const [recentMatches] = await db.query(
      "SELECT * FROM matches WHERE (league_id = ? OR LOWER(league) LIKE ?) AND status = 'FT' ORDER BY id DESC LIMIT 5",
      [id, `%${league.name.toLowerCase()}%`]
    );

    // Fetch league season stats
    const [seasonStats] = await db.query(
      "SELECT * FROM league_season_stats WHERE league_id = ? AND season = ?",
      [id, targetSeason]
    );
    const stats = seasonStats.length > 0 ? seasonStats[0] : {
      matches_played: 0, total_goals: 0, yellow_cards: 0, red_cards: 0, clean_sheets: 0, champion: ""
    };
    
    // Dynamically calculate avg_goals for this season
    stats.avg_goals = stats.matches_played > 0 
      ? (stats.total_goals / stats.matches_played).toFixed(2) 
      : 0.00;

    // Fetch upcoming fixtures
    const [upcomingFixtures] = await db.query(
      "SELECT * FROM matches WHERE (league_id = ? OR LOWER(league) LIKE ?) AND status IN ('UPCOMING', 'TODAY', 'LIVE') ORDER BY id ASC LIMIT 5",
      [id, `%${league.name.toLowerCase()}%`]
    );

    res.json({
      league: { ...league, ...stats },
      availableSeasons: uniqueSeasons,
      currentSeason: targetSeason,
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
    const { 
      name, logo, country, season, clubs, champion, description,
      matches_played, total_goals, avg_goals, yellow_cards, red_cards, clean_sheets 
    } = req.body;

    const [existing] = await db.query("SELECT * FROM leagues WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "League not found" });
    }

    await db.query(
      `UPDATE leagues 
       SET name = ?, logo = ?, country = ?, season = ?, clubs = ?, description = ?, avg_goals = ?
       WHERE id = ?`,
      [
        name || existing[0].name,
        logo || existing[0].logo,
        country || existing[0].country,
        season || existing[0].season,
        clubs !== undefined ? clubs : existing[0].clubs,
        description || existing[0].description,
        avg_goals !== undefined ? avg_goals : existing[0].avg_goals,
        id,
      ]
    );

    // Update or Insert into league_season_stats
    await db.query(
      `INSERT INTO league_season_stats 
       (league_id, season, matches_played, total_goals, yellow_cards, red_cards, clean_sheets, champion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       matches_played = VALUES(matches_played),
       total_goals = VALUES(total_goals),
       yellow_cards = VALUES(yellow_cards),
       red_cards = VALUES(red_cards),
       clean_sheets = VALUES(clean_sheets),
       champion = VALUES(champion)`,
      [
        id, 
        season || existing[0].season, 
        matches_played !== undefined ? matches_played : 0, 
        total_goals !== undefined ? total_goals : 0, 
        yellow_cards !== undefined ? yellow_cards : 0, 
        red_cards !== undefined ? red_cards : 0, 
        clean_sheets !== undefined ? clean_sheets : 0, 
        champion || ''
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

/* ==========================================
   STANDINGS CRUD
========================================== */

export const addStanding = async (req, res) => {
  const { id } = req.params;
  try {
    const { position, club, played, won, drawn, lost, gf, ga, gd, points, form, season } = req.body;
    await db.query(
      `INSERT INTO league_standings (league_id, position, club, played, won, draw, lost, gf, ga, gd, points, form, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, position, club, played, won, drawn, lost, gf, ga, gd, points, Array.isArray(form) ? form.join(',') : form, season || '2025-26']
    );
    res.status(201).json({ message: 'Standing added' });
  } catch (error) {
    console.error('Error adding standing:', error);
    res.status(500).json({ message: 'Server error adding standing' });
  }
};

export const updateStanding = async (req, res) => {
  const { standingId } = req.params;
  try {
    const { position, club, played, won, drawn, lost, gf, ga, gd, points, form, season } = req.body;
    await db.query(
      `UPDATE league_standings SET position=?, club=?, played=?, won=?, draw=?, lost=?, gf=?, ga=?, gd=?, points=?, form=?, season=? WHERE id=?`,
      [position, club, played, won, drawn, lost, gf, ga, gd, points, Array.isArray(form) ? form.join(',') : form, season || '2025-26', standingId]
    );
    res.json({ message: 'Standing updated' });
  } catch (error) {
    console.error('Error updating standing:', error);
    res.status(500).json({ message: 'Server error updating standing' });
  }
};

export const deleteStanding = async (req, res) => {
  const { standingId } = req.params;
  try {
    await db.query('DELETE FROM league_standings WHERE id=?', [standingId]);
    res.json({ message: 'Standing deleted' });
  } catch (error) {
    console.error('Error deleting standing:', error);
    res.status(500).json({ message: 'Server error deleting standing' });
  }
};

/* ==========================================
   TOP SCORERS CRUD
========================================== */

export const addTopScorer = async (req, res) => {
  const { id } = req.params;
  try {
    const { rank_no, player, club, goals, season } = req.body;
    await db.query(
      `INSERT INTO top_scorers (league_id, rank_no, player, club, goals, season) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, rank_no, player, club, goals, season || '2025-26']
    );
    res.status(201).json({ message: 'Scorer added' });
  } catch (error) {
    console.error('Error adding scorer:', error);
    res.status(500).json({ message: 'Server error adding scorer' });
  }
};

export const updateTopScorer = async (req, res) => {
  const { scorerId } = req.params;
  try {
    const { rank_no, player, club, goals, season } = req.body;
    await db.query(
      `UPDATE top_scorers SET rank_no=?, player=?, club=?, goals=?, season=? WHERE id=?`,
      [rank_no, player, club, goals, season || '2025-26', scorerId]
    );
    res.json({ message: 'Scorer updated' });
  } catch (error) {
    console.error('Error updating scorer:', error);
    res.status(500).json({ message: 'Server error updating scorer' });
  }
};

export const deleteTopScorer = async (req, res) => {
  const { scorerId } = req.params;
  try {
    await db.query('DELETE FROM top_scorers WHERE id=?', [scorerId]);
    res.json({ message: 'Scorer deleted' });
  } catch (error) {
    console.error('Error deleting scorer:', error);
    res.status(500).json({ message: 'Server error deleting scorer' });
  }
};
