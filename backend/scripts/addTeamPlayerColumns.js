import db from "../config/db.js";

const migrate = async () => {
    try {
        console.log("🔄 Adding new columns...");

        const [playerCols] = await db.query("SHOW COLUMNS FROM players LIKE 'dob'");
        if (playerCols.length === 0) {
            await db.query("ALTER TABLE players ADD COLUMN dob DATE DEFAULT NULL");
            console.log("✅ Added players.dob");
        }

        const [mvCols] = await db.query("SHOW COLUMNS FROM players LIKE 'market_value'");
        if (mvCols.length === 0) {
            await db.query("ALTER TABLE players ADD COLUMN market_value VARCHAR(50) DEFAULT NULL");
            console.log("✅ Added players.market_value");
        }

        const [trophyCols] = await db.query("SHOW COLUMNS FROM teams LIKE 'trophies'");
        if (trophyCols.length === 0) {
            await db.query("ALTER TABLE teams ADD COLUMN trophies TEXT DEFAULT NULL");
            console.log("✅ Added teams.trophies");
        }

        console.log("🎉 Migration complete.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error.message);
        process.exit(1);
    }
};

migrate();