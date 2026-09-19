import { $n, $t, $c, $a, on, randInt } from '../../util.js'
import { G } from '../model/game.js'
import Modal from './modal.js'
import { buildCard } from './buildCard.js'
import { renderGame } from './renderGame.js'
import { store } from '../model/store.js'
import { viewCard } from './modals/viewCard.js'
import {subBatter} from '../actions/game.js'

export function subCard(card) {
  const cardModal = new Modal;
  const subCon = $n("div", "sub-modal-container")
  const subDiv = $n("div", "sub-modal-body", subCon);
  const subAct = $n("div", "sub-modal-action", subCon);
  const cDiv = $n('div', ['lineup-card', 'modal-card', 'sub-card']);
  const subButton = $n("button", "btn-team", subAct);
  const poolKey = card.fatigue ? "bullpen" : "bench";
  const activeKey = card.fatigue ? "pitcher" : "order";
  const subPool = G.lineup[poolKey].filter(p => p.available);
  let subPlayer;
  
  const cSvg = buildCard(card);
  cDiv.append(cSvg);
  on(cDiv,"click",() => {viewCard(card)});
  subDiv.append(cDiv);
  
  const subGallery = $n("div", "sub-gallery");
  subDiv.append(subGallery);
  subGallery.append($n('div', ['lineup-card', 'modal-card', 'sub-card']));
  if ( /*G.lineup.bench.filter(s => s.available)*/ subPool.length === 0) {
    const emptyMsg = $n('div', ['lineup-card', 'modal-card', 'sub-card']);
    emptyMsg.textContent = "None Available";
    emptyMsg.style.color = "white";
    subGallery.append(emptyMsg);
  }
  /*G.lineup.bench*/
  subPool.forEach(s => {
    if (s.available) {
      const sDiv = $n('div', ['lineup-card', 'modal-card', 'sub-card']);
      sDiv.dataset.id = s.id;
      const sSvg = buildCard(s);
      sDiv.append(sSvg);
      on(sDiv,"click",() => {viewCard(s)})
      subGallery.append(sDiv);
    }
  })
  subGallery.append($n('div', ['lineup-card', 'modal-card', 'sub-card']));
  const items = subGallery.querySelectorAll('.lineup-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Find the index of the visible item
        const currentIndex = Array.from(items).indexOf(entry.target);
        if (currentIndex === 0) {
          subGallery.children[1].scrollIntoView();
        } else if (currentIndex === subGallery.children.length - 1) {
          subGallery.children[subGallery.children.length - 2].scrollIntoView();
        }
        subPlayer = /*G.lineup.bench*/ subPool.find(p => p.id === entry.target.dataset.id);
        if (subPlayer) {
          subButton.textContent = `Substitute ${subPlayer.name}`;
        }
      }
    });
  }, {
    root: subGallery,
    threshold: 1
  });
  
  // Attach observer to each item
  items.forEach(item => observer.observe(item));
  
  const topBar = $n('div');
  Object.assign(topBar.style, {
    width: "100%",
    height: "20%",
    position: "absolute",
    top: "0",
    left: "0",
    background: `linear-gradient(180deg,${G.thisTeam.td} 10%,transparent 100%)`,
    pointerEvents: "none"
  })
  subDiv.append(topBar);
  
  const bottomBar = $n('div');
  Object.assign(bottomBar.style, {
    width: "100%",
    height: "20%",
    position: "absolute",
    bottom: "0",
    left: "0",
    background: `linear-gradient(0deg,${G.thisTeam.td} 10%,transparent 100%)`,
    pointerEvents: "none"
  })
  subDiv.append(bottomBar);
  
  on(subButton, "click", () => {
    
    if (card.fatigue) {
      const bullpenIdx = G.lineup.bullpen.indexOf(subPlayer);
      G.lineup.pitcher = G.lineup.bullpen.splice(bullpenIdx, 1, G.lineup.pitcher)[0];
      store.emit("pitcher:sub");
    } else {
      subBatter(card,subPlayer)
      
    }
    cardModal.close();
  })
  
  const options = {
    title: "Substitute",
    body: subCon,
    destroyOnClose: true,
    size: "medium",
    onClose: () => {
      G.game.mode="roll";
      renderGame();
    }
    
  }
  cardModal.show(options);
  subGallery.children[1].scrollIntoView();
}
