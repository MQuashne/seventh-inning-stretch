import { renderCondition, box } from './rollSymbols.js'
import { buildPlay } from './rolls/plays.js'
import { $n, $t, $c, $a, on, randInt } from '../util.js'
import { brandColors } from './brandColors.js'

function $sao(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'style' && typeof value === 'object') {
      // Assign properties directly to the element's style object
      Object.assign(element.style, value);
    } else {
      element.setAttribute(key, value);
    }
  });
}



const $sa = (svg, att, val) => svg.setAttribute(att, val);
const $ne = (el) => {
  const newEl = document.createElementNS('http://www.w3.org/2000/svg', el);
  return newEl
}

function randBt(min, max) {
  return Math.random() * (max - min) + min;
}


export function buildCardProg(player) {
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
  
  let tierColor = "#9D7051";
  
  switch (player.tier) {
    case 2:
      tierColor = "#C3C5C4";
      break;
    case 3:
      tierColor = "#F0D96C";
      break;
    default:
      tierColor = "#9D7051";
  }
  
  // const tp = rootStyles.getPropertyValue('--tp').trim();
  //  const ts = rootStyles.getPropertyValue('--ts').trim();
  
  const pTeam = player.team ?? Object.keys(brandColors)[Math.floor(Math.random() * Object.keys(brandColors).length)];
  const tp = brandColors[pTeam].tp
  const ts = brandColors[pTeam].ts
  
  const tpText = getContrastColor(tp);
  const tierText = getContrastColor(tierColor);
  
  //Create SVG Shell  
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
  svg.id = player.id;
  
  const svgSt = {
    width: "100%",
    height: "100%",
    viewBox: "0 0 250 350"
  }
  $sao(svg, svgSt)
  //CREATE DEFS
  const defs = $ne('defs');
  
  // --------------------------------------------------------------------------
  // CREATE GRADIENT
  // --------------------------------------------------------------------------
  
  //FoilGradient
  const linGrad = $ne('linearGradient');
  linGrad.id = `foil-gradient${player.id}`;
  $sao(linGrad, {
    x1: "100%",
    x2: "0",
    y1: 0,
    y2: "100%"
  });
  
  
  /*$sa(linGrad, 'x2', "100%");
  $sa(linGrad, 'y1', "0");
  $sa(linGrad, 'y2', "100%");
  */
  
  let gradDir = randInt(0, 1);
  
  //GRADIENT STOPS
  const stopData = [
    { p: 0, c: "#ffc0c0", o: randBt(0.2, 0.8) },
    { p: 0.08, c: "#ffe0c0", o: randBt(0.2, 0.8) },
    { p: 0.16, c: "#fff0c0", o: randBt(0.2, 0.8) },
    { p: 0.25, c: "#c0ffc0", o: randBt(0.2, 0.8) },
    { p: 0.33, c: "#c0c0ff", o: randBt(0.2, 0.8) },
    { p: 0.41, c: "#ffc0ff", o: randBt(0.2, 0.8) },
    { p: 0.5, c: "#ffc0c0", o: randBt(0.2, 0.8) },
    { p: 0.58, c: "#ffe0c0", o: randBt(0.2, 0.8) },
    { p: 0.66, c: "#fff0c0", o: randBt(0.2, 0.8) },
    { p: 0.75, c: "#c0ffc0", o: randBt(0.2, 0.8) },
    { p: 0.83, c: "#c0c0ff", o: randBt(0.2, 0.8) },
    { p: 0.91, c: "#ffc0ff", o: randBt(0.2, 0.8) },
    { p: 1, c: "#ffc0c0", o: randBt(0.2, 0.8) }
  ];
  stopData.forEach((stop) => {
    const st = $ne("stop");
    $sao(st, {
      offset: stop.p,
      "stop-color": stop.c,
      "stop-opacity": stop.o
    });
    
    linGrad.append(st);
  });
  defs.append(linGrad);
  
  //Metalic Black Gradient
  const tierGrad = $ne('linearGradient');
  tierGrad.id = `tier-gradient${player.id}`;
  $sa(tierGrad, 'x1', gradDir === 0 ? '0%' : '100%');
  $sa(tierGrad, 'x2', gradDir === 0 ? '100%' : '0%');
  $sa(tierGrad, 'y1', "0");
  $sa(tierGrad, 'y2', "0%");
  
  //GRADIENT STOPS
  const blkStop = [
    { p: 0, c: "#2e2e2e", o: 1 },
    { p: 0.25 + randBt(-.1, .1), c: "#626262", o: 1 },
    { p: 0.5 + randBt(-.1, .1), c: "#8B8B8B", o: 1 },
    { p: 0.75 + randBt(-.1, .1), c: "#414141", o: 1 },
    { p: 1, c: "#000000", o: 1 }
  ];
  
  const bnzStop = [
    { p: 0, c: "#C4a588", o: 1 },
    { p: 0.33 + randBt(-.1, .1), c: "#895b40", o: 1 },
    { p: 0.66 + randBt(-.1, .1), c: "#edcdb4", o: 1 },
    { p: 1, c: "#8b5d3b", o: 1 }
  ];
  
  const slvStop = [
    { p: 0, c: "#b1b2b4", o: 1 },
    { p: 0.25 + randBt(-.1, .1), c: "#7A7B7F", o: 1 },
    { p: 0.5 + randBt(-.1, .1), c: "#F0F0F0", o: 1 },
    { p: 0.75 + randBt(-.1, .1), c: "#A7A8AC", o: 1 },
    { p: 1, c: "#EDEDED", o: 1 }
  ];
  
  const gldStop = [
    { p: 0, c: "#f6e073", o: 1 },
    { p: 0.25 + randBt(-.1, .1), c: "#c28f1a", o: 1 },
    { p: 0.5 + randBt(-.1, .1), c: "#f9e37a", o: 1 },
    { p: 0.75 + randBt(-.1, .1), c: "#b78c1a", o: 1 },
    { p: 1, c: "#f0d96c", o: 1 }
  ];
  
  let tierStop = bnzStop;
  if (player.tier === 2) {
    tierStop = slvStop;
  } else if (player.tier === 3) {
    tierStop = gldStop;
  }
  //PICK IT UP HERE
  tierStop.forEach((stop) => {
    const st = $ne("stop");
    $sao(st, {
      offset: stop.p,
      "stop-color": stop.c,
      "stop-opacity": stop.o
    });
    tierGrad.append(st);
  });
  defs.append(tierGrad);
  
  // --------------------------------------------------------------------------
  // CLIP BACKGROUND
  // --------------------------------------------------------------------------
  const clip = $ne('clipPath');
  clip.id = `bgClip${player.id}`;
  const clRect = $ne('rect');
  $sao(clRect, {
    x: 19,
    y: 42,
    width: 212,
    height: 250
  })
  clip.append(clRect);
  defs.append(clip);
  svg.append(defs);
  
  //Clip whole card
  const clipCard = $ne('clipPath');
  clipCard.id = `cardClip${player.id}`;
  const cdRect = $ne('rect');
  $sao(cdRect, {
    x: 0,
    y: 0,
    width: 250,
    height: 350
  })
  
  clipCard.append(cdRect);
  defs.append(clipCard);
  svg.append(defs);
  
  // --------------------------------------------------------------------------
  // ADD PLAYER IMAGE
  // --------------------------------------------------------------------------
  const bgImage = $ne('image');
  bgImage.id = `bg-image-${player.id}`;
  $sao(bgImage, {
    'href': `../public/assets/players/${player.id}.png`,
    y: 42,
    width: 250,
    height: 250,
    'clip-path': `url(#bgClip${player.id})`
  })
  
  svg.append(bgImage);
  
  // --------------------------------------------------------------------------
  // ADD CARD TEMPLATE ELEMENTS
  // --------------------------------------------------------------------------
  const template = $ne('g');
  template.id = `template${player.id}`
  $sa(template, 'clip-path', `url(#cardClip${player.id})`);
  
  //Left bar primary
  const leftBar = $ne('rect');
  leftBar.id = `left-bar-prim-${player.id}`;
  $sao(leftBar, {
    x: 0,
    y: 0,
    width: 20,
    height: 350,
    fill: tp
  });
  
  template.append(leftBar);
  
  //Right bar primary
  const rightBar = $ne('rect');
  rightBar.id = `right-bar-prim-${player.id}`;
  $sao(rightBar, {
    x: 230,
    y: 0,
    width: 20,
    height: 350,
    fill: tp
  });
  template.append(rightBar);
  
  //Top bar tier
  const topBarT = $ne('rect');
  topBarT.id = `top-bar-tier-${player.id}`;
  $sao(topBarT, {
    x: 150,
    y: 0,
    width: 100,
    height: 42,
    fill: `url(#${`tier-gradient${player.id}`}`
  });
  
  template.append(topBarT);
  
  //Top bar secondary
  const topBarS = $ne('path');
  topBarS.id = `top-bar-secondary-${player.id}`;
  $sao(topBarS, {
    d: 'M 0 0 v 48 h 155 l 48 -48 z',
    fill: ts
  });
  template.append(topBarS);
  
  //Top bar primary
  const topBarP = $ne('path');
  topBarP.id = `top-bar-primary-${player.id}`;
  $sao(topBarP, {
    d: 'M 0 0 v 55 h 140 l 55 -55 z',
    fill: tp
  });
  
  template.append(topBarP);
  
  //Bottom bar tier
  const botBarT = $ne('rect');
  botBarT.id = `bottom-bar-tier-${player.id}`;
  $sao(botBarT, {
    x: 100,
    y: 290,
    width: 150,
    height: 60,
    fill: `url(#${`tier-gradient${player.id}`}`
  });
  
  template.append(botBarT);
  
  //Bottom bar primary
  const botBarP = $ne('path');
  botBarP.id = `bottom-bar-primary-${player.id}`;
  $sao(botBarP, {
    d: 'M 0 270 v 80 h 250 v -17 l -63 -63 z',
    fill: tp
  });
  template.append(botBarP);
  
  //Resource bar secondary
  const resBarS = $ne('path');
  resBarS.id = `resource-bar-secondary-${player.id}`;
  $sa(resBarS, 'd', 'M 0 250 v 30 h 150 l -30 -30 z');
  $sa(resBarS, 'fill', ts);
  template.append(resBarS);
  
  //Top Stripe Set
  
  for (let i = 0; i < 12; i++) {
    const stripe = $ne('rect');
    $sao(stripe, {
      x: 0 + (10 * i),
      y: 46,
      width: 8,
      height: 12,
      fill: ts,
      transform: `translate(${4 + (10 * i)},52) skewX(-45) translate(-${4 + (10 * i)},-52)`
    });
    template.append(stripe);
  }
  
  //Bottom Stripe Set
  for (let i = 0; i < 3; i++) {
    const stripe = $ne('rect');
    $sao(stripe, {
      x: 142 + (10 * i),
      y: 264,
      width: 8,
      height: 12,
      fill: ts,
      transform: `translate(${146 + (10 * i)},270) skewX(45) translate(-${146 + (10 * i)},-270)`
    });
    template.append(stripe);
  }
  
  //Side Stripe Set
  for (let i = 0; i < 12; i++) {
    const stripe = $ne('rect');
    $sao(stripe, {
      y: 150 + (10 * i),
      x: 242,
      height: 8,
      width: 12,
      fill: ts,
      transform: `translate(248,${179 + (10 * i)}) skewY(45) translate(-248,-${179 + (10 * i)})`
    });
    template.append(stripe);
  }
  
  //Accent Bar Tier
  const accBar = $ne('path');
  accBar.id = `accent-bar-${player.id}`;
  $sao(accBar, {
    d: 'M 0 36 v 4 h 134 l 4 -4 z',
    fill: `url(#${`tier-gradient${player.id}`}`
  })
  template.append(accBar);
  
  //STARS
  for (let i = 0; i < player.tier; i++) {
    const star = $ne("polygon");
    let ys = 55
    let xs = 232
    $sao(star, {
      points: '8,0 10,6 16,6 12,10 14,16 8,13 2,16 4,10 0,6 6,6',
      fill: `url(#${`tier-gradient${player.id}`}`,
      transform: `translate(232,${55 + 26*i})`
    })
    template.append(star);
  }
  
  const tLogo = $ne('image');
  tLogo.id = `team-logo-${player.id}`;
  $sao(tLogo, {
    x: 175,
    y: 45,
    width: 50,
    height: 50,
    href: `https://www.mlbstatic.com/team-logos/team-cap-on-dark/${brandColors[pTeam].tid}.svg`,
    onerror: `this.onerror=null; this.setAttribute('href', 'https://www.mlbstatic.com/team-logos/${brandColors[pTeam].tid}.svg')`
  })
  
  template.append(tLogo);
  svg.append(template);
  
  // --------------------------------------------------------------------------
  // ADD CARD TEXT ELEMENTS
  // --------------------------------------------------------------------------
  const playerName = $ne('text');
  playerName.id = `player-name-${player.id}`;
  $sao(playerName, {
    style: {
      fontSize: 16,
      fontFamily: `"Proxima Nova","Arial"`,
      textAlign: "left",
      textAnchor: "left",
      fill: tpText
    },
    x: 10,
    y: 24
  })
  
  const firstName = $ne('tspan');
  firstName.id = `first-name-${player.id}`;
  firstName.textContent = `${player.first} `;
  playerName.append(firstName);
  
  const lastName = $ne('tspan');
  lastName.id = `last-name-${player.id}`;
  lastName.style.fontWeight = "700";
  lastName.textContent = `${player.last}`;
  playerName.append(lastName);
  svg.append(playerName);
  
  const playerNum = $ne('text');
  playerNum.id = `player-num-${player.id}`;
  $sao(playerNum, {
    style: {
      fontSize: 30,
      fontFamily: `"Helvetica Neue","Arial"`,
      fontWeight: 600,
      textAlign: "center",
      textAnchor: "middle",
      fill: "black"
    },
    x: 215,
    y: 32
  })
  
  playerNum.textContent = player.number;
  svg.append(playerNum);
  
  // --------------------------------------------------------------------------
  // ADD RESOURCES
  // --------------------------------------------------------------------------
  
  //Dice
  if (player.dice > 0) {
    const dieGrp = $ne('g');
    dieGrp.id = `dice-${player.id}`
    
    const dice = $ne('path');
    $sao(dice, {
      style: {
        fill: "white",
        stroke: "black",
        strokeWidth: 0.5,
        strokeLinejoin: "round"
      },
      d: "M 42 257.5 l -6 -6 h -21 l 6 6 z m -21 0 l -6 -6 v 21 l 6 6 z m 21 0 v 21 h -21 v -21 z"
    })
    
    dieGrp.append(dice);
    
    const dieText = $ne("text");
    $sao(dieText, {
      style: {
        fontSize: 18,
        fontFamily: `"Proxima Nova","Arial"`,
        fontWeight: 700,
        textAlign: "center",
        textAnchor: "middle",
        fill: "black"
      },
      x: 31,
      y: 273
    })
    dieText.textContent = player.dice;
    dieGrp.append(dieText);
    
    svg.append(dieGrp);
  }
  
  //reRoll
  if (player.reRoll > 0) {
    const reGrp = $ne('g');
    reGrp.id = `reroll-${player.id}`;
    
    const reCircle = $ne('circle');
    $sao(reCircle, {
      style: {
        fill: "#009400",
        stroke: "black",
        strokeWidth: 1
      },
      cx: 69,
      cy: 265,
      r: 11
    })
    
    reGrp.append(reCircle);
    
    const reArrow = $ne('path');
    $sao(reArrow, {
      style: {
        stroke: "#fff",
        strokeWidth: 2.5,
        fill: "transparent"
      },
      d: 'M73 260.5 a 6.25 6.25 0 1 0 0 9'
    })
    
    reGrp.append(reArrow);
    
    const reHead = $ne('path');
    $sao(reHead, {
      style: {
        stroke: "white",
        strokeWidth: 2.5,
        fill: "transparent"
      },
      d: 'M73.5 260.5 l 1 -1 l 0.75 3.25 l -3.5 -0.5 z'
    })
    reGrp.append(reHead);
    
    svg.append(reGrp);
  }
  
  //Modifier
  if (player.modifier > 0) {
    const mod = $ne('g');
    mod.id = `mod-${player.id}`;
    
    const modBox = $ne('rect');
    $sao(modBox, {
      style: {
        stroke: "black",
        strokeWidth: 1,
        fill: "#ffef00"
      },
      x: 84,
      y: 254,
      width: 23,
      height: 23,
      rx: 2,
      ry: 2
    })
    mod.append(modBox);
    
    const modNum = $ne('text');
    $sao(modNum, {
      style: {
        fontSize: '18',
        fontFamily: `"Helvetica Neue", "Arial"`,
        fontWeight: 700,
        textAlign: "center",
        textAnchor: "middle",
        fill: "black"
      },
      x: 96.5,
      y: 272
    })
    modNum.textContent = "±1";
    mod.append(modNum);
    
    svg.append(mod);
  }
  // --------------------------------------------------------------------------
  // ADD CONDITIONS
  // --------------------------------------------------------------------------
  if (player.condition) {
    if (player.condition === "roll") {
      const gap = 4; // px
      const n = player.outcomes.length;
      
      const outcomeObj = $ne('foreignObject');
      $sao(outcomeObj, {
        x: 4,
        y: 285,
        width: 195,
        height: 61
      })
      
      const outFlex = $n('div');
      outFlex.id = `outcomes-${player.id}`;
      outFlex.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(outFlex, {
        style: {
          boxSizing: "border-box",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          gap: `${gap}px`,
          width: "100%",
          height: "100%"
        }
      })
      outcomeObj.append(outFlex);
      
      // Add condition boxes - size based on count 
      const w = n === 1 ? '75%' : `calc(50% - ${gap / 2}px)`;
      const h = n < 3 ? '100%' : `calc(50% - ${gap / 2}px)`
      
      player.outcomes.forEach((outcome) => {
        
        const oBox = $n('div');
        oBox.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
        $sao(oBox, {
          style: {
            boxSizing: "border-box",
            flex: `0 0 ${w}`,
            width: w,
            height: h,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }
        })
        oBox.append(renderCondition[outcome.type](outcome.count ?? 1, outcome.target ?? 1, outcome.play))
        outFlex.append(oBox);
      })
      svg.append(outcomeObj);
      
    } else if (player.condition === "opt" || player.condition === "auto") {
      
      const gap = 4
      const outcomeObj = $ne('foreignObject');
      $sao(outcomeObj, {
        x: 10,
        y: 285,
        width: 210,
        height: 61
      })
      
      const outFlex = $n('div');
      outFlex.id = `outcomes-${player.id}`;
      outFlex.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(outFlex, {
        style: {
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          textAlign: "center",
          gap: `${gap}px`,
          width: "100%",
          height: "100%"
        }
      })
      
      
      const symFlex = $n('div');
      symFlex.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(symFlex, {
        style: {
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          textAlign: "center",
          flex: 0.75,
          width: "8%",
          height: "100%",
          padding: "1%"
        }
      });
      
      var symSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      symSvg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
      $sao(symSvg, {
        width: "95%",
        height: "95%",
        viewBox: "0 0 100 100"
      })
      
      var sCircle = $ne('circle');
      $sao(sCircle, {
        cx: 50,
        cy: 50,
        r: 45,
        stroke: "white",
        fill: "transparent",
        "stroke-width": 4
      });
      symSvg.append(sCircle);
      
      if (player.action.type === "opt") {
        const sText = $ne('text');
        $sao(sText, {
          x: 50,
          y: 92,
          fill: "white",
          "font-family": "Arial",
          "text-anchor": "middle",
          "alignment-baseline": "middle",
          "font-size": "144",
          "font-weight": "800"
        });
        sText.textContent = "*"
        symSvg.append(sText);
        
      } else {
        
        const sPoly = $ne('polygon');
        $sao(sPoly, {
          points: "75,50 35,70 35,30",
          fill: "white"
        });
        symSvg.append(sPoly);
      }
      symFlex.append(symSvg);
      outFlex.append(symFlex);
      
      const conFlex = $n('div');
      conFlex.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(conFlex, {
        style: {
          boxSizing: "border-box",
          flex: 3,
          width: "72%",
          minWidth: 0,
          padding: "1%",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          color: "white",
          fontFamily: "Arial",
          fontSize: "0.8em"
        }
      });
      conFlex.textContent = player.action.desc;
      outFlex.append(conFlex);
      if (player.action.play) {
        const playFlex = $n('div');
        playFlex.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
        $sao(playFlex, {
          style: {
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            flex: 1,
            width: "20%",
            height: "100%",
            padding: "0%"
          }
        })
        
        var playSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        playSvg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        $sao(playSvg, {
          width: "100%",
          viewBox: "0 0 125 100",
          xmlns: "http://www.w3.org/2000/svg"
        });
        playSvg.append(buildPlay(player.action.play, false, false));
        playFlex.append(playSvg);
        outFlex.append(playFlex);
      }
      outcomeObj.append(outFlex);
      svg.append(outcomeObj);
    } else if (player.condition === "sp-ec") {
      //EDDIE CAMPBELL
      
      const ecObj = $ne('foreignObject');
      $sao(ecObj, {
        x: 10,
        y: 285,
        width: 210,
        height: 61
      })
      
      const ecFlex = $n('div');
      ecFlex.id = `outcomes-${player.id}`;
      ecFlex.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(ecFlex, {
        style: {
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          gap: `$1px`,
          width: "100%",
          height: "100%",
          flexDirection: "column"
        }
      })
      ecObj.append(ecFlex);
      
      const ecCon = $n('div');
      ecCon.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(ecCon, {
        style: {
          width: "100%",
          height: "calc(50% - 6px)",
          minHeight: 0,
          display: "flex",
          justifyContent: "center",
          gap: "1px"
        }
      });
      ecFlex.append(ecCon);
      ecCon.append(box("X"));
      ecCon.append(box("X"));
      ecCon.append(box("Y"));
      ecCon.append(box("Y"));
      
      var ecSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      ecSvg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
      $sao(ecSvg, {
        viewBox: "0 0 125 100",
        xmlns: "http://www.w3.org/2000/svg"
      });
      
      ecSvg.append(buildPlay("HR", false, false));
      ecCon.append(ecSvg);
      
      const ecTex = $n('div');
      ecTex.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(ecTex, {
        style: {
          boxSizing: "border-box",
          display: "flex",
          gap: "10px",
          width: "100%",
          height: 'calc(50% + 4px)',
          minHeight: 0,
          justifyContent: "center",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          color: "white",
          fontFamily: "Arial",
          fontSize: "0.8em",
          textAlign: "center"
        }
      });
      ecTex.textContent = "You may not use adjust tokens during this turn";
      ecFlex.append(ecTex);
      svg.append(ecObj);
    } else if (player.condition === "sp-kw") {
      //KENNY WILLIAMS
      
      const kwObj = $ne('foreignObject');
      $sao(kwObj, {
        x: 10,
        y: 285,
        width: 210,
        height: 61
      })
      
      const kwFlex = $n('div');
      kwFlex.id = `outcomes-${player.id}`;
      kwFlex.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(kwFlex, {
        style: {
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          gap: `$1px`,
          width: "100%",
          height: "100%",
          flexDirection: "column"
        }
      })
      kwObj.append(kwFlex);
      
      const kwCon = $n('div');
      kwCon.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(kwCon, {
        style: {
          width: "100%",
          height: "58%",
          minHeight: 0,
          display: "flex",
          justifyContent: "center",
          gap: "1px"
        }
      });
      kwFlex.append(kwCon);
      kwCon.append(renderCondition['max'](0, 4, "2B"));
      
      const kwTex = $n('div');
      kwTex.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(kwTex, {
        style: {
          boxSizing: "border-box",
          display: "flex",
          gap: "10px",
          width: "100%",
          height: '42%',
          minHeight: 0,
          justifyContent: "center",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          color: "white",
          fontFamily: "Arial",
          fontSize: "0.8em",
          textAlign: "center"
        }
      });
      kwTex.textContent = "If max is less than 4, all runners out";
      kwFlex.append(kwTex);
      svg.append(kwObj);
    } else if (player.condition === "sp-tr") {
      //TOMAS RIVERA
      
      const trObj = $ne('foreignObject');
      $sao(trObj, {
        x: 10,
        y: 285,
        width: 210,
        height: 61
      })
      
      const trFlex = $n('div');
      trFlex.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(trFlex, {
        style: {
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          gap: `$1px`,
          width: "100%",
          height: "100%",
          flexDirection: "column"
        }
      })
      trObj.append(trFlex);
      
      const trCon = $n('div');
      trCon.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(trCon, {
        style: {
          width: "100%",
          height: "40%",
          minHeight: 0,
          display: "flex",
          justifyContent: "center",
          gap: "1px"
        }
      });
      trFlex.append(trCon);
      trCon.append(renderCondition["range"](0, 3, "1B"));
      
      const trTex = $n('div');
      trTex.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/1999/xhtml");
      $sao(trTex, {
        style: {
          boxSizing: "border-box",
          display: "flex",
          gap: "10px",
          width: "100%",
          height: 'calc(60% - 2px)',
          minHeight: 0,
          justifyContent: "center",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          color: "white",
          fontFamily: "Arial",
          fontSize: "0.8em",
          textAlign: "center"
        }
      });
      trTex.textContent = "and all runners advance one extra base. +1 d6 for each run scored.";
      trFlex.append(trTex);
      svg.append(trObj);
    }
  }
  
  const foil=$ne('rect');
  $sao(foil,{
    x:0,
    y:0,
    height:350,
    width:250,
    style:{
      opacity:0.20,
      "mix-blend-mode":"color-dodge",
      fill:`url(#foil-gradient${player.id})`
    }
  })
  svg.append(foil);
  
  return svg
}