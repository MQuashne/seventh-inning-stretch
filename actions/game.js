import { store } from '../model/store.js'
import { G } from '../model/game.js'



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

export function playerOut(player) {
  const orderIndex = G.game.order.indexOf(player);
  const runnerIndex = G.game.runners.findIndex(r => r.player === player);
  store.update(state => {
    state.game.runners.splice(runnerIndex, 1);
    state.game.outs++
  }, ["player:out"]);
  if (orderIndex === G.game.currentBatterIndex) {
    store.update(state => {
      state.game.currentBatterIndex < 8 ? state.game.currentBatterIndex++ : state.game.currentBatterIndex = 0;
    }, [
      ["batter:out", player]
    ]);
  }
  if (G.game.outs >= 3) {
    endOffHalf();
  }
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
      }, ["inning:changed"]);
    }
  }
}

export function startOffHalf() {
  newBatter(G.game.order[G.game.currentBatterIndex]);
}

export function endGame() {
  
}

export function advanceRunners() {
  //Walk - only advance if forced
  //Hit - move all same as value
  //sacrifice - all move but batter
  
  //or do this one at a time?
}