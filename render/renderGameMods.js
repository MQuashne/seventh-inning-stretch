import { $n, $t, $c, $a, $ac, $cl, on, randInt, show, hide } from '../util.js'
import { G } from '../model/game.js'
import { store } from '../model/store.js'
import { getBatterOutcome, changeMode, getRunnerOutcome } from '../actions/game.js'
import { plays, gamebox, renderGame } from './renderGame.js'
const modAction = $t('mod-action');
const modOverlay = $t("mod-overlay");
const modPlay = $t("mod-play");
const modBack = $t("roll-back");
const rollDisplay = $t('roll-display');
const offerModifier = $t('offer-modifier');
const outcomeDisplay = $t('roll-outcome');
const scModCount = $t("scoreboard-mod-count");

let preMod = [];
let tempPlay = "";
let totalChange = 0;
let mods = G.game.mods;
export let modResult = [];
export let modsUsed = 0;


export function initMods() {
  
  on(modOverlay, "click", (e) => {
    const sel = e.target.closest(".overlay-select-group");
    const up = e.target.closest('[data-part="up"]');
    const down = e.target.closest('[data-part="down"]');
    if (sel) {
      const selUp = sel.querySelector('[data-part="up"]');
      const selDown = sel.querySelector('[data-part="down"]');
      if (up) {
        gamebox.apply_mod(Number(sel.dataset.id), 1, (notation) => {
          modResult = [...notation.result];
        });
        sel.dataset.change < 0 ? mods++ : mods--;
        sel.dataset.change < 0 ? modsUsed-- : modsUsed++;
        
        sel.dataset.change++;
      }
      if (down) {
        gamebox.apply_mod(Number(sel.dataset.id), -1, (notation) => {
          modResult = [...notation.result];
        });
        sel.dataset.change > 0 ? mods++ : mods--;
        sel.dataset.change > 0 ? modsUsed-- : modsUsed++;
        sel.dataset.change--;
      }
      
      updateModButtons(modResult, mods);
      if (G.game.process === "hit") {
        tempPlay = getBatterOutcome(G.lineup.order[G.game.currentBatterIndex], modResult, "mod");
      } else if (G.game.process === "run") {
        tempPlay = getRunnerOutcome(modResult, "mod");
      }
      outcomeDisplay.textContent = plays[tempPlay].toUpperCase();
      scModCount.textContent = mods;
    }
  });
}

export function modScreen(dice) {
  preMod = [...dice];
  modResult = [...dice];
  totalChange = 0;
  mods = G.game.mods;
  modOverlay.replaceChildren();
  //G.game.mode = "mod";
  gamebox.line_up_dice({ y_fraction: 0.3 });
  rollDisplay.classList.add("mod-shift");
  //rollDisplay.classList.add("hidden");
  //hide([...$ac("btn-glass", rollDisplay)]);
  //show([modOverlay, ...$a('mod-roll')]);
  const nDice = gamebox.dices.length;
  for (let i = 0; i < nDice; i++) {
    const s = $cl("overlay-select");
    s.root.dataset.id = i;
    s.root.dataset.change = 0;
    s.root.classList.add("overlay-select-group");
    modOverlay.append(s.root);
  }
  updateModButtons(modResult, mods);
}


export function updateModButtons(modResult, mods) {
  $t("process-mode").textContent=`${G.game.process}:${G.game.mode}`;
  const selectors = $a("mod-overlay-select");
  
  selectors.forEach((sel, index) => {
    const upBtn = sel.querySelector('[data-part="up"]');
    const dnBtn = sel.querySelector('[data-part="down"]');
    if (modResult[index] > 5 || (mods === 0 && sel.dataset.change >= 0)) {
      upBtn.disabled = true;
    } else upBtn.disabled = false;
    
    if (modResult[index] < 2 || (mods === 0 && sel.dataset.change <= 0)) {
      dnBtn.disabled = true;
    } else dnBtn.disabled = false;
    
    sel.dataset.change > 0 ? upBtn.style.color = "#FFFF00" : upBtn.style.color = "#FFFFFF";
    
    sel.dataset.change < 0 ? dnBtn.style.color = "#FFFF00" : dnBtn.style.color = "#FFFFFF";
  })
}