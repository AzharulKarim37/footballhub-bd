import bpl from "../assets/logos/bpl.jpg";
import federation from "../assets/logos/federation-cup.jpg";
import ucl from "../assets/logos/ucl.webp";

const leagues = [

  {
    id: "bpl",

    name: "Bangladesh Premier League",

    logo: bpl,

    country: "Bangladesh",

    season: "2025-26",

    clubs: 10,

    champion: "Bashundhara Kings",

    description:
      "Bangladesh's highest professional football league featuring the country's strongest clubs competing for the national championship.",

    matchesPlayed: 180,

    totalGoals: 472,

    avgGoals: 2.62,

    yellowCards: 694,

    redCards: 41,

    cleanSheets: 73,
  },

  {
    id: "federation-cup",

    name: "Federation Cup",

    logo: federation,

    country: "Bangladesh",

    season: "2025-26",

    clubs: 16,

    champion: "Mohammedan SC",

    description:
      "The oldest knockout football tournament in Bangladesh, bringing together clubs from across the country in a single elimination competition.",

    matchesPlayed: 61,

    totalGoals: 179,

    avgGoals: 2.93,

    yellowCards: 224,

    redCards: 12,

    cleanSheets: 19,
  },

  {
    id: "ucl",

    name: "UEFA Champions League",

    logo: ucl,

    country: "Europe",

    season: "2025-26",

    clubs: 36,

    champion: "Paris Saint-Germain",

    description:
      "Europe's premier club football competition featuring the continent's best teams competing for the most prestigious trophy in club football.",

    matchesPlayed: 189,

    totalGoals: 618,

    avgGoals: 3.27,

    yellowCards: 748,

    redCards: 29,

    cleanSheets: 58,
  }

];

export default leagues;