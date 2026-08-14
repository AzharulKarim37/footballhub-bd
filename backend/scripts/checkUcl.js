import db from "../config/db.js";

const checkUcl = async () => {
  try {
    const [leagues] = await db.query("SELECT * FROM leagues WHERE id = 'ucl'");
    console.log("Leagues:", leagues);
    
    const [standings] = await db.query("SELECT * FROM league_standings WHERE league_id = 'ucl'");
    console.log("Standings Count:", standings.length);
    if (standings.length > 0) {
      console.log("Sample Standing:", standings[0]);
    }
    
    const [scorers] = await db.query("SELECT * FROM top_scorers WHERE league_id = 'ucl'");
    console.log("Scorers Count:", scorers.length);

    const [matches] = await db.query("SELECT * FROM matches WHERE league_id = 'ucl' OR LOWER(league) LIKE '%ucl%' OR LOWER(league) LIKE '%champions league%'");
    console.log("Matches Count:", matches.length);
    if (matches.length > 0) {
      console.log("Sample Match:", matches[0]);
    }
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
};

checkUcl();
