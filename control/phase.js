import { G } from '../model/game.js'
//import { renderCalendarEvents } from '../render/renderCalendarEvents.js'
import { $n, $t, $c, $a, on, findKey, loadCard, randInt } from '../util.js'
import { initLineup } from '../render/renderLineup.js'

export function endSpring() {
  //Update Gamestate
  G.phase="season";
  const stEvent = G.schedule.find(ev => ev.id==="springTraining")
  stEvent.status="past";
  const g1 = G.schedule.find(ev => ev.id === "G1");
  g1.status="active";
  $t("event-nav").dataset.section="gameday";
  //renderCalendarEvents();
  
  //Hide spring training content
  $t("spring-training-content").classList.add("hidden");
  $t("gameday").classList.remove("hidden");
  
  //Update nav button
  $t("event-symbol").textContent="stadium";
  $t("event-nav-label").textContent="GAME 1";
  
  //Open gameday content
  $t("gameday").classList.remove("hidden")
  
  //render lineup
  renderLineup()
}