import "./FeaturedCompetitions.css";
import { Link } from "react-router-dom";
import bpl from "../../assets/logos/bpl.jpg";
import federation from "../../assets/logos/federation-cup.jpg";
import ucl from "../../assets/logos/ucl.webp";
import bangladesh from "../../assets/logos/bangladesh.png";
import { ArrowRight, Trophy } from "lucide-react";

const competitions = [
  {
    id: "bpl",
    title: "Bangladesh Premier League",
    format: "League • 10 Clubs",
    logo: bpl,
    description: "Top flight domestic championship with season standings & statistics.",
    link: "/leagues/bpl",
    badge: "Domestic Tier 1",
  },
  {
    id: "federation-cup",
    title: "Federation Cup",
    format: "Knockout • 16 Clubs",
    logo: federation,
    description: "The historical knockout cup uniting champion clubs nationwide.",
    link: "/leagues/federation-cup",
    badge: "National Cup",
  },
  {
    id: "bangladesh",
    title: "Bangladesh National Team",
    format: "International Matches",
    logo: bangladesh,
    description: "Men, women & youth national team fixtures and qualifiers.",
    link: "/matches",
    badge: "Red & Green",
  },
  {
    id: "ucl",
    title: "UEFA Champions League",
    format: "European Elite • 36 Clubs",
    logo: ucl,
    description: "Europe's marquee tournament featuring the world's finest clubs.",
    link: "/leagues/ucl",
    badge: "Global Elite",
  },
];

function FeaturedCompetitions() {
  return (
    <section className="competitions-section">
      <div className="competitions-header">
        <div className="competitions-pill">
          <Trophy size={15} />
          <span>TOURNAMENTS &amp; CUPS</span>
        </div>

        <h2>Featured Competitions</h2>
        <p>
          Follow the biggest domestic and international leagues covered by Football Hub BD.
        </p>
      </div>

      <div className="competition-grid">
        {competitions.map((competition) => (
          <div className="competition-card" key={competition.id}>
            <div className="competition-top">
              <span className="competition-badge">{competition.badge}</span>
              <div className="competition-logo-frame">
                <img
                  src={competition.logo}
                  alt={competition.title}
                  className="competition-logo"
                />
              </div>
            </div>

            <div className="competition-body">
              <span className="competition-format">{competition.format}</span>
              <h3>{competition.title}</h3>
              <p>{competition.description}</p>
            </div>

            <div className="competition-footer">
              <Link to={competition.link} className="competition-link-btn">
                <span>Explore League</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCompetitions;