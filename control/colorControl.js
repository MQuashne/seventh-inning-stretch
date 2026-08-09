import { teamUnis, teamNames, leagueNames, evergreenJerseys } from '../dice/assets/teamColors.js'
import { DICE } from '../dice/dice.js'
import { G } from '../model/game.js'
import { renderSpringTraining } from '../render/renderSpringTraining.js'
import { allPlayers } from '../control/setup.js'
import { buildCard } from '../render/buildCard.js'
import { $n, $t, $c, $a, $cl, on, randInt, findKey } from '../util.js'
import { brandColors } from '../render/brandColors.js'
import { opponents } from '../model/opponents.js'
import { teams, leagues } from '../model/teams.js'

const _option = (val, text) => {
  const o = document.createElement('option');
  o.value = val;
  o.textContent = text;
  return o
};

const leagueSelect = $t("league-select")
const teamSelect = $t("team-select");
const uniSelect = $t("uni-select");


export function colorSetup(box) {
  const replacements = adjustTeams();
  
  leagues.forEach((league) => {
    const leagueOpt = _option(league.code, league.name);
    leagueSelect.appendChild(leagueOpt);
  });
  
  //Initial Values
  leagueSelect.value = G.thisTeam.league;
  popTeamPicker(G.thisTeam.league, box);
  teamSelect.value = G.thisTeam.code
  popUniPicker(G.thisTeam.code, box);
  uniSelect.value = "Home";
  
  on(leagueSelect, 'change', (e) => {
    let league = e.target.value;
    popTeamPicker(league, box);
    popUniPicker(Object.keys(teamNames[league])[0], box)
  });
  on(teamSelect, 'change', (e) => {
    let team = e.target.value;
    document.documentElement.dataset.team = team;
    
    G.fullRoster.forEach((player) => player.team = team);
    G.myTeam = team;
    G.thisTeam = teams.find((t) => t.code === team);
    $t('header-team-name').textContent = teamNames[leagueSelect.value][team];
    const onBoard = document.querySelectorAll(".card");
    onBoard.forEach((card) => {
      if (card.dataset.pid) {
        card.innerHTML = '';
        card.append(buildCard(allPlayers.find(player => player.id === card.dataset.pid)))
        
      }
    })
    popUniPicker(team, box);
  });
  on(uniSelect, 'input', (e) => {
    let uni = evergreenJerseys[leagueSelect.value][teamSelect.value][e.target.value];
    let team = teamSelect.value;
    console.log(team)
    setColors(uni, box, team);
  })
}

function popTeamPicker(league, box) {
  teamSelect.innerHTML = "";
  
  const leagueTeams = teams.filter(t => t.league === league);
  leagueTeams.forEach(team => {
    const teamOpt = _option(team.code, `${team.city} ${team.name}`);
    teamSelect.appendChild(teamOpt);
    teamSelect.selectedIndex = 0;
  });
}

function popUniPicker(team, box) {
  uniSelect.innerHTML = "";
  const league = leagueSelect.value;
  const unis = evergreenJerseys[league][team];
  Object.entries(unis).forEach(([uni, value]) => {
    const uniOpt = _option(uni, uni);
    uniSelect.appendChild(uniOpt);
    setColors(unis["Home"], box);
    uniSelect.selectedIndex = 0;
  });
}

function setColors(uni, box) {
  const empty = "";
  console.log(uni)
  console.log(uni.stripe === empty);
  
  if (uni.stripe === "" || uni.stripe === uni.jersey) {
    document.documentElement.style.setProperty('--die-bg-color', uni.jersey);
    } else {
      document.documentElement.style.setProperty('--die-bg-color',`linear-gradient(90deg,${uni.jersey} 0%, ${uni.jersey} 5%, ${uni.stripe}a0 6%, ${uni.jersey} 7%, ${uni.jersey} 35%, ${uni.stripe}a0 36%, ${uni.jersey} 37%, ${uni.jersey} 65%, ${uni.stripe}a0 66%, ${uni.jersey} 67%, ${uni.jersey} 95%, ${uni.stripe}a0 96%, ${uni.jersey} 97%, ${uni.jersey} 100%)`)
    }
    
    
    document.documentElement.style.setProperty('--die-font-color', uni.text);
    document.documentElement.style.setProperty('--die-outline-color', uni.outline ||= "#ffffff00");
    document.documentElement.style.setProperty('--td', G.thisTeam.td==="#000000" ? "#222222" : G.thisTeam.td);
    
    
    DICE.set_color('dice', uni.jersey);
    DICE.set_color('label', uni.text);
    DICE.set_color('stripe', uni.stripe ||= uni.jersey);
    DICE.set_color('outline', uni.outline ||= uni.jersey);
    box.start_throw();
  }
  
  function getContrastColor(hexColor) {
    /*
    const cleanHex = hexColor.replace(/^#/, '');
    
    const r8 = parseInt(cleanHex.substring(0, 2), 16);
    const g8 = parseInt(cleanHex.substring(2, 4), 16);
    const b8 = parseInt(cleanHex.substring(4, 6), 16);
    
    const rgbDecimals = [r8, g8, b8].map(val => val / 255);
    
    const [r, g, b] = rgbDecimals.map(s => {
      return s <= 0.03928 ?
        s / 12.92 :
        Math.pow((s + 0.055) / 1.055, 2.4);
    });
    
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
    return luminance > 0.1791 ? '#000000' : '#ffffff';
    */
  }
  
  function getDarkerColor(hex1, hex2) {
    /*
    const getLuminance = (hex) => {
      const cleanHex = hex.replace('#', '');
      
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    
    console.log(`hex1: ${hex1}, lum1; ${lum1}, hex2: ${hex2}, lum2; ${lum2}`)
    
    return lum1 < lum2 ? hex1 : hex2;*/
  }
  
  export function initTeamColors(teams) {
    /*teams.forEach((team) => {
      team.td = getDarkerColor(team.tp, team.ts);
      team.tl = team.td===team.ts ? team.tp : team.ts;
      team.tpText = getContrastColor(team.tp);
      team.tsText = getContrastColor(team.ts);
      team.lbgText = getContrastColor(team.tp);
      team.lbgText = team.lbg === "#FFFFFF" ? team.ts : getContrastColor(team.lbg);
    })
    return teams*/
  }
  
  
  export function getTeamColors(code) {
    /*const tp = brandColors[code].tp;
    const ts = brandColors[code].ts;
    const td = getDarkerColor(tp, ts);
    const lbg = brandColors[code].lbg;
    const tpText = getContrastColor(tp);
    const tsText = getContrastColor(ts);
    const lbgText = lbg === "#FFFFFF" ? ts : getContrastColor(lbg);
    
    const tc = {
      tp,
      ts,
      td,
      lbg,
      tpText,
      tsText,
      lbgText
    }
    
    return tc*/
  }
  
  
  
  
  function adjustTeams() {
    //look for selected team in opponents list 
    G.league = [...opponents];
    const selTeam = G.league.find(t => t.code === G.thisTeam.code)
    
    //Only do something if there is already a parked team or the selected team is in the opponents list 
    
    if (selTeam) {
      G.parked = { ...selTeam };
      const excludeT = new Set(G.league.map(t => t.code));
      const remTeams = teams.filter(opt => !excludeT.has(opt.code));
      const filler = remTeams[randInt(0, remTeams.length - 1)];
      
      const pl = allPlayers.find(p => p.team === selTeam.code)
      selTeam.code = filler.code;
      selTeam.team = filler.name;
      selTeam.city = filler.city;
      pl.team = filler.code
    }
    
  }