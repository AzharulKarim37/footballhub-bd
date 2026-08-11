import('./config/db.js').then(async (db) => {
  try {
    await db.default.query(`
      CREATE TABLE IF NOT EXISTS league_season_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        league_id VARCHAR(50) NOT NULL,
        season VARCHAR(20) NOT NULL,
        matches_played INT DEFAULT 0,
        total_goals INT DEFAULT 0,
        yellow_cards INT DEFAULT 0,
        red_cards INT DEFAULT 0,
        clean_sheets INT DEFAULT 0,
        champion VARCHAR(100) DEFAULT '',
        UNIQUE KEY league_season (league_id, season)
      )
    `);
    console.log('league_season_stats table created successfully');
    
    // Copy existing stats from leagues table into league_season_stats for their default season
    await db.default.query(`
      INSERT IGNORE INTO league_season_stats (league_id, season, matches_played, total_goals, yellow_cards, red_cards, clean_sheets, champion)
      SELECT id, season, matches_played, total_goals, yellow_cards, red_cards, clean_sheets, champion FROM leagues
    `);
    console.log('Migrated existing stats');
  } catch(e) {
    console.error(e.message);
  }
  process.exit();
});
