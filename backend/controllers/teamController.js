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

// Get team by ID, including squad and trophy history
export const getTeamById = async (req, res) => {
  const { id } = req.params;
  try {
    const [teams] = await db.query("SELECT * FROM teams WHERE id = ?", [id]);
    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    const team = teams[0];

    // Squad: players whose club matches this team's name
    const [players] = await db.query("SELECT * FROM players WHERE club = ?", [team.name]);

    // Trophies stored as JSON text; parse safely
    let trophies = [];
    if (team.trophies) {
      try {
        trophies = JSON.parse(team.trophies);
      } catch {
        trophies = [];
      }
    }

    res.json({ ...team, squad: players, trophies });
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ message: "Server error fetching team" });
  }
};