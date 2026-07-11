import { buildPlay } from './rolls/plays.js'

const rootStyles = window.getComputedStyle(document.documentElement);
const tp = rootStyles.getPropertyValue('--tp').trim();
//const tpText= rootStyles.getPropertyValue('--tp-text').trim();

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

const $nr = (hasCount) => {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  $sao(svg, {
    width: "80%",
    height: "100%",
    viewBox: `0 0 ${hasCount ? 285 : 235} 100`
  });
  var g = $ne('g');
  $sa(g, "viewBox", `0 0 ${hasCount ? 150 : 50} 100`);
  svg.append(g);
  return svg
}


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
const tpText = getContrastColor(tp);

function targetText(target, hasCount = false) {
  const text = $ne('text');
  $sao(text, {
    x: hasCount ? 105 : 50,
    y: 55,
    style: {
      fill: "white",
      fontFamily: "Arial",
      textAnchor: "middle",
      alignmentBaseline: "middle",
      fontSize: 60,
      fontWeight: 800
    }
  });
  text.textContent = target;
  return text
}

function countText(count) {
  const text = $ne('text');
  $sao(text, {
    x: 0,
    y: 55,
    style: {
      fill: "white",
      fontFamily: "Arial",
      alignmentBaseline: "middle",
      fontSize: 60,
      fontWeight: 800
    }
  });
  text.textContent = count;
  return text
}

function frame(hasCount = false) {
  const frm = $ne('rect');
  $sao(frm, {
    x: hasCount ? 65 : 10,
    y: 10,
    width: 80,
    height: 80,
    rx: 10,
    ry: 10,
    fill: "transparent",
    stroke: "white",
    "stroke-width": 4
  });
  return frm
}

function sideFrame(hasCount = false) {
  const frm = $ne('path');
  $sao(frm, {
    d: `M ${hasCount ? 145 : 90} 30 v -10 a 10 10 0 0 0 -10 -10 h -60 a 10 10 0 0 0 -10 10 v 60 a 10 10 0 0 0 10 10 h 60 a 10 10 0 0 0 10 -10 v -10`,
    fill: "transparent",
    stroke: "white",
    "stroke-width": 4
  });
  return frm
}


// Example usage

export const renderCondition = {
  unequal: function(count, target, play) { return unequal(count, target, play) },
  odd: function(count, target, play) {
    return odd(count, target, play)
  },
  even: function(count, target, play) { return even(count, target, play) },
  match: function(count, target, play) { return match(count, target, play) },
  value: function(count, target, play) { return value(count, target, play) },
  max: function(count, target, play) {
    return max(count, target, play)
  },
  sum: function(count, target, play) {
    return sum(count, target, play)
  },
  straight: function(count, target, play) { return straight(count, target, play) },
  over: function(count, target, play) { return over(count, target, play) },
  range: function(count, target, play) { return range(count, target, play) },
};


function unequal(count, target, play) {
  const roll = $nr(true);
  roll.append(frame(true));
  roll.append(countText(count));
  roll.append(targetText("≠", true));
  roll.append(buildPlay(play, true));
  return roll
}

function odd(count, target, play) {
  const roll = $nr(true);
  roll.append(frame(true));
  roll.append(countText(count));
  roll.append(targetText("O", true));
  roll.append(buildPlay(play, true));
  return roll
}

function even(count, target, play) {
  const roll = $nr(true);
  roll.append(frame(true));
  roll.append(countText(count));
  roll.append(targetText("E", true));
  roll.append(buildPlay(play, true));
  return roll
}

function match(count, target, play) {
  const roll = $nr(true);
  roll.append(frame(true));
  roll.append(countText(count));
  roll.append(targetText("=", true));
  roll.append(buildPlay(play, true));
  return roll
}

function value(count, target, play) {
  const roll = $nr(true);
  roll.append(frame(true));
  roll.append(countText(count));
  roll.append(targetText(target, true));
  roll.append(buildPlay(play, true));
  return roll
}

function max(count, target, play) {
  const roll = $nr(false);
  roll.append(sideFrame(false));
  
  const sym = $ne('path');
  $sao(sym, {
    d: `M 90 63 v -26 l -7 8 m 7 -8 l 7 8`,
    fill: "transparent",
    stroke: "white",
    "stroke-width": 4,
    "stroke-linejoin": "round"
  });
  roll.append(sym);
  roll.append(targetText(target, false));
  roll.append(buildPlay(play, false));
  
  return roll
}

function sum(count, target, play) {
  const roll = $nr(false);
  roll.append(sideFrame(false));
  
  const sym = $ne('text');
  $sao(sym, {
    x: 90,
    y: 53,
    style: {
      fill: "white",
      fontFamily: "Arial",
      alignmentBaseline: "middle",
      textAnchor: "middle",
      fontSize: 35,
      fontWeight: 800
    }
  });
  sym.textContent = 'Σ'
  
  roll.append(sym);
  roll.append(targetText(target, false));
  roll.append(buildPlay(play, false));
  
  return roll
}


function straight(count, target, play) {
  const roll = $nr(false);
  const frm = $ne('path');
  $sao(frm, {
    d: `M 20 10 A 10 10 0 0 0 10 20 v 60 A 10 10 0 0 0 20 90 h 60 A 10 10 0 0 0 90 80 v -60 A 10 10 0 0 0 80 10`,
    fill: "transparent",
    stroke: "white",
    "stroke-width": 4
  });
  roll.append(frm);
  
  const sym = $ne('path');
  $sao(sym, {
    d: `M 27 10 h 46 l -7 -8 m 7 8 l -7 8 m 7 -8 l -46 0 l 7 8 m -7 -8 l 7 -8`,
    fill: "transparent",
    stroke: "white",
    "stroke-width": 4,
    "stroke-linejoin": "round"
  });
  roll.append(sym);
  roll.append(targetText(target, false));
  roll.append(buildPlay(play, false));
  return roll
}

function over(count, target, play) {
  const roll = $nr(true);
  roll.append(sideFrame(true));
  const sym = $ne('text');
  $sao(sym, {
    x: 145,
    y: 54,
    style: {
      fill: "white",
      fontFamily: "Arial",
      alignmentBaseline: "middle",
      textAnchor: "middle",
      fontSize: 45,
      fontWeight: 800
    }
  });
  sym.textContent = '+'
  roll.append(sym);
  roll.append(targetText(target, true));
  roll.append(countText(count));
  roll.append(buildPlay(play, true));
  return roll
}

function range(count, target, play) {
  const roll = $nr(false);
  roll.append(sideFrame(false));
  const sym = $ne('path');
  $sao(sym, {
    d: `M 90 37 v 26 l -7 -8 m 7 8 l 7 -8 m -7 8 l 0 -26 l -7 8 m 7 -8 l 7 8`,
    fill: "transparent",
    stroke: "white",
    "stroke-width": 4,
    "stroke-linejoin": "round"
  });
  roll.append(sym);
  roll.append(targetText(target, false));
  roll.append(buildPlay(play, false));
  return roll
}

export function box(val) {
  const roll = $nr(false);
 $sa(roll,"viewBox","0 0 100 100");
  roll.append(frame(false));
  roll.append(targetText(val, false));
  return roll
}