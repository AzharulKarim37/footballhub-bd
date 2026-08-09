import "./MatchFilter.css";

const filters = [
  "ALL",
  "LIVE",
  "TODAY",
  "UPCOMING",
  "FT",
];

function MatchFilter({ selected, setSelected }) {
  return (
    <div className="match-filters">
      {filters.map((filter) => (
        <button
          key={filter}
          className={selected === filter ? "active" : ""}
          onClick={() => setSelected(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default MatchFilter;