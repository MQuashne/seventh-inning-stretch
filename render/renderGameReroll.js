import { $n, $t, $c, $a, $cl, on, randInt, show, hide } from '../util.js'
import { G } from '../model/game.js'
import { store } from '../model/store.js'
import { getBatterOutcome, testOpp, changeMode } from '../actions/game.js'
import { plays, gamebox, selectedDice, renderGame } from './renderGame.js'
const rollDisplay = $t('roll-display');
const outcomeDisplay = $t('roll-outcome');
const scRerollCount = $t("scoreboard-reroll-count");
const rollButton = $t('roll-btn');
const offerReroll = $t('offer-reroll');
const rerollConfirm = $t("reroll-confirm");
const rerollBack = $t("roll-back");
const gameRoller = $t('gameRoller');
const mainRollBtn = $t("main-roll-btn");
let lastPlay = "";
//let selectedDice = [];
let rollResult = [];
let newResult = [];

export function initReroll() {
  on(gameRoller, "click", (ev) => {
    if (G.game.mode != "reroll") return;
    const rect = gameRoller.getBoundingClientRect();
    const chosen = gamebox.search_dice_by_mouse(ev, rect);
    if (!chosen) return;
    if (selectedDice.includes(chosen.notation_index)) {
      selectedDice.splice(selectedDice.indexOf(chosen.notation_index), 1);
      gamebox.set_dice_selected(chosen, false)
    } else {
      //how many allowed? 
      if (selectedDice.length < G.game.rerollAllowed) {
        selectedDice.push(chosen.notation_index);
        gamebox.set_dice_selected(chosen, true)
      }
    }
    selectedDice.length > 0 ? mainRollBtn.disabled = false : mainRollBtn.disabled = true;
  });
}

export function rerollScreen() {
  rollDisplay.classList.add("mod-shift");
  mainRollBtn.classList.add("display-shift");
  mainRollBtn.disabled = true;
}