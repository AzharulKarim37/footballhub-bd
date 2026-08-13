import "./MatchFilter.css";

const filters = [
  { id: "ALL", label: "All Matches", icon: "⚽" },
  { id: "LIVE", label: "Live Now", icon: "🔴" },
  { id: "TODAY", label: "Today", icon: "📅" },
  { id: "UPCOMING", label: "Upcoming", icon: "⏳" },
  { id: "FT", label: "Finished", icon: "✅" },
];

function MatchFilter({ selected, setSelected, counts = {} }) {
  return (
    <div className="match-filters">
      {filters.map((filter) => {
        const count = counts[filter.id];
        return (
          <button
            key={filter.id}
            className={`match-filter-btn ${selected === filter.id ? "active" : ""}`}
            onClick={() => setSelected(filter.id)}
          >
            <span className="filter-icon">{filter.icon}</span>
            <span className="filter-label">{filter.label}</span>
            {count !== undefined && count !== null && (
              <span className="filter-count-badge">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default MatchFilter;