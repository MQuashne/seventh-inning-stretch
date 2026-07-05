import {renderCondition} from './rollSymbols.js'

export function buildCard(player) {
  /*---------
  BUILD THE FULL CARD SVG FROM PLAYER DATA
  ----------*/
  const rootStyles = window.getComputedStyle(document.documentElement);
  
  function getContrastColor(hexColor) {
    // Remove the hash if it exists
    const hex = hexColor.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate YIQ (perceived luminance)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return black if bright, white if dark
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  }
  
  
  
  
  
  
  
  let tierColor = "#C4CED4";
  
  switch (player.tier) {
    case 2:
      tierColor = "#0068e6";
      break;
    case 3:
      tierColor = "#FFD100";
      break;
    default:
      tierColor = "#C4CED4";
  }
  
  const tp = rootStyles.getPropertyValue('--tp').trim();
  const ts = rootStyles.getPropertyValue('--ts').trim();
  const tpText = getContrastColor(tp);
  const tierText = getContrastColor(tierColor);
  
  let cardSVG = '';
  //SVG Headers, always used
  const svgHead = `<svg width="100%" height="350" viewBox="0 0 250 350" version="1.1" id="card${player.id}" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">`;
  cardSVG += svgHead;
  
  const styles = `<style>
    .tp{fill:${tp}}.ts{fill:${ts}}.tier{fill:${tierColor}}
  </style>`;
  cardSVG += styles;
  
  const defs = `  <defs id="defs1">
    <linearGradient id="linearGradient14686">
      <stop style="stop-color:#ffc0c0;stop-opacity:.8" offset="0" id="stop14682"/>
      <stop style="stop-color:#ffe0c0;stop-opacity:.6" offset=".13" id="stop14690"/>
      <stop style="stop-color:#ffffc0;stop-opacity:.4" offset=".25" id="stop14692"/>
      <stop style="stop-color:#c0ffc0;stop-opacity:.2" offset=".37" id="stop14694"/>
      <stop style="stop-color:#c0c0ff;stop-opacity:.3" offset=".5" id="stop14684"/>
      <stop style="stop-color:#ffc0ff;stop-opacity:.7" offset=".63" id="stop19042"/>
      <stop style="stop-color:#ffc0c0;stop-opacity:.2" offset=".749" id="stop19044"/>
      <stop style="stop-color:#ffe0c0;stop-opacity:.4" offset=".87" id="stop19046"/>
      <stop style="stop-color:#ffffc0;stop-opacity:.7" offset="1" id="stop19048"/>
    </linearGradient>
    <linearGradient xlink:href="#linearGradient14686" id="linearGradient16274" gradientUnits="userSpaceOnUse" x1="353.142" y1="213.878" x2="413.397" y2="163.044" gradientTransform="translate(-350.36 -124.291)" spreadMethod="pad"/>
    <path id="rect5833" d="M942 164h23v55h-23z"/>
    <path id="rect2178" d="M1065.61 10.607h49.02V41.82h-49.02z"/>
    <clipPath id="bgClip">
      <rect x="19" y="42" width="212" height="250"/>
    </clipPath>
  </defs>`;
  cardSVG += defs;
  
  const bg =`<image href="../public/assets/players/${player.id}.png" y="42" height="250" width="250" clip-path="url(#bgClip)"></image>`
  cardSVG+=bg;
  
  const geom = `  <g id="card">
    <g id="card-art" transform="scale(3.7794)"><path id="left-bar-pri" style="stroke-width:.100889" class="tp" d="M0 0h5.292v92.604H0Z"/>
    <path id="right-bar-pri" class="tp" style="stroke-width:.0946423" d="M60.854 11.112h5.292v81.492h-5.292z"/>
    <path id="top-bar-tier" class="tier" style="display:inline;stroke-width:.0870195;" d="M0 0h66.146v11.113H0Z"/>
    <path id="top-bar-sec" class="ts" style="display:inline;fill-opacity:1;stroke-width:.103559" d="M0 0v12.7h40.763L53.446.018V0H.529Z"/>
    <path id="top-bar-pri" class="tp" style="fill-opacity:1;stroke-width:.115386" d="M0 0v14.552h37.028L51.58 0Z"/>
    <path id="stripes-top-sec" class="ts" style="display:inline;fill-opacity:1;stroke-width:.0950331" d="m.75 12.174-.75.75v2.115l2.866-2.865zm2.703 0-3.29 3.29h2.115l3.29-3.29zm2.703 0-3.29 3.29H4.98l3.29-3.29zm2.703 0-3.29 3.29h2.114l3.29-3.29zm2.702 0-3.29 3.29h2.115l3.29-3.29zm2.703 0-3.29 3.29h2.115l3.29-3.29zm2.703 0-3.29 3.29h2.115l3.29-3.29zm2.702 0-3.29 3.29h2.115l3.29-3.29zm2.703 0-3.29 3.29h2.115l3.29-3.29zm2.703 0-3.29 3.29H23.9l3.29-3.29zm2.702 0-3.29 3.29h2.115l3.29-3.29zm2.703 0-3.29 3.29h2.115l3.29-3.29z"/>
    <path id="stripes-right-sec" class="ts" style="display:inline;fill-opacity:1;stroke-width:.0950331" d="M64.472 35.506v2.115l1.674 1.674v-2.114zm0 2.703v2.115l1.674 1.674v-2.115zm0 2.702v2.115l1.674 1.675v-2.115zm0 2.703v2.116l1.674 1.673v-2.115zm0 2.703v2.115l1.674 1.674v-2.115Zm0 2.702v2.115l1.674 1.675v-2.115zm0 2.703v2.115l1.674 1.674v-2.115zm0 2.703v2.115l1.674 1.674v-2.115zm0 2.702v2.115l1.674 1.675v-2.115Zm0 2.703v2.115l1.674 1.674v-2.115zm0 2.703v2.115l1.674 1.675v-2.116zm0 2.702v2.115l1.674 1.675V66.91z"/>
    <path id="bottom-corner-tier" class="tier" style="fill-opacity:1;stroke-width:.0836697" d="M54.91 77.085v.003l11.234 11.235h.002V77.085Z"/>
    <path id="bottom-bar-pri" class="tp" style="stroke-width:.149881" d="M0 71.438v21.166h66.146v-4.38L49.36 71.438Z"/>
    <path id="stripes-bottom-sec" class="ts" style="display:inline;fill-opacity:1;stroke-width:.0950331" d="m35.604 69.983 3.29 3.29h2.116l-3.29-3.29zm2.703 0 3.29 3.29h2.115l-3.29-3.29zm2.703 0 3.29 3.29h2.115l-3.29-3.29z"/>
    <path id="resoures-tier" class="ts" style="fill-opacity:1;stroke-width:.0647448" d="M0 66.317v7.937h39.688v-.046l-7.891-7.891z"/>
    <path id="accent-tier" class="tier" style="stroke-width:.035477fill:white;" d="M0 9.575v.926h35.381l.926-.926z"/>`;
  cardSVG += geom;
  
  const playerText = `    <text xml:space="preserve" style="font-size:3.95446px;-inkscape-font-specification:&quot;Papyrus, Normal&quot;;text-align:center;text-anchor:middle;fill:#eeff38;stroke:#000;stroke-width:0" x="17.995" y="5.918" id="player-name"><tspan style="font-style:normal;font-variant:normal;font-weight:400;font-stretch:normal;font-size:3.95446px;font-family:Arial;-inkscape-font-specification:Arial;fill:${tpText};fill-opacity:1;stroke:#fff;stroke-width:0;stroke-opacity:1" x="17.995" y="5.918" id="first-name">${player.first} <tspan style="font-style:normal;font-variant:normal;font-weight:700;font-stretch:normal;font-family:Arial;;fill:${tpText};fill-opacity:1;stroke:#fff;stroke-width:0;stroke-opacity:1" id="last-name">${player.last}</tspan></tspan></text>
    <text xml:space="preserve" transform="translate(-254.506 -1.665)scale(.28642)" id="player-num" style="font-style:normal;font-variant:normal;font-weight:700;font-stretch:normal;font-size:26.6667px;font-family:Arial;;text-align:center;white-space:pre;shape-inside:url(#rect2178);display:inline;fill:${tierText};fill-opacity:1;stroke:#000;stroke-width:0"><tspan text-anchor="middle" x="1090.288" y="34.628" id="tspan1372">${player.number}</tspan></text>`;
  cardSVG += playerText;
  
  if (player.dice) {
    const dice = `   <g id="die" transform="matrix(.98897 0 0 .97233 -224.768 2.443)">
      <path id="rect4020" style="fill:#fff;stroke:#000;stroke-width:.5;stroke-dasharray:none;stroke-linejoin:round" d="m236 67.8-1.6-1.6h-5.6l1.6 1.6zm-5.6 0-1.6-1.6v5.6l1.6 1.6zm5.6 0v5.6h-5.6v-5.6z"/>
      <text xml:space="preserve" style="font-style:normal;font-variant:normal;font-weight:700;font-stretch:normal;font-size:6px;font-family:Arial;;text-align:center;text-anchor:middle;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:.0476306;stroke-dasharray:none" x="233.2" y="72.7" id="die-num-1"><tspan id="tspan4214-6" style="font-size:6px;fill:#000;fill-opacity:1;stroke-width:.0476306;stroke-dasharray:none" x="233.2" y="72.7">${player.dice}</tspan></text>
    </g>`;
    cardSVG += dice;
  }
  
  if (player.reRoll > 0) {
    const reroll = `    <g id="reroll" transform="translate(-231.125 -.531)scale(1.01746)">
      <circle style="fill:#009400;fill-opacity:1;stroke:#000;stroke-width:.264583;stroke-dasharray:none" id="reroll-circle" cx="242.623" cy="69.585" r="2.988"/>
      <path id="reroll-arrow" style="fill:none;stroke:#fff;stroke-width:.762;stroke-opacity:1" d="M243.904 70.457a1.626 1.626 0 0 1-1.91.663 1.626 1.626 0 0 1-1.08-1.71 1.626 1.626 0 0 1 1.422-1.439 1.626 1.626 0 0 1 1.723 1.058"/>
      <path id="reroll-arrow-head" style="fill:none;stroke:#fff;stroke-width:.698608;stroke-opacity:1" d="m244.192 69.419-.386-.184.564-.206z"/>
    </g>`;
    cardSVG += reroll;
  }
  
  if (player.modifier > 0) {
    const mod = `    <g id="modifier" style="display:inline" transform="translate(-3.06 -2.133)">
      <rect style="fill:#ffef00;fill-opacity:1;stroke:#000;stroke-width:.224989;stroke-dasharray:none;stroke-opacity:1" id="modifier-square" width="6.125" height="6.125" x="25.302" y="69.339" rx=".579" ry=".579"/>
      <text xml:space="preserve" transform="translate(-180.702 32.99)scale(.22087)" id="modifier-number" style="font-style:normal;font-variant:normal;font-weight:700;font-stretch:normal;font-size:26.6667px;font-family:Arial;;text-align:center;white-space:pre;shape-inside:url(#rect5833);display:inline;fill:#ffef00;fill-opacity:1;stroke:#000;stroke-width:1;stroke-dasharray:none;stroke-opacity:1"><tspan x="946.085" y="188.02" id="tspan1376"><tspan style="fill:#000;stroke:none" id="tspan1374">1</tspan></tspan></text>
      <text xml:space="preserve" style="font-style:normal;font-variant:normal;font-weight:700;font-stretch:normal;font-size:4.65317px;font-family:Arial;text-align:center;text-anchor:middle;fill:#000;fill-opacity:1;stroke:none;stroke-width:.174494;stroke-dasharray:none;stroke-opacity:1" x="27.058" y="73.482" id="modifier-plus"><tspan id="tspan6563" style="stroke-width:.174494" x="27.058" y="73.482">+</tspan></text>
      <text xml:space="preserve" style="font-style:normal;font-variant:normal;font-weight:700;font-stretch:normal;font-size:6.18591px;font-family:Arial;text-align:center;text-anchor:middle;fill:#000;fill-opacity:1;stroke:none;stroke-width:.231972;stroke-dasharray:none;stroke-opacity:1" x="19.221" y="104.721" id="modifier-minus" transform="scale(1.39674 .71595)"><tspan id="tspan6563-1" style="stroke-width:.231972" x="19.221" y="104.721">-</tspan></text>
    </g>`;
    cardSVG += mod;
  }
  
  for (let i=0; i<player.tier;i++){
  const star1 = `<path
       style="fill-opacity:1;fill:#ffd100;stroke:#000000;stroke-width:0"
       id="star-1"
       d="m 274.76844,40.775703 -15.9704,14.014389 2.49087,21.101002 -18.2636,-10.858066 -19.29853,8.889518 4.68287,-20.725042 -14.41801,-15.606978 21.15778,-1.950715 10.38771,-18.535161 8.39335,19.519435 z"
       transform="matrix(0.06799823,-0.00356319,0.00356319,0.06799823,46.74298,${14 + 5.5 * i})" />`;
  cardSVG += star1;
  }
  /*
  if (player.tier > 1) {
    const star2 = `<path
       style="fill-opacity:1;fill:#ffd100;stroke:#000000;stroke-width:0"
       id="star-2"
       d="m 274.76844,40.775703 -15.9704,14.014389 2.49087,21.101002 -18.2636,-10.858066 -19.29853,8.889518 4.68287,-20.725042 -14.41801,-15.606978 21.15778,-1.950715 10.38771,-18.535161 8.39335,19.519435 z"
       transform="matrix(0.06799823,-0.00356319,0.00356319,0.06799823,46.74298,20.228033)" />`;
    cardSVG += star2;
  }
  
  if (player.tier > 2) {
    const star3 = `     <path
       style="fill-opacity:1;fill:#ffd100;stroke:#000000;stroke-width:0"
       id="star-3"
       d="m 274.76844,40.775703 -15.9704,14.014389 2.49087,21.101002 -18.2636,-10.858066 -19.29853,8.889518 4.68287,-20.725042 -14.41801,-15.606978 21.15778,-1.950715 10.38771,-18.535161 8.39335,19.519435 z"
       transform="matrix(0.06799823,-0.00356319,0.00356319,0.06799823,46.742981,25.731555)" />`;
    cardSVG += star3;
  }
  */
  cardSVG += "</g>"
  //OUTCOME BUILDER, currently builds 4 every time
  let outcomes = `<foreignObject x="4" y="285" width="195" height="61">
  <div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; flex-wrap: wrap; justify-content: center; align-items: stretch; gap: 1px; width: 100%; height: 100%;">`
  
  player.outcomes.forEach((outcome) => {
    outcomes+=`<div xmlns="http://www.w3.org/1999/xhtml" style="box-sizing:border-box;flex:1 1 calc(50% - 2px);min-height:calc(50% - 2px);max-width:75%;display:flex;justify-content:center;align-items:center;">${renderCondition[outcome.type](outcome.count ?? 1,outcome.target ?? 1,outcome.play)}</div>`
  });

  
  outcomes+=`</div>
  </foreignObject>`;
  
  
  cardSVG += outcomes;
  const foil = `<g id="foil" transform="scale(3.7794)"><path
       id="foil-cover"
       style="opacity:0.4;mix-blend-mode:colir-dodge;fill:url(#linearGradient16274);fill-opacity:1;stroke:#000000;stroke-width:0"
       d="M 5e-7,5.0000002e-7 V 11.112501 v 1.587501 1.852081 51.764798 7.9375 18.349784 H 66.14583 v -4.38009 -11.138864 -10.17767 -2.1146 -0.58756 -2.115644 -0.58756 -2.11511 -0.58756 -2.11512 -0.58756 -2.11512 -0.58756 -2.11512 -0.58756 -2.11511 -0.58756 -2.11512 -0.58756 -2.11512 -0.58704 -2.11564 -0.58756 -2.11511 V 37.178086 35.06349 11.112501 5e-7 Z M 42.350379,11.112501 h 18.50378 v 65.97271 h -5.84719 l -5.64771,-5.64772 h -4.77956 l -1.45469,-1.45469 h -2.11511 l 1.45469,1.45469 h -0.58756 l -1.4547,-1.45469 h -2.11511 l 1.45469,1.45469 h -0.58756 l -1.45469,-1.45469 h -2.11512 l 1.45469,1.45469 h -0.14211 l -5.12062,-5.12061 H 5.2916605 V 15.153593 l 0.60152,-0.60151 h 0.58756 l -0.91209,0.91209 h 2.11511 l 0.9120898,-0.91209 h 0.587559 l -0.9120788,0.91209 H 10.38644 l 0.91209,-0.91209 h 0.58756 l -0.91209,0.91209 h 2.11512 l 0.91209,-0.91209 h 0.58756 l -0.91209,0.91209 h 2.11512 l 0.91209,-0.91209 h 0.58756 l -0.91209,0.91209 h 2.11511 l 0.91209,-0.91209 h 0.58756 l -0.91209,0.91209 h 2.11512 l 0.91209,-0.91209 h 0.58756 l -0.91209,0.91209 h 2.11512 l 0.91209,-0.91209 h 0.58756 l -0.91209,0.91209 h 2.11512 l 0.91209,-0.91209 h 0.58756 l -0.91209,0.91209 h 2.11511 l 0.91209,-0.91209 h 6.81096 l 1.85208,-1.852081 h 1.88257 z" /></g>`;
  cardSVG += foil;
  
  
  
  
  //SVG CLOSEOUT
  
  const svgFooter = `</g> </svg>`
  cardSVG += svgFooter;
  
  return cardSVG
  
  
  
  
  
  
}