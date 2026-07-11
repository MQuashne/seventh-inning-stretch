//Build the play outcome as an svg to export as a constant.
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

export function buildPlay(play, hasCount, isRoll=true) {
  const playG = $ne('g');
  $sao(playG, {
    viewBox: '0 0 125 100'
  });
  if (isRoll){
    $sa(playG,'transform',`translate(${hasCount ? 160 : 110}) scale(0.98 0.98)`)
  }
  
  const baseP = $ne('path')
  $sao(baseP, {
    stroke: "white",
    "stroke-width": 1,
    fill: "transparent",
    "stroke-linejoin": "round",
    d: 'M 70 98 l 48 -48 l -48 -48 l -48 48 l 48 48 l 48 -48'
  })
  playG.append(baseP);
  
  const runP = $ne("path");
  $sao(runP, {
    stroke: "white",
    "stroke-width": 6,
    fill: play === 'HR' ? "white" : "transparent",
    "stroke-linejoin": "round",
  });
  
  let runPath;
  
  if (play === "1B" || play === "BB") {
    runPath = `M 70 98 l 48 -48`
  } else if (play === "2B") {
    runPath = `M 70 98 l 48 -48 l -48 -48`
  } else if (play === "3B") {
    runPath = `M 70 98 l 48 -48 l -48 -48 l -48 48`
  } else if (play === "HR") {
    runPath = `M 70 98 l 48 -48 l -48 -48 l -48 48 l 48 48 l 48 -48`
  }
  
  $sa(runP, 'd', runPath);
  playG.append(runP);
  
  const svgText = `<text x="70" y="53" fill="${play==="HR" ? "black" : "white"}"" font-family="Arial" text-anchor="middle" alignment-baseline="middle" font-size="36px" font-weight="800">${play}</text>`;
  
  const text = $ne('text');
  $sao(text, {
    x: 70,
    y: 53,
    style: {
      fill: play==="HR" ? "black" : "white",
      fontFamily: "Arial",
      textAnchor: "middle",
      alignmentBaseline: "middle",
      fontSize: 36,
      fontWeight: 800
    }
  });
  text.textContent=play;
  playG.append(text);
  
  return playG
}