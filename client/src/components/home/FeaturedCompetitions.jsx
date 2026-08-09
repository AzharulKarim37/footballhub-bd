import "./FeaturedCompetitions.css";

import bpl from "../../assets/logos/bpl.jpg";
import federation from "../../assets/logos/federation-cup.jpg";
import ucl from "../../assets/logos/ucl.webp";
import bangladesh from "../../assets/logos/bangladesh.png";

import { ArrowRight } from "lucide-react";

const competitions = [
  {
    title: "Bangladesh Premier League",
    logo: bpl,
    description: "Fixtures • Results • Standings",
  },
  {
    title: "Federation Cup",
    logo: federation,
    description: "Bangladesh's Biggest Knockout Competition",
  },
  {
    title: "Bangladesh National Team",
    logo: bangladesh,
    description: "Men • Women • Youth Teams",
  },
  {
    title: "UEFA Champions League",
    logo: ucl,
    description: "Europe's Elite Club Competition",
  },
];

function FeaturedCompetitions() {
  return (
    <section className="competitions">

      <div className="section-title">
        <h2>Featured Competitions</h2>
        <p>
          Follow the biggest football competitions covered by Football Hub BD.
        </p>
      </div>

      <div className="competition-grid">

        {competitions.map((competition, index) => (
          <div className="competition-card" key={index}>

            <img
              src={competition.logo}
              alt={competition.title}
              className="competition-logo"
            />

            <h3>{competition.title}</h3>

            <p>{competition.description}</p>

            <button>
              Explore <ArrowRight size={18} />
            </button>

          </div>
        ))}

      </div>

    </section>
  );
}

export default FeaturedCompetitions;