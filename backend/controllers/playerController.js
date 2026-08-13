import db from "../config/db.js";

// Get all players (with optional search, club, position query filter)
export const getAllPlayers = async (req, res) => {
  try {
    const { search, club, position } = req.query;

    let query = "SELECT * FROM players WHERE 1=1";
    const queryParams = [];

    if (club && club !== "ALL") {
      query += " AND club = ?";
      queryParams.push(club);
    }

    if (position && position !== "ALL") {
      query += " AND position = ?";
      queryParams.push(position);
    }

    if (search && search.trim() !== "") {
      query += " AND (LOWER(name) LIKE ? OR LOWER(club) LIKE ? OR LOWER(nationality) LIKE ?)";
      const searchPattern = `%${search.trim().toLowerCase()}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    query += " ORDER BY id ASC";

    const [players] = await db.query(query, queryParams);
    res.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ message: "Server error fetching players" });
  }
};

// Get player by ID
export const getPlayerById = async (req, res) => {
  const { id } = req.params;
  try {
    const [players] = await db.query("SELECT * FROM players WHERE id = ?", [id]);
    if (players.length === 0) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(players[0]);
  } catch (error) {
    console.error("Error fetching player:", error);
    res.status(500).json({ message: "Server error fetching player" });
  }
};

// Create new player
export const createPlayer = async (req, res) => {
  try {
    const { name, club, position, number, image, nationality, goals, assists } = req.body;

    if (!name || !club || !position) {
      return res.status(400).json({ message: "Name, club, and position are required" });
    }

    const [result] = await db.query(
      `INSERT INTO players (name, club, position, number, image, nationality, goals, assists)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        club,
        position,
        number || 10,
        image || "/src/assets/players/jamal-bhuyanjpg.webp",
        nationality || "Bangladesh",
        goals || 0,
        assists || 0,
      ]
    );

    const [newPlayer] = await db.query("SELECT * FROM players WHERE id = ?", [result.insertId]);
    res.status(201).json({ message: "Player created successfully", player: newPlayer[0] });
  } catch (error) {
    console.error("Error creating player:", error);
    res.status(500).json({ message: "Server error creating player" });
  }
};

// Update existing player
export const updatePlayer = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, club, position, number, image, nationality, goals, assists } = req.body;

    const [existing] = await db.query("SELECT * FROM players WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    await db.query(
      `UPDATE players 
       SET name = ?, club = ?, position = ?, number = ?, image = ?, nationality = ?, goals = ?, assists = ?
       WHERE id = ?`,
      [
        name || existing[0].name,
        club || existing[0].club,
        position || existing[0].position,
        number !== undefined ? number : existing[0].number,
        image || existing[0].image,
        nationality || existing[0].nationality,
        goals !== undefined ? goals : existing[0].goals,
        assists !== undefined ? assists : existing[0].assists,
        id,
      ]
    );

    const [updated] = await db.query("SELECT * FROM players WHERE id = ?", [id]);
    res.json({ message: "Player updated successfully", player: updated[0] });
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).json({ message: "Server error updating player" });
  }
};

// Delete player
export const deletePlayer = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query("SELECT * FROM players WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    await db.query("DELETE FROM players WHERE id = ?", [id]);
    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).json({ message: "Server error deleting player" });
  }
};
