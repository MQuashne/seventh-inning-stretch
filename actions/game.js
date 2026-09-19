import { store } from '../model/store.js'
import { G } from '../model/game.js'
import { rollTests } from '../control/rollTest.js'
import { oppTests } from '../control/oppTest.js'

/*
PROCESSES 
hit
run
steal
field
pitch

MODE
roll
outcome
mod
reroll
*/

export function playBall() {
  const gameEvent = G.schedule.find(e => e.id === `G${G.gameNum}`);
  const thisGame = {
    home: gameEvent.home,
    opponent: G.opponents[G.gameNum - 1],
    order: [...G.lineup.order],
    inning: 7,
    half: 2,
    mode: "",
    process: "",
    currentRoll: [],
    currentOutcome: "out",
    currentModRoll: [],
    currentModOutcome: "",
    atBat: gameEvent.home,
    inProgress: true,
    outs: 0,
    dice: 12,
    rerolls: 3,
    rerollAllowed: 99,
    mods: 3,
    score: [0, 0],
    currentBatterIndex: 0,
    pitcher: G.lineup.pitcher,
    runners: [],
    scoreboard: [
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ],
      [
        { hits: 0, runs: 0, errors: 0 },
        { hits: 0, runs: 0, errors: 0 }
      ]
    ]
  }
  store.update(state => {
    state.game = thisGame;
    state.game.mode = "roll";
    state.game.process = G.game.home ? "hit" : "field";
    state.lineup.bench.forEach(pl => pl.available = true);
    state.lineup.bullpen.forEach(pl => pl.available = true);
    state.lineup.order.forEach(pl => pl.available = false);
    state.lineup.pitcher.available = false;
  }, ["game:started"]);
}

export function firstBatter(player) {
  store.update(state => {
    state.game.runners.push({ player: player, location: 0 });
    state.game.dice += player.dice;
    state.game.rerolls += player.reroll;
    state.game.mods += player.modifier;
    state.game.mode = "roll";
  }, [
    ["batter:changed", player]
  ]);
}

export function subBatter(subOut, subIn) {
  store.update(state => {
    
    const batIdx = state.lineup.order.indexOf(subOut);
    const benchIdx = state.lineup.bench.indexOf(subIn);
    
    
    state.game.runners[state.game.runners.length - 1].player = subIn;
    state.game.dice += (subIn.dice - subOut.dice);
    state.game.rerolls += (subIn.reroll - subOut.reroll);
    state.game.mods += (subIn.modifier - subOut.modifier);
    [state.lineup.order[batIdx], state.lineup.bench[benchIdx]] = [state.lineup.bench[benchIdx], state.lineup.order[batIdx]];
    subOut.available = false;
    changeMode("roll");
  }, ["batter:sub"]);
  //update runner array
  //remove old batter resources 
}

export function nextBatter() {
  let batter;
  store.update(state => {
    state.game.currentBatterIndex < 8 ? state.game.currentBatterIndex++ : state.game.currentBatterIndex = 0;
    batter = state.lineup.order[state.game.currentBatterIndex];
    state.game.runners.push({ player: batter, location: 0 });
    state.game.dice += batter.dice;
    state.game.rerolls += batter.reroll;
    state.game.mods += batter.modifier;
    state.game.mode = "roll";
  }, ["batter:changed"]);
}

export function playerOut(outPlayer) {
  const runnerIndex = G.game.runners.findIndex(r => r.player === outPlayer);
  console.log("index")
  console.log(runnerIndex)
  const runnerLocation=G.game.runners[runnerIndex].location;

  store.update(state => {
      state.game.runners.splice(runnerIndex, 1);
      state.game.outs++;
      state.game.process = "hit";
    },["player:out", outPlayer ]);
  
  if (runnerLocation === 0) {
    store.emit("batter:out", outPlayer);
  }
  
  if (G.game.outs >= 3) {
    endOffHalf();
  }
}


export function endOffHalf() {
  if (G.game.half === 1 && G.game.inning >= 9 && G.game.score[1] > G.game.score[0]) {
    endGame();
  } else if (G.game.half === 2 && G.game.inning >= 9 && G.game.score[1] != G.game.score[0]) {
    endGame();
  } else {
    store.update(state => {
      state.game.half = 2 - (state.game.half - 1);
      state.game.outs = 0;
      state.game.dice = 0;
      state.game.rerolls = 0;
      state.game.mods = 0;
      state.game.runners = [];
      state.game.atBat = !state.game.atBat;
      if (state.game.half === 1) {
        state.game.inning++;
      }
    }, [
      ["inning:changed"],
      [`inning:${G.game.atBat ? "defense" : "offense"}`]
    ])
  }
}

export function endDefHalf(runs) {
  store.update(state => {
    state.game.home ? state.game.score[0] += runs : state.game.score[1] += runs
  }, ["score:changed"])
  endOffHalf();
}


export function startOffHalf() {
  //  nextBatter();
}


export function endGame() {
  
}

//ADVANCING RUNNERS

export function advanceRunners(lastPlay) {
  store.update((state) => {
    const runners = state.game.runners;
    const batter = runners.find(r => r.location === 0);
    
    if (lastPlay === "BB") {
      advanceOnWalk(runners, batter);
    } else if (lastPlay === "SAC") {
      advanceOnSac(runners, batter);
    } else {
      //It's a hit or we're in running mode 
      advanceOnHit(state, runners, lastPlay);
    }
    
    maybeEnterRunMode(state, lastPlay);
  }, [
    ["runners:advanced", { lastPlay }]
  ]);
}

function advanceOnWalk(runners, batter) {
  const FB = runners.find(r => r.location === 1);
  const SB = runners.find(r => r.location === 2);
  const TB = runners.find(r => r.location === 3);
  
  batter.location = 1;
  if (FB) {
    FB.location = 2;
    if (SB) {
      SB.location = 3;
      if (TB) TB.location = 4;
    }
  }
}

function advanceOnSac(runners, batter) {
  runners.forEach((r) => {
    if (r.location > 0) r.location++;
  });
  playerOut(batter.player);
}

const ADVANCE_BY = { "1B": 1, "2B": 2, "3B": 3, "HR": 4, extraBases: 1 };

function advanceOnHit(state, runners, lastPlay) {
  const advanceBy = ADVANCE_BY[lastPlay];
  
  runners.forEach((rn) => {
    rn.location = Math.min(rn.location + advanceBy, 4);
  });
  
  if (lastPlay === "extraBases") {
    runners[runners.length - 1].location -= 1;
    state.game.process = "hit";
  }
}

function maybeEnterRunMode(state, lastPlay) {
  const isHit = lastPlay !== "extraBases" && lastPlay !== "BB" && lastPlay !== "SAC";
  const runnersOnBase = state.game.runners.filter(r => r.location < 4).length;
  if (isHit && runnersOnBase >= 2) {
    state.game.mode = "run";
  }
}

/*
export function advanceRunners(lastPlay) {
  const movedRunners = [];
  let advanceBy;
  store.update((state) => {
    const batter = state.game.runners.find(r => r.location === 0);
    const FB = state.game.runners.find(r => r.location === 1);
    const SB = state.game.runners.find(r => r.location === 2);
    const TB = state.game.runners.find(r => r.location === 3);
    let hit = false;
    
    if (lastPlay === "BB") {
      batter.location = 1;
      if (FB) {
        FB.location = 2;
        if (SB) {
          SB.location = 3;
          if (TB) {
            TB.location = 4;
          }
        }
      }
    }
    else if (lastPlay === "SAC") {
      [FB, SB, TB].forEach((r) => {
        if (r) {
          r.location++;
        };
      });
      playerOut(batter.player);
    } else {
      hit = lastPlay === "extraBases" ? false : true;
      switch (lastPlay) {
        case "1B":
          advanceBy = 1;
          break;
        case "2B":
          advanceBy = 2;
          break;
        case "3B":
          advanceBy = 3;
          break;
        case "HR":
          advanceBy = 4;
          break;
        case "extraBases":
          advanceBy = 1;
          break;
      }
      state.game.runners.forEach((rn) => {
        const oldLocation = rn.location
        rn.location = Math.min(rn.location + advanceBy, 4);
      })
      if (lastPlay === "extraBases") {
        state.game.runners[state.game.runners.length - 1].location -= 1;
        state.game.process = "hit";
      }
    }
    if (hit && state.game.runners.filter(r => r.location < 4).length >= 2) {
      state.game.mode = "run";
    }
  }, [
    ["runners:advanced", { lastPlay }]
  ])
}

*/
export function runScored(runner) {
  const runnerIndex = G.game.runners.findIndex(r => r === runner);
  if (runnerIndex < 0) return;
  store.update(state => {
    state.game.runners.splice(runnerIndex, 1);
    state.game.home === true ? state.game.score[1]++ : state.game.score[0]++
  }, ["run:scored"]);
}


export function endOffenseRoll(dice) {
  //Charges resources and locks in result from getBatterOutcome 
  switch (G.game.mode) {
    case "reroll":
      store.update(state => {
        state.game.rerolls--;
        state.game.mode = "outcome";
      }, ["offense:re-rolled"]);
      break;
    case "roll":
      store.update(state => {
          state.game.dice -= dice.length;
          state.game.mode = "outcome";
        },
        ["offense:main-rolled"]
      );
      break;
  }
  const outcome = G.game.process === "run" ? getRunnerOutcome(dice) : getBatterOutcome(G.lineup.order[G.game.currentBatterIndex], dice);
  store.update(state => {
      state.game.currentRoll = dice;
      state.game.currentOutcome = outcome;
    },
    ["offense:rolled"]
  );
}

export function getBatterOutcome(batter, dice) {
  //Shows the potential outcome based on dice and batter 
  const outcomes = batter.outcomes;
  let pass = false;
  let best = false;
  let outcome;
  for (let i = 0; i < outcomes.length; i++) {
    const result = rollTests[outcomes[i].type](dice, outcomes[i].count, outcomes[i].target);
    if (result === true) {
      outcome = outcomes[i].play;
      pass = true;
      if (i === 0) best = true
      break;
    }
  }
  if (pass === false) outcome = "out";
  return outcome
}

export function applyMods(batter, dice, modCount) {
  store.update(state => {
    state.game.currentDice = dice;
    switch (G.game.process) {
      case 'hit':
        state.game.currentOutcome = getBatterOutcome(batter, dice)
        state.game.mods -= modCount;
        break;
      case 'run':
        state.game.currentOutcome = getRunnerOutcome(dice);
        state.game.mods -= modCount;
        break;
      default:
        // Tab to edit
    }
  }, ["mods:applied"]);
}

//store.emit("batter:rolled", { outcome, best });

export function testOpp(opp, dice, type) {
  const result = oppTests[opp.result.test](dice);
  store.emit("opp:rolled", { result });
  return result;
}

export function getRunnerOutcome(dice) {
  const result = G.game.outs < 2 ? dice.filter(d => d === 6).length > 0 : dice.filter(d => d >= 5).length > 0;
  return result ? "safe" : "out";
}

export function changeMode(mode) {
  store.update(state => {
    state.game.mode = mode;
  }, ["mode:changed"]);
}
export function changeProcess(process) {
  store.update(state => {
    state.game.process = process;
  }, ["process:changed"]);
}

export const specialBatterThrow = {
  "008": () => {
    store.update(state => {
      state.game.currentOutcome = "SAC";
      state.game.dice -= 3;
      advanceRunners("SAC");
    })
  }
}