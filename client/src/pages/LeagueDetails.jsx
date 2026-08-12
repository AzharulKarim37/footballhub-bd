import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./LeagueDetails.css";

import { fetchLeagueById } from "../services/api";

import LeagueBanner from "../components/leagues/LeagueBanner";
import LeagueStats from "../components/leagues/LeagueStats";
import LeagueTable from "../components/leagues/LeagueTable";
import TopScorers from "../components/leagues/TopScorers";
import RecentMatches from "../components/leagues/RecentMatches";
import UpcomingFixtures from "../components/leagues/UpcomingFixtures";

function LeagueDetails() {
  const { leagueId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchLeagueById(leagueId, selectedSeason)
      .then((res) => {
        setData(res);
        if (!selectedSeason && res.currentSeason) {
          setSelectedSeason(res.currentSeason);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [leagueId, selectedSeason]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#07130D",
          color: "#00ff87",
          fontSize: "24px",
          fontWeight: "600",
        }}
      >
        Loading League Details...
      </div>
    );
  }

  if (!data || !data.league) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#07130D",
          color: "white",
          fontSize: "42px",
          fontWeight: "700",
        }}
      >
        Competition Not Found
      </div>
    );
  }

  const { league, standings, topScorers, recentMatches, upcomingFixtures, availableSeasons, currentSeason } = data;

  return (
    <div className="league-details-page">
      {/* Banner */}
      <LeagueBanner 
        league={league} 
        availableSeasons={availableSeasons} 
        currentSeason={currentSeason} 
        onSeasonChange={(s) => setSelectedSeason(s)} 
      />

      {/* Statistics */}
      <LeagueStats league={league} />

      {/* Standings + Top Scorers */}
      <div className="league-dashboard">
        <div className="dashboard-left">
          <LeagueTable standings={standings || []} leagueName={league.name} />
        </div>

        <div className="dashboard-right">
          <TopScorers players={topScorers || []} />
        </div>
      </div>

      {/* Recent Matches + Upcoming Fixtures */}
      <div className="league-dashboard">
        <div className="dashboard-left">
          <RecentMatches matches={recentMatches || []} />
        </div>

        <div className="dashboard-right">
          <UpcomingFixtures fixtures={upcomingFixtures || []} />
        </div>
      </div>
    </div>
  );
}

export default LeagueDetails;