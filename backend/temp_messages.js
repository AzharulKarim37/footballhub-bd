import('./config/db.js').then(async (db) => {
  try {
    await db.default.query(`
      CREATE TABLE IF NOT EXISTS user_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        quiz_id INT DEFAULT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'MESSAGE',
        status VARCHAR(50) DEFAULT 'UNREAD',
        form_fields JSON DEFAULT NULL,
        claim_data JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL
      )
    `);
    console.log('user_messages table created successfully');
  } catch(e) {
    console.error(e.message);
  }
  process.exit();
});
