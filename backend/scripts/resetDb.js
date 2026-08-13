import db from "../config/db.js";

const resetDatabase = async () => {
  try {
    // Disable FK checks first
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    console.log("🔓 Foreign key checks disabled.");

    // Find all tables in the database
    const [rows] = await db.query("SHOW TABLES");
    const tables = rows.map(r => Object.values(r)[0]);
    console.log("📋 Tables found:", tables.join(", "));

    for (const table of tables) {
      await db.query(`DROP TABLE IF EXISTS \`${table}\``);
      console.log(`  🗑️  Dropped: ${table}`);
    }

    await db.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("\n✅ All tables dropped. Database is clean.");
    console.log("🚀 Now restart the server to recreate tables with correct schema.");
    process.exit(0);
  } catch (error) {
    await db.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
    console.error("Reset failed:", error.message);
    process.exit(1);
  }
};

resetDatabase();
