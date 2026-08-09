import { store } from '../model/store.js'
import { G } from '../model/game.js'
import { rollTests } from '../control/rollTest.js'


export function newBatter(player) {
  store.update(state => {
    state.game.runners.push({ player: player, location: 0 });
    state.game.dice += player.dice;
    state.game.rerolls += player.reRoll;
    state.game.mods += player.modifier;
  }, [
    ["batter:changed", player]
  ]);
  
}

export function nextBatter() {
  let player;
  store.update(state => {
    state.game.currentBatterIndex < 8 ? state.game.currentBatterIndex++ : state.game.currentBatterIndex = 0;
    player = state.game.order[state.game.currentBatterIndex];
    state.game.runners.push({ player: player, location: 0 });
    state.game.dice += player.dice;
    state.game.rerolls += player.reRoll;
    state.game.mods += player.modifier;
  }, []);
  store.emit("batter:changed", player);
}

export function playerOut(player) {
  const orderIndex = G.game.order.indexOf(player);
  const runnerIndex = G.game.runners.findIndex(r => r.player === player);
  const runnerLocation = G.game.runners.find(r => r.player === player).location;
  store.update(state => {
    state.game.runners.splice(runnerIndex, 1);
    state.game.outs++
  }, ["player:out"]);
  
  if (runnerLocation === 0) {
    
    store.emit("batter:out", player);
  }
  if (G.game.outs >= 3) {
    endOffHalf();
  }
}

export function batterOut() {
  
}


export function endOffHalf() {
  if (G.game.half === 1) {
    if (G.game.inning >= 9 && G.game.score[1] > G.game.score[0]) {
      endGame();
    } else {
      store.update(state => {
        state.game.half = 2;
        state.game.outs = 0;
        state.game.dice = 0;
        state.game.rerolls = 0;
        state.game.mods = 0;
        state.game.runners=[];
      }, ["inning:changed"])
    }
  } else {
    if (G.game.inning >= 9 && G.game.score[1] != G.game.score[0]) {
      endGame();
    } else {
      store.update(state => {
        state.game.inning++;
        state.game.half = 1;
        state.game.outs = 0;
        state.game.dice = 0;
        state.game.rerolls = 0;
        state.game.mods = 0;
        state.game.runners=[];
      }, ["inning:changed"]);
    }
  }
}

export function startOffHalf() {
  nextBatter();
}


export function endGame() {
  
}


export function advanceRunners(lastPlay) {
  const movedRunners = [];
  store.update((state) => {
    const batter = state.game.runners.find(r => r.location === 0);
    const FB = state.game.runners.find(r => r.location === 1);
    const SB = state.game.runners.find(r => r.location === 2);
    const TB = state.game.runners.find(r => r.location === 3);
    
    if (lastPlay === "BB") {
      console.log("walk");
      batter.location = 1;
      movedRunners.push({ pid: batter.player.id, from: 0, to: 1 });
      if (FB) {
        FB.location = 2;
        movedRunners.push({ pid: FB.player.id, from: 1, to: 2 });
        if (SB) {
          SB.location = 3;
          movedRunners.push({ pid: SB.player.id, from: 2, to: 3 });
          if (TB) {
            TB.location = 4;
            movedRunners.push({ pid: TB.player.id, from: 3, to: 4 });
            //runScored(TB);
          }
        }
      }
    }
    else if (lastPlay === "SAC") {
      console.log("sac");
      [FB, SB, TB].forEach((r) => {
        if (r) {
          r.location++;
          movedRunners.push({ pid: r.player.id, from: r.location - 1, to: r.location });
        };
      });
      playerOut(batter.player);
    } else {
      console.log("hit")
      let advanceBy;
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
      }
      state.game.runners.forEach((rn) => {
        const oldLocation = rn.location
        rn.location = Math.min(rn.location + advanceBy, 4);
        movedRunners.push({ pid: rn.player.id, from: oldLocation, to: rn.location });
        if (rn.location === 4) {
          console.log(`run: ${rn.player.id}`)
          //runScored(rn);
          
        }
      })
    }
  }, [
    ["runners:advanced", {lastPlay,movedRunners}]
  ])
  
  //Walk - only advance if forced
  //Hit - move all same as value
  //sacrifice - all move but batter
  
  //or do this one at a time?
}


export function runScored(runner) {
  const runnerIndex = G.game.runners.findIndex(r => r === runner);
  if (runnerIndex<0) return;
  store.update(state => {
    state.game.runners.splice(runnerIndex, 1);
    state.game.home === true ? state.game.score[1]++ : state.game.score[0]++
  }, ["run:scored"]);
}

export function testBatter(batter, dice) {
  const outcomes = batter.outcomes;
  let pass = false;
  let best = false;
  let outcome = "";
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
  console.log("emit")
  store.emit("batter:rolled", { outcome, best });
}
