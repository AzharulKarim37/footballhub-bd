/**
 * Comprehensive API endpoint test script for Football Hub BD backend
 * Tests: auth, leagues, matches, teams, players, quizzes
 */

const BASE = "http://localhost:5001";
let adminToken = "";
let createdLeagueId = "";
let createdMatchId = "";
let createdPlayerId = "";
let createdQuizId = "";

const req = async (method, path, body, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
};

const pass = (label) => console.log(`  ✅ ${label}`);
const fail = (label, detail) => console.log(`  ❌ ${label}: ${detail}`);
const section = (name) => console.log(`\n📋 ${name}`);

const test = async (label, fn) => {
  try {
    await fn();
    pass(label);
  } catch (e) {
    fail(label, e.message);
  }
};

const assert = (condition, msg) => {
  if (!condition) throw new Error(msg);
};

const run = async () => {
  console.log("🚀 Starting Football Hub API Tests...\n");

  // ====================
  // AUTH TESTS
  // ====================
  section("AUTH ENDPOINTS");

  await test("POST /api/auth/signup (new user)", async () => {
    const { status, data } = await req("POST", "/api/auth/signup", {
      name: "Test User",
      email: "testuser_api@footballhub.bd",
      password: "Test@1234",
      confirmPassword: "Test@1234",
    });
    assert(status === 201 || status === 409, `Expected 201/409, got ${status}: ${data.message}`);
  });

  await test("POST /api/auth/login (admin)", async () => {
    const { status, data } = await req("POST", "/api/auth/login", {
      email: "admin@footballhub.bd",
      password: "Admin@1234",
    });
    assert(status === 200, `Expected 200, got ${status}: ${JSON.stringify(data)}`);
    assert(data.token, "No token in response");
    adminToken = data.token;
  });

  await test("GET /api/auth/me (authenticated)", async () => {
    const { status, data } = await req("GET", "/api/auth/me", null, adminToken);
    assert(status === 200, `Expected 200, got ${status}: ${data.message}`);
    assert(data.user || data.email || data.name || data.id, "No user data returned");
  });

  // ====================
  // LEAGUES TESTS
  // ====================
  section("LEAGUES ENDPOINTS");

  await test("GET /api/leagues (all leagues)", async () => {
    const { status, data } = await req("GET", "/api/leagues");
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data), "Response should be array");
    assert(data.length > 0, "Should have seeded leagues");
    console.log(`     → Found ${data.length} leagues`);
  });

  await test("GET /api/leagues/bpl (league by ID)", async () => {
    const { status, data } = await req("GET", "/api/leagues/bpl");
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.league, "Should have league data");
    assert(data.standings, "Should have standings");
  });

  await test("POST /api/leagues (create league - admin)", async () => {
    const { status, data } = await req("POST", "/api/leagues", {
      name: "API Test League",
      country: "Bangladesh",
      season: "2025-26",
      clubs: 8,
    }, adminToken);
    assert(status === 201, `Expected 201, got ${status}: ${data.message}`);
    assert(data.league, "Should return created league");
    createdLeagueId = data.league.id;
    console.log(`     → Created league ID: ${createdLeagueId}`);
  });

  await test("PUT /api/leagues/:id (update league - admin)", async () => {
    const { status, data } = await req("PUT", `/api/leagues/${createdLeagueId}`, {
      name: "API Test League (Updated)",
      clubs: 10,
    }, adminToken);
    assert(status === 200, `Expected 200, got ${status}: ${data.message}`);
  });

  await test("DELETE /api/leagues/:id (delete league - admin)", async () => {
    const { status } = await req("DELETE", `/api/leagues/${createdLeagueId}`, null, adminToken);
    assert(status === 200, `Expected 200, got ${status}`);
  });

  // ====================
  // MATCHES TESTS
  // ====================
  section("MATCHES ENDPOINTS");

  await test("GET /api/matches (all matches)", async () => {
    const { status, data } = await req("GET", "/api/matches");
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data), "Response should be array");
    assert(data.length > 0, "Should have seeded matches");
    console.log(`     → Found ${data.length} matches`);
  });

  await test("GET /api/matches?status=LIVE", async () => {
    const { status, data } = await req("GET", "/api/matches?status=LIVE");
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data), "Response should be array");
  });

  await test("GET /api/matches?league=bpl", async () => {
    const { status, data } = await req("GET", "/api/matches?league=bpl");
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data), "Response should be array");
  });

  await test("POST /api/matches (create match - admin)", async () => {
    const { status, data } = await req("POST", "/api/matches", {
      league: "Test League",
      league_id: "test",
      stage: "Test Round",
      status: "UPCOMING",
      date: "10 Aug 2026",
      time: "18:00",
      home: "Team Alpha",
      away: "Team Beta",
      stadium: "Test Stadium",
    }, adminToken);
    assert(status === 201, `Expected 201, got ${status}: ${data.message}`);
    assert(data.match, "Should return created match");
    createdMatchId = data.match.id;
    console.log(`     → Created match ID: ${createdMatchId}`);
  });

  await test("PUT /api/matches/:id (update match - admin)", async () => {
    const { status, data } = await req("PUT", `/api/matches/${createdMatchId}`, {
      status: "LIVE",
      homeScore: 1,
      awayScore: 0,
      minute: "45'",
    }, adminToken);
    assert(status === 200, `Expected 200, got ${status}: ${data.message}`);
  });

  await test("DELETE /api/matches/:id (delete match - admin)", async () => {
    const { status } = await req("DELETE", `/api/matches/${createdMatchId}`, null, adminToken);
    assert(status === 200, `Expected 200, got ${status}`);
  });

  // ====================
  // TEAMS TESTS
  // ====================
  section("TEAMS ENDPOINTS");

  await test("GET /api/teams (all teams)", async () => {
    const { status, data } = await req("GET", "/api/teams");
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data), "Response should be array");
    assert(data.length > 0, "Should have seeded teams");
    console.log(`     → Found ${data.length} teams`);
  });

  await test("GET /api/teams?league=Bangladesh Premier League", async () => {
    const { status, data } = await req("GET", "/api/teams?league=Bangladesh%20Premier%20League");
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data), "Response should be array");
  });

  await test("GET /api/teams/1 (team by ID)", async () => {
    const { status, data } = await req("GET", "/api/teams/1");
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.name, "Should have team name");
  });

  // ====================
  // PLAYERS TESTS
  // ====================
  section("PLAYERS ENDPOINTS");

  await test("GET /api/players (all players)", async () => {
    const { status, data } = await req("GET", "/api/players");
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data), "Response should be array");
    assert(data.length > 0, "Should have seeded players");
    console.log(`     → Found ${data.length} players`);
  });

  await test("POST /api/players (create player - admin)", async () => {
    const { status, data } = await req("POST", "/api/players", {
      name: "Test Player",
      club: "Bashundhara Kings",
      position: "Forward",
      number: 99,
      nationality: "Bangladesh",
      goals: 5,
      assists: 3,
    }, adminToken);
    assert(status === 201, `Expected 201, got ${status}: ${data.message}`);
    createdPlayerId = data.player.id;
    console.log(`     → Created player ID: ${createdPlayerId}`);
  });

  await test("PUT /api/players/:id (update player - admin)", async () => {
    const { status, data } = await req("PUT", `/api/players/${createdPlayerId}`, {
      goals: 10,
    }, adminToken);
    assert(status === 200, `Expected 200, got ${status}: ${data.message}`);
  });

  await test("DELETE /api/players/:id (delete player - admin)", async () => {
    const { status } = await req("DELETE", `/api/players/${createdPlayerId}`, null, adminToken);
    assert(status === 200, `Expected 200, got ${status}`);
  });

  // ====================
  // QUIZ TESTS (ADMIN)
  // ====================
  section("QUIZ ENDPOINTS (Admin)");

  await test("GET /api/quizzes (admin - all quizzes)", async () => {
    const { status, data } = await req("GET", "/api/quizzes", null, adminToken);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.quizzes, "Should have quizzes array");
    assert(data.quizzes.length > 0, "Should have seeded quiz");
    console.log(`     → Found ${data.quizzes.length} quiz(es)`);
  });

  await test("POST /api/quizzes (create quiz - admin)", async () => {
    const { status, data } = await req("POST", "/api/quizzes", {
      title: "API Test Quiz",
      description: "Test quiz created by API test",
      difficulty: "Easy",
      time_limit: 5,
    }, adminToken);
    assert(status === 201, `Expected 201, got ${status}: ${data.message}`);
    assert(data.quiz, "Should return created quiz");
    createdQuizId = data.quiz.id;
    console.log(`     → Created quiz ID: ${createdQuizId}`);
  });

  await test("GET /api/quizzes/:id (get quiz by ID - admin)", async () => {
    const { status, data } = await req("GET", `/api/quizzes/${createdQuizId}`, null, adminToken);
    assert(status === 200, `Expected 200, got ${status}: ${data.message}`);
    assert(data.quiz, "Should have quiz data");
  });

  await test("POST /api/quizzes/:id/questions (add question)", async () => {
    const { status, data } = await req("POST", `/api/quizzes/${createdQuizId}/questions`, {
      question: "What year was BPL founded?",
      option_a: "2007",
      option_b: "2010",
      option_c: "2012",
      option_d: "2015",
      correct_answer: "A",
    }, adminToken);
    assert(status === 201, `Expected 201, got ${status}: ${data.message}`);
  });

  await test("PUT /api/quizzes/:id/publish (publish quiz)", async () => {
    const { status, data } = await req("PUT", `/api/quizzes/${createdQuizId}/publish`, null, adminToken);
    assert(status === 200, `Expected 200, got ${status}: ${data.message}`);
  });

  await test("PUT /api/quizzes/:id (update quiz - must unpublish first via publish toggle)", async () => {
    // Unpublish first
    await req("PUT", `/api/quizzes/${createdQuizId}/publish`, null, adminToken);
    const { status, data } = await req("PUT", `/api/quizzes/${createdQuizId}`, {
      title: "API Test Quiz (Updated)",
      description: "Updated description",
      difficulty: "Medium",
      time_limit: 10,
    }, adminToken);
    assert(status === 200, `Expected 200, got ${status}: ${data.message}`);
  });

  await test("DELETE /api/quizzes/:id (delete quiz - admin)", async () => {
    const { status } = await req("DELETE", `/api/quizzes/${createdQuizId}`, null, adminToken);
    assert(status === 200, `Expected 200, got ${status}`);
  });

  // ====================
  // PUBLIC QUIZ ENDPOINTS
  // ====================
  section("QUIZ ENDPOINTS (Public)");

  await test("GET /api/quizzes/published (published quizzes - public)", async () => {
    const { status, data } = await req("GET", "/api/quizzes/published");
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.quizzes !== undefined, "Should have quizzes array");
    console.log(`     → Found ${data.quizzes.length} published quiz(es)`);
  });

  // ====================
  // ERROR HANDLING
  // ====================
  section("ERROR HANDLING");

  await test("GET /api/leagues/nonexistent-id returns 404", async () => {
    const { status } = await req("GET", "/api/leagues/nonexistent-league-xyz");
    assert(status === 404, `Expected 404, got ${status}`);
  });

  await test("POST /api/matches without auth returns 401/403", async () => {
    const { status } = await req("POST", "/api/matches", {
      league: "Test", home: "A", away: "B", status: "UPCOMING"
    });
    assert(status === 401 || status === 403, `Expected 401/403, got ${status}`);
  });

  await test("GET /api/nonexistent-endpoint returns 404", async () => {
    const { status } = await req("GET", "/api/nonexistent");
    assert(status === 404, `Expected 404, got ${status}`);
  });

  console.log("\n🎉 All API tests complete!\n");
  process.exit(0);
};

run().catch(e => {
  console.error("Test runner error:", e);
  process.exit(1);
});
