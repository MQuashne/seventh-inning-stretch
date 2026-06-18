export const G = {
  season: "spring",
  batterRoster: [],
  pitcherRoster:[],
  tier2Deck: [],
  tier3Deck: [],
  diceSupply: 12,
  resources: {
    dice: 0,
    reroll: 0,
    modifier: 0
  },
  schedule: [],
  gameNum: 1,
  game: {
    home:1,
    opponent:{},
    lineup:[],
    currentBatterIndex:[],
    outs:0,
    inning:7,
    half:1,
    pitcher:{},
    runs:[0,0],
    scoreboard:[]
    
  }
}