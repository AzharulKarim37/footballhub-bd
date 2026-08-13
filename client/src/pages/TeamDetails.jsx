import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTeams, fetchPlayers } from "../services/api";

import bashundhara from "../assets/logos/Boshundora kings.webp";
import abahani from "../assets/logos/Abhani Dhaka.webp";
import mohammedan from "../assets/logos/Mohamedan.webp";
import brothers from "../assets/logos/Brothers Union.webp";
import fortis from "../assets/logos/Fortis fc.webp";
import rahmatganj from "../assets/logos/Rahmatgonj FC.webp";
import police from "../assets/logos/BD police.webp";
import pwt from "../assets/logos/PWT fc.webp";
import arambag from "../assets/logos/Arambag.webp";
import fokira from "../assets/logos/Fokira.jpg";

import jamal from "../assets/players/jamal-bhuyanjpg.webp";
import rakib from "../assets/players/rakib.webp";
import topu from "../assets/players/Topu-Barman.webp";
import sohel from "../assets/players/Shohel rana.webp";

import "./TeamDetails.css";


/* =========================================================
   TEAM LOGOS
   ========================================================= */

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


/* =========================================================
   PLAYER IMAGES
   ========================================================= */

const playerImageMap = {
    "Jamal Bhuyan": jamal,
    "Rakib Hossain": rakib,
    "Topu Barman": topu,
    "Sohel Rana": sohel,
};


/* =========================================================
   TEAM DETAILS
   ========================================================= */

function TeamDetails() {
    const { id } = useParams();

    const [team, setTeam] = useState(null);
    const [squad, setSquad] = useState([]);
    const [loading, setLoading] = useState(true);


    /* =====================================================
       LOAD TEAM + PLAYERS
       ===================================================== */

    useEffect(() => {
        const loadTeam = async () => {
            try {
                const teams = await fetchTeams();

                const selectedTeam = teams?.find(
                    (item) => String(item.id) === String(id)
                );

                setTeam(selectedTeam || null);

                if (selectedTeam) {
                    const players = await fetchPlayers({
                        club: selectedTeam.name,
                    });

                    setSquad(players || []);
                }
            } catch (error) {
                console.error("Error loading team:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTeam();
    }, [id]);


    /* =====================================================
       LOADING
       ===================================================== */

    if (loading) {
        return (
            <div className="team-details-page team-details-loading">
                <div className="loading-text">
                    Loading team...
                </div>
            </div>
        );
    }


    /* =====================================================
       TEAM NOT FOUND
       ===================================================== */

    if (!team) {
        return (
            <div className="team-details-page team-not-found">
                <h1>Team Not Found</h1>

                <Link to="/teams" className="back-to-teams">
                    ← Back to Teams
                </Link>
            </div>
        );
    }


    const logo = logoMap[team.name] || bashundhara;


    /* =====================================================
       PAGE
       ===================================================== */

    return (
        <main className="team-details-page">

            {/* =================================================
                BACK TO TEAMS
               ================================================= */}

            <Link to="/teams" className="back-to-teams">
                <span className="back-arrow">←</span>
                <span>Back to Teams</span>
            </Link>


            {/* =================================================
                TEAM HEADER
               ================================================= */}

            <section className="team-details-hero">

                {/* TEAM LOGO */}

                <div className="team-logo-box">
                    <img
                        src={logo}
                        alt={team.name}
                        className="team-details-logo"
                    />
                </div>


                {/* TEAM INFORMATION */}

                <div className="team-info">

                    <h1>
                        {team.name}
                    </h1>

                    <p className="team-league">
                        {team.league}
                    </p>


                    <div className="team-meta">

                        {/* COACH */}

                        <div className="meta-item">
                            <span className="meta-icon">
                                ♙
                            </span>

                            <span>
                                <strong>Coach:</strong>{" "}
                                {team.coach || "Unknown"}
                            </span>
                        </div>


                        {/* STADIUM */}

                        <div className="meta-item">
                            <span className="meta-icon">
                                ▣
                            </span>

                            <span>
                                <strong>Stadium:</strong>{" "}
                                {team.stadium || "Unknown"}
                            </span>
                        </div>


                        {/* FOUNDED */}

                        <div className="meta-item">
                            <span className="meta-icon">
                                ▣
                            </span>

                            <span>
                                <strong>Founded:</strong>{" "}
                                {team.founded || "Unknown"}
                            </span>
                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                TROPHY HISTORY
               ================================================= */}

            <section className="team-section trophy-section">

                <div className="section-heading">

                    <span className="section-icon">
                        🏆
                    </span>

                    <h2>
                        Trophy History
                    </h2>

                </div>


                <div className="section-line"></div>

                {(() => {
                    let trophies = [];
                    if (team.trophies) {
                        if (Array.isArray(team.trophies)) {
                            trophies = team.trophies;
                        } else {
                            try {
                                trophies = JSON.parse(team.trophies);
                            } catch {
                                trophies = [];
                            }
                        }
                    }

                    if (trophies.length === 0) {
                        return (
                            <p className="empty-message">
                                No trophy record available yet.
                            </p>
                        );
                    }

                    return (
                        <ul className="trophy-list">
                            {trophies.map((trophy, idx) => (
                                <li key={idx}>{trophy}</li>
                            ))}
                        </ul>
                    );
                })()}

            </section>


            {/* =================================================
                SQUAD
               ================================================= */}

            <section className="team-section squad-section">

                <div className="section-heading">

                    <span className="section-icon">
                        👥
                    </span>

                    <h2>
                        Squad
                    </h2>

                </div>


                <div className="section-line"></div>


                {/* NO PLAYERS */}

                {squad.length === 0 ? (

                    <div className="empty-squad">
                        No players available for this team yet.
                    </div>

                ) : (

                    /* =================================================
                       SQUAD TABLE
                       ================================================= */

                    <div className="squad-table-wrapper">

                        <table className="squad-table">

                            {/* TABLE HEADER */}

                            <thead>

                                <tr>

                                    <th className="number-column">
                                        #
                                    </th>

                                    <th>
                                        PLAYER
                                    </th>

                                    <th className="nationality-column">
                                        NAT.
                                    </th>

                                </tr>

                            </thead>


                            {/* TABLE BODY */}

                            <tbody>

                                {squad.map((player, index) => {

                                    /*
                                     * First use our local player
                                     * image mapping.
                                     *
                                     * If there is no local image,
                                     * use the image coming from
                                     * the database/API.
                                     */

                                    const playerImage =
                                        playerImageMap[player.name] ||
                                        player.image ||
                                        null;


                                    return (

                                        <tr
                                            key={
                                                player.id || index
                                            }
                                        >

                                            {/* =====================
                                                PLAYER NUMBER
                                               ===================== */}

                                            <td className="number-column">

                                                <span className="player-number">
                                                    {player.number || "-"}
                                                </span>

                                            </td>


                                            {/* =====================
                                                PLAYER INFORMATION
                                               ===================== */}

                                            <td>

                                                <div className="player-info">

                                                    {/* PLAYER IMAGE */}

                                                    {playerImage ? (

                                                        <img
                                                            src={playerImage}
                                                            alt={player.name}
                                                            className="player-avatar"

                                                            onError={(event) => {
                                                                event.currentTarget.style.display =
                                                                    "none";
                                                            }}
                                                        />

                                                    ) : (

                                                        <div className="player-avatar player-placeholder">

                                                            {player.name?.charAt(
                                                                0
                                                            ) || "?"}

                                                        </div>

                                                    )}


                                                    {/* PLAYER NAME + POSITION */}

                                                    <div className="player-text">

                                                        <div className="player-name">
                                                            {player.name}
                                                        </div>

                                                        <div className="player-position">
                                                            {player.position ||
                                                                "Player"}
                                                        </div>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* =====================
                                                NATIONALITY
                                               ===================== */}

                                            <td className="nationality-column">

                                                <span className="nationality">
                                                    {player.nationality ||
                                                        "Bangladesh"}
                                                </span>

                                            </td>

                                        </tr>

                                    );
                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </main>
    );
}


export default TeamDetails;