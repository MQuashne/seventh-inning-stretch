import {players} from './model/players.js'
import {maxValue} from './control/rollTest.js'

let result = players[8].bat([1,2,3,4]);
const resultDiv=document.getElementById('result');
const nameDiv=document.getElementById('name');
nameDiv.textContent=players[8].name;
resultDiv.textContent=result;