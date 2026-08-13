import db from "../config/db.js";

// Get all teams with optional search and league query filters
export const getAllTeams = async (req, res) => {
  try {
    const { search, league } = req.query;

    let query = "SELECT * FROM teams WHERE 1=1";
    const queryParams = [];

    if (league && league !== "ALL") {
      query += " AND league = ?";
      queryParams.push(league);
    }

    if (search && search.trim() !== "") {
      query += " AND (LOWER(name) LIKE ? OR LOWER(coach) LIKE ? OR LOWER(stadium) LIKE ?)";
      const searchPattern = `%${search.trim().toLowerCase()}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    query += " ORDER BY id ASC";

    const [teams] = await db.query(query, queryParams);
    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Server error fetching teams" });
  }
};

// Get team by ID
export const getTeamById = async (req, res) => {
  const { id } = req.params;
  try {
    const [teams] = await db.query("SELECT * FROM teams WHERE id = ?", [id]);
    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(teams[0]);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ message: "Server error fetching team" });
  }
};
