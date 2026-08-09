import "./PageHero.css";

function PageHero({
  title,
  subtitle,
  placeholder = "",
  search = "",
  setSearch = null,
}) {
  return (
    <section className="page-hero">

      <div className="hero-overlay"></div>

      <div className="page-hero-content">

        <span className="page-tag">
          ⚽ Football Hub BD
        </span>

        <h1>{title}</h1>

        <p>{subtitle}</p>

        {setSearch && (
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

      </div>

    </section>
  );
}

export default PageHero;