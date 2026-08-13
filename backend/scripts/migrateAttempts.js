import db from "../config/db.js";

async function run() {
  try {
    console.log("Checking if user_answers_json exists...");
    const [rows] = await db.query("SHOW COLUMNS FROM quiz_attempts LIKE 'user_answers_json'");
    if (rows.length === 0) {
      console.log("Adding user_answers_json to quiz_attempts...");
      await db.query("ALTER TABLE quiz_attempts ADD COLUMN user_answers_json JSON DEFAULT NULL;");
      console.log("Column added successfully!");
    } else {
      console.log("Column already exists.");
    }
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

run();
