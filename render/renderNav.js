import { G } from '../model/game.js'
import { $n, $t, $c, $a, on, findKey, loadCard, randInt } from '../util.js'
import { store } from '../model/store.js'

function isolate(nodes, targetClass, op, lone) {
  nodes.forEach((node) => {
    op === "add" ? node.classList.add(targetClass) : node.classList.remove(targetClass);
  });
  op === "add" ? $t(lone).classList.remove(targetClass) : $t(lone).classList.add(targetClass)
}

export function initNav() {
  const mainContent = $a("main-content");
  const navItems = $a("nav-item");
  
  navItems.forEach((nav) => {
    on(nav, "click", (e) => {
      isolate(mainContent, "hidden", "add", e.currentTarget.dataset.section);
      isolate(navItems, "active", "remove", e.currentTarget.id);
    })
  });
  store.on("event:complete", () => {
    renderNav();
  })
  renderNav();
}

export function renderNav() {
  switch (G.season) {
    case 'spring':
      $t("event-symbol").textContent = "content_paste";
      $t("event-nav-label").textContent = "SPRING TRAINING";
      $t("event-nav").dataset.section = "spring-training-content";
      break;
    case 'season':
      $t("event-symbol").textContent = "stadium";
      $t("event-nav-label").textContent = `GAME ${G.gameNum}`;
      $t("event-nav").dataset.section = "gameday";
      break;
    case 'break':
      $t("event-symbol").textContent = "hotel_class";
      $t("event-nav-label").textContent = `ALL-STAR BREAK`;
      break;
    case 'playoffs':
      $t("event-symbol").textContent = "flowchart";
      $t("event-nav-label").textContent = `PLAYOFFS`;
      break;
    default:
      // Tab to edit
  }
}