import { $n, $t, $c, $a, $cl, on, randInt } from '../util.js'
import { modal } from '../main.js'
import { G } from '../model/game.js'
import { store } from '../model/store.js'
import { buildCard, buildDie, buildReRoll, buildMod } from './buildCard.js'
import { buildOpp } from './buildOpp.js'
import { viewCard, viewOpp } from './modals/viewCard.js'
import { playerOut, endOffHalf, newBatter, startOffHalf } from '../actions/game.js'
import { DICE } from '../dice/dice.js'
import { teams } from '../model/teams.js'

/*
TODO: View card on player tap
wire out button


*/

const logoAwayDiv = $t("game-away-logo");
const logoHomeDiv = $t("game-home-logo");
const scoreHomeDiv = $t("game-home-score");
const scoreAwayDiv = $t("game-away-score");
const batterSurface = $t("batter-surface");
const orderSurface = $t("order-surface");
const diceInput = $t("dice-input-border");
const diceCount = $t("dice-input-count");
const diceUp = $t("dice-up");
const diceDown = $t("dice-down");
const runnerLayer = $t("runners");
const gameRoller = $t('gameRoller');
const scDiceCount = $t("scoreboard-dice-count");
const scRerollCount = $t("scoreboard-reroll-count");
const scModCount = $t("scoreboard-mod-count");
const scInningNum = $t("inning-num");
const scInningTop = $t("inning-top");
const scInningBottom = $t("inning-bottom");
const rollButton = $t('roll-btn');
const outButton = $t('out-btn');
const stealButton = $t('steal-btn');
const pinchButton = $t('pinch-btn');

export function initGame() {

const ro = new ResizeObserver(entries => {
  for (const entry of entries) {
    const width = entry.contentRect.width;
    runnerLayer.style.setProperty('--runner-scale', width / 100);
  }
});
ro.observe(runnerLayer);

  
/*  $t("roll-surface").style.backgroundImage = `url("https://www.mlbstatic.com/team-logos/${G.thisTeam.tid}.svg"), linear-gradient(90deg,var(--ts-dark),var(--ts-dark)) `;
  */
  const batter = G.game.order[G.game.currentBatterIndex]
  const homeTeam = G.game.home === true ? G.thisTeam : teams.find(t => t.code === G.game.opponent.code);
  const awayTeam = G.game.home === false ? G.thisTeam : teams.find(t => t.code === G.game.opponent.code);
  
  
  
  logoHomeDiv.style.backgroundImage = `linear-gradient(135deg,#FFFFFF60 0%,#FFFFFF10 40%,#FFFFFF00 41%,#FFFFFF00 100%), url("https://midfield.mlbstatic.com/v1/team/${homeTeam.tid}/spots/120")`;
  logoAwayDiv.style.backgroundImage = `linear-gradient(135deg,#FFFFFF60 0%,#FFFFFF10 40%,#FFFFFF00 41%,#FFFFFF00 100%), url("https://midfield.mlbstatic.com/v1/team/${awayTeam.tid}/spots/120")`;
  scoreAwayDiv.style.background = awayTeam.tp;
  scoreAwayDiv.style.color = awayTeam.tpText;
  scoreHomeDiv.style.background = homeTeam.tp;
  scoreHomeDiv.style.color = homeTeam.tpText;
  
  //TODO: put update logic in render
  
  //add batter card to table 
  const batterCard = $n("div", "lineup-card", batterSurface);
  batterCard.style.viewTransitionName = `lc-0`;
  batterCard.append(buildCard(batter));
 
  newBatter(batter);
  
  //add the rest of the order
  for (let i = 1; i < 9; i++) {
    const orderNum = G.game.currentBatterIndex + i > 8 ? G.game.currentBatterIndex + i - 9 : G.game.currentBatterIndex + i;
    const orderCard = $n("div", "lineup-card", orderSurface);
    orderCard.style.viewTransitionName = `lc-${orderNum}`;
    orderCard.append(buildCard(G.game.order[orderNum]));
  }
  
  //initialize dice box
  const gamebox = new DICE.dice_box(gameRoller);
  
  
  //Create runner divs - create instead of unhide so that we can animate later 
  G.game.runners.forEach((runner) => {
    const runDot = $n("div", ["runner"], runnerLayer);
    runDot.dataset.pid = runner.player.id;
    runDot.textContent = runner.player.number;
    runDot.style.offsetDistance=`${runner.location/4}%`;
  });
  
  //Wire dice count buttons
  on(diceUp, "click", () => {
    diceCount.textContent++;
    updateGameButtons();
  })
  on(diceDown, "click", () => {
    diceCount.textContent--;
    updateGameButtons();
  })
  
  //initialize roll button
  on(rollButton, 'click', () => {
    gamebox.setDice(`${Number(diceCount.textContent)}d6`);
    gamebox.start_throw(
      () => diceInput.classList.add("hidden"),
      (notation) => {
        console.log(notation);
        diceInput.classList.remove("hidden");
        
      }
    )
  });
  
  on(outButton, "click", () => {
  //  playerOut(G.game.order[G.game.currentBatterIndex]);
  gamebox.renderer.render(gamebox.scene, gamebox.camera);

  });
  
  on(stealButton,"click", () => {
console.log("clicky");
gamebox.line_up_dice();
)
)

  })
  
  store.on("batter:out", (outplayer) => {
    const bCard = batterSurface.querySelector(".lineup-card");
    
    const oCard = orderSurface.querySelector(".lineup-card");
    
    const transition = document.startViewTransition(() => {
      orderSurface.append(bCard);
      batterSurface.append(oCard);
    });
    const batterDot = runnerLayer.querySelector(`[data-pid="${outplayer.id}"]`);
    if (batterDot) batterDot.remove();
    if (G.game.outs<3) newBatter(G.game.order[G.game.currentBatterIndex]);
    renderGame();
  });
  
  store.on("batter:changed", (runplayer) => {
    const runDot = $n("div", ["runner", `run-0`], runnerLayer);
    runDot.dataset.pid = runplayer.id;
    runDot.textContent = runplayer.number;
  })
  
  
  store.on("inning:changed", () => {
    if ((G.game.home && G.game.half===2) || (!G.game.home && G.game.half===1)){
      startOffHalf();
    }
    renderGame();
  })
  //initialize out button
  renderGame();
}

export function renderGame() {
  scoreAwayDiv.textContent = G.game.score[0];
  scoreHomeDiv.textContent = G.game.score[1];
  scDiceCount.textContent = G.game.dice;
  scRerollCount.textContent = G.game.rerolls;
  scModCount.textContent = G.game.mods;
  scInningNum.textContent = G.game.inning;
  G.game.half === 1 ? scInningTop.classList.remove("inning-off") : scInningTop.classList.add("inning-off")
  
  G.game.half === 1 ? scInningBottom.classList.add("inning-off") : scInningBottom.classList.remove("inning-off")
  
  for (let i = 0; i < 2; i++) {
    const outPips = $a("out-pip");
    G.game.outs >= i + 1 ? outPips[i].classList.add("out-on") : outPips[i].classList.remove("out-on");
  }
  diceCount.textContent = 0;
  updateGameButtons()
  /*
  runners = [
  {
    player,
    base
  }]
  */
}

export function updateGameButtons() {
  diceCount.textContent < G.game.dice ? diceUp.disabled = false : diceUp.disabled = true;
  diceCount.textContent > 0 ? diceDown.disabled = false : diceDown.disabled = true;
  
}
