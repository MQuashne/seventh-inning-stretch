export function maxValue(dice, op, target) {
  const diceMax = Math.max(...dice);
  switch (op) {
    case 'eq':
      return diceMax === target;
      break;
    case 'le':
      return diceMax <= target;
      break;
    case 'ge':
      return diceMax >= target;
      break;
    default:
      return false;
  }
}

export function sumValue(dice, op, target) {
  const diceSum = dice.reduce((sum, item) => sum + item, 0);
  switch (op) {
    case 'eq':
      return diceSum === target;
      break;
    case 'le':
      return diceSum <= target;
      break;
    case 'ge':
      return diceSum >= target;
      break;
    default:
      return false;
  }
}

export function countEvenOdd(dice, op, eo, target) {
  
  let count = { even: 0, odd: 0 };
  
  for (let i = 0; i < dice.length; i++) {
    dice[i] % 2 === 0 ? count.even++ : count.odd++
  }
  
  switch (op) {
    case 'eq':
      return count[eo] === target;
      break;
    case 'le':
      return count[eo] <= target;
      break;
    case 'ge':
      return count[eo] >= target;
      break;
    default:
      return false;
  }
}

export function checkStraight(dice, run) {
  // Sort and remove duplicates in case of unsorted or messy inputs
  const uniqueSorted = [...new Set(dice)].sort((a, b) => a - b);
  
  // A straight of 3 requires a span of at most 2 across 3 elements
  for (let i = 0; i <= uniqueSorted.length - run; i++) {
    if (uniqueSorted[i + run - 1] - uniqueSorted[i] === run - 1) {
      return true;
    }
  }
  return false;
}

export function countValue(dice, op, val, target) {
  const valCount = dice.filter(res => res===val).length
  switch (op) {
    case 'eq':
      return valCount === target;
      break;
    case 'le':
      return valCount <= target;
      break;
    case 'ge':
      return valCount >= target;
      break;
    default:
      return false;
  }
}

export function countPairs(dice, op, target) {
  const counts={};
  
  for (const num of dice){
    counts[num]=(counts[num] || 0) +1;
  }
  
  const pairs = Object.values(counts).filter(count => count>=2).length;
  
  switch (op) {
  case 'eq':
    return pairs === target;
    break;
  case 'le':
    return pairs <= target;
    break;
  case 'ge':
    return pairs >= target;
    break;
  default:
    return false;
}
}

export function countSets(dice, op, num,target) {
  const counts = {};
  
  for (const num of dice) {
    counts[num] = (counts[num] || 0) + 1;
  }
  
  const sets = Object.values(counts).filter(count => count >= num).length;
  
  switch (op) {
    case 'eq':
      return sets === target;
      break;
    case 'le':
      return sets <= target;
      break;
    case 'ge':
      return sets >= target;
      break;
    default:
      return false;
  }
}
