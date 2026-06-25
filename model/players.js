import { maxValue, sumValue, countEvenOdd, checkStraight, countValue, countPairs, countSets, testRange, countUnique } from '../control/rollTest.js'

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
          return "Out"
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
  },
  {
    id: "014",
    first: "Sammy",
    last: "Abbott",
    name: "Sammy Abbott",
    number: 14,
    tier: 1,
    dice: 1,
    reRoll: 0,
    modifier: 0,
    condition: "roll",
    bat(dice) {
      if (testRange(dice, "ge", 5, 1)) {
        return "2B"
      } else if (testRange(dice, "ge", 4, 1)) {
        return "1B"
      } else if (testRange(dice, "ge", 3, 1)) {
        return "BB"
      } else {
        return "Out"
      }
    }
  },
  {
    id: "013",
    first: "Xavier",
    last: "Kelly",
    name: "Xavier Kelly",
    number: 13,
    tier: 1,
    dice: 0,
    reRoll: 0,
    modifier: 0,
    condition: "opt",
    bat(dice) {
      //come back to this one
    }
  },
  {
    id: "010",
    first: "Jose",
    last: "Adams",
    name: "Jose Adams",
    number: 10,
    tier: 1,
    dice: 2,
    reRoll: 0,
    modifier: 0,
    condition: "roll",
    //Base Running Bonus
    bat(dice) {
      if (sumValue(dice, "ge", 12)) {
        return "2B";
      } else {
        return "Out";
      }
    }
  },
  {
    id: "004",
    first: "Joey",
    last: "Hughes",
    name: "Joey Hughes",
    number: 4,
    tier: 1,
    dice: 2,
    reRoll: 0,
    modifier: 0,
    condition: "roll",
    bat(dice) {
      if (countUnique(dice, "ge", 3)) {
        return "1B";
      } else {
        return "Out";
      }
    }
  },
  {
    id: "008",
    first: "Tommy",
    last: "Baxter",
    name: "Tommy Baxter",
    number: 8,
    tier: 1,
    dice: 3,
    reRoll: 0,
    modifier: 0,
    condition: "opt",
    bat(dice) {
      //come back to this
    }
  },
  {
    id: "011",
    first: "Curtis",
    last: "Garcia",
    name: "Curtis Garcia",
    number: 11,
    tier: 1,
    dice: 0, //One per baserunner
    reRoll: 0,
    modifier: 0,
    condition: "field",
    bat(dice) {
      //come back to this
    }
  },
  {
    id: "015",
    first: "Kenny",
    last: "Williams",
    name: "Kenny Williams",
    number: 15,
    tier: 1,
    dice: 0,
    reRoll: 0,
    modifier: 0,
    condition: "roll",
    bat(dice) {
      if (maxValue(dice, "ge", 4)) {
        return "2B";
      } else {
        return "Out"
        //All base runners out
      }
    }
  },
  {
    id: "021",
    first: "Rashid",
    last: "Walker",
    name: "Rashid Walker",
    number: 21,
    tier: 2,
    dice: 3,
    reRoll: 1,
    modifier: 0,
    team: "COL",
    condition: "opt",
    bat(dice) {
      //minus two dice to sacrifice
    }
  },
  {
    id: "032",
    first: "Tony",
    last: "Benson",
    name: "Tony Benson",
    number: 32,
    tier: 3,
    dice: 2,
    reRoll: 0,
    modifier: 1,
    team: "BOS",
    condition: "roll",
    bat(dice) {
      if (countSets(dice, "ge", 3, 1)) {
        return "HR"
      } else if (countSets(dice, "ge", 2, 1)) {
        return "2B"
      } else {
        return "Out"
      }
    }
  },
  {
    id: "024",
    first: "Bobby",
    last: "Jones",
    name: "Bobby Jones",
    number: 24,
    tier: 2,
    dice: 0,
    reRoll: 0,
    modifier: 0,
    team: "SF",
    condition: "roll",
    bat(dice) {
      if (maxValue(dice, "ge", 6)) {
        return "2B"
      } else if (maxValue(dice, "ge", 4)) {
        return "1B"
      } else if (maxValue(dice, "ge", 3)) {
        return "SAC"
      } else {
        return "Out"
      }
    }
  },
  {
    id: "019",
    first: "Freddy",
    last: "Mitchell",
    name: "Freddy Mitchell",
    number: 19,
    tier: 2,
    dice: 1,
    reRoll: 0,
    modifier: 0,
    team: "SEA",
    condition: "opt",
    bat(dice) {
      if (sumValue(dice, "ge", 11)) {
        return "2B"
      } else if (sumValue(dice, "ge", 7)) {
        return "1B"
      } else {
        return "Out"
      }
    }
  }
  
]

/*
bat(dice) {
  if (countValue(dice, "ge", 6, 2)) {
    return "HR"
  } else if (countValue(dice, "ge", 6, 1)) {
    return "2B"
  } else {
    return "Out"
  }
}
*/