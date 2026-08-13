function createStandings(teams) {

  return teams.map((team, index) => {

    const played = 20;

    const won = Math.max(2, 15 - index);

    const draw = (index % 4) + 1;

    const lost = played - won - draw;

    const gf = 42 - index * 2;

    const ga = 10 + index * 2;

    const gd = gf - ga;

    const points = won * 3 + draw;

    const forms = [
      ["W", "W", "D", "W", "W"],
      ["W", "L", "W", "D", "W"],
      ["D", "W", "W", "L", "W"],
      ["W", "W", "L", "D", "L"],
      ["L", "W", "D", "W", "W"],
      ["W", "D", "L", "W", "D"],
      ["L", "L", "W", "W", "D"],
      ["W", "W", "W", "L", "W"],
      ["D", "L", "W", "D", "L"],
      ["L", "W", "L", "W", "D"]
    ];

    return {

      position: index + 1,

      club: team,

      played,

      won,

      draw,

      lost,

      gf,

      ga,

      gd,

      points,

      form: forms[index % forms.length]

    };

  });

}



const bplTeams = [

  "Bashundhara Kings",
  "Abahani Limited",
  "Mohammedan SC",
  "Rahmatganj MFS",
  "Brothers Union",
  "Police FC",
  "Sheikh Russel KC",
  "Fortis FC",
  "Chittagong Abahani",
  "Youngmen's Club"

];



const federationTeams = [

  "Bashundhara Kings",
  "Abahani Limited",
  "Mohammedan SC",
  "Rahmatganj MFS",
  "Brothers Union",
  "Police FC",
  "Sheikh Russel KC",
  "Fortis FC",
  "Chittagong Abahani",
  "Youngmen's Club",
  "Sheikh Jamal DC",
  "Feni Soccer Club",
  "Wanderers Club",
  "Arambagh KS",
  "Victoria SC",
  "Farashganj SC"

];



const uclTeams = [

  "Real Madrid",
  "Barcelona",
  "Manchester City",
  "Liverpool",
  "Arsenal",
  "Chelsea",
  "Manchester United",
  "Tottenham Hotspur",
  "Bayern Munich",
  "Borussia Dortmund",
  "RB Leipzig",
  "Bayer Leverkusen",
  "Inter Milan",
  "AC Milan",
  "Juventus",
  "Napoli",
  "Roma",
  "Atalanta",
  "Paris Saint-Germain",
  "Marseille",
  "Monaco",
  "Ajax",
  "PSV Eindhoven",
  "Feyenoord",
  "Benfica",
  "Porto",
  "Sporting CP",
  "Celtic",
  "Rangers",
  "Club Brugge",
  "Galatasaray",
  "Fenerbahce",
  "RB Salzburg",
  "Shakhtar Donetsk",
  "Olympiacos",
  "Dinamo Zagreb"

];



const leagueStandings = {

  bpl: createStandings(bplTeams),

  "federation-cup": createStandings(federationTeams),

  ucl: createStandings(uclTeams)

};

export default leagueStandings;