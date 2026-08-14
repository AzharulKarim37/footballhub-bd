import db from "../config/db.js";

const migrate = async () => {
  try {
    // Check if column already exists
    const [cols] = await db.query("SHOW COLUMNS FROM league_standings LIKE 'group_name'");
    if (cols.length > 0) {
      console.log("ℹ️  group_name column already exists, skipping.");
    } else {
      await db.query(
        "ALTER TABLE league_standings ADD COLUMN group_name VARCHAR(50) DEFAULT 'Group 1'"
      );
      console.log("✅ Added group_name column to league_standings");
    }
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  }
};

migrate();
