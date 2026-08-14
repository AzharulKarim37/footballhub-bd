import { useNavigate } from "react-router-dom";
import "./Hero.css";
import football from "../../assets/images/Football.png";

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero">

      <div className="hero-left">

        <p className="hero-tag">
          ● FEATURED STORY
        </p>

        <h1>
          Bangladesh Football,
          <br />
          <span>One Hub.</span>
        </h1>

        <p className="hero-description">
          Your home for Bangladesh football news,
          international match updates, player stories,
          fixtures, scores and everything football.
        </p>

        <button className="hero-btn" onClick={() => navigate('/news')}>
          Explore Latest News →
        </button>

      </div>

      <div className="hero-right">

        <img
          src={football}
          alt="Football"
          className="hero-image"
        />

      </div>

    </section>
  );
}

export default Hero;