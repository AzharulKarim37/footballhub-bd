const fs = require('fs');
const file = 'controllers/quizController.js';
let content = fs.readFileSync(file, 'utf8');

const replacement = `export const sendQuizRewards = async (req, res) => {
  try {
    const { id } = req.params;
    const { form_fields } = req.body; // Array of fields like ["Name", "Address"]

    /* GET QUIZ */
    const [quizzes] = await db.query(
      'SELECT id, title, leaderboard_published FROM quizzes WHERE id = ?',
      [id]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const quiz = quizzes[0];

    /* GET TOP 3 */
    const [players] = await db.query(
      \`SELECT qa.id AS attempt_id, qa.user_id, u.name, u.email, qa.score, qa.correct_answers, qa.total_questions, qa.reward_sent, qa.reward_sent_at, qa.completed_at
        FROM quiz_attempts qa
        INNER JOIN users u ON qa.user_id = u.id
        WHERE qa.quiz_id = ? AND qa.completed_at IS NOT NULL
        ORDER BY qa.score DESC, qa.correct_answers DESC, qa.completed_at ASC, qa.id ASC
        LIMIT 3\`,
      [id]
    );

    if (players.length === 0) {
      return res.status(400).json({ message: "There are no completed quiz attempts yet." });
    }

    /* SEND IN-APP REWARD MESSAGES */
    const rewardNames = ["Champion", "Runner-up", "Third Place"];
    const results = [];
    const fields = Array.isArray(form_fields) && form_fields.length > 0 ? form_fields : ["Full Name", "Phone Number", "Shipping Address"];

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (Number(player.reward_sent) === 1) {
        results.push({ rank: i + 1, name: player.name, email: player.email, status: "already_sent" });
        continue;
      }

      const rewardName = rewardNames[i];
      const title = \`🏆 Quiz Reward: \${rewardName}\`;
      const content = \`Congratulations \${player.name || "Fan"}! You finished \${rewardName} in the quiz: \${quiz.title}. Please submit the required information to claim your reward.\`;

      try {
        await db.query(
          'INSERT INTO user_messages (user_id, quiz_id, title, content, type, form_fields) VALUES (?, ?, ?, ?, ?, ?)',
          [player.user_id, id, title, content, 'REWARD_CLAIM', JSON.stringify(fields)]
        );

        /* MARK REWARD AS SENT */
        await db.query(
          'UPDATE quiz_attempts SET reward_sent = 1, reward_sent_at = NOW() WHERE id = ?',
          [player.attempt_id]
        );

        results.push({ rank: i + 1, name: player.name, email: player.email, status: "sent" });
      } catch (err) {
        console.error('Reward message error:', err);
        results.push({ rank: i + 1, name: player.name, email: player.email, status: "failed", error: err.message });
      }
    }

    const sentCount = results.filter((item) => item.status === "sent").length;
    return res.status(200).json({
      message: sentCount > 0 ? \`Reward process completed. \${sentCount} in-app message(s) sent.\` : "No new reward messages were sent.",
      results,
    });
  } catch (error) {
    console.error("Send quiz rewards error:", error);
    return res.status(500).json({ message: "Failed to send quiz rewards", error: error.message });
  }
};`;

const startIdx = content.indexOf('export const sendQuizRewards = async (');
const nextExportIdx = content.indexOf('export const getQuizAttemptDetails', startIdx);

if (startIdx !== -1 && nextExportIdx !== -1) {
  content = content.substring(0, startIdx) + replacement + '\n\n/*\n========================================================\nUSER - GET ATTEMPT DETAILS\n========================================================\n*/\n\n' + content.substring(nextExportIdx);
  fs.writeFileSync(file, content);
  console.log('Replaced sendQuizRewards successfully');
} else {
  console.log('Could not find boundaries');
}
