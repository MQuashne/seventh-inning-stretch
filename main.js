import { players } from './model/players.js'
import { maxValue } from './control/rollTest.js'
import DiceBox from "https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/dice-box.es.js";
import {colorSetup} from './control/colorControl.js'
import { DICE } from './dice/dice.js'

const $t = id => document.getElementById(id);
const $c = id => document.querySelector(`.${id}`);
const on = (el, event, cb) => el.addEventListener(event, cb);


let result = players[8].bat([1, 2, 3, 4]);
const resultDiv = document.getElementById('result');
const nameDiv = document.getElementById('name');
nameDiv.textContent = players[8].name;
resultDiv.textContent = result;

const diceRoller=$t('diceRoller');
const rollButton = $t('roll');
on(rollButton, 'click', () => { box.start_throw() });

const box = new DICE.dice_box(diceRoller);
box.setDice("3d6");


//--TEAM AND COLOR SELECT--
colorSetup(box);



// Mix equal parts black (#000000) and white (#ffffff)
// Updates a global variable like --main-color
document.documentElement.style.setProperty('--main-color', '#ffffff');
document.documentElement.style.setProperty('--die-font-color', '#000000');
/*
let c1='#e81828';
let f1='#002D72';

let diceGrad= `radial-gradient(circle at 5% 5%,${blendColors(c1,'#ffffff',0.5)} 0%,${c1} 80%)`;
let fontGrad= `radial-gradient(circle at 5% 5%,${blendColors(f1,'#ffffff',0.5)} 0%,${f1} 80%)`;

let grad = $c('die-box');
//grad.style.backgroundImage=`${diceGrad},${fontGrad}`;
grad.style.background=c1;
*/