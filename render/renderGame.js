import { $n, $t, $c, $a, $cl, on, randInt, hide, show, enable, disable } from '../util.js'
import { modal } from '../main.js'
import { G } from '../model/game.js'
import { store } from '../model/store.js'
import { buildCard, buildDie, buildReRoll, buildMod } from './buildCard.js'
import { buildOpp } from './buildOpp.js'
import { viewCard, viewOpp } from './modals/viewCard.js'
import { playerOut, endOffHalf, firstBatter, startOffHalf, endOffenseRoll, getBatterOutcome, advanceRunners, nextBatter, runScored, testOpp, endDefHalf, changeMode, changeProcess, applyMods, specialBatterThrow } from '../actions/game.js'
import { DICE } from '../dice/dice.js'
import { teams } from '../model/teams.js'
import { allPlayers } from '../control/setup.js'
import { teamUnis, teamNames, leagueNames, evergreenJerseys } from '../dice/assets/teamColors.js'
import { initMods, modScreen, modResult, modsUsed } from './renderGameMods.js'
import { initReroll, rerollScreen } from './renderGameReroll.js'
import { initOpp, defenseHalf } from './renderGameOpp.js'
import { initPitcher } from './renderGamePitcher.js'
import { subCard } from './renderGameSub.js'

/*
TODO: View card on player tap
wire out button


*/
const root = document.documentElement;

// SURFACES
const batterSurface = $t("batter-surface");
const orderSurface = $t("order-surface");
const scoreboardSurface = $t("scoreboard-surface");

//DISPLAYS
// --debug
const processMode = $t("process-mode")

// --score bug
const logoAwayDiv = $t("game-away-logo");
const logoHomeDiv = $t("game-home-logo");
const scoreHomeDiv = $t("game-home-score");
const scoreAwayDiv = $t("game-away-score");
const runnerLayer = $t("runners");
const awayScoreLogo = $t("away-score-logo");
const homeScoreLogo = $t("home-score-logo");


// --scoreboard
const scDiceCount = $t("scoreboard-dice-count");
const scRerollCount = $t("scoreboard-reroll-count");
const scModCount = $t("scoreboard-mod-count");
const scInningNum = $t("inning-num");
const scInningTop = $t("inning-top");
const scInningBottom = $t("inning-bottom");

// --rolling
const rollDisplay = $t('roll-display');
const rollOptions = $t("roll-options");

// --substitute
const subCover = $t("sub-cover");

// BUTTONS
// --glass buttons
const outcomeDisplay = $t('roll-outcome');
const offerReroll = $t('offer-reroll');
const offerModifier = $t('offer-modifier');
const offerPitcher = $t("offer-pitcher");
const defenseOutcome = $t("defense-outcome");
const mainRollBtn = $t("main-roll-btn");
const outButton = $t('main-out-btn');
const modPlay = $t("mod-play");
const rollBackBtn = $t("roll-back");
const offerBases = $t("offer-bases");
const continueBtn = $t("continue-btn");

// --action bar buttons
const rollButton = $t('roll-btn');

const bbButton = $t('bb-btn');
const sacButton = $t('sac-btn');
const singleButton = $t('1b-btn');
const doubleButton = $t('2b-btn');
const tripleButton = $t('3b-btn');
const hrButton = $t('hr-btn');
const subButton = $t('sub-btn');
const subCancelButton = $t('sub-cancel');

// --other buttons
const scheduleNav = $t('schedule-nav');
const gameBack = $t("game-back");
const rollFix = $t("roll-fix");

// COMPONENTS
// --dice input
const diceInput = $t("dice-input-border");
const diceCount = $t("dice-input-count");
const diceUp = $t("dice-up");
const diceDown = $t("dice-down");

// --dice rolling
const gameRoller = $t('gameRoller');
export const gamebox = new DICE.dice_box(gameRoller);

// --mods
const modOverlay = $t("mod-overlay");

// --baserunning
const runnerChoiceOverlay = $t("runner-choice-overlay");

// --notification
const notifyBox = $t("notification");

// ELEMENTS
// --cards
const pitcherCard = $t("pitcher-card");
const oppCard = $t("opp-card");



//EXTERNAL REFERENCES
const leagueSelect = $t("league-select")
const teamSelect = $t("team-select");
const uniSelect = $t("uni-select");

export const plays = {
  "out": "Out",
  "BB": "Walk",
  "1B": "Single",
  "2B": "Double",
  "3B": "Triple",
  "HR": "Home Run",
  "SAC": "Sacrifice",
  "safe": "Safe"
}

let lastPlay = "";
export let selectedDice = [];
let rollResult = [];
let newResult = [];
let totalChange = 0;
let mods = G.game.mods;
let mode = "roll";
let homeTeam = {};
let awayTeam = {};
export let oppTeam = {};
let batTeam = {};
let defThrow = 0;
let pitcherRemove = false;
let batter;
let selectedRunner;


const VIEW_CONFIG = {
  "hit:roll": { visible: [mainRollBtn, outButton, diceInput] },
  "hit:outcome": { visible: [outcomeDisplay, offerReroll, offerModifier] },
  "hit:mod": { visible: [outcomeDisplay, rollBackBtn, modOverlay] },
  "hit:reroll": { visible: [mainRollBtn, rollBackBtn] },
  "hit:run": { visible: [offerBases, continueBtn] },
  "hit:sub": { visible: [subCover] },
  "run:roll": { visible: [mainRollBtn, rollBackBtn, diceInput] },
  "run:outcome": { visible: [outcomeDisplay, offerReroll, offerModifier] },
  "run:out": { visible: [outcomeDisplay, runnerChoiceOverlay] },
  "run:mod": { visible: [outcomeDisplay, rollBackBtn, modOverlay] },
  "run:reroll": { visible: [mainRollBtn, rollBackBtn] },
  "field:roll": { visible: [mainRollBtn, outButton, diceInput] },
  "field:sub": { visible: [mainRollBtn, outButton, diceInput] },
  "008:roll": { visible: [mainRollBtn, outButton, diceInput] }
}

const SPEC_VIEW_CONFIG = {
  
}

const ROLL_MAP = {
  "hit:roll": () => batterThrow(getBatter()),
  "hit:reroll": () => batterRethrow(getBatter()),
  "run:roll": () => batterThrow(getBatter()),
  "run:reroll": () => batterRethrow(getBatter()),
}

const OUTCOME_MAP = {
  "hit:outcome": () => batterOutcome(),
  "hit:mod": () => modOutcome(),
  "run:outcome": () => runOutcome(),
  "run:out": () => runOut(),
  "run:mod": () => modOutcome(),
}


export function initGame() {
  
  //----- RESIZING OBSERVER FOR DICE BOX 
  const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
      const width = entry.contentRect.width;
      runnerLayer.style.setProperty('--runner-scale', width / 100);
    }
  });
  ro.observe(runnerLayer);
  
  
  //------INITIALIZE TEAMS
  homeTeam = G.game.home === true ? G.thisTeam : teams.find(t => t.code === G.game.opponent.code);
  awayTeam = G.game.home === false ? G.thisTeam : teams.find(t => t.code === G.game.opponent.code);
  oppTeam = teams.find(t => t.code === G.game.opponent.code)
  
  
  //--------INITIAL VISIBILITIES
  
  if (G.game.home) {
    hide([pitcherCard, oppCard, ...$a("btn-glass")]);
    show([...$a("main-roll")]);
  } else {
    show([pitcherCard, oppCard, ...$a("opp-roll")]);
    hide(diceInput);
  }
  
  
  
  //------CURRENT BATTER  
  diceCount.textContent = 0;
  
  //CH:CARDS
  //add batter card to table 
  function addBatter() {
    batter = getBatter();
    batterSurface.replaceChildren();
    const batterCard = $n("div", ["lineup-card", "card"], batterSurface);
    batterCard.dataset.pid = batter.id
    batterCard.style.viewTransitionName = `lc-${G.game.currentBatterIndex}`;
    batterCard.append(buildCard(batter));
    on(batterCard, "click", () => {
      viewCard(batter)
    })
  }
  addBatter();
  firstBatter(batter);
  
  //-------BATTING ORDER
  function addOrder() {
    orderSurface.replaceChildren();
    for (let i = 1; i < 9; i++) {
      const orderNum = G.game.currentBatterIndex + i > 8 ? G.game.currentBatterIndex + i - 8 : G.game.currentBatterIndex + i;
      const orderCard = $n("div", ["lineup-card", "card"], orderSurface);
      orderCard.dataset.pid = G.lineup.order[orderNum].id;
      orderCard.style.viewTransitionName = `lc-${orderNum}`;
      orderCard.append(buildCard(G.lineup.order[orderNum]));
      on(orderCard, "click", () => {
        viewCard(G.lineup.order[orderNum]);
      });
    }
  }
  addOrder();
  //----PITCHER AND OPP CARDS
  function addPitcher() {
    pitcherCard.replaceChildren();
    pitcherCard.append(buildCard(G.lineup.pitcher));
  }
  addPitcher();
  on(pitcherCard, "click", () => {
    viewCard(G.lineup.pitcher);
  });
  
  //CH:DICE
  //-------- INITIALIZE DICE BOX
  
  
  $t("roll-surface").style.backgroundImage = `url("public/assets/logos/${homeTeam.code}.svg"), linear-gradient(90deg,oklch(from ${homeTeam.ts} calc(l - 0.12) c h),oklch(from ${homeTeam.ts} calc(l - 0.12) c h)) `;
  
  //----WIRING BUTTONS 
  
  /* NEED:
  Roll
  Out
  Outcome
  Back
  reroll
  mod
  pitch
  sub
  */
  
  
  //=====================
  // BASIC ROLLING
  //=====================
  //-------SCREEN NAV
  //CH:BUTTONS
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
  on(mainRollBtn, 'click', () => {
    //action map for offense, defense, reroll
    //
    const key = `${G.game.process}:${G.game.mode}`;
    ROLL_MAP[key]?.();
  });
  
  //--------BACK BUTTON FUNCTIONS
  on(rollBackBtn, "click", () => {
    //Exit [this thing]
    //Enter (this thing)
    if (G.game.mode === "mod") {
      exitMod();
      changeMode("outcome");
    } else if (G.game.mode === "reroll") {
      exitReroll()
      changeMode("outcome");
    } else {
      if (G.game.process === "run") {
        changeProcess("hit");
        changeMode("run");
      }
    }
    renderGame();
  })
  
  function exitMod() {
    const sels = $a("overlay-select-group");
    sels.forEach((sel) => {
      gamebox.apply_mod(Number(sel.dataset.id), -sel.dataset.change)
    });
    gamebox.line_up_dice({ y_fraction: 0.72 });
    modOverlay.replaceChildren();
    rollDisplay.classList.remove("mod-shift");
  }
  
  function exitReroll() {
    mainRollBtn.classList.remove("display-shift");
    rollDisplay.classList.remove("mod-shift");
  }
  
  function exitRun() {
    
  }
  
  function exitSteal() {
    
  }
  
  
  
  //CH:OUTCOMEBUTTONS
  //-----------ACCEPT OUTCOME  
  on(outcomeDisplay, "click", () => {
    const key = `${G.game.process}:${G.game.mode}`;
    OUTCOME_MAP[key]?.();
  });
  
  
  on(outButton, "click", () => {
    playerOut(getBatter());
  });
  
  on(continueBtn, "click", () => {
    changeMode("roll");
    nextBatter();
  })
  
  on(offerBases, "click", () => {
    changeProcess("run");
    changeMode("roll");
    rollBackBtn.classList.remove("display-shift");
    diceCount.textContent = 0;
    updateGameButtons();
    renderGame();
  });
  
  on(rollFix, "click", () => {
    renderGame();
  })
  //-------TESTING BUTTONS
  on(bbButton, "click", () => {
    advanceRunners("BB");
  });
  
  
  on(sacButton, "click", () => {
    advanceRunners("SAC");
  });
  
  on(singleButton, "click", () => {
    advanceRunners("1B");
  });
  on(doubleButton, "click", () => {
    advanceRunners("2B");
  });
  
  on(tripleButton, "click", () => {
    //rollResult holds the originals
    $t("notification").classList.add("showing");
  });
  
  on(hrButton, "click", () => {
    console.log(G)
  });
  
  on(subButton, "click", () => {
    changeMode("sub");
    G.game.process === "hit" ? subCard(getBatter()) : subCard(G.lineup.pitcher)
  })
  
  
  //------DEFENSE BUTTONS
  
  //CH:ROLLSUBS
  
  store.on("game:started", () => {
    renderGame();
  })
  
  store.on("mode:changed", () => {
    renderGame();
  })
  //----------ROLL OUTCOME SUBSCRIBER
  store.on("offense:rolled", () => {
    G.game.rerolls > 0 ? enable(offerReroll) : disable(offerReroll);
    G.game.mods > 0 ? enable(offerModifier) : disable(offerModifier);
    renderGame();
  })
  
  //=======================
  // BASIC OUTCOME SUBSCRIBERS
  //=======================
  //CH:BATRUNMOVE
  
  store.on("player:out", (outplayer) => {
    if (outplayer === getBatter()) { notify("Batter Out") }
    if (G.game.outs < 3) nextBatter();
    renderGame();
  });
  
  store.on("batter:changed", () => {
    const bCard = batterSurface.querySelector(".lineup-card");
    const oCard = orderSurface.querySelector(".lineup-card");
    const transition = document.startViewTransition(() => {
      orderSurface.append(bCard);
      batterSurface.append(oCard);
    });
    diceCount.textContent = 0;
    renderGame();
  });
  
  store.on("runners:advanced", ({ lastPlay }) => {
    setTimeout(() => {
      if (lastPlay !== "SAC") { //Follows the "batter out logic if it's a sacrifice"
        if (G.game.mode === "roll") {
          nextBatter();
        } else {
          //runstuff
        }
      }
    }, 1000);
    renderGame();
  })
  
  //===================
  // GAME FLOW SUBSCRIBERS/HANDLERS
  //===================
  //CH:INNINGCHANGE
  store.on("inning:changed", () => {
    if ((G.game.home && G.game.half === 2) || (!G.game.home && G.game.half === 1)) {
      startOffHalf();
    }
    diceCount.textContent = 0;
    renderGame();
  });
  
  store.on("inning:offense", () => {
    let uni = evergreenJerseys[G.thisTeam.league][G.thisTeam.code][G.thisTeam.uni];
    DICE.set_color('dice', uni.jersey);
    DICE.set_color('label', uni.text);
    DICE.set_color('stripe', uni.stripe ||= uni.jersey);
    DICE.set_color('outline', uni.outline ||= uni.jersey);
    diceInput.querySelector(".die-box").classList.remove("opp-die");
    $t("roll-surface").style.backgroundImage = `url("public/assets/logos/${G.thisTeam.code}.svg"), linear-gradient(90deg,oklch(from ${G.thisTeam.ts} calc(l - 0.12) c h),oklch(from ${G.thisTeam.ts} calc(l - 0.12) c h)) `;
    hide([pitcherCard, oppCard, ...$a("def-outcome")]);
    show(diceInput);
    gamebox.clear();
    nextBatter();
  });
  
  store.on("inning:defense", () => {
    defenseHalf();
  })
  
  store.on("pitcher:sub", () => {
    addPitcher();
  })
  
  store.on("batter:sub", () => {
    console.log(G.game.dice)
    addBatter();
  })
  
  //just updates the scoreboard for now, need end of game win logic for walk-offs
  store.on("run:scored", () => renderGame())
  
  //==============================
  // ROLL CHANGES
  //==============================
  
  //--------------------
  // REROLL
  //--------------------
  //CH:REROLL
  
  
  on(offerReroll, "click", () => {
    selectedDice = [];
    changeMode("reroll");
    rerollScreen();
  })
  
  //--------------------
  // MODIFY
  //--------------------
  //CH:MODIFY
  // #region MODIFY
  on(offerModifier, "click", () => {
    changeMode("mod");
    modScreen(rollResult);
  })
  // #endregion
  
  renderGame();
  initMods();
  initReroll();
  initOpp();
  initPitcher();
  G.game.mode = "roll";
}


export function renderGame() {
  processMode.textContent = `${G.game.process}:${G.game.mode}`;
  renderScorebug();
  renderScoreboard();
  updateGameButtons();
  renderRunners();
  renderRoller();
}

function renderScorebug() {
  logoHomeDiv.style.background = homeTeam.tp;
  homeScoreLogo.src = `public/assets/logos/${homeTeam.tpLogo}.svg`
  logoAwayDiv.style.background = awayTeam.tp;
  awayScoreLogo.src = `public/assets/logos/${awayTeam.tpLogo}.svg`;
  scoreAwayDiv.style.background = awayTeam.tp;
  scoreAwayDiv.style.color = awayTeam.tpText;
  scoreHomeDiv.style.background = homeTeam.tp;
  scoreHomeDiv.style.color = homeTeam.tpText;
  scoreAwayDiv.textContent = G.game.score[0];
  scoreHomeDiv.textContent = G.game.score[1];
}

function renderScoreboard() {
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
  if (G.game.atBat) {
    hide(pitcherCard, oppCard);
  } else {
    show(pitcherCard, oppCard);
  }
}

function renderRunners() {
  const elements = document.querySelectorAll('.runner');
  const transitionPromises = Array.from(elements).flatMap(element =>
    element.getAnimations().map(animation => animation.finished)
  );
  
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

function renderRoller() {
  let key;
  if (G.game.process === "hit" && getBatter().condition !== "roll") {
    key = `${ getBatter().id }:${G.game.mode}`;
  } else {
    key = `${G.game.process}:${G.game.mode}`;
  }
  const config = VIEW_CONFIG[key];
  [...$a('roll-el')].forEach(el => config.visible.includes(el) ? show(el) : hide(el));
  
  outcomeDisplay.textContent = G.game.atBat ? plays[G.game.currentOutcome].toUpperCase() : `${G.game.currentOutcome} RUNS`;
}


export function updateGameButtons() {
  if (G.game.atBat) {
    if (getBatter().id === "008") {
      diceCount.textContent = 3;
      disable(diceUp);
      disable(diceDown);
    } else {
      diceCount.textContent < G.game.dice ? diceUp.disabled = false : diceUp.disabled = true;
      diceCount.textContent > 0 ? diceDown.disabled = false : diceDown.disabled = true;
    }
  } else {
    diceCount.textContent < Number(G.game.opponent.dice[0]) ? diceUp.disabled = false : diceUp.disabled = true;
    diceCount.textContent > 0 ? diceDown.disabled = false : diceDown.disabled = true;
  }
  
  subButton.disabled = ((G.game.process !== "hit" && G.game.process !== "field") || G.game.mode !== "roll");
  updateRollButton();
}

function updateRollButton() {
  if (G.game.atBat) {
    mainRollBtn.textContent = getBatter().rollText ?? "Roll";
  }
  mainRollBtn.disabled = diceCount.textContent < 1;
}

function notify(message) {
  notifyBox.classList.add("showing");
  setTimeout(() => { notifyBox.classList.remove("showing"); }, 3000)
}
//===============
// ROLL FUNCTIONS
//========++++++=
function batterThrow(batter) {
  
  //Default throw actions
  function defaultThrow() {
    gamebox.setDice(`${Number(diceCount.textContent)}d6`);
    gamebox.start_throw(
      () => hide([diceInput, ...[...$a("main-roll")]]),
      (notation) => {
        if (G.game.process === "hit") {
          if (batter.condition === "roll") endOffenseRoll(notation.result);
        } else if (G.game.process === "run") {
          endOffenseRoll(notation.result);
        }
      }
    )
  }
  //Special throw actions
  
  
  //Check for special cases by batter and fall back to the default.
  specialBatterThrow[batter.id] ? specBatter[batter.id]() : defaultThrow();
}


function batterRethrow(batter) {
  //batter = getBatter();
  mainRollBtn.classList.remove("display-shift");
  rollDisplay.classList.remove("mod-shift");
  
  gamebox.reroll(selectedDice, () => hide([diceInput, ...[...$a("main-roll")]]),
    (notation) => {
      if (G.game.process === "hit") {
        if (batter.condition === "roll") endOffenseRoll(notation.result);
      } else if (G.game.process === "run") {
        if (batter.condition === "roll") endOffenseRoll(notation.result);
      }
    }
  );
}



//================
// OUTCOME FUNCTIONS
//================

function batterOutcome() {
  changeMode("roll");
  diceCount.textContent = 0;
  if (G.game.currentOutcome === "out") {
    playerOut(getBatter());
  } else {
    advanceRunners(G.game.currentOutcome);
  }
  gamebox.clear();
  renderGame();
}

function modOutcome() {
  rollDisplay.classList.remove("mod-shift");
  applyMods(getBatter(), modResult, modsUsed);
  switch (G.game.process) {
    case 'hit':
      batterOutcome();
      break;
    case 'run':
      runOutcome();
      break;
    default:
      batterOutcome();
  }
}

function runOutcome() {
  diceCount.textContent = 0;
  if (G.game.currentOutcome === "out") {
    changeMode("out");
    renderRunnerChoice();
  } else {
    changeMode("roll");
    advanceRunners("extraBases");
  }
  gamebox.clear();
  renderGame();
}

function renderRunnerChoice() {
  runnerChoiceOverlay.replaceChildren();
  for (let i = 0; i < G.game.runners.length - 1; i++) {
    const runnerChoice = $n("div", "runner-choice", runnerChoiceOverlay);
    runnerChoice.textContent = G.game.runners[i].player.number;
    on(runnerChoice, "click", () => {
      $a("runner-choice").forEach(rc => { rc.classList.remove("chosen") });
      runnerChoice.classList.add("chosen");
      selectedRunner = G.game.runners[i].player;
      outcomeDisplay.textContent = `#${selectedRunner.number} Out`;
    });
  }
}

function runOut() {
  playerOut(selectedRunner);
}

function getBatter() {
  return G.lineup.order[G.game.currentBatterIndex]
}