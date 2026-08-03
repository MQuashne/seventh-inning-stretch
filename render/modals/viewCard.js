import { $n, $t, $c, $a, on, randInt } from '../../util.js'
import Modal from '../modal.js'
import {buildCard} from '../buildCard.js'
import {buildOpp} from '../buildOpp.js'
  
export function viewCard(card){
  const cardModal=new Modal;
  
  const cDiv=$n('div','lineup-card');
  cDiv.style.display="flex";
  cDiv.style.justifyContent="center";
  cDiv.style.alignItems="center";
  cDiv.style.padding="0.5em";
  cDiv.style.margin="auto";
  const cSvg = buildCard(card);
  cSvg.style.height="90%";
  cDiv.append(cSvg);
  const options = {title:"Player Profile",
    body:cDiv,
    destroyOnClose:true,
    size:"medium"
    
  }
  cardModal.show(options);
}

export function viewOpp(card){
  const cardModal=new Modal;
  
  const cDiv=$n('div','lineup-card');
  cDiv.style.display="flex";
  cDiv.style.justifyContent="center";
  cDiv.style.alignItems="center";
  cDiv.style.padding="0.5em";
  cDiv.style.margin="auto";
  const cSvg = buildOpp(card);
  cSvg.style.height="90%";
  cDiv.append(cSvg);
  const options = {title:"Opponent Profile",
    body:cDiv,
    destroyOnClose:true,
    size:"medium"
    
  }
  cardModal.show(options);
}