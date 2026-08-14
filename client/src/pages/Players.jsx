import { useState } from "react";
import PlayersHero from "../components/players/PlayersHero";
import PlayersGrid from "../components/players/PlayersGrid";

function Players() {
  const [search, setSearch] = useState("");

  return (
    <>
      <PlayersHero search={search} onSearch={setSearch} />
      <PlayersGrid search={search} />
    </>
  );
}

export default Players;