import { $n, $t, $c, $a, on, loadCard, randInt } from '../util.js';
import { G } from '../model/game.js';
//import { renderCalendarEvents } from '../render/renderCalendarEvents.js'

export function getTwo(tier) {
  const pair = tier === 2 ? G.tier2Deck.splice(0, 2) : G.tier3Deck.splice(0, 2);
  const opps = [];
  pair.forEach((player) => {
    opps.push(G.league.find(opp => opp.code === player.team));
  })
  return [pair, opps]
}

export function sign(player, opp) {
  if (player.fatigue) {
    G.lineup.bullpen.push(player);
  } else {
    G.lineup.bench.push(player);
  }
  G.fullRoster.push(player)
 
  player.team = G.myTeam;
  G.opponents.push(opp);
  const nextGame = G.schedule.find(event => event.title === "TBD");
  nextGame.title = `${opp.city} ${opp.team}`;
  //renderCalendarEvents();
}