import { $n, $t, $c, $a, $cl, on, findKey, loadCard, randInt } from '../util.js'
import { G } from '../model/game.js'
import {viewCard} from './modals/viewCard.js'


export function buildBar(player) {
  const bar = $cl("lineup-bar-template")
  const batter = player.fatigue ? false : true;
  
  let tierGrad;
  
  switch (player.tier) {
    case 3:
      tierGrad = "gold-grad";
      break;
    case 2:
      tierGrad = "silver-grad";
      break;
    default:
      tierGrad = "bronze-grad";
  }
  bar.root.classList.add(tierGrad);
  bar.num.textContent = player.number;
  bar.firstName.textContent = player.first;
  bar.lastName.textContent = player.last;
  if (batter) {
    bar.fatigue.classList.add("hidden");
    if (player.dice === 0) {
      bar.dice.classList.add("hidden")
    } else {
      bar.diceCount.textContent = player.dice;
    }
    if (player.reRoll === 0) bar.reroll.classList.add("hidden");
    if (player.modifier === 0) bar.mod.classList.add("hidden");
    const order = G.lineup.order.indexOf(player);
    if (!(order>0)) {
      bar.up.disabled=true;
    }
    if (order === 8 || !(order>=0)) {
      bar.down.disabled=true
    }
    if (order>=0 || G.lineup.order.length>=9) {
      bar.start.classList.add("hidden")
    } 
    if (!(order>=0)) {
      bar.bench.classList.add("hidden");
      bar.up.classList.add("hidden");
      bar.down.classList.add("hidden");
    }
    bar.buttons.classList.remove("hidden");
    
  } else {
    bar.resources.classList.add("hidden");
    if (player.fatigue > 20) {
      bar.fatigueCount.textContent = "∞"
    } else {
      bar.fatigueCount.textContent = `${player.used}/${player.fatigue}`;
    }
    if (G.lineup.startPitcher){
      bar.start.classList.add("hidden");
      bar.bench.classList.add("hidden")
    }
    if (player===G.lineup.startPitcher){
      bar.bench.classList.remove("hidden")
    }
    bar.up.classList.add("hidden");
    bar.down.classList.add("hidden");
    
  }
  bar.root.dataset.pid=player.id;
  return bar.root
}

export function checkButtons(){
  
}