import { players } from './model/players.js'
import { maxValue } from './control/rollTest.js'
import {colorSetup} from './control/colorControl.js'
import { DICE } from './dice/dice.js'
import { setupTest } from './control/setup.js'

const $t = id => document.getElementById(id);
const $c = id => document.querySelector(`.${id}`);
const on = (el, event, cb) => el.addEventListener(event, cb);

/*console.log(players.length)
let result = players[12].bat([1, 6, 3, 4]);
const resultDiv = document.getElementById('result');
const nameDiv = document.getElementById('name');
nameDiv.textContent = players[12].name;
resultDiv.textContent = result;

const diceRoller=$t('diceRoller');
const rollButton = $t('roll');
on(rollButton, 'click', () => { box.start_throw() });

const box = new DICE.dice_box(diceRoller);
box.setDice("12d6");


//--TEAM AND COLOR SELECT--
colorSetup(box);*/
setupTest()
