import { useState, useEffect } from "react";
import TeamCard from "./TeamCard";
import { fetchTeams } from "../../services/api";

import bashundhara from "../../assets/logos/Boshundora kings.webp";
import abahani from "../../assets/logos/Abhani Dhaka.webp";
import mohammedan from "../../assets/logos/Mohamedan.webp";
import brothers from "../../assets/logos/Brothers Union.webp";
import fortis from "../../assets/logos/Fortis fc.webp";
import rahmatganj from "../../assets/logos/Rahmatgonj FC.webp";
import police from "../../assets/logos/BD police.webp";
import pwt from "../../assets/logos/PWT fc.webp";
import arambag from "../../assets/logos/Arambag.webp";
import fokira from "../../assets/logos/Fokira.jpg";

const defaultTeams = [
  {
    id: 1,
    name: "Bashundhara Kings",
    league: "Bangladesh Premier League",
    coach: "Oscar Bruzon",
    stadium: "Kings Arena",
    founded: 2013,
    logo: bashundhara,
  },
  {
    id: 2,
    name: "Abahani Limited Dhaka",
    league: "Bangladesh Premier League",
    coach: "Maruful Haque",
    stadium: "Bangabandhu National Stadium",
    founded: 1972,
    logo: abahani,
  },
  {
    id: 3,
    name: "Mohammedan SC",
    league: "Bangladesh Premier League",
    coach: "Alfaz Ahmed",
    stadium: "Shaheed Dhirendranath Datta Stadium",
    founded: 1936,
    logo: mohammedan,
  },
  {
    id: 4,
    name: "Brothers Union",
    league: "Bangladesh Premier League",
    coach: "Mizanur Rahman",
    stadium: "Bangabandhu National Stadium",
    founded: 1949,
    logo: brothers,
  },
  {
    id: 5,
    name: "Fortis FC",
    league: "Bangladesh Premier League",
    coach: "Bimal Ghosh",
    stadium: "Rajshahi Stadium",
    founded: 2022,
    logo: fortis,
  },
  {
    id: 6,
    name: "Rahmatganj MFS",
    league: "Bangladesh Premier League",
    coach: "Hasan Al Mamun",
    stadium: "Bangabandhu National Stadium",
    founded: 1958,
    logo: rahmatganj,
  },
  {
    id: 7,
    name: "Bangladesh Police FC",
    league: "Bangladesh Premier League",
    coach: "Shakhawat Hossain",
    stadium: "Police Lines Ground",
    founded: 1972,
    logo: police,
  },
  {
    id: 8,
    name: "PWD SC",
    league: "Bangladesh Championship League",
    coach: "Unknown",
    stadium: "Dhaka",
    founded: 2004,
    logo: pwt,
  },
  {
    id: 9,
    name: "Arambagh KS",
    league: "Bangladesh Championship League",
    coach: "Unknown",
    stadium: "Arambagh Ground",
    founded: 1958,
    logo: arambag,
  },
  {
    id: 10,
    name: "Fakirerpool Young Men's Club",
    league: "Bangladesh Championship League",
    coach: "Unknown",
    stadium: "Dhaka",
    founded: 1939,
    logo: fokira,
  },
];

const logoMap = {
  "Bashundhara Kings": bashundhara,
  "Abahani Limited Dhaka": abahani,
  "Mohammedan SC": mohammedan,
  "Brothers Union": brothers,
  "Fortis FC": fortis,
  "Rahmatganj MFS": rahmatganj,
  "Bangladesh Police FC": police,
  "PWD SC": pwt,
  "Arambagh KS": arambag,
  "Fakirerpool Young Men's Club": fokira,
};

function TeamsGrid() {
  const [teamList, setTeamList] = useState(defaultTeams);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams()
      .then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((t) => ({
            ...t,
            logo: logoMap[t.name] || t.logo || bashundhara,
          }));
          setTeamList(formatted);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#0d1117",
        padding: "50px 40px",
        minHeight: "100vh",
      }}
    >
      {loading ? (
        <div style={{ textAlign: "center", color: "#00ff87", fontSize: "18px" }}>
          Loading Teams...
        </div>
      ) : (
        <div
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          {teamList.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </section>
  );
}

export default TeamsGrid;