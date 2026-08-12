import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Home from "./pages/Home";
import Matches from "./pages/Matches";
import Leagues from "./pages/Leagues";
import LeagueDetails from "./pages/LeagueDetails";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import News from "./pages/News";

import Quiz from "./pages/Quiz";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

import MyQuizAttempts from "./pages/MyQuizAttempts";
import QuizLeaderboard from "./pages/QuizLeaderboard";
import AttemptDetails from "./pages/AttemptDetails";

import AdminDashboard from "./pages/AdminDashboard";
import AdminQuizzes from "./pages/AdminQuizzes";
import AdminMatches from "./pages/AdminMatches";
import AdminLeagues from "./pages/AdminLeagues";
import AdminLeagueDetails from "./pages/AdminLeagueDetails";
import AdminPlayers from "./pages/AdminPlayers";
import AdminRewards from "./pages/AdminRewards";

function App() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/leagues" element={<Leagues />} />
        <Route path="/leagues/:leagueId" element={<LeagueDetails />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/players" element={<Players />} />
        <Route path="/news" element={<News />} />

        {/* QUIZ */}
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/my-quiz-attempts" element={<MyQuizAttempts />} />
        <Route path="/quiz/:quizId/leaderboard" element={<QuizLeaderboard />} />
        <Route path="/attempt/:quizId/:attemptId" element={<AttemptDetails />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/quizzes" element={<AdminQuizzes />} />
        <Route path="/admin/matches" element={<AdminMatches />} />
        <Route path="/admin/leagues" element={<AdminLeagues />} />
        <Route path="/admin/leagues/:leagueId" element={<AdminLeagueDetails />} />
        <Route path="/admin/players" element={<AdminPlayers />} />
        <Route path="/admin/rewards" element={<AdminRewards />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "70vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#00130d",
                color: "white",
                textAlign: "center",
              }}
            >
              <h1 style={{ fontSize: "60px", margin: 0 }}>404</h1>
              <p style={{ fontSize: "20px" }}>Page not found.</p>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;