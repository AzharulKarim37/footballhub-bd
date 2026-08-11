import axios from "axios";

// Local fallback data imports
import fallbackMatches from "../data/matches";
import fallbackLeagues from "../data/leagues";
import fallbackLeagueStandings from "../data/leagueStandings";
import fallbackTopScorers from "../data/topScorers";
import fallbackRecentMatches from "../data/recentMatches";
import fallbackUpcomingFixtures from "../data/upcomingFixtures";

import jamal from "../assets/players/jamal-bhuyanjpg.webp";
import rakib from "../assets/players/rakib.webp";
import topu from "../assets/players/Topu-Barman.webp";
import sohel from "../assets/players/Shohel rana.webp";

const fallbackPlayers = [
  { id: 1, name: "Jamal Bhuyan", club: "Brothers Union", position: "Midfielder", number: 6, image: jamal, nationality: "Bangladesh", goals: 12, assists: 24 },
  { id: 2, name: "Rakib Hossain", club: "Bashundhara Kings", position: "Winger", number: 17, image: rakib, nationality: "Bangladesh", goals: 15, assists: 10 },
  { id: 3, name: "Topu Barman", club: "Bashundhara Kings", position: "Defender", number: 4, image: topu, nationality: "Bangladesh", goals: 8, assists: 3 },
  { id: 4, name: "Sohel Rana", club: "Abahani Limited", position: "Midfielder", number: 8, image: sohel, nationality: "Bangladesh", goals: 9, assists: 14 },
];

const API_BASE = "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

/**
 * Fetch matches with optional filters: status, search, league
 */
export const fetchMatches = async (params = {}) => {
  try {
    const response = await api.get("/matches", { params });
    return response.data;
  } catch (error) {
    console.warn("⚠️ API fetchMatches failed, using fallback static data.", error.message);
    const { status, search, league } = params;
    return fallbackMatches.filter((match) => {
      const filterMatch = !status || status === "ALL" ? true : match.status === status;
      const searchMatch = !search || match.home.toLowerCase().includes(search.toLowerCase()) || match.away.toLowerCase().includes(search.toLowerCase());
      const leagueMatch = !league || league === "ALL" ? true : match.league === league;
      return filterMatch && searchMatch && leagueMatch;
    });
  }
};

/**
 * Fetch all leagues
 */
export const fetchLeagues = async () => {
  try {
    const response = await api.get("/leagues");
    return response.data;
  } catch (error) {
    console.warn("⚠️ API fetchLeagues failed, using fallback static data.", error.message);
    return fallbackLeagues;
  }
};

/**
 * Fetch single league details (league stats, standings, top scorers, recent matches, upcoming fixtures)
 */
export const fetchLeagueById = async (leagueId, season = null) => {
  try {
    const url = season ? `/leagues/${leagueId}?season=${season}` : `/leagues/${leagueId}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.warn(`⚠️ API fetchLeagueById(${leagueId}) failed, using fallback static data.`, error.message);
    const league = fallbackLeagues.find((item) => item.id === leagueId);
    if (!league) return null;
    return {
      league,
      standings: fallbackLeagueStandings[leagueId] || [],
      topScorers: fallbackTopScorers[leagueId] || [],
      recentMatches: fallbackRecentMatches[leagueId] || [],
      upcomingFixtures: fallbackUpcomingFixtures[leagueId] || [],
    };
  }
};

/**
 * Fetch all teams with optional search and league filter
 */
export const fetchTeams = async (params = {}) => {
  try {
    const response = await api.get("/teams", { params });
    return response.data;
  } catch (error) {
    console.warn("⚠️ API fetchTeams failed, fallback to component default.", error.message);
    return null;
  }
};

/**
 * Fetch all players
 */
export const fetchPlayers = async (params = {}) => {
  try {
    const response = await api.get("/players", { params });
    return response.data;
  } catch (error) {
    console.warn("⚠️ API fetchPlayers failed, fallback to static data.", error.message);
    return fallbackPlayers;
  }
};

export default api;
