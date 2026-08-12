import { modal } from '../main.js'
import { G } from '../model/game.js'
import { buildCard } from './buildCard.js'
import { buildOpp } from './buildOpp.js'
import { viewCard, viewOpp } from './modals/viewCard.js'
import { brandColors } from './brandColors.js'
import { teams } from '../model/teams.js'
import { $n, $t, $c, $a, on, findKey, loadCard, randInt } from '../util.js'
import { renderGame, initGame } from './renderGame.js'

export function renderCover() {
  const awayLogo = $t("logo-away");
  const homeLogo = $t("logo-home");
  
 const homeTeam = G.game.home===true ? G.thisTeam : teams.find(t => t.code === G.game.opponent.code);
 const awayTeam = G.game.home===false ? G.thisTeam : teams.find(t => t.code === G.game.opponent.code);
 
  awayLogo.src = `https://www.mlbstatic.com/team-logos/team-cap-on-dark/${awayTeam.tid}.svg`;
  awayLogo.onerror = function() {
    this.onerror = null; 
    this.src=`https://www.mlbstatic.com/team-logos/${awayTeam.tid}.svg`;
  }
  homeLogo.src = `https://www.mlbstatic.com/team-logos/team-cap-on-dark/${homeTeam.tid}.svg`
 homeLogo.onerror = function() {
    this.onerror = null;
    this.src = `https://www.mlbstatic.com/team-logos/${homeTeam.tid}.svg`;
 }
 $t('game-span').textContent=`GAME ${G.gameNum}`

const playBall=$t("btn-play-ball");
on(playBall,"click",() => {
  console.log(G.lineup.order);
  console.log(G.game.order)
  G.game.order = [...G.lineup.order]
  //console.log(G.game.order)
  
  initGame();
  $t("gameday-cover").classList.add("hidden");
  $t("gameplay-content").classList.remove("hidden")
})
  
}