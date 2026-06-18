import {players} from './model/players.js'
import {maxValue} from './control/rollTest.js'
import DiceBox from "https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/dice-box.es.min.js";

console.log("running")
let result = players[8].bat([1,2,3,4]);
const resultDiv=document.getElementById('result');
const nameDiv=document.getElementById('name');
nameDiv.textContent=players[8].name;
resultDiv.textContent=result;

