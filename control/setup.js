import { players } from '../model/players.js'
import { pitchers } from '../model/pitchers.js'
import { G } from '../model/game.js'

function shuffle(array) {
 
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Pick a random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
};

export function gameSetup(){
//Create 3 player decks
const t1Players = players.filter(player => (player.tier===1 && player.condition==="roll"));
const t1Pitchers = pitchers.filter(pitcher => (pitcher.tier === 1));
shuffle(t1Players);
shuffle(t1Pitchers);
const t2Players = players.filter(player => (player.tier === 2 && player.condition === "roll"));
const t2Pitchers = pitchers.filter(pitcher => (pitcher.tier === 2));
t2Players.push(...t2Pitchers)
shuffle(t2Players);
const t3Players = players.filter(player => (player.tier === 3 && player.condition === "roll"));
const t3Pitchers = pitchers.filter(pitcher => (pitcher.tier === 3));
t3Players.push(...t3Pitchers)
shuffle(t3Players);

//Get initial Roster of T1 Players
G.batterRoster=t1Players.splice(0,9);
G.pitcherRoster=t1Pitchers.splice(0,1);
console.log(G.batterRoster);
console.log(G.pitcherRoster);
}
