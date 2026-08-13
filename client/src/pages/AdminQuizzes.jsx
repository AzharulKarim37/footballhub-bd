import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminQuizzes.css";

const API_URL = "http://localhost:5001/api/quizzes";

function AdminQuizzes() {
  const navigate = useNavigate();

  // ============================================================
  // STATE
  // ============================================================

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [attempts, setAttempts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const [saving, setSaving] = useState(false);
  const [sendingRewards, setSendingRewards] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const [showAttempts, setShowAttempts] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    difficulty: "Medium",
    time_limit: 10,
    category: "",
  });

  const [questionForm, setQuestionForm] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
  });

  // ============================================================
  // AUTH
  // ============================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  };

  // ============================================================
  // RESET MESSAGE
  // ============================================================

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  // ============================================================
  // ADMIN CHECK
  // ============================================================

  useEffect(() => {
    const user = getUser();

    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    loadQuizzes();
  }, [navigate]);

  // ============================================================
  // LOAD ALL QUIZZES
  // ============================================================

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load quizzes"
        );
      }

      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error("Load quizzes error:", error);

      setError(
        error.message || "Failed to load quizzes"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD SINGLE QUIZ
  // ============================================================

  const loadQuiz = async (quizId) => {
    try {
      setLoadingQuiz(true);
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load quiz"
        );
      }

      setSelectedQuiz(data.quiz);
      setQuestions(data.questions || []);

      setQuizForm({
        title: data.quiz.title || "",
        description: data.quiz.description || "",
        difficulty:
          data.quiz.difficulty || "Medium",
        time_limit:
          data.quiz.time_limit || 10,
        category:
          data.quiz.category || "",
      });

      setEditingQuiz(false);
      setEditingQuestionId(null);

      setAttempts([]);
      setLeaderboard([]);

      setShowAttempts(false);
      setShowLeaderboard(false);

      resetQuestionForm();
    } catch (error) {
      console.error("Load quiz error:", error);

      setError(
        error.message || "Failed to load quiz"
      );
    } finally {
      setLoadingQuiz(false);
    }
  };

  // ============================================================
  // RESET QUESTION FORM
  // ============================================================

  const resetQuestionForm = () => {
    setQuestionForm({
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A",
    });
  };

  // ============================================================
  // CREATE QUIZ
  // ============================================================

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      clearMessages();

      const token = getToken();

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          ...quizForm,
          time_limit: Number(
            quizForm.time_limit
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create quiz"
        );
      }

      setMessage(
        "Quiz created successfully."
      );

      setShowCreate(false);

      setQuizForm({
        title: "",
        description: "",
        difficulty: "Medium",
        time_limit: 10,
        category: "",
      });

      await loadQuizzes();

      if (data.quiz?.id) {
        await loadQuiz(data.quiz.id);
      }
    } catch (error) {
      console.error(
        "Create quiz error:",
        error
      );

      setError(
        error.message ||
          "Failed to create quiz"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // UPDATE QUIZ
  // ============================================================

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();

    if (!selectedQuiz) return;

    try {
      setSaving(true);
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${selectedQuiz.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...quizForm,
            time_limit: Number(
              quizForm.time_limit
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update quiz"
        );
      }

      setSelectedQuiz(data.quiz);

      setEditingQuiz(false);

      setMessage(
        "Quiz updated successfully."
      );

      await loadQuizzes();
    } catch (error) {
      console.error(
        "Update quiz error:",
        error
      );

      setError(
        error.message ||
          "Failed to update quiz"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE QUIZ
  // ============================================================

  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) return;

    const confirmed = window.confirm(
      `Delete "${selectedQuiz.title}" and all its questions and attempts?`
    );

    if (!confirmed) return;

    try {
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${selectedQuiz.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete quiz"
        );
      }

      setSelectedQuiz(null);
      setQuestions([]);
      setAttempts([]);
      setLeaderboard([]);

      setEditingQuiz(false);
      setEditingQuestionId(null);

      setShowAttempts(false);
      setShowLeaderboard(false);

      setMessage(
        "Quiz deleted successfully."
      );

      await loadQuizzes();
    } catch (error) {
      console.error(
        "Delete quiz error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete quiz"
      );
    }
  };

  // ============================================================
  // PUBLISH / UNPUBLISH
  // ============================================================

  const handlePublish = async () => {
    if (!selectedQuiz) return;

    try {
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${selectedQuiz.id}/publish`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to change quiz status"
        );
      }

      setSelectedQuiz((previous) => ({
        ...previous,
        status:
          data.status ||
          (previous.status === "published"
            ? "draft"
            : "published"),
      }));

      setMessage(
        data.message ||
          "Quiz status updated."
      );

      await loadQuizzes();
    } catch (error) {
      console.error(
        "Publish quiz error:",
        error
      );

      setError(
        error.message ||
          "Failed to change quiz status"
      );
    }
  };

  // ============================================================
  // STOP QUIZ
  // ============================================================

  const handleStopQuiz = async () => {
    if (!selectedQuiz) return;

    try {
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${selectedQuiz.id}/stop`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to stop quiz"
        );
      }

      setSelectedQuiz((previous) => ({
        ...previous,
        status: "stopped",
        stopped_at:
          data.stopped_at ||
          new Date().toISOString(),
      }));

      setMessage(
        data.message ||
          "Quiz stopped successfully."
      );

      await loadQuizzes();
    } catch (error) {
      console.error(
        "Stop quiz error:",
        error
      );

      setError(
        error.message ||
          "Failed to stop quiz"
      );
    }
  };

  // ============================================================
  // RESUME QUIZ
  // ============================================================

  const handleResumeQuiz = async () => {
    if (!selectedQuiz) return;

    try {
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${selectedQuiz.id}/resume`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to resume quiz"
        );
      }

      setSelectedQuiz((previous) => ({
        ...previous,
        status:
          data.status || "published",
        stopped_at: null,
      }));

      setMessage(
        data.message ||
          "Quiz resumed successfully."
      );

      await loadQuizzes();
    } catch (error) {
      console.error(
        "Resume quiz error:",
        error
      );

      setError(
        error.message ||
          "Failed to resume quiz"
      );
    }
  };

  // ============================================================
  // LEADERBOARD VISIBILITY
  // ============================================================

  const handleToggleLeaderboard = async () => {
    if (!selectedQuiz) return;

    try {
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${selectedQuiz.id}/leaderboard`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to change leaderboard status"
        );
      }

      setSelectedQuiz((previous) => ({
        ...previous,
        leaderboard_published:
          data.leaderboard_published ??
          data.status ??
          !previous.leaderboard_published,
      }));

      setMessage(
        data.message ||
          "Leaderboard visibility updated."
      );

      await loadQuizzes();
    } catch (error) {
      console.error(
        "Leaderboard toggle error:",
        error
      );

      setError(
        error.message ||
          "Failed to change leaderboard status"
      );
    }
  };

  // ============================================================
  // ADD QUESTION
  // ============================================================

  const handleAddQuestion = async (e) => {
    e.preventDefault();

    if (!selectedQuiz) return;

    try {
      setSaving(true);
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${selectedQuiz.id}/questions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(
            questionForm
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add question"
        );
      }

      setQuestions((previous) => [
        ...previous,
        data.question,
      ]);

      resetQuestionForm();

      setMessage(
        "Question added successfully."
      );

      await loadQuizzes();
    } catch (error) {
      console.error(
        "Add question error:",
        error
      );

      setError(
        error.message ||
          "Failed to add question"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // UPDATE QUESTION
  // ============================================================

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();

    if (
      !selectedQuiz ||
      !editingQuestionId
    ) {
      return;
    }

    try {
      setSaving(true);
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${selectedQuiz.id}/questions/${editingQuestionId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(
            questionForm
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update question"
        );
      }

      setQuestions((previous) =>
        previous.map((question) =>
          Number(question.id) ===
          Number(editingQuestionId)
            ? data.question
            : question
        )
      );

      setEditingQuestionId(null);

      resetQuestionForm();

      setMessage(
        "Question updated successfully."
      );

      await loadQuizzes();
    } catch (error) {
      console.error(
        "Update question error:",
        error
      );

      setError(
        error.message ||
          "Failed to update question"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE QUESTION
  // ============================================================

  const handleDeleteQuestion = async (
    questionId
  ) => {
    if (!selectedQuiz) return;

    const confirmed = window.confirm(
      "Delete this question?"
    );

    if (!confirmed) return;

    try {
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${selectedQuiz.id}/questions/${questionId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete question"
        );
      }

      setQuestions((previous) =>
        previous.filter(
          (question) =>
            Number(question.id) !==
            Number(questionId)
        )
      );

      setMessage(
        "Question deleted successfully."
      );

      await loadQuizzes();
    } catch (error) {
      console.error(
        "Delete question error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete question"
      );
    }
  };

  // ============================================================
  // EDIT QUESTION
  // ============================================================

  const startQuestionEdit = (question) => {
    setEditingQuestionId(question.id);

    setQuestionForm({
      question:
        question.question || "",
      option_a:
        question.option_a || "",
      option_b:
        question.option_b || "",
      option_c:
        question.option_c || "",
      option_d:
        question.option_d || "",
      correct_answer:
        question.correct_answer || "A",
    });

    window.scrollTo({
      top: 400,
      behavior: "smooth",
    });
  };

  // ============================================================
  // CANCEL QUESTION EDIT
  // ============================================================

  const cancelQuestionEdit = () => {
    setEditingQuestionId(null);
    resetQuestionForm();
  };

  // ============================================================
  // LOAD ATTEMPTS
  // ============================================================

  const loadAttempts = async () => {
    if (!selectedQuiz) return;

    try {
      setLoadingAttempts(true);
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${selectedQuiz.id}/attempts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load quiz attempts"
        );
      }

      setAttempts(
        data.attempts || []
      );

      setShowAttempts(true);
    } catch (error) {
      console.error(
        "Load attempts error:",
        error
      );

      setError(
        error.message ||
          "Failed to load quiz attempts"
      );
    } finally {
      setLoadingAttempts(false);
    }
  };

  // ============================================================
  // LOAD LEADERBOARD
  // ============================================================

  const loadLeaderboard = async () => {
    if (!selectedQuiz) return;

    try {
      setLoadingLeaderboard(true);
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${selectedQuiz.id}/leaderboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load leaderboard"
        );
      }

      setLeaderboard(
        data.leaderboard || []
      );

      setShowLeaderboard(true);
    } catch (error) {
      console.error(
        "Load leaderboard error:",
        error
      );

      setError(
        error.message ||
          "Failed to load leaderboard"
      );
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  // ============================================================
  // SEND REWARDS
  // ============================================================

  const handleSendRewards = async () => {
    if (!selectedQuiz) return;

    if (
      !window.confirm(
        "Send rewards to the top users of this quiz?"
      )
    ) {
      return;
    }

    try {
      setSendingRewards(true);
      clearMessages();

      const token = getToken();

      const response = await fetch(
        `${API_URL}/${selectedQuiz.id}/rewards`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send rewards"
        );
      }

      setMessage(
        data.message ||
          "Rewards sent successfully."
      );

      await loadAttempts();
    } catch (error) {
      console.error(
        "Send rewards error:",
        error
      );

      setError(
        error.message ||
          "Failed to send rewards"
      );
    } finally {
      setSendingRewards(false);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="quiz-admin-page">
        <div className="empty-state">
          <h2>Loading Quiz Management...</h2>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="quiz-admin-page">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside className="quiz-admin-sidebar">

        <div className="quiz-admin-logo">

          <img
            src="/src/assets/logos/logo.png"
            alt="Football Hub BD"
          />

          <h2>
            Football Hub BD
          </h2>

          <span>
            ADMIN PANEL
          </span>

        </div>

        <nav>

          <Link to="/admin/dashboard">
            Dashboard
          </Link>

          <Link
            to="/admin/quizzes"
            className="active"
          >
            Quiz Management
          </Link>

          <Link to="/">
            View Website
          </Link>

        </nav>

        <button
          className="quiz-sidebar-logout"
          onClick={logout}
        >
          Logout
        </button>

      </aside>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="quiz-admin-main">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="quiz-page-header">

          <div>
            <h1>
              Quiz Management
            </h1>

            <p>
              Create, manage, publish and monitor quizzes.
            </p>
          </div>

          <button
            className="create-quiz-button"
            onClick={() => {
              clearMessages();

              setQuizForm({
                title: "",
                description: "",
                difficulty: "Medium",
                time_limit: 10,
                category: "",
              });

              setShowCreate(true);
            }}
          >
            + Create Quiz
          </button>

        </div>

        {/* ====================================================
            MESSAGES
        ==================================================== */}

        {error && (
          <div className="quiz-error">
            {error}
          </div>
        )}

        {message && (
          <div className="quiz-success">
            {message}
          </div>
        )}

        {/* ====================================================
            LAYOUT
        ==================================================== */}

        <div className="quiz-admin-layout">

          {/* ==================================================
              QUIZ LIST
          ================================================== */}

          <section className="quiz-list-panel">

            <div className="panel-title">

              <h2>
                All Quizzes
              </h2>

              <span>
                {quizzes.length}
              </span>

            </div>

            {quizzes.length === 0 ? (

              <div className="empty-state">

                <div>📝</div>

                <h3>
                  No quizzes yet
                </h3>

                <p>
                  Create your first quiz.
                </p>

              </div>

            ) : (

              <div className="quiz-list">

                {quizzes.map((quiz) => (

                  <button
                    key={quiz.id}
                    className={
                      selectedQuiz?.id ===
                      quiz.id
                        ? "quiz-list-item selected"
                        : "quiz-list-item"
                    }
                    onClick={() =>
                      loadQuiz(quiz.id)
                    }
                  >

                    <div>

                      <h3>
                        {quiz.title}
                      </h3>

                      <p>
                        {quiz.question_count ||
                          0}{" "}
                        questions
                      </p>

                    </div>

                    <div className="quiz-list-meta">

                      <span
                        className={
                          quiz.status ===
                          "published"
                            ? "status published"
                            : quiz.status ===
                              "stopped"
                            ? "status stopped"
                            : "status draft"
                        }
                      >
                        {quiz.status}
                      </span>

                    </div>

                  </button>

                ))}

              </div>

            )}

          </section>

          {/* ==================================================
              EDITOR
          ================================================== */}

          <section className="quiz-editor-panel">

            {!selectedQuiz ? (

              <div className="editor-empty">

                <div>📝</div>

                <h2>
                  Select a quiz
                </h2>

                <p>
                  Select a quiz from the left
                  or create a new one.
                </p>

              </div>

            ) : (

              <>

                {/* ==========================================
                    QUIZ HEADER
                ========================================== */}

                <div className="editor-header">

                  <div>

                    <h2>
                      {selectedQuiz.title}
                    </h2>

                    <span
                      className={
                        selectedQuiz.status ===
                        "published"
                          ? "status published"
                          : selectedQuiz.status ===
                            "stopped"
                          ? "status stopped"
                          : "status draft"
                      }
                    >
                      {selectedQuiz.status}
                    </span>

                  </div>

                  <div className="editor-actions">

                    <button
                      onClick={() =>
                        setEditingQuiz(
                          !editingQuiz
                        )
                      }
                    >
                      {editingQuiz
                        ? "Close Edit"
                        : "Edit"}
                    </button>

                    {selectedQuiz.status ===
                    "stopped" ? (

                      <button
                        onClick={
                          handleResumeQuiz
                        }
                        className="publish-button"
                      >
                        Resume
                      </button>

                    ) : (

                      <button
                        onClick={
                          handlePublish
                        }
                        className="publish-button"
                      >
                        {selectedQuiz.status ===
                        "published"
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                    )}

                    {selectedQuiz.status ===
                      "published" && (

                      <button
                        onClick={
                          handleStopQuiz
                        }
                      >
                        Stop
                      </button>

                    )}

                    <button
                      onClick={
                        handleDeleteQuiz
                      }
                      className="delete-button"
                    >
                      Delete
                    </button>

                  </div>

                </div>

                {/* ==========================================
                    QUIZ CONTROL PANEL
                ========================================== */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "12px",
                    marginBottom: "25px",
                  }}
                >

                  <button
                    onClick={
                      handleToggleLeaderboard
                    }
                    className="save-button"
                  >
                    {selectedQuiz.leaderboard_published
                      ? "Hide Leaderboard"
                      : "Publish Leaderboard"}
                  </button>

                  <button
                    onClick={
                      loadLeaderboard
                    }
                    className="save-button"
                    disabled={
                      loadingLeaderboard
                    }
                  >
                    {loadingLeaderboard
                      ? "Loading..."
                      : "View Leaderboard"}
                  </button>

                  <button
                    onClick={
                      loadAttempts
                    }
                    className="save-button"
                    disabled={
                      loadingAttempts
                    }
                  >
                    {loadingAttempts
                      ? "Loading..."
                      : "View All Attempts"}
                  </button>

                  <button
                    onClick={
                      handleSendRewards
                    }
                    className="publish-button"
                    disabled={
                      sendingRewards
                    }
                  >
                    {sendingRewards
                      ? "Sending..."
                      : "Send Rewards"}
                  </button>

                </div>

                {/* ==========================================
                    LEADERBOARD STATUS
                ========================================== */}

                <div
                  style={{
                    padding: "15px",
                    marginBottom: "25px",
                    borderRadius: "10px",
                    background:
                      selectedQuiz.leaderboard_published
                        ? "#e8f8ee"
                        : "#f5f5f5",
                  }}
                >
                  <strong>
                    Leaderboard:{" "}
                  </strong>

                  {selectedQuiz.leaderboard_published
                    ? "Published — users can view it."
                    : "Private — only admins can view it."}
                </div>

                {/* ==========================================
                    EDIT QUIZ
                ========================================== */}

                {editingQuiz && (

                  <form
                    className="quiz-info-form"
                    onSubmit={
                      handleUpdateQuiz
                    }
                  >

                    <h3>
                      Edit Quiz
                    </h3>

                    <label>
                      Quiz Title
                    </label>

                    <input
                      value={
                        quizForm.title
                      }
                      onChange={(e) =>
                        setQuizForm({
                          ...quizForm,
                          title:
                            e.target.value,
                        })
                      }
                      required
                    />

                    <label>
                      Description
                    </label>

                    <textarea
                      value={
                        quizForm.description
                      }
                      onChange={(e) =>
                        setQuizForm({
                          ...quizForm,
                          description:
                            e.target.value,
                        })
                      }
                    />

                    <label>
                      Category
                    </label>

                    <input
                      value={
                        quizForm.category
                      }
                      onChange={(e) =>
                        setQuizForm({
                          ...quizForm,
                          category:
                            e.target.value,
                        })
                      }
                      placeholder="Bangladesh Football"
                    />

                    <div className="form-two-column">

                      <div>

                        <label>
                          Difficulty
                        </label>

                        <select
                          value={
                            quizForm.difficulty
                          }
                          onChange={(e) =>
                            setQuizForm({
                              ...quizForm,
                              difficulty:
                                e.target.value,
                            })
                          }
                        >

                          <option value="Easy">
                            Easy
                          </option>

                          <option value="Medium">
                            Medium
                          </option>

                          <option value="Hard">
                            Hard
                          </option>

                        </select>

                      </div>

                      <div>

                        <label>
                          Time Limit
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={
                            quizForm.time_limit
                          }
                          onChange={(e) =>
                            setQuizForm({
                              ...quizForm,
                              time_limit:
                                e.target.value,
                            })
                          }
                        />

                      </div>

                    </div>

                    <button
                      className="save-button"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                  </form>

                )}

                {/* ==========================================
                    QUESTIONS
                ========================================== */}

                <div className="questions-section">

                  <div className="questions-title">

                    <h3>
                      Questions
                    </h3>

                    <span>
                      {questions.length}
                    </span>

                  </div>

                  {questions.length === 0 ? (

                    <div className="no-questions">
                      <p>
                        No questions yet.
                      </p>
                    </div>

                  ) : (

                    <div className="questions-list">

                      {questions.map(
                        (question, index) => (

                          <div
                            className="question-card"
                            key={question.id}
                          >

                            <div className="question-top">

                              <strong>
                                Question{" "}
                                {index + 1}
                              </strong>

                              <div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    startQuestionEdit(
                                      question
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="delete-text"
                                  onClick={() =>
                                    handleDeleteQuestion(
                                      question.id
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>

                            </div>

                            <p className="question-text">
                              {
                                question.question
                              }
                            </p>

                            <div className="options-grid">

                              {[
                                ["A", question.option_a],
                                ["B", question.option_b],
                                ["C", question.option_c],
                                ["D", question.option_d],
                              ].map(
                                ([letter, text]) => (

                                  <div
                                    key={letter}
                                    className={
                                      question.correct_answer ===
                                      letter
                                        ? "option correct"
                                        : "option"
                                    }
                                  >

                                    <b>
                                      {letter}
                                    </b>

                                    {text}

                                  </div>

                                )
                              )}

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                  {/* ========================================
                      ADD / EDIT QUESTION
                  ======================================== */}

                  <form
                    className="question-form"
                    onSubmit={
                      editingQuestionId
                        ? handleUpdateQuestion
                        : handleAddQuestion
                    }
                  >

                    <h3>
                      {editingQuestionId
                        ? "Edit Question"
                        : "Add New Question"}
                    </h3>

                    <label>
                      Question
                    </label>

                    <textarea
                      value={
                        questionForm.question
                      }
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          question:
                            e.target.value,
                        })
                      }
                      placeholder="Enter the question..."
                      required
                    />

                    <div className="options-form">

                      {[
                        ["A", "option_a"],
                        ["B", "option_b"],
                        ["C", "option_c"],
                        ["D", "option_d"],
                      ].map(
                        ([letter, key]) => (

                          <div key={letter}>

                            <label>
                              Option {letter}
                            </label>

                            <input
                              value={
                                questionForm[
                                  key
                                ]
                              }
                              onChange={(e) =>
                                setQuestionForm({
                                  ...questionForm,
                                  [key]:
                                    e.target.value,
                                })
                              }
                              required
                            />

                          </div>

                        )
                      )}

                    </div>

                    <label>
                      Correct Answer
                    </label>

                    <select
                      value={
                        questionForm.correct_answer
                      }
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          correct_answer:
                            e.target.value,
                        })
                      }
                    >

                      <option value="A">
                        A
                      </option>

                      <option value="B">
                        B
                      </option>

                      <option value="C">
                        C
                      </option>

                      <option value="D">
                        D
                      </option>

                    </select>

                    <div className="question-form-buttons">

                      <button
                        type="submit"
                        className="save-button"
                        disabled={saving}
                      >
                        {saving
                          ? "Saving..."
                          : editingQuestionId
                          ? "Update Question"
                          : "Add Question"}
                      </button>

                      {editingQuestionId && (

                        <button
                          type="button"
                          className="cancel-button"
                          onClick={
                            cancelQuestionEdit
                          }
                        >
                          Cancel
                        </button>

                      )}

                    </div>

                  </form>

                </div>

                {/* ==========================================
                    ATTEMPTS
                ========================================== */}

                {showAttempts && (

                  <section
                    style={{
                      marginTop: "30px",
                    }}
                  >

                    <div className="questions-title">

                      <h3>
                        Quiz Attempts
                      </h3>

                      <span>
                        {attempts.length}
                      </span>

                    </div>

                    {attempts.length === 0 ? (

                      <div className="no-questions">
                        <p>
                          No users have attempted
                          this quiz yet.
                        </p>
                      </div>

                    ) : (

                      <div
                        style={{
                          overflowX: "auto",
                        }}
                      >

                        <table
                          style={{
                            width: "100%",
                            borderCollapse:
                              "collapse",
                          }}
                        >

                          <thead>

                            <tr>

                              <th>User</th>
                              <th>Email</th>
                              <th>Score</th>
                              <th>Correct</th>
                              <th>Questions</th>
                              <th>Completed</th>
                              <th>Reward</th>

                            </tr>

                          </thead>

                          <tbody>

                            {attempts.map(
                              (attempt) => (

                                <tr
                                  key={
                                    attempt.attempt_id || attempt.id
                                  }
                                >

                                  <td>
                                    {attempt.name ||
                                      attempt.user_name ||
                                      `User #${attempt.user_id}`}
                                  </td>

                                  <td>
                                    {attempt.email ||
                                      "-"}
                                  </td>

                                  <td>
                                    <strong>
                                      {
                                        attempt.score
                                      }
                                    </strong>
                                  </td>

                                  <td>
                                    {
                                      attempt.correct_answers
                                    }
                                  </td>

                                  <td>
                                    {
                                      attempt.total_questions
                                    }
                                  </td>

                                  <td>
                                    {attempt.completed_at
                                      ? new Date(
                                          attempt.completed_at
                                        ).toLocaleString()
                                      : "In progress"}
                                  </td>

                                  <td>
                                    {attempt.reward_sent ? (
                                      <span>
                                        ✓ Sent
                                      </span>
                                    ) : (
                                      <span>
                                        Not sent
                                      </span>
                                    )}
                                  </td>

                                </tr>

                              )
                            )}

                          </tbody>

                        </table>

                      </div>

                    )}

                  </section>

                )}

                {/* ==========================================
                    LEADERBOARD
                ========================================== */}

                {showLeaderboard && (

                  <section
                    style={{
                      marginTop: "30px",
                    }}
                  >

                    <div className="questions-title">

                      <h3>
                        🏆 Quiz Leaderboard
                      </h3>

                      <span>
                        {leaderboard.length}
                      </span>

                    </div>

                    {leaderboard.length === 0 ? (

                      <div className="no-questions">
                        <p>
                          No completed attempts
                          yet.
                        </p>
                      </div>

                    ) : (

                      <div
                        style={{
                          overflowX: "auto",
                        }}
                      >

                        <table
                          style={{
                            width: "100%",
                            borderCollapse:
                              "collapse",
                          }}
                        >

                          <thead>

                            <tr>

                              <th>
                                Rank
                              </th>

                              <th>
                                User
                              </th>

                              <th>
                                Email
                              </th>

                              <th>
                                Score
                              </th>

                              <th>
                                Percentage
                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {leaderboard.map(
                              (player, index) => {

                                const score =
                                  Number(
                                    player.score ||
                                      0
                                  );

                                const total =
                                  Number(
                                    player.total_questions ||
                                      questions.length ||
                                      0
                                  );

                                const percentage =
                                  total > 0
                                    ? Math.round(
                                        (score /
                                          total) *
                                          100
                                      )
                                    : 0;

                                return (
                                  <tr
                                    key={
                                      player.id ||
                                      player.attempt_id ||
                                      player.user_id
                                    }
                                  >

                                    <td>

                                      {index ===
                                        0 &&
                                        "🥇"}

                                      {index ===
                                        1 &&
                                        "🥈"}

                                      {index ===
                                        2 &&
                                        "🥉"}

                                      {index > 2 &&
                                        `#${index + 1}`}

                                    </td>

                                    <td>
                                      <strong>
                                        {player.name ||
                                          player.user_name ||
                                          `User #${player.user_id}`}
                                      </strong>
                                    </td>

                                    <td>
                                      {player.email ||
                                        "-"}
                                    </td>

                                    <td>
                                      {score} /{" "}
                                      {total}
                                    </td>

                                    <td>
                                      {percentage}%
                                    </td>

                                  </tr>
                                );
                              }
                            )}

                          </tbody>

                        </table>

                      </div>

                    )}

                  </section>

                )}

              </>

            )}

          </section>

        </div>

      </main>

      {/* ======================================================
          CREATE QUIZ MODAL
      ====================================================== */}

      {showCreate && (

        <div className="modal-overlay">

          <div className="create-modal">

            <div className="modal-header">

              <h2>
                Create New Quiz
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowCreate(false)
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleCreateQuiz
              }
            >

              <label>
                Quiz Title
              </label>

              <input
                value={
                  quizForm.title
                }
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    title:
                      e.target.value,
                  })
                }
                placeholder="Example: Bangladesh Football Quiz"
                required
              />

              <label>
                Description
              </label>

              <textarea
                value={
                  quizForm.description
                }
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    description:
                      e.target.value,
                  })
                }
                placeholder="Describe the quiz..."
              />

              <label>
                Category
              </label>

              <input
                value={
                  quizForm.category
                }
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    category:
                      e.target.value,
                  })
                }
                placeholder="Example: Bangladesh Football"
              />

              <div className="form-two-column">

                <div>

                  <label>
                    Difficulty
                  </label>

                  <select
                    value={
                      quizForm.difficulty
                    }
                    onChange={(e) =>
                      setQuizForm({
                        ...quizForm,
                        difficulty:
                          e.target.value,
                      })
                    }
                  >

                    <option value="Easy">
                      Easy
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Hard">
                      Hard
                    </option>

                  </select>

                </div>

                <div>

                  <label>
                    Time Limit
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      quizForm.time_limit
                    }
                    onChange={(e) =>
                      setQuizForm({
                        ...quizForm,
                        time_limit:
                          e.target.value,
                      })
                    }
                  />

                </div>

              </div>

              <div className="modal-buttons">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowCreate(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Creating..."
                    : "Create Quiz"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminQuizzes;