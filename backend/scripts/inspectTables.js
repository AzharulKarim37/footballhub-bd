import db from "../config/db.js";

const inspectTables = async () => {
  const tables = ["leagues", "matches", "teams", "players", "quizzes", "quiz_questions", "quiz_attempts", "league_standings", "top_scorers"];
  
  for (const table of tables) {
    try {
      const [cols] = await db.query(`DESCRIBE \`${table}\``);
      console.log(`\n=== ${table.toUpperCase()} ===`);
      cols.forEach(c => console.log(`  ${c.Field} (${c.Type}) NULL=${c.Null} Default=${c.Default}`));
    } catch (e) {
      console.log(`\n=== ${table.toUpperCase()} === [DOES NOT EXIST]`);
    }
  }
  
  process.exit(0);
};

inspectTables();
