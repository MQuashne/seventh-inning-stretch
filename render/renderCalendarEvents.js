import {$n, $t, $c, on} from '../util.js'
import { G } from '../model/game.js'

export function renderCalendarEvents() {
  const calendar = document.getElementById("calendar-body");
  console.log(calendar)
  calendar.replaceChildren();
  G.schedule.forEach((page) => {
   
    const event = $n("div",["event",page.status]);
    const eventTop = $n("div","event-top",event);
    const eventTitle = $n("div", "event-title",event);
    eventTitle.textContent=page.title;
    const eventBody = $n("div", "event-body",event);
    eventBody.textContent = page.description;
    calendar.append(event);
  })
}

