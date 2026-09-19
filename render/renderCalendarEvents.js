import { $n, $t, $c, on, $cl } from '../util.js'
import { G } from '../model/game.js'
import { renderSpringTraining } from './renderSpringTraining.js'
import { store } from '../model/store.js'

const calendar = document.getElementById("calendar-body");
const eNav = $t("event-nav");
const pastEvents = $t("past-events");
const nextEvent = $t("next-event");
const upcomingEvents = $t("upcoming-events");

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
  pastEvents.replaceChildren();
  nextEvent.replaceChildren();
  upcomingEvents.replaceChildren();
  G.schedule.forEach((page) => {
    
    /*  const newEv = $cl('calendar-event-template');
      newEv.root.className="event2";*/
    const newEv = $cl('calendar-ev-template');
    newEv.root.className = "event";
    newEv.root.classList.add(page.status);
    page.home === false ? newEv.root.classList.add("away") : newEv.root.classList.add("home");
    if (page.type === "game") {
      newEv.title.textContent = `${page.home===false ? "at" : "vs"} ${page.title}`;
      G.opponents[page.num] ? newEv.spot.src=`public/assets/spot/${G.opponents[page.num].code}.svg` : "";
    } else {
      newEv.title.textContent = page.title
    }
    newEv.date.textContent=page.description;
    switch (page.status) {
      case "past":
        pastEvents.append(newEv.root);
        break;
      case "active":
        nextEvent.append(newEv.root);
        break;
      case "future":
        upcomingEvents.append(newEv.root);
        break;
    }
    //calendar.append(newEv.root);
  })
}