import { $n, $t, $c, $a, $cl, on, randInt } from '../util.js'
import { modal } from '../main.js'
import { G } from '../model/game.js'
import { store } from '../model/store.js'
import { buildCard, buildDie, buildReRoll, buildMod } from './buildCard.js'
import { buildOpp } from './buildOpp.js'
import { viewCard, viewOpp } from './modals/viewCard.js'
import { playerOut, endOffHalf, newBatter, startOffHalf, testBatter, advanceRunners, nextBatter, runScored } from '../actions/game.js'
import { DICE } from '../dice/dice.js'
import { teams } from '../model/teams.js'
import { allPlayers } from '../control/setup.js'

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
const bbButton = $t('bb-btn');
const sacButton = $t('sac-btn');
const singleButton = $t('1b-btn');
const doubleButton = $t('2b-btn');
const tripleButton = $t('3b-btn');
const hrButton = $t('hr-btn');
const rollDisplay = $t('roll-display');
const outcomeDisplay = $t('roll-outcome');
const offerReroll = $t('offer-reroll');
const offerModifier = $t('offer-modifier');
export const plays = {
  "out": "Out",
  "BB": "Walk",
  "1B": "Single",
  "2B": "Double",
  "3B": "Triple",
  "HR": "Home Run",
  "SAC": "Sacrifice"
}
const scheduleNav = $t('schedule-nav');
const gameBack = $t("game-back");
let lastPlay = "";
const selectedDice = [];

export function initGame() {
  
  //----- RESIZING OBSERVER FOR DICE BOX 
  const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
      const width = entry.contentRect.width;
      runnerLayer.style.setProperty('--runner-scale', width / 100);
    }
  });
  ro.observe(runnerLayer);
  
  //------CURRENT BATTER  
  const batter = G.game.order[G.game.currentBatterIndex]
  
  //TODO: put update logic in render
  
  //add batter card to table 
  const batterCard = $n("div", ["lineup-card", "card"], batterSurface);
  batterCard.dataset.pid = batter.id
  batterCard.style.viewTransitionName = `lc-0`;
  batterCard.append(buildCard(batter));
  on(batterCard, "click", () => {
    viewCard(batter);
  })
  newBatter(batter);
  
  //-------BATTING ORDER
  for (let i = 1; i < 9; i++) {
    const orderNum = G.game.currentBatterIndex + i > 8 ? G.game.currentBatterIndex + i - 9 : G.game.currentBatterIndex + i;
    const orderCard = $n("div", ["lineup-card", "card"], orderSurface);
    orderCard.dataset.pid = G.game.order[orderNum].id;
    orderCard.style.viewTransitionName = `lc-${orderNum}`;
    orderCard.append(buildCard(G.game.order[orderNum]));
    on(orderCard, "click", () => {
      viewCard(G.game.order[orderNum])
    })
  }
  
  //-------- INITIALIZE DICE BOX
  const gamebox = new DICE.dice_box(gameRoller);
  /*
  
  //Create runner divs - create instead of unhide so that we can animate later 
  G.game.runners.forEach((runner) => {
    const runDot = $n("div", ["runner"], runnerLayer);
    runDot.dataset.pid = runner.player.id;
    runDot.dataset.location = runner.location;
    runDot.textContent = runner.player.number;
    runDot.style.offsetDistance = `${runner.location/4}%`;
  });
  */
  
  //----WIRING BUTTONS 
  
  //=====================
  // BASIC ROLLING
  //=====================
  //-------SCREEN NAV
  on(gameBack, "click", () => scheduleNav.click())
  
  //-------DICE INPUT   
  on(diceUp, "click", () => {
    diceCount.textContent++;
    updateGameButtons();
  })
  on(diceDown, "click", () => {
    diceCount.textContent--;
    updateGameButtons();
  })
  
  //-----ROLL STUFF
  on(rollButton, 'click', () => {
    gamebox.setDice(`${Number(diceCount.textContent)}d6`);
    gamebox.start_throw(
      () => diceInput.classList.add("hidden"),
      (notation) => {
        console.log(notation);
        //diceInput.classList.remove("hidden");
        //Find batter and get outcomes.
        //loop through each and test. stop when one hits or return out
        const batter = G.game.order[G.game.currentBatterIndex];
        if (batter.condition === "roll") testBatter(batter, notation.result)
      }
    )
  });
  
  //-----------ACCEPT OUTCOME  
  on(outcomeDisplay, "click", () => {
    if (lastPlay === "out") {
      playerOut(G.game.order[G.game.currentBatterIndex]);
      console.log(`${G.game.order[G.game.currentBatterIndex.id]} out`);
    } else {
      advanceRunners(lastPlay);
    }
    gamebox.clear();
    diceInput.classList.remove("hidden");
    rollDisplay.classList.add("hidden");
  })
  
  
  on(outButton, "click", () => {
    playerOut(G.game.order[G.game.currentBatterIndex]);
  });
  
  
  //-------TESTING BUTTONS
  on(bbButton, "click", () => {
    advanceRunners("BB");
  });
  
  
  on(sacButton, "click", () => {
    advanceRunners("SAC");
  })
  
  on(singleButton, "click", () => {
    advanceRunners("1B");
  })
  on(doubleButton, "click", () => {
    advanceRunners("2B");
  })
  
  on(hrButton, "click", () => {
    const onBoard = document.querySelectorAll(".card");
    onBoard.forEach((card) => {
      if (card.dataset.pid) {
        card.innerHTML = '';
        card.append(buildCard(allPlayers.find(player => player.id === card.dataset.pid)))
      }
    })
    console.log(G);
  })
  
  //----------ROLL OUTCOME SUBSCRIBER
  store.on("batter:rolled", (result, isBest) => {
    lastPlay = result.outcome;
    outcomeDisplay.textContent = plays[result.outcome].toUpperCase();
    G.game.rerolls > 0 ? offerReroll.classList.remove("hidden") : offerReroll.classList.add("hidden");
    G.game.mods > 0 ? offerModifier.classList.remove("hidden") : offerModifier.classList.add("hidden");
    rollDisplay.classList.remove("hidden");
  })
  
  //=======================
  // BASIC OUTCOME SUBSCRIBERS
  //=======================
  
  store.on("batter:out", (outplayer) => {
    /* const batterDot = runnerLayer.querySelector(`[data-pid="${outplayer.id}"]`);
     if (batterDot) batterDot.remove();*/
    if (G.game.outs < 3) nextBatter();
    renderGame();
  });
  
  store.on("batter:changed", (runplayer) => {
    const bCard = batterSurface.querySelector(".lineup-card");
    const oCard = orderSurface.querySelector(".lineup-card");
    const transition = document.startViewTransition(() => {
      orderSurface.append(bCard);
      batterSurface.append(oCard);
    });
    renderGame();
  });
  store.on("runners:advanced", ({ lastPlay, movedRunners }) => {
    /* NOT SURE OF I NEED THIS LATER
       movedRunners.forEach((runner) => {
         const dot = runnerLayer.querySelector(`[data-pid="${runner.pid}"]`);
         if (runner.to === 4) {
           dot.addEventListener('transitionend', () => {
             dot.remove();
           }, { once: true });
         }
         dot.style.transitionDuration = `${(runner.to-runner.from) * 500}ms`
         dot.style.offsetDistance = `${runner.to*100/4}%`;
       });
       
       */
    setTimeout(() => {
      if (lastPlay !== "SAC") { //Follows the "batter out logic if it's a sacrifice"
        nextBatter();
      }
    }, 1000);
    renderGame();
    
    //===================
    // GAME FLOW SUBSCRIBERS/HANDLERS
    //===================
    
    store.on("inning:changed", () => {
      if ((G.game.home && G.game.half === 2) || (!G.game.home && G.game.half === 1)) {
        startOffHalf();
      }
      renderGame();
    })
  });
  
  //just updates the scoreboard for now, need end of game win logic for walk-offs
  store.on("run:scored", () => renderGame())
  
  //==============================
  // ROLL CHANGES
  //==============================
  
  //--------------------
  // REROLL
  //--------------------
  
  on(gameRoller, "click", (ev) => {
    const rect = gameRoller.getBoundingClientRect();
    const chosen = gamebox.search_dice_by_mouse(ev, rect);
    if (!chosen) return;
    if (selectedDice.includes(chosen.notation_index)) {
      selectedDice.splice(selectedDice.indexOf(chosen.notation_index), 1);
      gamebox.set_dice_selected(chosen, false)
    } else {
      selectedDice.push(chosen.notation_index);
      gamebox.set_dice_selected(chosen, true)
    }
  })
  
  //--------------------
  // MODIFY
  //--------------------
  
  
  renderGame();
}



export function renderGame() {
  
  $t("roll-surface").style.backgroundImage = `url("https://www.mlbstatic.com/team-logos/${G.thisTeam.tid}.svg"), linear-gradient(90deg,var(--ts-dark),var(--ts-dark)) `;
  
  const homeTeam = G.game.home === true ? G.thisTeam : teams.find(t => t.code === G.game.opponent.code);
  const awayTeam = G.game.home === false ? G.thisTeam : teams.find(t => t.code === G.game.opponent.code);
  
  
  
  logoHomeDiv.style.backgroundImage = `linear-gradient(135deg,#FFFFFF60 0%,#FFFFFF10 40%,#FFFFFF00 41%,#FFFFFF00 100%), url("https://midfield.mlbstatic.com/v1/team/${homeTeam.tid}/spots/120")`;
  logoAwayDiv.style.backgroundImage = `linear-gradient(135deg,#FFFFFF60 0%,#FFFFFF10 40%,#FFFFFF00 41%,#FFFFFF00 100%), url("https://midfield.mlbstatic.com/v1/team/${awayTeam.tid}/spots/120")`;
  scoreAwayDiv.style.background = awayTeam.tp;
  scoreAwayDiv.style.color = awayTeam.tpText;
  scoreHomeDiv.style.background = homeTeam.tp;
  scoreHomeDiv.style.color = homeTeam.tpText;
  
  const elements = document.querySelectorAll('.runner');
  const transitionPromises = Array.from(elements).flatMap(element =>
    element.getAnimations().map(animation => animation.finished)
  );
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
  
  //UPDATE RUNNERS
  const existingMap = new Map();
  for (const child of runnerLayer.children) {
    existingMap.set(child.dataset.pid, child);
  }
  
  G.game.runners.forEach((runner) => {
    let el = existingMap.get(String(runner.player.id));
    
    if (!el) {
      // Create new element if it does not exist
      const runDot = $n("div", ["runner"], runnerLayer);
      runDot.dataset.pid = runner.player.id;
      runDot.dataset.location = runner.location;
      runDot.textContent = runner.player.number;
      runDot.style.offsetDistance = `${runner.location*100/4}%`;
      
    } else {
      // Remove from map so we know it was kept
      existingMap.delete(String(runner.player.id));
      const lastLoc = Number(el.dataset.location);
      const newLoc = runner.location;
      el.style.transitionDuration = `${(newLoc-lastLoc) * 500}ms`
      el.dataset.location = newLoc;
      if (newLoc === 4) {
        el.addEventListener('transitionend', () => {
          if (event.target !== el) return;
          el.remove();
          runScored(runner)
        }, { once: true });
      }
      // Update content if needed
      el.style.offsetDistance = `${newLoc*100/4}%`;
    }
  });
  // Delete elements that are no longer in the array
  
  Promise.all(transitionPromises).then(() => {
    for (const el of existingMap.values()) {
      if (el.dataset.pid) {
        el.remove();
      }
    }
  });
  
}

export function updateGameButtons() {
  diceCount.textContent < G.game.dice ? diceUp.disabled = false : diceUp.disabled = true;
  diceCount.textContent > 0 ? diceDown.disabled = false : diceDown.disabled = true;
  
}