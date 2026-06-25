import { players } from '../model/players.js'
import { G } from '../model/game.js'

function shuffle(array) {
 
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Pick a random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
};

export function setupTest(){
const tier1Players = players.filter(player => (player.tier===1 && player.condition==="roll"));
shuffle(tier1Players);
G.batterRoster = tier1Players.splice(0,9);
G.game.lineup=G.batterRoster;


}
