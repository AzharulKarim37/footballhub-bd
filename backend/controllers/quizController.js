import db from "../config/db.js";
import nodemailer from "nodemailer";

/*
========================================================
EMAIL CONFIGURATION
========================================================

Add these to backend/.env:

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password

For Gmail, EMAIL_PASS should be a Google App Password,
not your normal Gmail password.
*/

const createEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

/*
========================================================
CREATE QUIZ
ADMIN ONLY
========================================================
*/

export const createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      time_limit,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Quiz title is required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO quizzes
      (
        title,
        description,
        difficulty,
        time_limit,
        status,
        leaderboard_published,
        created_by
      )
      VALUES (?, ?, ?, ?, 'draft', 0, ?)
      `,
      [
        title.trim(),
        description?.trim() || "",
        difficulty || "Medium",
        Number(time_limit) || 10,
        req.user.id,
      ]
    );

    const [quizzes] = await db.query(
      `
      SELECT
        id,
        title,
        description,
        difficulty,
        time_limit,
        status,
        leaderboard_published,
        created_by,
        created_at,
        updated_at
      FROM quizzes
      WHERE id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json({
      message: "Quiz created successfully",
      quiz: quizzes[0],
    });
  } catch (error) {
    console.error("Create quiz error:", error);

    return res.status(500).json({
      message: "Failed to create quiz",
      error: error.message,
    });
  }
};

/*
========================================================
GET ALL QUIZZES
ADMIN ONLY
========================================================
*/

export const getAllQuizzes = async (req, res) => {
  try {
    const [quizzes] = await db.query(
      `
      SELECT
        q.id,
        q.title,
        q.description,
        q.difficulty,
        q.time_limit,
        q.status,
        q.leaderboard_published,
        q.created_by,
        q.created_at,
        q.updated_at,

        (
          SELECT COUNT(*)
          FROM quiz_questions qq
          WHERE qq.quiz_id = q.id
        ) AS question_count,

        (
          SELECT COUNT(*)
          FROM quiz_attempts qa
          WHERE qa.quiz_id = q.id
        ) AS attempt_count

      FROM quizzes q
      ORDER BY q.created_at DESC
      `
    );

    return res.status(200).json({
      quizzes,
    });
  } catch (error) {
    console.error("Get all quizzes error:", error);

    return res.status(500).json({
      message: "Failed to load quizzes",
      error: error.message,
    });
  }
};

/*
========================================================
GET SINGLE QUIZ
ADMIN ONLY
========================================================
*/

export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const [quizzes] = await db.query(
      `
      SELECT
        id,
        title,
        description,
        difficulty,
        time_limit,
        status,
        leaderboard_published,
        created_by,
        created_at,
        updated_at
      FROM quizzes
      WHERE id = ?
      `,
      [id]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const [questions] = await db.query(
      `
      SELECT
        id,
        quiz_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        question_order
      FROM quiz_questions
      WHERE quiz_id = ?
      ORDER BY question_order ASC, id ASC
      `,
      [id]
    );

    return res.status(200).json({
      quiz: quizzes[0],
      questions,
    });
  } catch (error) {
    console.error("Get quiz error:", error);

    return res.status(500).json({
      message: "Failed to load quiz",
      error: error.message,
    });
  }
};

/*
========================================================
UPDATE QUIZ
ADMIN ONLY
========================================================
*/

export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      difficulty,
      time_limit,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Quiz title is required",
      });
    }

    const [result] = await db.query(
      `
      UPDATE quizzes
      SET
        title = ?,
        description = ?,
        difficulty = ?,
        time_limit = ?
      WHERE id = ?
      `,
      [
        title.trim(),
        description?.trim() || "",
        difficulty || "Medium",
        Number(time_limit) || 10,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const [quizzes] = await db.query(
      `
      SELECT
        id,
        title,
        description,
        difficulty,
        time_limit,
        status,
        leaderboard_published,
        created_by,
        created_at,
        updated_at
      FROM quizzes
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      message: "Quiz updated successfully",
      quiz: quizzes[0],
    });
  } catch (error) {
    console.error("Update quiz error:", error);

    return res.status(500).json({
      message: "Failed to update quiz",
      error: error.message,
    });
  }
};

/*
========================================================
DELETE QUIZ
ADMIN ONLY
========================================================
*/

export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM quizzes
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Delete quiz error:", error);

    return res.status(500).json({
      message: "Failed to delete quiz",
      error: error.message,
    });
  }
};

/*
========================================================
ADD QUESTION
ADMIN ONLY
========================================================
*/

export const addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;

    const {
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
    } = req.body;

    if (
      !question?.trim() ||
      !option_a?.trim() ||
      !option_b?.trim() ||
      !option_c?.trim() ||
      !option_d?.trim() ||
      !correct_answer
    ) {
      return res.status(400).json({
        message: "All question fields are required",
      });
    }

    const correct =
      String(correct_answer).toUpperCase();

    if (!["A", "B", "C", "D"].includes(correct)) {
      return res.status(400).json({
        message: "Invalid correct answer",
      });
    }

    const [quizzes] = await db.query(
      `
      SELECT id, status
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

    if (quizzes[0].status === "published") {
      return res.status(400).json({
        message:
          "Unpublish the quiz before changing its questions.",
      });
    }

    const [lastQuestion] = await db.query(
      `
      SELECT
        COALESCE(MAX(question_order), 0) AS last_order
      FROM quiz_questions
      WHERE quiz_id = ?
      `,
      [quizId]
    );

    const nextOrder =
      Number(lastQuestion[0].last_order) + 1;

    const [result] = await db.query(
      `
      INSERT INTO quiz_questions
      (
        quiz_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        question_order
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        quizId,
        question.trim(),
        option_a.trim(),
        option_b.trim(),
        option_c.trim(),
        option_d.trim(),
        correct,
        nextOrder,
      ]
    );

    const [questions] = await db.query(
      `
      SELECT
        id,
        quiz_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        question_order
      FROM quiz_questions
      WHERE id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json({
      message: "Question added successfully",
      question: questions[0],
    });
  } catch (error) {
    console.error("Add question error:", error);

    return res.status(500).json({
      message: "Failed to add question",
      error: error.message,
    });
  }
};

/*
========================================================
UPDATE QUESTION
ADMIN ONLY
========================================================
*/

export const updateQuestion = async (req, res) => {
  try {
    const {
      quizId,
      questionId,
    } = req.params;

    const {
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
    } = req.body;

    if (
      !question?.trim() ||
      !option_a?.trim() ||
      !option_b?.trim() ||
      !option_c?.trim() ||
      !option_d?.trim() ||
      !correct_answer
    ) {
      return res.status(400).json({
        message: "All question fields are required",
      });
    }

    const correct =
      String(correct_answer).toUpperCase();

    if (!["A", "B", "C", "D"].includes(correct)) {
      return res.status(400).json({
        message: "Invalid correct answer",
      });
    }

    const [quiz] = await db.query(
      `
      SELECT id, status
      FROM quizzes
      WHERE id = ?
      `,
      [quizId]
    );

    if (quiz.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    if (quiz[0].status === "published") {
      return res.status(400).json({
        message:
          "Unpublish the quiz before changing questions.",
      });
    }

    const [result] = await db.query(
      `
      UPDATE quiz_questions
      SET
        question = ?,
        option_a = ?,
        option_b = ?,
        option_c = ?,
        option_d = ?,
        correct_answer = ?
      WHERE id = ?
        AND quiz_id = ?
      `,
      [
        question.trim(),
        option_a.trim(),
        option_b.trim(),
        option_c.trim(),
        option_d.trim(),
        correct,
        questionId,
        quizId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const [questions] = await db.query(
      `
      SELECT
        id,
        quiz_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        question_order
      FROM quiz_questions
      WHERE id = ?
        AND quiz_id = ?
      `,
      [questionId, quizId]
    );

    return res.status(200).json({
      message: "Question updated successfully",
      question: questions[0],
    });
  } catch (error) {
    console.error("Update question error:", error);

    return res.status(500).json({
      message: "Failed to update question",
      error: error.message,
    });
  }
};

/*
========================================================
DELETE QUESTION
ADMIN ONLY
========================================================
*/

export const deleteQuestion = async (req, res) => {
  try {
    const {
      quizId,
      questionId,
    } = req.params;

    const [quiz] = await db.query(
      `
      SELECT status
      FROM quizzes
      WHERE id = ?
      `,
      [quizId]
    );

    if (quiz.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    if (quiz[0].status === "published") {
      return res.status(400).json({
        message:
          "Unpublish the quiz before changing questions.",
      });
    }

    const [result] = await db.query(
      `
      DELETE FROM quiz_questions
      WHERE id = ?
        AND quiz_id = ?
      `,
      [questionId, quizId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    return res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete question error:", error);

    return res.status(500).json({
      message: "Failed to delete question",
      error: error.message,
    });
  }
};

/*
========================================================
PUBLISH / UNPUBLISH QUIZ
========================================================
*/

export const togglePublishQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const [quizzes] = await db.query(
      `
      SELECT
        id,
        status,
        leaderboard_published
      FROM quizzes
      WHERE id = ?
      `,
      [id]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const currentStatus = quizzes[0].status;

    if (currentStatus === "stopped") {
      return res.status(400).json({
        message:
          "Stopped quiz must be resumed before publishing/unpublishing.",
      });
    }

    const newStatus =
      currentStatus === "published"
        ? "draft"
        : "published";

    if (newStatus === "published") {
      const [questions] = await db.query(
        `
        SELECT COUNT(*) AS count
        FROM quiz_questions
        WHERE quiz_id = ?
        `,
        [id]
      );

      if (Number(questions[0].count) === 0) {
        return res.status(400).json({
          message:
            "Add at least one question before publishing.",
        });
      }
    }

    await db.query(
      `
      UPDATE quizzes
      SET
        status = ?,
        leaderboard_published =
          CASE
            WHEN ? = 'draft' THEN 0
            ELSE leaderboard_published
          END
      WHERE id = ?
      `,
      [newStatus, newStatus, id]
    );

    return res.status(200).json({
      message:
        newStatus === "published"
          ? "Quiz published successfully"
          : "Quiz unpublished successfully",
      status: newStatus,
    });
  } catch (error) {
    console.error("Publish quiz error:", error);

    return res.status(500).json({
      message: "Failed to change quiz status",
      error: error.message,
    });
  }
};

/*
========================================================
STOP QUIZ
========================================================
*/

export const stopQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const [quizzes] = await db.query(
      `
      SELECT id, status
      FROM quizzes
      WHERE id = ?
      `,
      [id]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    if (quizzes[0].status !== "published") {
      return res.status(400).json({
        message:
          "Only a published quiz can be stopped.",
      });
    }

    await db.query(
      `
      UPDATE quizzes
      SET
        status = 'stopped',
        stopped_at = NOW()
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      message: "Quiz stopped successfully",
      status: "stopped",
    });
  } catch (error) {
    console.error("Stop quiz error:", error);

    return res.status(500).json({
      message: "Failed to stop quiz",
      error: error.message,
    });
  }
};

/*
========================================================
RESUME QUIZ
========================================================
*/

export const resumeQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const [quizzes] = await db.query(
      `
      SELECT id, status
      FROM quizzes
      WHERE id = ?
      `,
      [id]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    if (quizzes[0].status !== "stopped") {
      return res.status(400).json({
        message: "Quiz is not stopped.",
      });
    }

    await db.query(
      `
      UPDATE quizzes
      SET
        status = 'published',
        stopped_at = NULL
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      message: "Quiz resumed successfully",
      status: "published",
    });
  } catch (error) {
    console.error("Resume quiz error:", error);

    return res.status(500).json({
      message: "Failed to resume quiz",
      error: error.message,
    });
  }
};

/*
========================================================
PUBLISH / UNPUBLISH LEADERBOARD
========================================================
*/

export const toggleLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;

    const [quizzes] = await db.query(
      `
      SELECT
        id,
        title,
        status,
        leaderboard_published
      FROM quizzes
      WHERE id = ?
      `,
      [id]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    if (
      quizzes[0].status !== "published" &&
      quizzes[0].status !== "stopped"
    ) {
      return res.status(400).json({
        message:
          "Publish the quiz before publishing its leaderboard.",
      });
    }

    const newValue =
      Number(quizzes[0].leaderboard_published) === 1
        ? 0
        : 1;

    await db.query(
      `
      UPDATE quizzes
      SET leaderboard_published = ?
      WHERE id = ?
      `,
      [newValue, id]
    );

    return res.status(200).json({
      message:
        newValue === 1
          ? "Leaderboard published successfully"
          : "Leaderboard unpublished successfully",
      leaderboard_published: newValue,
    });
  } catch (error) {
    console.error("Toggle leaderboard error:", error);

    return res.status(500).json({
      message: "Failed to change leaderboard status",
      error: error.message,
    });
  }
};

/*
========================================================
PUBLIC — GET PUBLISHED QUIZZES
========================================================
*/

export const getPublishedQuizzes = async (req, res) => {
  try {
    const [quizzes] = await db.query(
      `
      SELECT
        q.id,
        q.title,
        q.description,
        q.difficulty,
        q.time_limit,
        q.leaderboard_published,
        q.created_at,

        COUNT(qq.id) AS question_count

      FROM quizzes q

      LEFT JOIN quiz_questions qq
        ON q.id = qq.quiz_id

      WHERE q.status = 'published'

      GROUP BY
        q.id,
        q.title,
        q.description,
        q.difficulty,
        q.time_limit,
        q.leaderboard_published,
        q.created_at

      ORDER BY q.created_at DESC
      `
    );

    return res.status(200).json({
      quizzes,
    });
  } catch (error) {
    console.error(
      "Get published quizzes error:",
      error
    );

    return res.status(500).json({
      message: "Failed to load quizzes",
      error: error.message,
    });
  }
};

/*
========================================================
PUBLIC — GET PUBLISHED QUIZ
DO NOT SEND CORRECT ANSWERS
========================================================
*/

export const getPublishedQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const [quizzes] = await db.query(
      `
      SELECT
        id,
        title,
        description,
        difficulty,
        time_limit,
        status,
        leaderboard_published,
        created_at
      FROM quizzes
      WHERE id = ?
        AND status = 'published'
      `,
      [id]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({
        message:
          "Quiz not found or quiz is not active.",
      });
    }

    const [questions] = await db.query(
      `
      SELECT
        id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        question_order
      FROM quiz_questions
      WHERE quiz_id = ?
      ORDER BY question_order ASC, id ASC
      `,
      [id]
    );

    return res.status(200).json({
      quiz: quizzes[0],
      questions,
    });
  } catch (error) {
    console.error(
      "Get published quiz error:",
      error
    );

    return res.status(500).json({
      message: "Failed to load published quiz",
      error: error.message,
    });
  }
};

/*
========================================================
START QUIZ ATTEMPT
USER ONLY
========================================================
*/

export const startQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

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

    if (quizzes[0].status !== "published") {
      return res.status(400).json({
        message:
          "This quiz is not currently available.",
      });
    }

    /*
    ------------------------------------------------------
    CHECK EXISTING ATTEMPT
    ------------------------------------------------------
    */

    const [existingAttempts] = await db.query(
      `
      SELECT
        id,
        score,
        correct_answers,
        total_questions,
        started_at,
        completed_at
      FROM quiz_attempts
      WHERE quiz_id = ?
        AND user_id = ?
      LIMIT 1
      `,
      [quizId, userId]
    );

    if (existingAttempts.length > 0) {
      return res.status(409).json({
        message:
          "You have already attempted this quiz.",
        attempt: existingAttempts[0],
      });
    }

    /*
    ------------------------------------------------------
    COUNT QUESTIONS
    ------------------------------------------------------
    */

    const [questionCount] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM quiz_questions
      WHERE quiz_id = ?
      `,
      [quizId]
    );

    const totalQuestions =
      Number(questionCount[0].total);

    if (totalQuestions === 0) {
      return res.status(400).json({
        message: "This quiz has no questions.",
      });
    }

    /*
    ------------------------------------------------------
    CREATE ATTEMPT
    ------------------------------------------------------
    */

    try {
      const [result] = await db.query(
        `
        INSERT INTO quiz_attempts
        (
          quiz_id,
          user_id,
          score,
          correct_answers,
          total_questions,
          started_at
        )
        VALUES (?, ?, 0, 0, ?, NOW())
        `,
        [
          quizId,
          userId,
          totalQuestions,
        ]
      );

      return res.status(201).json({
        message: "Quiz attempt started",
        attemptId: result.insertId,
        totalQuestions,
      });
    } catch (insertError) {
      /*
      Database-level protection if UNIQUE
      (quiz_id, user_id) exists.
      */

      if (
        insertError.code === "ER_DUP_ENTRY"
      ) {
        return res.status(409).json({
          message:
            "You have already attempted this quiz.",
        });
      }

      throw insertError;
    }
  } catch (error) {
    console.error(
      "Start quiz attempt error:",
      error
    );

    return res.status(500).json({
      message: "Failed to start quiz",
      error: error.message,
    });
  }
};

/*
========================================================
COMPLETE QUIZ ATTEMPT
SERVER CALCULATES SCORE
========================================================
*/

export const completeQuizAttempt = async (
  req,
  res
) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message:
          "Answers must be an array.",
      });
    }

    /*
    ------------------------------------------------------
    FIND ATTEMPT
    ------------------------------------------------------
    */

    const [attempts] = await db.query(
      `
      SELECT
        id,
        completed_at
      FROM quiz_attempts
      WHERE quiz_id = ?
        AND user_id = ?
      LIMIT 1
      `,
      [quizId, userId]
    );

    if (attempts.length === 0) {
      return res.status(404).json({
        message:
          "Quiz attempt not found.",
      });
    }

    if (attempts[0].completed_at) {
      return res.status(409).json({
        message:
          "This quiz attempt has already been completed.",
      });
    }

    /*
    ------------------------------------------------------
    GET CORRECT ANSWERS FROM DATABASE
    ------------------------------------------------------
    */

    const [questions] = await db.query(
      `
      SELECT
        id,
        correct_answer
      FROM quiz_questions
      WHERE quiz_id = ?
      ORDER BY question_order ASC, id ASC
      `,
      [quizId]
    );

    if (questions.length === 0) {
      return res.status(400).json({
        message:
          "Quiz has no questions.",
      });
    }

    /*
    ------------------------------------------------------
    CREATE ANSWER MAP
    ------------------------------------------------------
    */

    const answerMap = new Map();

    for (const answer of answers) {
      if (
        answer &&
        answer.question_id !== undefined
      ) {
        answerMap.set(
          Number(answer.question_id),
          String(
            answer.answer || ""
          ).toUpperCase()
        );
      }
    }

    /*
    ------------------------------------------------------
    CALCULATE SCORE
    ------------------------------------------------------
    */

    let correctAnswers = 0;

    for (const question of questions) {
      const userAnswer =
        answerMap.get(
          Number(question.id)
        );

      const correctAnswer =
        String(
          question.correct_answer
        ).toUpperCase();

      if (
        userAnswer &&
        userAnswer === correctAnswer
      ) {
        correctAnswers++;
      }
    }

    const totalQuestions =
      questions.length;

    const score = correctAnswers;

    /*
    ------------------------------------------------------
    SAVE RESULT
    ------------------------------------------------------
    */

    const [result] = await db.query(
      `
      UPDATE quiz_attempts
      SET
        score = ?,
        correct_answers = ?,
        total_questions = ?,
        completed_at = NOW(),
        user_answers_json = ?
      WHERE quiz_id = ?
        AND user_id = ?
        AND completed_at IS NULL
      `,
      [
        score,
        correctAnswers,
        totalQuestions,
        JSON.stringify(answers),
        quizId,
        userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(409).json({
        message:
          "Quiz attempt has already been completed.",
      });
    }

    /*
    ------------------------------------------------------
    GET SAVED RESULT
    ------------------------------------------------------
    */

    const [updatedAttempts] =
      await db.query(
        `
        SELECT
          id,
          quiz_id,
          user_id,
          score,
          correct_answers,
          total_questions,
          started_at,
          completed_at
        FROM quiz_attempts
        WHERE quiz_id = ?
          AND user_id = ?
        LIMIT 1
        `,
        [quizId, userId]
      );

    return res.status(200).json({
      message:
        "Quiz attempt completed successfully",
      attempt:
        updatedAttempts[0],
    });
  } catch (error) {
    console.error(
      "Complete quiz attempt error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to complete quiz attempt",
      error: error.message,
    });
  }
};

/*
========================================================
USER — MY QUIZ ATTEMPTS
========================================================
*/

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

        q.title,
        q.description,
        q.difficulty,
        q.status AS quiz_status,
        q.leaderboard_published,

        qa.score,
        qa.correct_answers,
        qa.total_questions,

        qa.started_at,
        qa.completed_at,

        qa.reward_sent,
        qa.reward_sent_at,

        (
          SELECT COUNT(*) + 1 
          FROM quiz_attempts qa2 
          WHERE qa2.quiz_id = qa.quiz_id 
            AND qa2.completed_at IS NOT NULL 
            AND (
              qa2.score > qa.score 
              OR (qa2.score = qa.score AND qa2.completed_at < qa.completed_at)
            )
        ) AS user_rank

      FROM quiz_attempts qa

      INNER JOIN quizzes q
        ON qa.quiz_id = q.id

      WHERE qa.user_id = ?

      ORDER BY
        qa.completed_at DESC,
        qa.started_at DESC
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
        "Failed to load your quiz attempts",
      error: error.message,
    });
  }
};

/*
========================================================
USER — QUIZ LEADERBOARD
ONLY WHEN ADMIN PUBLISHES IT
========================================================
*/

export const getQuizLeaderboard = async (
  req,
  res
) => {
  try {
    const { quizId } = req.params;

    const [quiz] = await db.query(
      `
      SELECT
        id,
        title,
        status,
        leaderboard_published
      FROM quizzes
      WHERE id = ?
      `,
      [quizId]
    );

    if (quiz.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    if (
      Number(quiz[0].leaderboard_published) !== 1 &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Leaderboard has not been published yet.",
      });
    }

    const [leaderboard] =
      await db.query(
        `
        SELECT
          qa.id AS attempt_id,
          qa.user_id,

          u.name,
          u.email,

          qa.score,
          qa.correct_answers,
          qa.total_questions,
          qa.completed_at

        FROM quiz_attempts qa

        INNER JOIN users u
          ON qa.user_id = u.id

        WHERE qa.quiz_id = ?
          AND qa.completed_at IS NOT NULL

        ORDER BY
          qa.score DESC,
          qa.correct_answers DESC,
          qa.completed_at ASC,
          qa.id ASC
        `,
        [quizId]
      );

    const rankedLeaderboard =
      leaderboard.map(
        (player, index) => ({
          rank: index + 1,
          ...player,
        })
      );

    return res.status(200).json({
      quiz: quiz[0],
      leaderboard:
        rankedLeaderboard,
    });
  } catch (error) {
    console.error(
      "Get quiz leaderboard error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load leaderboard",
      error: error.message,
    });
  }
};

/*
========================================================
ADMIN — GET ALL QUIZ ATTEMPTS
========================================================
*/

export const getQuizAttempts = async (
  req,
  res
) => {
  try {
    const { quizId } = req.params;

    const [quiz] = await db.query(
      `
      SELECT
        id,
        title,
        status,
        leaderboard_published
      FROM quizzes
      WHERE id = ?
      `,
      [quizId]
    );

    if (quiz.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const [attempts] =
      await db.query(
        `
        SELECT
          qa.id AS attempt_id,
          qa.quiz_id,
          qa.user_id,

          u.name,
          u.email,

          qa.score,
          qa.correct_answers,
          qa.total_questions,

          qa.started_at,
          qa.completed_at,

          qa.reward_sent,
          qa.reward_sent_at

        FROM quiz_attempts qa

        INNER JOIN users u
          ON qa.user_id = u.id

        WHERE qa.quiz_id = ?

        ORDER BY
          CASE
            WHEN qa.completed_at IS NULL
            THEN 1
            ELSE 0
          END,
          qa.score DESC,
          qa.correct_answers DESC,
          qa.completed_at ASC,
          qa.id ASC
        `,
        [quizId]
      );

    const completedAttempts =
      attempts.filter(
        (attempt) =>
          attempt.completed_at
      );

    const rankedAttempts =
      completedAttempts.map(
        (attempt, index) => ({
          rank: index + 1,
          ...attempt,
        })
      );

    return res.status(200).json({
      quiz: quiz[0],
      attempts,
      leaderboard:
        rankedAttempts,
    });
  } catch (error) {
    console.error(
      "Get quiz attempts error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load quiz attempts",
      error: error.message,
    });
  }
};

/*
========================================================
ADMIN — SEND REWARDS
========================================================

Rewards are sent to the top 3 completed users.

1st = Champion
2nd = Runner-up
3rd = Third Place

reward_sent is updated only after the email
is successfully sent.
========================================================
*/

export const sendQuizRewards = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    /*
    ------------------------------------------------------
    GET QUIZ
    ------------------------------------------------------
    */

    const [quizzes] = await db.query(
      `
      SELECT
        id,
        title,
        leaderboard_published
      FROM quizzes
      WHERE id = ?
      `,
      [id]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const quiz = quizzes[0];

    /*
    ------------------------------------------------------
    GET TOP 3
    ------------------------------------------------------
    */

    const [players] =
      await db.query(
        `
        SELECT
          qa.id AS attempt_id,
          qa.user_id,

          u.name,
          u.email,

          qa.score,
          qa.correct_answers,
          qa.total_questions,

          qa.reward_sent,
          qa.reward_sent_at,

          qa.completed_at

        FROM quiz_attempts qa

        INNER JOIN users u
          ON qa.user_id = u.id

        WHERE qa.quiz_id = ?
          AND qa.completed_at IS NOT NULL

        ORDER BY
          qa.score DESC,
          qa.correct_answers DESC,
          qa.completed_at ASC,
          qa.id ASC

        LIMIT 3
        `,
        [id]
      );

    if (players.length === 0) {
      return res.status(400).json({
        message:
          "There are no completed quiz attempts yet.",
      });
    }

    /*
    ------------------------------------------------------
    CHECK EMAIL CONFIGURATION
    ------------------------------------------------------
    */

    let transporter = createEmailTransporter();

    if (!transporter) {
      console.warn("EMAIL_USER not configured. Mocking reward emails...");
      // Mock transporter
      transporter = {
        sendMail: async (options) => {
          console.log(`[MOCK EMAIL] Sent to ${options.to}: ${options.subject}`);
          return true;
        }
      };
    }

    /*
    ------------------------------------------------------
    SEND EMAILS
    ------------------------------------------------------
    */

    const rewardNames = [
      "Champion",
      "Runner-up",
      "Third Place",
    ];

    const results = [];

    for (
      let i = 0;
      i < players.length;
      i++
    ) {
      const player = players[i];

      /*
      Do not send another reward email
      if reward was already sent.
      */

      if (
        Number(player.reward_sent) === 1
      ) {
        results.push({
          rank: i + 1,
          name: player.name,
          email: player.email,
          status: "already_sent",
        });

        continue;
      }

      if (!player.email) {
        results.push({
          rank: i + 1,
          name: player.name,
          email: null,
          status: "no_email",
        });

        continue;
      }

      const rewardName =
        rewardNames[i];

      const percentage =
        player.total_questions > 0
          ? Math.round(
              (player.correct_answers /
                player.total_questions) *
                100
            )
          : 0;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,

          to: player.email,

          subject:
            `🏆 Football Hub BD Quiz Reward - ${rewardName}`,

          html: `
            <div style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: auto;
              padding: 30px;
              background: #f5f7f6;
              border-radius: 12px;
            ">

              <div style="
                background: #006b3c;
                color: white;
                padding: 25px;
                border-radius: 10px;
                text-align: center;
              ">

                <h1>
                  🏆 Congratulations!
                </h1>

                <p>
                  Football Hub BD Quiz
                </p>

              </div>

              <div style="
                background: white;
                padding: 25px;
                margin-top: 15px;
                border-radius: 10px;
              ">

                <h2>
                  ${player.name || "Football Fan"}
                </h2>

                <p>
                  You finished
                  <strong>${rewardName}</strong>
                  in:
                </p>

                <h2>
                  ${quiz.title}
                </h2>

                <hr />

                <p>
                  <strong>Score:</strong>
                  ${player.score}/${player.total_questions}
                </p>

                <p>
                  <strong>Correct Answers:</strong>
                  ${player.correct_answers}
                </p>

                <p>
                  <strong>Accuracy:</strong>
                  ${percentage}%
                </p>

                <p>
                  Your performance earned you a
                  <strong>${rewardName}</strong>
                  reward from Football Hub BD.
                </p>

                <p>
                  Thank you for participating and
                  supporting football in Bangladesh.
                </p>

              </div>

              <p style="
                text-align: center;
                color: #777;
                margin-top: 20px;
              ">
                Football Hub BD
              </p>

            </div>
          `,
        });

        /*
        --------------------------------------------------
        MARK REWARD AS SENT
        --------------------------------------------------
        */

        await db.query(
          `
          UPDATE quiz_attempts
          SET
            reward_sent = 1,
            reward_sent_at = NOW()
          WHERE id = ?
          `,
          [player.attempt_id]
        );

        results.push({
          rank: i + 1,
          name: player.name,
          email: player.email,
          status: "sent",
        });
      } catch (emailError) {
        console.error(
          `Reward email error for ${player.email}:`,
          emailError
        );

        results.push({
          rank: i + 1,
          name: player.name,
          email: player.email,
          status: "failed",
          error: emailError.message,
        });
      }
    }

    const sentCount =
      results.filter(
        (item) =>
          item.status === "sent"
      ).length;

    return res.status(200).json({
      message:
        sentCount > 0
          ? `Reward process completed. ${sentCount} reward email(s) sent.`
          : "No new reward emails were sent.",

      results,
    });
  } catch (error) {
    console.error(
      "Send quiz rewards error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to send quiz rewards",
      error: error.message,
    });
  }
};

/*
========================================================
USER - GET ATTEMPT DETAILS
========================================================
*/

export const getQuizAttemptDetails = async (req, res) => {
  try {
    const { quizId, attemptId } = req.params;
    const userId = req.user.id;

    // Get the attempt info
    const [attempts] = await db.query(
      `SELECT id, quiz_id, score, correct_answers, total_questions, started_at, completed_at, user_answers_json
       FROM quiz_attempts
       WHERE id = ? AND quiz_id = ? AND user_id = ?`,
      [attemptId, quizId, userId]
    );

    if (attempts.length === 0) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    const attempt = attempts[0];

    // Get the quiz questions and correct answers
    const [questions] = await db.query(
      `SELECT id, question as question_text, option_a, option_b, option_c, option_d, correct_answer
       FROM quiz_questions
       WHERE quiz_id = ?
       ORDER BY question_order ASC, id ASC`,
      [quizId]
    );

    const formattedQuestions = questions.map(q => ({
      id: q.id,
      question_text: q.question_text,
      correct_answer: q.correct_answer,
      options_json: {
        A: q.option_a,
        B: q.option_b,
        C: q.option_c,
        D: q.option_d
      }
    }));

    return res.status(200).json({
      attempt,
      questions: formattedQuestions
    });
  } catch (error) {
    console.error('Get attempt details error:', error);
    return res.status(500).json({ message: 'Failed to load attempt details', error: error.message });
  }
};
