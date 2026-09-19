import { $n, $t, $c, $a, $cl, on, randInt, hide, show } from '../../util.js'
import { G } from '../../model/game.js'
import { store } from '../../model/store.js'
import { testOpp, endDefHalf } from '../../actions/game.js'
import { gamebox, renderGame, oppTeam } from './renderGame.js'
import { rerollScreen } from './renderGameReroll.js'
import { buildOpp } from './buildOpp.js'
import { viewCard, viewOpp } from './modals/viewCard.js'
import { DICE } from '../dice/dice.js'
import { teams } from '../model/teams.js'
import { teamUnis, teamNames, leagueNames, evergreenJerseys } from '../dice/assets/teamColors.js'

const diceInput = $t("dice-input-border");
const pitcherCard = $t("pitcher-card");
const oppCard = $t("opp-card");
const leagueSelect = $t("league-select")
const teamSelect = $t("team-select");
const uniSelect = $t("uni-select");
const offerPitcher = $t("offer-pitcher");
const defenseDisplay = $t("defense-display");
const defenseOutcome = $t("defense-outcome");
const diceCount = $t("dice-input-count");
const oppRoll = $t("opp-roll");
const oppRollBtn = $t("opp-roll-btn");
let defThrow;


export function initPitcher() {
  //subtract, reroll, mod, set, temp
  on(offerPitcher,"click",() => {
    console.log("here")
    pitchReroll();
  });
}

export function playPitcher() {
  const ability = G.lineup.pitcher.ability
}

function pitchSubtract() {
  defenseOutcome[0] = G.lineup.pitcher.ability === "cancelAll" ? 0 : Number(defenseOutcome[0])-1;
}

function pitchReroll() {
  G.game.mode = "reroll";
  G.game.rerollAllowed = G.lineup.pitcher.ability === "rerollOne" ? 1 : 99;
  rerollScreen();
}