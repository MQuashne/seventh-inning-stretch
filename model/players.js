import { maxValue, sumValue, countEvenOdd, checkStraight, countValue, countPairs, countSets } from '../control/rollTest.js'

export const players = [
  {
    id: "001",
    first: "Marcus",
    last: "Baker",
    name: "Marcus Baker",
    number: 1,
    tier: 1,
    dice: 2,
    reRoll: 0,
    modifier: 0,
    condition: "roll",
    bat(dice) {
      console.log(dice);
      if (maxValue(dice, "eq", 6)) {
        return "1B";
      } else if (maxValue(dice, "ge", 4)) {
        return "SAC";
      } else {
        return "Out"
      }
    }
  },
  {
    id: "005",
    first: "Rashawn",
    last: "Carter",
    name: "Rashawn Carter",
    number: 5,
    tier: 1,
    dice: 1,
    reRoll: 1,
    modifier: 0,
    condition: "roll",
    bat(dice) {
      if (sumValue(dice, "ge", 8)) {
        return "1B";
      } else {
        return "Out";
      }
    }
  },
  {
    id: "012",
    first: "Willie",
    last: "Morris",
    name: "Willie Morris",
    number: 12,
    tier: 1,
    dice: 1,
    reRoll: 0,
    modifier: 0,
    condition: "opt",
    bat(dice) {
      //come back to this one
    }
  },
  {
    id: "016",
    first: "Marlon",
    last: "Perez",
    name: "Marlon Perez",
    number: 16,
    tier: 1,
    dice: 1,
    reRoll: 1,
    modifier: 0,
    condition: "roll",
    bat(dice) {
      if (countEvenOdd(dice, "ge", "even", 3)) {
        return "2B";
      } else if (countEvenOdd(dice, "ge", "odd", 3)) {
        return "BB";
      } else {
        return "Out";
      }
    }
  },
  {
    id: "002",
    first: "Jimmy",
    last: "Martinez",
    name: "Jimmy Martinez",
    number: 2,
    tier: 1,
    dice: 2,
    reRoll: 1,
    modifier: 0,
    condition: "roll",
    bat(dice) {
      if (checkStraight(dice, 3)) {
        return "1B"
      } else {
        return "Out"
      }
    }
  },
  {
    id: "006",
    first: "Andre",
    last: "Parker",
    name: "Andre Parker",
    number: 6,
    tier: 1,
    dice: 1,
    reRoll: 0,
    modifier: 0,
    condition: "roll",
    bat(dice) {
      if (countValue(dice, "ge", 6, 2)) {
        return "HR"
      } else if (countValue(dice, "ge", 6, 1)) {
        return "2B"
      } else {
        {
          return "Out"
        }
      }
    }
  },
  {
    id: "009",
    first: "Eddie",
    last: "Campbell",
    name: "Eddie Campbell",
    number: 9,
    tier: 1,
    dice: 1,
    reRoll: 0,
    modifier: 1,
    condition: "roll",
    bat(dice) {
      //disable resources?
      if (countSets(dice, "ge", 2, 2)) {
        return "HR"
      } else {
        {
          return "Out"
        }
      }
    }
  },
  {
    id: "003",
    first: "Louie",
    last: "Cooper",
    name: "Louie Cooper",
    number: 3,
    tier: 1,
    dice: 1,
    reRoll: 1,
    modifier: 0,
    condition: "roll",
    bat(dice) {
      //disable resources?
      if (countEvenOdd(dice, "ge", "even", 2)) {
        return "1B"
      } else {
        {
          return "Out"
        }
      }
    }
  },
  {
    id: "007",
    first: "Timmy",
    last: "Sanchez",
    name: "Timmy Sanchez",
    number: 7,
    tier: 1,
    dice: 2,
    reRoll: 0,
    modifier: 0,
    condition: "roll",
    bat(dice) {
      //disable resources?
      if (countSets(dice, "ge", 3, 1)) {
        return "2B"
      } else if (countSets(dice, "ge", 2, 1)) {
        return "1B"
      } else {
        {
          return "Out"
        }
      }
    }
  }
  
  
  
]