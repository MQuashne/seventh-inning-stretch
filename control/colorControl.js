import { teamUnis, teamNames } from '../dice/assets/teamColors.js'
import { DICE } from '../dice/dice.js'

const $t = id => document.getElementById(id);
const $c = id => document.querySelector(`.${id}`);
const on = (el, event, cb) => el.addEventListener(event, cb);
const _option = (val, text) => {
  const o = document.createElement('option');
  o.value = val;
  o.textContent = text;
  return o
};

function capitalizeFirstLetter(str) {
  if (!str) return ""; // Handle null, undefined, or empty string
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const teamSelect = $t("team-select");
const uniSelect = $t("color-1");



const teams = Object.keys(teamUnis);

export function colorSetup(box) {
  teams.forEach((team) => {
    const teamOpt = _option(team, teamNames[team]);
    teamSelect.appendChild(teamOpt);
  });
  on(teamSelect, 'change', (e) => {
    popColorPickers(e.target.value, box);
  });
  on(uniSelect, 'input', (e) => {
    let uni = teamUnis[teamSelect.value][e.target.value];
    setColors(uni,box);
  });
}

function popColorPickers(team, box) {
  uniSelect.innerHTML = "";
  const unis = teamUnis[team];
  
  Object.entries(unis).forEach(([key, value]) => {
    const uniOpt = _option(key, key);
    uniSelect.appendChild(uniOpt);
  });
  setColors(unis["Home"],box);
  uniSelect.selectedIndex = 0;
  
}

function setColors(uni,box) {
  document.documentElement.style.setProperty('--die-bg-color', uni.stripe ? `linear-gradient(90deg,${uni.jersey} 0%, ${uni.jersey} 5%, ${uni.stripe}a0 6%, ${uni.jersey} 7%, ${uni.jersey} 35%, ${uni.stripe}a0 36%, ${uni.jersey} 37%, ${uni.jersey} 65%, ${uni.stripe}a0 66%, ${uni.jersey} 67%, ${uni.jersey} 95%, ${uni.stripe}a0 96%, ${uni.jersey} 97%, ${uni.jersey} 100%)` : uni.jersey);
  
  
  document.documentElement.style.setProperty('--die-font-color', uni.text);
  document.documentElement.style.setProperty('--die-outline-color', uni.outline ||= "#ffffff00");
  
  DICE.set_color('dice', uni.jersey);
  DICE.set_color('label', uni.text);
  DICE.set_color('stripe', uni.stripe ||= uni.jersey);
  DICE.set_color('outline', uni.outline ||= uni.jersey);
  box.start_throw();
  //console.log(document.documentElement.style.getPropertyValue('--die-bg-color'));
 
  

  
}