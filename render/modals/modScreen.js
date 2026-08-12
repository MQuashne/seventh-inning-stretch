import { $n, $t, $c, $a, $cl, on, randInt } from '../../util.js'
import Modal from '../modal.js'
import { G } from '../../model/game.js'
import { store } from '../../model/store.js'
import { testBatter } from '../../actions/game.js'
import { plays } from '../renderGame.js'

let mods = 0;
const modArea = $t("mod-area")
const outcomeDisplay = $t('roll-outcome');
const modPlay = $t("mod-play");
const modBack = $t("mod-back");

export function initModScreen(dice, batter) {
  const modDice = [...dice];
  mods = G.game.mods;
  modArea.classList.remove("hidden");
  const modScroll = $t("mod-scroll").cloneNode(true);
  $t("mod-scroll").replaceWith(modScroll);
  modScroll.replaceChildren();
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
    console.log("ping")
    const sel = e.target.closest(".mod-selector");
    const up = e.target.closest('[data-part="up"]');
    const down = e.target.closest('[data-part="down"]');
    if (sel) {
      const box = sel.querySelector(".die-box");
      const selUp = sel.querySelector('[data-part="up"]');
      const selDown = sel.querySelector('[data-part="down"]');
      if (up) {
        //box.textContent++;
        modDice[sel.dataset.id]++;
        sel.dataset.change < 0 ? mods++ : mods--;
        sel.dataset.change++;
        //renderModScreen(dice);
      }
      if (down) {
        modDice[sel.dataset.id]--;
        sel.dataset.change > 0 ? mods++ : mods--;
        sel.dataset.change--;
        //renderModScreen(dice);
      }
    } else return
    testBatter(batter, modDice, "show");
    renderModScreen(modDice);
  })
  
  on(modBack, "click", () => {
    $t("scoreboard-mod-count").textContent = G.game.mods;
    testBatter(batter, dice, "show");
    modScroll.replaceChildren();
    console.log(modScroll);
    modArea.classList.add("hidden");
    store.emit("reroll:closed")
  });
  
  on(modPlay, "click", () => {
   G.game.mods=mods;
   outcomeDisplay.click();
   modArea.classList.add("hidden");
  })
  
  store.on("batter:rolled", (outcome, isBest) => {
    
    modPlay.textContent = plays[outcome.outcome];
  })
  
  testBatter(batter, modDice, "show");
  renderModScreen(modDice)
}

export function renderModScreen(modDice) {
  
  $t("scoreboard-mod-count").textContent = mods;
  const selectors = $a("mod-selector");
  
  selectors.forEach((sel, index) => {
    const upBtn = sel.querySelector('[data-part="up"]');
    const dnBtn = sel.querySelector('[data-part="down"]');
    const die = sel.querySelector(".die-box");
    
    die.textContent = modDice[index];
    
    if (die.textContent > 5 || (mods === 0 && sel.dataset.change >= 0)) {
      upBtn.disabled = true;
    } else upBtn.disabled = false;
    
    if (die.textContent < 2 || (mods === 0 && sel.dataset.change <= 0)) {
      dnBtn.disabled = true;
    } else dnBtn.disabled = false;
    
    sel.dataset.change > 0 ? upBtn.style.color = "#FFFF00" : upBtn.style.color = "#FFFFFF";
    
    sel.dataset.change < 0 ? dnBtn.style.color = "#FFFF00" : dnBtn.style.color = "#FFFFFF";
    
  })
}