export const G = {
  season: "spring",
  batterRoster: [],
  pitcherRoster: [],
  tier2Deck: [],
  tier3Deck: [],
  diceSupply: 12,
  schedule: [],
  gameNum: 1,
  game: {
    home: 1,
    opponent: {},
    lineup: [],
    inning: 7,
    half: 1,
    outs: 0,
    dice: 0,
    rerolls: 0,
    mods: 0,
    currentBatterIndex: 0,
    pitcher: {},
    runners: [null, null, null],
    scoreboard:
    [
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ]
    ]
  }
}


/*------------
Single game state (current, do historic later)
home/away
opponent
lineup
bench
pitcher
fatigue

inning
half
outs
dice
rerolls
modifiers
runners
1st
2nd
3rd
batter index
-------------*/

/*------------
Team object (current, stats elsewhere)
roster (batters/pitchers)
schedule
game index
season points
record
------------*/