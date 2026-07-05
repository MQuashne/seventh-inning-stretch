import { buildPlay } from './rolls/plays.js'

const rootStyles = window.getComputedStyle(document.documentElement);
const tp = rootStyles.getPropertyValue('--tp').trim();
//const tpText= rootStyles.getPropertyValue('--tp-text').trim();

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

// Example usage

export const renderCondition = {
  unequal: function(count,target,play) {return unequal(count, target, play)},
  max: function(count, target, play)
  {return max(count,target,play)},
  sum: function(count, target, play) { return sum(count, target, play) },
  odd: function(count, target, play) { return odd(count, target, play) },
  even: function(count, target, play) { return even(count, target, play) },
  //odd: odd(count, target, play),
  //even: even(count, target, play),
  //match: match(count, target, play),
  //straight: straight(count, target, play),
  //value: value(count, target, play),
  //over: over(count, target, play),
  //range: range(count, target, play),
};


function value(target, count) {
  return `<svg width="175" height="100" viewBox = "0 0 175 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 165,30
    v -10
    a 10 10 0 0 0 -10 -10
    h -60
    a 10 10 0 0 0 -10 10
    v 60
    a 10 10 0 0 0 10 10
    h 60
    a 10 10 0 0 0 10 -10
    v -50
    " stroke-width="4" fill="transparent" stroke=${tpText} />
    <text x="125" y="55" font-family="Arial" text-anchor="middle" alignment-baseline="middle" font-size="60px" font-weight="800" fill="${tpText}">${target}</text>
      <text x="50" y="55" fill=${tpText} font-family="Arial" text-anchor="middle" alignment-baseline="middle" font-size="60px" font-weight="800">${count}</text>
    </svg>`
}

function unequal(count, target, play) {
  return `<svg width="80%" viewBox="0 0 285 100" xmlns="http://www.w3.org/2000/svg">
  <g viewBox="0 0 150 100">
  <path d="M 145,30
v -10
a 10 10 0 0 0 -10 -10
h -60
a 10 10 0 0 0 -10 10
v 60
a 10 10 0 0 0 10 10
h 60
a 10 10 0 0 0 10 -10
v -50
" stroke="white" stroke-width="2" fill="transparent"/>
  <text x="105" y="55" fill="white" font-family="Arial" text-anchor="middle" alignment-baseline="middle" font-size="60px" font-weight="800">≠</text>
  <text x="0" y="55" fill="white" font-family="Arial" alignment-baseline="middle" font-size="60px" font-weight="800">${count}</text>
  </g>
  ${buildPlay(play,150)}
</svg>`
}

function max(count,target,play){
  return `<svg width="80%" viewBox="0 0 235 100" xmlns="http://www.w3.org/2000/svg">
  <g viewbox="0 0 100 100">
  <path d="M 90,30
v -10
A 10 10 0 0 0 80 10
h -60
A 10 10 0 0 0 10 20
v 60
A 10 10 0 0 0 20 90
h 60
A 10 10 0 0 0 90 80
v -10
" stroke="white" stroke-width="2" fill="transparent" />
  <path d="
M 90 63
v -26
l -7 8
m 7 -8
l 7 8
" stroke="white" stroke-linejoin="round" stroke-width="3" fill="transparent" />
<text x="50" y="55" fill="white" font-family="Arial" text-anchor="middle" alignment-baseline="middle" font-size="60px" font-weight="800">${target}</text>
</g>
  ${buildPlay(play,100)}
</svg>`
}

function sum(count, target, play) {
  return `<svg width="80%" viewBox="0 0 235 100" xmlns="http://www.w3.org/2000/svg">
  <g viewbox="0 0 100 100">
  <path d="M 90,30
v -10
A 10 10 0 0 0 80 10
h -60
A 10 10 0 0 0 10 20
v 60
A 10 10 0 0 0 20 90
h 60
A 10 10 0 0 0 90 80
v -10
" stroke="white" stroke-width="2" fill="transparent" />
<text x="90" y="52" fill="white" font-family="Arial" text-anchor="middle" alignment-baseline="middle" font-size="30px" font-weight="800">Σ</text>
<text x="50" y="55" fill="white" font-family="Arial" text-anchor="middle" alignment-baseline="middle" font-size="60px" font-weight="800">${target}</text>
</g>
  ${buildPlay(play,100)}
</svg>`
}

function odd(count, target, play) {
  return `<svg width="80%" viewBox="0 0 285 100" xmlns="http://www.w3.org/2000/svg">
  <g viewBox="0 0 150 100">
  <path d="M 145,30
v -10
a 10 10 0 0 0 -10 -10
h -60
a 10 10 0 0 0 -10 10
v 60
a 10 10 0 0 0 10 10
h 60
a 10 10 0 0 0 10 -10
v -50
" stroke="white" stroke-width="4" fill="transparent"/>
  <text x="105" y="55" fill="white" font-family="Arial" text-anchor="middle" alignment-baseline="middle" font-size="60px" font-weight="800">O</text>
  <text x="0" y="55" fill="white" font-family="Arial" alignment-baseline="middle" font-size="60px" font-weight="800">${count}</text>
  </g>
  ${buildPlay(play,150)}
</svg>`
}

function even(count, target, play) {
  return `<svg width="80%" viewBox="0 0 285 100" xmlns="http://www.w3.org/2000/svg">
  <g viewBox="0 0 150 100">
    <path d="M 145,30
v -10
a 10 10 0 0 0 -10 -10
h -60
a 10 10 0 0 0 -10 10
v 60
a 10 10 0 0 0 10 10
h 60
a 10 10 0 0 0 10 -10
v -50
" stroke="white" stroke-width="4" fill="transparent"/>
  <text x="105" y="55" fill="white" font-family="Arial" text-anchor="middle" alignment-baseline="middle" font-size="60px" font-weight="800">E</text>
  <text x="0" y="55" fill="white" font-family="Arial" alignment-baseline="middle" font-size="60px" font-weight="800">${count}</text>
  </g>
  ${buildPlay(play,150)}
</svg>`
}