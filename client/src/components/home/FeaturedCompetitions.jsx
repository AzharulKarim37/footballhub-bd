import "./FeaturedCompetitions.css";
import { Link } from "react-router-dom";
import bpl from "../../assets/logos/bpl.jpg";
import federation from "../../assets/logos/federation-cup.jpg";
import ucl from "../../assets/logos/ucl.webp";
import bangladesh from "../../assets/logos/bangladesh.png";
import { ArrowRight } from "lucide-react";

const competitions = [
  {
    id: "bpl",
    title: "Bangladesh Premier League",
    logo: bpl,
    description: "Fixtures • Results • Standings",
    link: "/leagues/bpl",
  },
  {
    id: "federation-cup",
    title: "Federation Cup",
    logo: federation,
    description: "Bangladesh's Biggest Knockout Competition",
    link: "/leagues/federation-cup",
  },
  {
    id: "bangladesh",
    title: "Bangladesh National Team",
    logo: bangladesh,
    description: "Men • Women • Youth Teams",
    link: "/matches",
  },
  {
    id: "ucl",
    title: "UEFA Champions League",
    logo: ucl,
    description: "Europe's Elite Club Competition",
    link: "/leagues/ucl",
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
        {competitions.map((competition) => (
          <div className="competition-card" key={competition.id}>
            <img
              src={competition.logo}
              alt={competition.title}
              className="competition-logo"
            />

            <h3>{competition.title}</h3>

            <p>{competition.description}</p>

            <Link to={competition.link} className="competition-link-btn">
              Explore <ArrowRight size={18} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCompetitions;