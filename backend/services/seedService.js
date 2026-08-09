import db from "../config/db.js";

export const initAndSeedDatabase = async () => {
  try {
    console.log("🔄 Initializing Football Hub database tables...");

    // ======================================================
    // 1. USERS TABLE (required by auth)
    // Columns match authController.js expectations exactly
    // ======================================================
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        is_verified TINYINT(1) DEFAULT 0,
        verification_token VARCHAR(255),
        verification_token_expires DATETIME,
        reset_token VARCHAR(255),
        reset_token_expires DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // ======================================================
    // 2. LEAGUES TABLE (VARCHAR id for slug-based IDs)
    // ======================================================
    await db.query(`
      CREATE TABLE IF NOT EXISTS leagues (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        logo VARCHAR(255),
        country VARCHAR(50) DEFAULT 'Bangladesh',
        season VARCHAR(20) DEFAULT '2025-26',
        clubs INT DEFAULT 0,
        champion VARCHAR(100),
        description TEXT,
        matches_played INT DEFAULT 0,
        total_goals INT DEFAULT 0,
        avg_goals DECIMAL(4,2) DEFAULT 0.00,
        yellow_cards INT DEFAULT 0,
        red_cards INT DEFAULT 0,
        clean_sheets INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ======================================================
    // 3. LEAGUE STANDINGS TABLE
    // ======================================================
    await db.query(`
      CREATE TABLE IF NOT EXISTS league_standings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        league_id VARCHAR(50) NOT NULL,
        position INT NOT NULL,
        club VARCHAR(100) NOT NULL,
        played INT DEFAULT 0,
        won INT DEFAULT 0,
        draw INT DEFAULT 0,
        lost INT DEFAULT 0,
        gf INT DEFAULT 0,
        ga INT DEFAULT 0,
        gd INT DEFAULT 0,
        points INT DEFAULT 0,
        form VARCHAR(100) DEFAULT 'W,W,D,W,W'
      )
    `);

    // ======================================================
    // 4. TOP SCORERS TABLE
    // ======================================================
    await db.query(`
      CREATE TABLE IF NOT EXISTS top_scorers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        league_id VARCHAR(50) NOT NULL,
        rank_no INT NOT NULL,
        player VARCHAR(100) NOT NULL,
        club VARCHAR(100) NOT NULL,
        goals INT DEFAULT 0
      )
    `);

    // ======================================================
    // 5. MATCHES TABLE (text-based fields for admin UI)
    // ======================================================
    await db.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        league VARCHAR(100) NOT NULL,
        league_id VARCHAR(50) DEFAULT 'bpl',
        stage VARCHAR(100) DEFAULT 'Regular Stage',
        status VARCHAR(20) NOT NULL DEFAULT 'UPCOMING',
        date VARCHAR(50),
        time VARCHAR(50),
        home VARCHAR(100) NOT NULL,
        away VARCHAR(100) NOT NULL,
        homeScore INT DEFAULT NULL,
        awayScore INT DEFAULT NULL,
        minute VARCHAR(20) DEFAULT NULL,
        stadium VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ======================================================
    // 6. TEAMS TABLE
    // ======================================================
    await db.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        league VARCHAR(100) NOT NULL DEFAULT 'Bangladesh Premier League',
        coach VARCHAR(100),
        stadium VARCHAR(100),
        founded INT,
        logo VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ======================================================
    // 7. PLAYERS TABLE
    // ======================================================
    await db.query(`
      CREATE TABLE IF NOT EXISTS players (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        club VARCHAR(100) NOT NULL,
        position VARCHAR(50) NOT NULL,
        number INT DEFAULT 10,
        image VARCHAR(255),
        nationality VARCHAR(50) DEFAULT 'Bangladesh',
        goals INT DEFAULT 0,
        assists INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ======================================================
    // 8. QUIZZES TABLE
    // ======================================================
    await db.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        difficulty VARCHAR(50) DEFAULT 'Medium',
        time_limit INT DEFAULT 10,
        category VARCHAR(100) DEFAULT 'Football',
        status ENUM('draft', 'published', 'stopped') DEFAULT 'draft',
        leaderboard_published TINYINT(1) DEFAULT 0,
        created_by INT DEFAULT NULL,
        stopped_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // ======================================================
    // 9. QUIZ QUESTIONS TABLE
    // ======================================================
    await db.query(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quiz_id INT NOT NULL,
        question TEXT NOT NULL,
        option_a VARCHAR(500),
        option_b VARCHAR(500),
        option_c VARCHAR(500),
        option_d VARCHAR(500),
        correct_answer VARCHAR(10) NOT NULL,
        points INT DEFAULT 1,
        question_order INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ======================================================
    // 10. QUIZ ATTEMPTS TABLE
    // ======================================================
    await db.query(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quiz_id INT NOT NULL,
        user_id INT NOT NULL,
        score INT DEFAULT 0,
        correct_answers INT DEFAULT 0,
        total_questions INT DEFAULT 0,
        percentage DECIMAL(5,2) DEFAULT 0.00,
        time_spent INT DEFAULT 0,
        reward_sent TINYINT(1) DEFAULT 0,
        reward_sent_at DATETIME DEFAULT NULL,
        started_at DATETIME DEFAULT NULL,
        completed_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ======================================================
    // SEED DATA — only if tables are empty
    // ======================================================

    // Leagues
    const [existingLeagues] = await db.query("SELECT COUNT(*) as count FROM leagues");
    if (existingLeagues[0].count === 0) {
      console.log("🌱 Seeding Leagues...");
      await db.query(`
        INSERT INTO leagues 
        (id, name, logo, country, season, clubs, champion, description, matches_played, total_goals, avg_goals, yellow_cards, red_cards, clean_sheets) 
        VALUES
        ('bpl', 'Bangladesh Premier League', '/assets/logos/bpl.jpg', 'Bangladesh', '2025-26', 10, 'Bashundhara Kings', 'Bangladesh''s highest professional football league featuring the country''s strongest clubs competing for the national championship.', 180, 472, 2.62, 694, 41, 73),
        ('federation-cup', 'Federation Cup', '/assets/logos/federation-cup.jpg', 'Bangladesh', '2025-26', 16, 'Mohammedan SC', 'The oldest knockout football tournament in Bangladesh, bringing together clubs from across the country in a single elimination competition.', 61, 179, 2.93, 224, 12, 19),
        ('ucl', 'UEFA Champions League', '/assets/logos/ucl.webp', 'Europe', '2025-26', 36, 'Paris Saint-Germain', 'Europe''s premier club football competition featuring the continent''s best teams competing for the most prestigious trophy in club football.', 189, 618, 3.27, 748, 29, 58)
      `);
    }

    // Top Scorers
    const [existingScorers] = await db.query("SELECT COUNT(*) as count FROM top_scorers");
    if (existingScorers[0].count === 0) {
      console.log("🌱 Seeding Top Scorers...");
      await db.query(`
        INSERT INTO top_scorers (league_id, rank_no, player, club, goals) VALUES
        ('bpl', 1, 'Dorielton', 'Bashundhara Kings', 18),
        ('bpl', 2, 'Rakib Hossain', 'Bashundhara Kings', 15),
        ('bpl', 3, 'Sunday Chizoba', 'Mohammedan SC', 13),
        ('bpl', 4, 'Jewel Rana', 'Abahani Ltd', 11),
        ('bpl', 5, 'Sohel Rana', 'Rahmatganj', 9),
        ('federation-cup', 1, 'Dorielton', 'Bashundhara Kings', 6),
        ('federation-cup', 2, 'Sunday Chizoba', 'Mohammedan SC', 5),
        ('federation-cup', 3, 'Rakib Hossain', 'Bashundhara Kings', 4),
        ('federation-cup', 4, 'Jewel Rana', 'Abahani Ltd', 4),
        ('federation-cup', 5, 'Fahim', 'Rahmatganj', 3),
        ('ucl', 1, 'Erling Haaland', 'Manchester City', 12),
        ('ucl', 2, 'Harry Kane', 'Bayern Munich', 11),
        ('ucl', 3, 'Kylian Mbappe', 'Real Madrid', 10),
        ('ucl', 4, 'Robert Lewandowski', 'Barcelona', 9),
        ('ucl', 5, 'Mohamed Salah', 'Liverpool', 8)
      `);
    }

    // League Standings
    const [existingStandings] = await db.query("SELECT COUNT(*) as count FROM league_standings");
    if (existingStandings[0].count === 0) {
      console.log("🌱 Seeding League Standings...");
      const bplClubs = [
        "Bashundhara Kings", "Abahani Limited", "Mohammedan SC", "Rahmatganj MFS",
        "Brothers Union", "Bangladesh Police FC", "Sheikh Russel KC", "Fortis FC",
        "Chittagong Abahani", "Youngmen's Club"
      ];
      let pos = 1;
      for (const club of bplClubs) {
        const played = 20;
        const won = Math.max(2, 15 - (pos - 1));
        const draw = ((pos - 1) % 4) + 1;
        const lost = Math.max(0, played - won - draw);
        const gf = 42 - (pos - 1) * 2;
        const ga = 10 + (pos - 1) * 2;
        const gd = gf - ga;
        const points = won * 3 + draw;
        await db.query(
          `INSERT INTO league_standings (league_id, position, club, played, won, draw, lost, gf, ga, gd, points, form)
           VALUES ('bpl', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'W,W,D,W,W')`,
          [pos, club, played, won, draw, lost, gf, ga, gd, points]
        );
        pos++;
      }

      const uclClubs = [
        "Real Madrid", "Barcelona", "Manchester City", "Liverpool", "Arsenal",
        "Chelsea", "Bayern Munich", "Paris Saint-Germain", "Inter Milan", "Juventus"
      ];
      pos = 1;
      for (const club of uclClubs) {
        const played = 8;
        const won = Math.max(1, 7 - Math.floor((pos - 1) / 2));
        const draw = (pos % 2);
        const lost = Math.max(0, played - won - draw);
        const gf = 20 - pos;
        const ga = 5 + pos;
        const gd = gf - ga;
        const points = won * 3 + draw;
        await db.query(
          `INSERT INTO league_standings (league_id, position, club, played, won, draw, lost, gf, ga, gd, points, form)
           VALUES ('ucl', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'W,W,W,D,W')`,
          [pos, club, played, won, draw, lost, gf, ga, gd, points]
        );
        pos++;
      }
    }

    // Matches
    const [existingMatches] = await db.query("SELECT COUNT(*) as count FROM matches");
    if (existingMatches[0].count === 0) {
      console.log("🌱 Seeding Matches...");
      await db.query(`
        INSERT INTO matches (league, league_id, stage, status, date, time, home, away, homeScore, awayScore, minute, stadium) VALUES
        ('Bangladesh Premier League', 'bpl', 'Matchday 15', 'LIVE', '04 Aug 2026', '18:00', 'Bashundhara Kings', 'Abahani Limited', 2, 1, '67''', 'Kings Arena'),
        ('Bangladesh Premier League', 'bpl', 'Matchday 15', 'LIVE', '04 Aug 2026', '18:30', 'Mohammedan SC', 'Rahmatganj MFS', 1, 1, '39''', 'Shaheed Dhirendranath Stadium'),
        ('Bangladesh Premier League', 'bpl', 'Matchday 15', 'TODAY', '04 Aug 2026', '20:00', 'Fortis FC', 'Brothers Union', NULL, NULL, NULL, 'Rajshahi Stadium'),
        ('Bangladesh Premier League', 'bpl', 'Matchday 15', 'TODAY', '04 Aug 2026', '20:30', 'Bangladesh Police FC', 'Sheikh Russel KC', NULL, NULL, NULL, 'Police Lines Ground'),
        ('Bangladesh Premier League', 'bpl', 'Matchday 16', 'UPCOMING', '05 Aug 2026', '17:30', 'Chittagong Abahani', 'Fakirerpool YC', NULL, NULL, NULL, 'MA Aziz Stadium'),
        ('Bangladesh Premier League', 'bpl', 'Matchday 16', 'UPCOMING', '05 Aug 2026', '20:00', 'Bashundhara Kings', 'Fortis FC', NULL, NULL, NULL, 'Kings Arena'),
        ('Bangladesh Premier League', 'bpl', 'Matchday 14', 'FT', '03 Aug 2026', 'Finished', 'Abahani Limited', 'Mohammedan SC', 3, 2, NULL, 'Bangabandhu National Stadium'),
        ('Bangladesh Premier League', 'bpl', 'Matchday 14', 'FT', '03 Aug 2026', 'Finished', 'Rahmatganj MFS', 'Fortis FC', 0, 1, NULL, 'Rajshahi Stadium'),
        ('Federation Cup', 'federation-cup', 'Quarter Final', 'LIVE', '04 Aug 2026', '19:00', 'Mohammedan SC', 'Abahani Limited', 1, 0, '54''', 'Bangabandhu National Stadium'),
        ('Federation Cup', 'federation-cup', 'Quarter Final', 'TODAY', '04 Aug 2026', '20:30', 'Bashundhara Kings', 'Sheikh Russel KC', NULL, NULL, NULL, 'Kings Arena'),
        ('Federation Cup', 'federation-cup', 'Quarter Final', 'UPCOMING', '05 Aug 2026', '17:00', 'Rahmatganj MFS', 'Fortis FC', NULL, NULL, NULL, 'Rajshahi Stadium'),
        ('Federation Cup', 'federation-cup', 'Round of 16', 'FT', '03 Aug 2026', 'Finished', 'Mohammedan SC', 'Fakirerpool YC', 4, 1, NULL, 'Bangabandhu National Stadium'),
        ('UEFA Champions League', 'ucl', 'League Stage', 'LIVE', '04 Aug 2026', '20:00', 'Real Madrid', 'Manchester City', 2, 1, '71''', 'Santiago Bernabéu'),
        ('UEFA Champions League', 'ucl', 'League Stage', 'LIVE', '04 Aug 2026', '20:00', 'Liverpool', 'PSG', 1, 1, '48''', 'Anfield'),
        ('UEFA Champions League', 'ucl', 'League Stage', 'TODAY', '04 Aug 2026', '22:00', 'Barcelona', 'Bayern Munich', NULL, NULL, NULL, 'Spotify Camp Nou'),
        ('UEFA Champions League', 'ucl', 'League Stage', 'UPCOMING', '05 Aug 2026', '20:00', 'Chelsea', 'Juventus', NULL, NULL, NULL, 'Stamford Bridge'),
        ('UEFA Champions League', 'ucl', 'League Stage', 'FT', '03 Aug 2026', 'Finished', 'PSG', 'Borussia Dortmund', 3, 1, NULL, 'Parc des Princes')
      `);
    }

    // Teams
    const [existingTeams] = await db.query("SELECT COUNT(*) as count FROM teams");
    if (existingTeams[0].count === 0) {
      console.log("🌱 Seeding Teams...");
      await db.query(`
        INSERT INTO teams (name, league, coach, stadium, founded, logo) VALUES
        ('Bashundhara Kings', 'Bangladesh Premier League', 'Oscar Bruzon', 'Kings Arena', 2013, '/src/assets/logos/Boshundora kings.webp'),
        ('Abahani Limited Dhaka', 'Bangladesh Premier League', 'Maruful Haque', 'Bangabandhu National Stadium', 1972, '/src/assets/logos/Abhani Dhaka.webp'),
        ('Mohammedan SC', 'Bangladesh Premier League', 'Alfaz Ahmed', 'Shaheed Dhirendranath Datta Stadium', 1936, '/src/assets/logos/Mohamedan.webp'),
        ('Brothers Union', 'Bangladesh Premier League', 'Mizanur Rahman', 'Bangabandhu National Stadium', 1949, '/src/assets/logos/Brothers Union.webp'),
        ('Fortis FC', 'Bangladesh Premier League', 'Bimal Ghosh', 'Rajshahi Stadium', 2022, '/src/assets/logos/Fortis fc.webp'),
        ('Rahmatganj MFS', 'Bangladesh Premier League', 'Hasan Al Mamun', 'Bangabandhu National Stadium', 1958, '/src/assets/logos/Rahmatgonj FC.webp'),
        ('Bangladesh Police FC', 'Bangladesh Premier League', 'Shakhawat Hossain', 'Police Lines Ground', 1972, '/src/assets/logos/BD police.webp'),
        ('PWD SC', 'Bangladesh Championship League', 'Unknown', 'Dhaka', 2004, '/src/assets/logos/PWT fc.webp'),
        ('Arambagh KS', 'Bangladesh Championship League', 'Unknown', 'Arambagh Ground', 1958, '/src/assets/logos/Arambag.webp'),
        ('Fakirerpool Young Men''s Club', 'Bangladesh Championship League', 'Unknown', 'Dhaka', 1939, '/src/assets/logos/Fokira.jpg')
      `);
    }

    // Players
    const [existingPlayers] = await db.query("SELECT COUNT(*) as count FROM players");
    if (existingPlayers[0].count === 0) {
      console.log("🌱 Seeding Players...");
      await db.query(`
        INSERT INTO players (name, club, position, number, image, nationality, goals, assists) VALUES
        ('Jamal Bhuyan', 'Brothers Union', 'Midfielder', 6, '/src/assets/players/jamal-bhuyanjpg.webp', 'Bangladesh', 12, 24),
        ('Rakib Hossain', 'Bashundhara Kings', 'Winger', 17, '/src/assets/players/rakib.webp', 'Bangladesh', 15, 10),
        ('Topu Barman', 'Bashundhara Kings', 'Defender', 4, '/src/assets/players/Topu-Barman.webp', 'Bangladesh', 8, 3),
        ('Sohel Rana', 'Abahani Limited', 'Midfielder', 8, '/src/assets/players/Shohel rana.webp', 'Bangladesh', 9, 14),
        ('Sunday Chizoba', 'Mohammedan SC', 'Forward', 9, '/src/assets/players/jamal-bhuyanjpg.webp', 'Nigeria', 13, 5),
        ('Dorielton', 'Bashundhara Kings', 'Forward', 11, '/src/assets/players/rakib.webp', 'Brazil', 18, 8)
      `);
    }

    // Quizzes
    const [existingQuizzes] = await db.query("SELECT COUNT(*) as count FROM quizzes");
    if (existingQuizzes[0].count === 0) {
      console.log("🌱 Seeding Quizzes...");
      const [quizResult] = await db.query(`
        INSERT INTO quizzes (title, description, difficulty, time_limit, category, status, leaderboard_published)
        VALUES ('Bangladesh Football & BPL History', 'Test your knowledge about Bangladesh Football, BPL history and famous players!', 'Medium', 10, 'Football', 'published', 1)
      `);
      const quizId = quizResult.insertId;
      await db.query(`
        INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, points, question_order) VALUES
        (?, 'Which club won the Bangladesh Premier League 2023-24 season?', 'Abahani Limited', 'Bashundhara Kings', 'Mohammedan SC', 'Sheikh Russel KC', 'B', 1, 1),
        (?, 'What is the home stadium of Bashundhara Kings?', 'Kings Arena', 'Bangabandhu Stadium', 'MA Aziz Stadium', 'Rajshahi Stadium', 'A', 1, 2),
        (?, 'Who is the captain of Bangladesh National Football Team?', 'Rakib Hossain', 'Topu Barman', 'Jamal Bhuyan', 'Sohel Rana', 'C', 1, 3),
        (?, 'In which year was Bashundhara Kings FC founded?', '2009', '2011', '2013', '2015', 'C', 1, 4),
        (?, 'Which stadium is known as the home of Bangladesh football?', 'Kings Arena', 'Bangabandhu National Stadium', 'MA Aziz Stadium', 'Sylhet Stadium', 'B', 1, 5)
      `, [quizId, quizId, quizId, quizId, quizId]);
    }

    // Seed admin user if no users exist
    const [existingUsers] = await db.query("SELECT COUNT(*) as count FROM users");
    if (existingUsers[0].count === 0) {
      console.log("🌱 Seeding default admin user...");
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.default.hash("Admin@1234", 10);
      await db.query(
        `INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, 'admin', 1)`,
        ["Admin", "admin@footballhub.bd", hashedPassword]
      );
      console.log("  👤 Admin user created: admin@footballhub.bd / Admin@1234");
    }

    console.log("✅ Database initialized and seeded successfully.");
  } catch (error) {
    console.error("❌ Error initializing/seeding database:", error.message);
    throw error;
  }
};
