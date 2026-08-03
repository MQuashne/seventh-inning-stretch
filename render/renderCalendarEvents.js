import { $n, $t, $c, on, $cl } from '../util.js'
import { G } from '../model/game.js'
import { renderSpringTraining } from './renderSpringTraining.js'
import { store } from '../model/store.js'

const calendar = document.getElementById("calendar-body");
const eNav = $t("event-nav");

export function initCalendar() {
  
  on(calendar, "click", (e) => {
    if (e.target.closest(".event").classList.contains("active")) {
      eNav.click();
    }
  });
  store.on("schedule:changed", () => {
    renderCalendar();
  })
  
  renderCalendar();
}

export function renderCalendar() {
  calendar.replaceChildren();
  G.schedule.forEach((page) => {
    
    const newEv = $cl('calendar-event-template');
    newEv.root.className="event";
    newEv.root.classList.add(page.status);
    newEv.title.textContent = page.title;
    newEv.body.textContent = page.description;
    calendar.append(newEv.root);
  })
}