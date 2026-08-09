import db from "../config/db.js";

// ======================================================
// SUBMIT QUIZ ATTEMPT
// USER ONLY
// ======================================================

export const submitQuizAttempt = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      quiz_id,
      score,
      correct_answers,
      total_questions,
      started_at,
    } = req.body;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!quiz_id) {
      return res.status(400).json({
        message: "Quiz ID is required",
      });
    }

    if (
      score === undefined ||
      score === null
    ) {
      return res.status(400).json({
        message: "Score is required",
      });
    }

    if (
      correct_answers === undefined ||
      correct_answers === null
    ) {
      return res.status(400).json({
        message: "Correct answers are required",
      });
    }

    if (
      total_questions === undefined ||
      total_questions === null
    ) {
      return res.status(400).json({
        message: "Total questions are required",
      });
    }

    const quizId = Number(quiz_id);
    const finalScore = Number(score);
    const correctAnswers = Number(correct_answers);
    const totalQuestions = Number(total_questions);

    // --------------------------------------------------
    // NUMBER VALIDATION
    // --------------------------------------------------

    if (
      !Number.isInteger(quizId) ||
      quizId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid quiz ID",
      });
    }

    if (
      !Number.isInteger(finalScore) ||
      finalScore < 0
    ) {
      return res.status(400).json({
        message: "Invalid score",
      });
    }

    if (
      !Number.isInteger(correctAnswers) ||
      correctAnswers < 0
    ) {
      return res.status(400).json({
        message: "Invalid correct answers",
      });
    }

    if (
      !Number.isInteger(totalQuestions) ||
      totalQuestions <= 0
    ) {
      return res.status(400).json({
        message: "Invalid total questions",
      });
    }

    if (correctAnswers > totalQuestions) {
      return res.status(400).json({
        message:
          "Correct answers cannot exceed total questions",
      });
    }

    // --------------------------------------------------
    // CHECK QUIZ
    // --------------------------------------------------

    const [quizzes] = await db.query(
      `
      SELECT
        id,
        title,
        status
      FROM quizzes
      WHERE id = ?
      `,
      [quizId]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const quiz = quizzes[0];

    // Only published quizzes can be attempted

    if (quiz.status !== "published") {
      return res.status(400).json({
        message:
          "This quiz is not currently available",
      });
    }

    // --------------------------------------------------
    // CHECK ACTUAL QUESTION COUNT
    // --------------------------------------------------

    const [questionCount] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM quiz_questions
      WHERE quiz_id = ?
      `,
      [quizId]
    );

    const actualQuestionCount =
      Number(questionCount[0].total);

    if (
      actualQuestionCount !== totalQuestions
    ) {
      return res.status(400).json({
        message:
          "Invalid total question count",
      });
    }

    // --------------------------------------------------
    // START TIME
    // --------------------------------------------------

    let startedAt = null;

    if (started_at) {
      const parsedDate =
        new Date(started_at);

      if (!isNaN(parsedDate.getTime())) {
        startedAt = parsedDate;
      }
    }

    // --------------------------------------------------
    // SAVE ATTEMPT
    // --------------------------------------------------

    const [result] = await db.query(
      `
      INSERT INTO quiz_attempts
      (
        quiz_id,
        user_id,
        score,
        correct_answers,
        total_questions,
        started_at,
        completed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        quizId,
        userId,
        finalScore,
        correctAnswers,
        totalQuestions,
        startedAt,
      ]
    );

    // --------------------------------------------------
    // GET SAVED ATTEMPT
    // --------------------------------------------------

    const [attempts] = await db.query(
      `
      SELECT
        qa.id,
        qa.quiz_id,
        qa.user_id,
        qa.score,
        qa.correct_answers,
        qa.total_questions,
        qa.started_at,
        qa.completed_at,
        q.title AS quiz_title
      FROM quiz_attempts qa
      JOIN quizzes q
        ON qa.quiz_id = q.id
      WHERE qa.id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json({
      message:
        "Quiz attempt saved successfully",

      attempt: attempts[0],
    });

  } catch (error) {
    console.error(
      "Submit quiz attempt error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to save quiz attempt",

      error: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
    });
  }
};


// ======================================================
// GET MY QUIZ ATTEMPTS
// USER ONLY
// ======================================================

export const getMyQuizAttempts = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const [attempts] = await db.query(
      `
      SELECT
        qa.id,
        qa.quiz_id,
        q.title AS quiz_title,
        q.description AS quiz_description,
        q.difficulty,
        qa.score,
        qa.correct_answers,
        qa.total_questions,
        qa.started_at,
        qa.completed_at
      FROM quiz_attempts qa
      JOIN quizzes q
        ON qa.quiz_id = q.id
      WHERE qa.user_id = ?
      ORDER BY
        qa.completed_at DESC,
        qa.id DESC
      `,
      [userId]
    );

    return res.status(200).json({
      attempts,
    });

  } catch (error) {
    console.error(
      "Get my quiz attempts error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load quiz attempts",

      error: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
    });
  }
};


// ======================================================
// GET MY BEST ATTEMPT FOR A QUIZ
// USER ONLY
// ======================================================

export const getMyBestQuizAttempt = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;
    const { quizId } = req.params;

    if (!quizId) {
      return res.status(400).json({
        message: "Quiz ID is required",
      });
    }

    const [attempts] = await db.query(
      `
      SELECT
        qa.id,
        qa.quiz_id,
        q.title AS quiz_title,
        qa.score,
        qa.correct_answers,
        qa.total_questions,
        qa.started_at,
        qa.completed_at
      FROM quiz_attempts qa
      JOIN quizzes q
        ON qa.quiz_id = q.id
      WHERE qa.user_id = ?
        AND qa.quiz_id = ?
      ORDER BY
        qa.correct_answers DESC,
        qa.score DESC,
        qa.completed_at DESC
      LIMIT 1
      `,
      [
        userId,
        quizId,
      ]
    );

    if (attempts.length === 0) {
      return res.status(200).json({
        attempt: null,
      });
    }

    return res.status(200).json({
      attempt: attempts[0],
    });

  } catch (error) {
    console.error(
      "Get best quiz attempt error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load best quiz attempt",

      error: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
    });
  }
};