import db from "../config/db.js";

// Fetch messages for logged-in user
export const getMyMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const [messages] = await db.query(
      "SELECT * FROM user_messages WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// Submit a reward claim
export const submitRewardClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { claim_data } = req.body;

    const [existing] = await db.query("SELECT * FROM user_messages WHERE id = ? AND user_id = ?", [id, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (existing[0].status === "CLAIMED") {
      return res.status(400).json({ message: "Reward already claimed" });
    }

    await db.query(
      "UPDATE user_messages SET status = 'CLAIMED', claim_data = ? WHERE id = ?",
      [JSON.stringify(claim_data), id]
    );

    res.json({ message: "Reward claim submitted successfully" });
  } catch (error) {
    console.error("Error submitting claim:", error);
    res.status(500).json({ message: "Failed to submit claim" });
  }
};

// Fetch all reward claims for admin
export const getAllRewardClaims = async (req, res) => {
  try {
    const [claims] = await db.query(`
      SELECT m.*, u.name as user_name, u.email as user_email, q.title as quiz_title
      FROM user_messages m
      JOIN users u ON m.user_id = u.id
      LEFT JOIN quizzes q ON m.quiz_id = q.id
      WHERE m.type = 'REWARD_CLAIM'
      ORDER BY m.created_at DESC
    `);
    res.json(claims);
  } catch (error) {
    console.error("Error fetching all claims:", error);
    res.status(500).json({ message: "Failed to fetch reward claims" });
  }
};
