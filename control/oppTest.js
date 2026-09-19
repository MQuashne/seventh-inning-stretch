import {G} from '../model/game.js'

export const oppTests = {
  lowDiff: (dice) => {
    const res = [...new Set(dice)].sort((a, b) => a - b);
    const diff = res[1] - res[0];
    return diff
  },
  sumSeven: (dice) => {
    const counts = {};
    for (const value of dice) {
      counts[value] = (counts[value] || 0) + 1;
    }
    const complementPairs = [
      [1, 6],
      [2, 5],
      [3, 4]
    ];
    let runs = 0;
    for (const [a, b] of complementPairs) {
      const countA = counts[a] || 0;
      const countB = counts[b] || 0;
      runs += countA * countB;
    }
    return runs;
  },
  lowMinus: (dice) => {
    return Math.min(...dice) - 1;
  },
  once: (dice) => {
    const counts = {};
    for (const value of dice) {
      counts[value] = (counts[value] || 0) + 1;
    }
    const singles = Object.values(counts).filter(x => x === 1);
    return singles.length;
  },
  missing: (dice) => {
    const counts = {};
    let missingCount = 0;
    for (const value of dice) {
      counts[value] = (counts[value] || 0) + 1;
    }
    for (let i = 1; i <= 6; i++) {
      counts[i] ?
        missingCount += 0 : missingCount++;
    }
    return missingCount;
  },
  setMinus: (dice) => {
    const counts = {};
    for (const value of dice) {
      counts[value] = (counts[value] || 0) + 1;
    }
    const maxMinus = Math.max(...Object.values(counts)) - 1
    return maxMinus;
  },
  divideFour: (dice) => {
    const diceSum = dice.reduce((acc, item) => acc + item, 0);
    return Math.floor(diceSum / 4);
  },
  fourDistance: (dice) => {
    const diceSum = dice.reduce((acc, item) => acc + item, 0);
    return Math.abs(diceSum - 4);
  },
  runMinus: (dice) => {
    const uniqueSorted = [...new Set(dice)].sort((a, b) => a - b);
    if (uniqueSorted.length === 0) return 0;
    let longest = 1;
    let current = 1;
    for (let i = 1; i < uniqueSorted.length; i++) {
      if (uniqueSorted[i] === uniqueSorted[i - 1] + 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }
    return longest - 1;
  },
  fiveSix: (dice) => {
    return dice.filter(d => d > 4).length;
  },
  matches: (dice) => {
    // Count occurrences of each value
    const counts = {};
    for (const value of dice) {
      counts[value] = (counts[value] || 0) + 1;
    }
    // For each value, add C(n, 2) = n*(n-1)/2 pairs
    let runs = 0;
    for (const value in counts) {
      const n = counts[value];
      runs += (n * (n - 1)) / 2;
    }
    return runs;
  },
  odd: (dice) => {
    let countOdd = 0;
    for (let i = 0; i < dice.length; i++) {
      dice[i] % 2 != 0 ? countOdd++ : countOdd += 0;
    }
    return countOdd;
  },
  sumNine: (dice) => {
    const diceSum = dice.reduce((acc, item) => acc + item, 0);
    return diceSum < 9 ? 0 : 2;
  },
  placeRoll: (dice) => {
    const counts = {};
    for (const value of dice) {
      counts[value] = (counts[value] || 0) + 1;
    }
    const maxMatch = Math.max(...Object.values(counts));
    if (maxMatch>=2){
      return G.game.opponent.result.unit;
    } else {
      return Number(G.game.opponent.dice[0])-dice.length;
    }
    
  }
}