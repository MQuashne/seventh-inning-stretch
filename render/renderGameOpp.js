import { $n, $t, $c, $a, $cl, on, randInt, hide, show } from '../util.js'
import { G } from '../model/game.js'
import { store } from '../model/store.js'
import { testOpp, endDefHalf } from '../actions/game.js'
import { gamebox, renderGame, oppTeam } from './renderGame.js'
import { buildOpp } from './buildOpp.js'
import { viewCard, viewOpp } from './modals/viewCard.js'
import { DICE } from '../dice/dice.js'
import { teams } from '../model/teams.js'
import { teamUnis, teamNames, leagueNames, evergreenJerseys } from '../dice/assets/teamColors.js'

const diceInput = $t("dice-input-border");
const pitcherCard = $t("pitcher-card");
const oppCard = $t("opp-card");
const leagueSelect = $t("league-select")
const teamSelect = $t("team-select");
const uniSelect = $t("uni-select");
const offerPitcher = $t("offer-pitcher");
const defenseDisplay = $t("defense-display");
const defenseOutcome = $t("defense-outcome");
const diceCount = $t("dice-input-count");
const oppRoll = $t("opp-roll");
const oppRollBtn = $t("opp-roll-btn");
let oppUni;
let defThrow;


export function initOpp() {
  
  oppUni = G.game.home ? evergreenJerseys[oppTeam.league][oppTeam.code]["Away"] : evergreenJerseys[oppTeam.league][oppTeam.code]["Home"];
  
  
  if (oppUni.stripe === "" || oppUni.stripe === oppUni.jersey) {
    document.documentElement.style.setProperty('--opp-die-bg-color', oppUni.jersey);
  } else {
    document.documentElement.style.setProperty('--opp-die-bg-color', `linear-gradient(90deg,${oppUni.jersey} 0%, ${oppUni.jersey} 5%, ${oppUni.stripe}a0 6%, ${oppUni.jersey} 7%, ${oppUni} 35%, ${oppUni.stripe}a0 36%, ${oppUni.jersey} 37%, ${oppUni.jersey} 65%, ${oppUni.stripe}a0 66%, ${oppUni.jersey} 67%, ${oppUni.jersey} 95%, ${oppUni.stripe}a0 96%, ${oppUni.jersey} 97%, ${oppUni.jersey} 100%)`)
  }
  
  document.documentElement.style.setProperty('--opp-die-font-color', oppUni.text);
  document.documentElement.style.setProperty('--opp-die-outline-color', oppUni.outline ||= "#ffffff00");
  
  oppCard.replaceChildren();
  oppCard.append(buildOpp(G.game.opponent));
  
  on(oppRollBtn, "click", () => {
    DICE.set_color('dice', oppUni.jersey);
    DICE.set_color('label', oppUni.text);
    DICE.set_color('stripe', oppUni.stripe ||= oppUni.jersey);
    DICE.set_color('outline', oppUni.outline ||= oppUni.jersey);
    G.game.opponent.result.test === "placeRoll" ? defThrow = `${diceCount.textContent}d6` : defThrow = G.game.opponent.dice;
    gamebox.setDice(defThrow);
    hide([diceInput, ...$a('opp-roll')]);
    gamebox.start_throw("", (notation) => {
      testOpp(G.game.opponent, notation.result);
    });
  });
  
  
  on(defenseOutcome, "click", () => {
    const runs = Number(defenseOutcome.textContent[0]);
    endDefHalf(runs);
  });
  
  store.on("opp:rolled", (result) => {
    show([...$a("def-outcome")]);
    defenseOutcome.textContent = `${result.result} RUNS`;
    renderGame();
  })
}

export function defenseHalf() {
  
  //------INITIAL SCREEN LAYOUT
  show([pitcherCard, oppCard, ...$a("opp-roll")]);
  hide([diceInput,...$a("main-roll")]);
  
  //Show the dice input if the opponent condition is "Place X, Roll Y" 
  if (G.game.opponent.result.test === "placeRoll") {
    show(diceInput)
    diceCount.textContent = G.game.opponent.dice[0];
    diceInput.querySelector(".die-box").classList.add("opp-die");
  }
  else {
    hide(diceInput);
  }
  
  
  //Show pitcher ability to add before the roll 
  if ((G.lineup.pitcher.ability === "addD6" || G.lineup.pitcher.ability === "addD10") && G.lineup.pitcher.used < G.lineup.pitcher.fatigue) {
    show(offerPitcher);
  }
  
  //-------OPPONENT TEAM STYLING
  //CH:OPPSTYLE
  // If it's a place X roll Y, change dicebox styling
  
  $t("roll-surface").style.backgroundImage = `url("public/assets/logos/${oppTeam.code}.svg"), linear-gradient(90deg,oklch(from ${oppTeam.ts} calc(l - 0.12) c h),oklch(from ${oppTeam.ts} calc(l - 0.12) c h)) `;
  
  renderGame();
}