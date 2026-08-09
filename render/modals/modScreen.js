import { $n, $t, $c, $a, $cl, on, randInt } from '../../util.js'
import Modal from '../modal.js'
import { G } from '../../model/game.js'
import { store } from '../../model/store.js'
import {testBatter} from '../../actions/game.js'

let mods = G.game.mods;
export function initModScreen(dice, batter) {

  const modScroll = $t("mod-scroll");
  const resultOutput=$t("mod-play")
  
  dice.forEach((d, index) => {
    const selector = $cl("mod-select");
    selector.root.dataset.id = index;
    selector.root.dataset.change = 0;
    selector.value.textContent = d;
    if (d === 1) selector.down.disabled = true;
    if (d === 6) selector.up.disabled = true;
    modScroll.append(selector.root);
  });

  on(modScroll, "click", (e) => {
    const sel = e.target.closest(".mod-selector");
    const up = e.target.closest('[data-part="up"]');
    const down = e.target.closest('[data-part="down"]');
    if (sel) {
      const box = sel.querySelector(".die-box");
      const selUp = sel.querySelector('[data-part="up"]');
      const selDown = sel.querySelector('[data-part="down"]');
      if (up) {
        //box.textContent++;
        dice[sel.dataset.id]++;
        sel.dataset.change < 0 ? mods++ : mods--;
        sel.dataset.change++;
        //renderModScreen(dice);
      }
      if (down) {
        dice[sel.dataset.id]--;
        sel.dataset.change > 0 ? mods++ : mods--;
        sel.dataset.change--;
        //renderModScreen(dice);
      }
    } else return
    testBatter(batter,dice);
    renderModScreen(dice);
  })
  
  store.on("batter:rolled", (outcome,isBest) => {
     console.log("heard")
    resultOutput.textContent=outcome.outcome;
  })
  testBatter(batter,dice);
  renderModScreen(dice)
}

export function renderModScreen(dice) {
  
  $t("scoreboard-mod-count").textContent=mods;
  console.log(dice);
  const selectors = $a("mod-selector");
  
  selectors.forEach((sel,index) => {
    const upBtn = sel.querySelector('[data-part="up"]');
    const dnBtn = sel.querySelector('[data-part="down"]');
    const die = sel.querySelector(".die-box");
    
    die.textContent=dice[index];
    
    if (die.textContent > 5 || (mods === 0 && sel.dataset.change >= 0)) {
      upBtn.disabled = true;
    } else upBtn.disabled = false;
    
    if (die.textContent < 2 || (mods === 0 && sel.dataset.change <= 0)) {
      dnBtn.disabled = true;
    } else dnBtn.disabled = false;
    
    sel.dataset.change>0 ? upBtn.style.color="#FFFF00" : upBtn.style.color="#FFFFFF";
    
    sel.dataset.change<0 ? dnBtn.style.color="#FFFF00" : dnBtn.style.color="#FFFFFF";
    
  })
}