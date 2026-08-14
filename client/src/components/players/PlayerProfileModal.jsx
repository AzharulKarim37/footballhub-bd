import { useEffect } from "react";
import "./PlayerProfileModal.css";

/* ============================================================
   POSITION → COLOR THEME
   ============================================================ */

const positionTheme = {
  Goalkeeper: { from: "#f59e0b", to: "#d97706", accent: "#fbbf24", label: "GK" },
  Defender:   { from: "#3b82f6", to: "#1d4ed8", accent: "#60a5fa", label: "DEF" },
  Midfielder: { from: "#8b5cf6", to: "#6d28d9", accent: "#a78bfa", label: "MID" },
  Winger:     { from: "#ec4899", to: "#be185d", accent: "#f472b6", label: "WNG" },
  Forward:    { from: "#ef4444", to: "#b91c1c", accent: "#f87171", label: "FWD" },
  Striker:    { from: "#ef4444", to: "#b91c1c", accent: "#f87171", label: "ST" },
};

function getTheme(position) {
  return positionTheme[position] || { from: "#00ff87", to: "#00c46a", accent: "#00ff87", label: "PLY" };
}

/* ============================================================
   FLAG EMOJI HELPER
   ============================================================ */

const nationalityFlags = {
  Bangladesh:  "🇧🇩",
  Brazil:      "🇧🇷",
  Argentina:   "🇦🇷",
  England:     "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  Spain:       "🇪🇸",
  France:      "🇫🇷",
  Germany:     "🇩🇪",
  Portugal:    "🇵🇹",
  Nigeria:     "🇳🇬",
  Ghana:       "🇬🇭",
  Senegal:     "🇸🇳",
  India:       "🇮🇳",
};

function getFlag(nationality) {
  return nationalityFlags[nationality] || "🌍";
}

/* ============================================================
   MODAL COMPONENT
   ============================================================ */

function PlayerProfileModal({ player, onClose }) {
  const theme = getTheme(player?.position);

  /* Close on Escape key */
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!player) return null;

  const goals    = player.goals    ?? 0;
  const rating   = player.rating   ?? "—";

  return (
    <div className="ppm-backdrop" onClick={onClose} role="dialog" aria-modal="true">

      {/* ── MODAL PANEL ── */}
      <div
        className="ppm-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ "--accent": theme.accent, "--grad-from": theme.from, "--grad-to": theme.to }}
      >

        {/* CLOSE BUTTON */}
        <button className="ppm-close" onClick={onClose} aria-label="Close">✕</button>


        {/* ══════════════════════════════════════════
            LEFT SIDE — PREMIUM PLAYER CARD
            ══════════════════════════════════════════ */}

        <div className="ppm-left">

          {/* CARD GLOW */}
          <div className="ppm-card-glow" />

          {/* PREMIUM CARD */}
          <div className="ppm-card">

            {/* Card header strip */}
            <div className="ppm-card-header">
              <div className="ppm-card-rating">{rating}</div>
              <div className="ppm-card-pos-badge">{theme.label}</div>
            </div>

            {/* Player Photo */}
            <div className="ppm-photo-wrap">
              {player.image ? (
                <img
                  src={player.image}
                  alt={player.name}
                  className="ppm-photo"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="ppm-photo-placeholder">
                  {player.name?.charAt(0) || "?"}
                </div>
              )}
              {/* Shine overlay */}
              <div className="ppm-shine" />
            </div>

            {/* Card footer name strip */}
            <div className="ppm-card-footer">
              <span className="ppm-card-name">{player.name}</span>
              <span className="ppm-card-club">{player.club || "—"}</span>
            </div>

            {/* Corner decorations */}
            <div className="ppm-corner ppm-corner-tl" />
            <div className="ppm-corner ppm-corner-tr" />
            <div className="ppm-corner ppm-corner-bl" />
            <div className="ppm-corner ppm-corner-br" />

          </div>

          {/* CARD REFLECTION */}
          <div className="ppm-card-reflection" />

        </div>


        {/* ══════════════════════════════════════════
            RIGHT SIDE — PLAYER STATS
            ══════════════════════════════════════════ */}

        <div className="ppm-right">

          {/* SECTION LABEL */}
          <p className="ppm-section-label">Player Profile</p>

          {/* PLAYER NAME */}
          <h2 className="ppm-player-name">{player.name}</h2>

          {/* POSITION BADGE */}
          <span className="ppm-position-badge">
            {player.position || "Player"}
          </span>

          {/* DIVIDER */}
          <div className="ppm-divider" />

          {/* INFO ROWS */}
          <ul className="ppm-info-list">

            <li className="ppm-info-item">
              <span className="ppm-info-icon">🌍</span>
              <div>
                <span className="ppm-info-label">Nationality</span>
                <span className="ppm-info-value">
                  {getFlag(player.nationality)}&nbsp;{player.nationality || "Bangladesh"}
                </span>
              </div>
            </li>

            <li className="ppm-info-item">
              <span className="ppm-info-icon">🏟️</span>
              <div>
                <span className="ppm-info-label">Club</span>
                <span className="ppm-info-value">{player.club || "—"}</span>
              </div>
            </li>

            <li className="ppm-info-item">
              <span className="ppm-info-icon">⚽</span>
              <div>
                <span className="ppm-info-label">Position</span>
                <span className="ppm-info-value">{player.position || "—"}</span>
              </div>
            </li>

            <li className="ppm-info-item">
              <span className="ppm-info-icon">🔢</span>
              <div>
                <span className="ppm-info-label">Jersey Number</span>
                <span className="ppm-info-value">#{player.number || "—"}</span>
              </div>
            </li>

          </ul>

          {/* DIVIDER */}
          <div className="ppm-divider" />

          {/* GOALS STAT */}
          <div className="ppm-goals-stat">
            <span className="ppm-stat-number" style={{ color: "var(--accent)" }}>{goals}</span>
            <span className="ppm-stat-label">Goals Scored</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default PlayerProfileModal;
