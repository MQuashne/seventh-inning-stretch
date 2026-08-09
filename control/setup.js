import { players } from '../model/players.js'
import { pitchers } from '../model/pitchers.js'
import { opponents } from '../model/opponents.js'
import { G } from '../model/game.js'
import { initCalendar } from '../render/renderCalendarEvents.js'

import { renderSpringTraining, initSpringTraining } from '../render/renderSpringTraining.js'

import { initLineup } from '../render/renderLineup.js'

import { renderCover } from '../render/renderGameday.js'

import { initNav, renderNav } from '../render/renderNav.js'
import { $n, $t, $c, $a, on, findKey, loadCard, randInt } from '../util.js'
import { buildCard } from '../render/buildCard.js'
import { buildOpp } from '../render/buildOpp.js'
import Modal from '../render/modal.js'
import { colorSetup, getTeamColors } from './colorControl.js'
import { teamUnis, teamNames, leagueNames, evergreenJerseys } from '../dice/assets/teamColors.js'
import { teams, leagues } from '../model/teams.js'
import { endSpring } from './phase.js'
import { brandColors } from '../render/brandColors.js'
import { initGame } from '../render/renderGame.js'
import { DICE } from '../dice/dice.js'
import { setTest } from './testState.js'
import { initModScreen } from '../render/modals/modScreen.js'

export const allPlayers = [...players, ...pitchers];

function shuffle(array) {
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Pick a random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
};

export function gameSetup() {
  G.myTeam = document.documentElement.dataset.team;
  G.thisTeam = teams.find((t) => t.code === document.documentElement.dataset.team)
  $t('header-team-name').textContent = `${G.thisTeam.city} ${G.thisTeam.name}`;
  const myColors = getTeamColors(G.myTeam);
  
  const root = document.documentElement;
  root.style.setProperty('--td', G.thisTeam.td);
  
  const mainModal = new Modal();
  
  //Create 3 player decks
  const t1Players = players.filter(player => (player.tier === 1 && player.condition === "roll"));
  const t1Pitchers = pitchers.filter(pitcher => (pitcher.tier === 1));
  shuffle(t1Players);
  shuffle(t1Pitchers);
  const t2Players = players.filter(player => (player.tier === 2 && player.condition === "roll"));
  const t2Pitchers = pitchers.filter(pitcher => (pitcher.tier === 2));
  t2Players.push(...t2Pitchers)
  shuffle(t2Players)
  const t3Players = players.filter(player => (player.tier === 3 && player.condition === "roll"));
  const t3Pitchers = pitchers.filter(pitcher => (pitcher.tier === 3));
  t3Players.push(...t3Pitchers)
  shuffle(t3Players);
  G.tier2Deck = t2Players;
  G.tier3Deck = t3Players;
  G.league = [...opponents];
  
  const diceRoller = $t('diceRoller');
  const box = new DICE.dice_box(diceRoller);
  box.setDice("4d6");
  const rollButton = $t('roll');
  on(rollButton, 'click', () => { box.start_throw() });
  colorSetup(box);
  
  //Get initial Roster of T1 Players
  G.lineup.order = t1Players.splice(0, 9);
  G.lineup.startPitcher = t1Pitchers.splice(0, 1)[0];
  
  G.lineup.order.forEach((player) => player.team = G.thisTeam.code);
  G.lineup.startPitcher.team = G.thisTeam.code;
  G.fullRoster=[...G.lineup.order, G.lineup.startPitcher,...G.lineup.bench,...G.lineup.bullpen];
  
  
  
  

  //G.fullRoster=[...G.lineup.order, G.lineup.startPitcher,...G.lineup.bench,...G.lineup.bullpen];
  
  setTest();
  
  //Set up nav buttons
  initNav();
  initCalendar();
  initSpringTraining();
  
  if (G.season === "spring") {
    initSpringTraining();
  }
  
  initLineup();
  G.game.order = G.lineup.order;
  G.game.opponent = G.opponents[0];
  renderCover();
  // $t("gameday-cover").classList.add("hidden")
  initGame();
  initModScreen([1,4,6],G.game.order[0]);
  
  //GET REPLACEMENT OPTIONS
  
  /*
  for (const[key,value] of Object.entries(brandColors)){
   
    const testPage=$t("color-logo-test");
    const pSwatch=$n('div','color-logo-swatch',testPage);
    const sSwatch=$n('div','color-logo-swatch',testPage);
    const wSwatch=$n('div','color-logo-swatch',testPage);
    //pSwatch.style.background=value.tp;
   
    
    pSwatch.style.backgroundImage=`url("https://www.mlbstatic.com/team-logos/${value.tid}.svg"), linear-gradient(90deg,${value.tp},${value.tp})`;
   sSwatch.style.backgroundImage=`url("https://www.mlbstatic.com/team-logos/${value.tid}.svg"), linear-gradient(90deg,${value.ts},${value.ts})`;
   wSwatch.style.backgroundImage=`url("https://www.mlbstatic.com/team-logos/${value.tid}.svg"), linear-gradient(90deg,#FFFFFF,#FFFFFF)`;
  }
   */
  
  //cardTest.innerHTML = buildCard(players[0]);
  
  //https://prod-gameday.mlbstatic.com/responsive-gameday-assets/1.3.0/images/stadiums/[stadium_id].jpg
  
  
  //Show roster
  /*const lineupDiv = $t("lineup");
  console.log(lineupDiv)
  
  G.batterRoster.forEach(batter => {
    const batterCard=document.createElement("div");
    batterCard.className="lineup-card";
    const card = document.createElement("img");
    card.src=`../public/assets/players/${batter.id}.png`;
    batterCard.appendChild(card);
    lineupDiv.appendChild(batterCard);
  })
  */
}