//Build the play outcome as an svg to export as a constant.
export function buildPlay(play,w) {
  const baseSvg = `<g viewBox = "0 0 125 100" transform="translate(${w+10}) scale(0.98 0.98)">

  <path d="
  M 70 98
  l 48 -48
  l -48 -48
  l -48 48
  l 48 48
  l 48 -48
  " stroke="white" stroke-width="1" fill="transparent" stroke-linejoin="round"/>`;
  
  let runPath = ``;
  
  if (play === "1B" || play === "BB") {
    runPath = `    <path d="
  M 70 98
  l 48 -48
  " stroke="white" stroke-width="6" fill="transparent" stroke-linejoin="round"/>`
  } else if (play === "2B") {
    runPath = `    <path d="
  M 70 98
  l 48 -48
  l -48 -48
  " stroke="white" stroke-width="6" fill="transparent" stroke-linejoin="round"/>`
  } else if (play === "3B") {
    runPath = `    <path d="
  M 70 98
  l 48 -48
  l -48 -48
  l -48 48
  " stroke="white" stroke-width="6" fill="transparent" stroke-linejoin="round"/>`
  } else if (play === "HR") {
    runPath = `    <path d="
  M 70 98
  l 48 -48
  l -48 -48
  l -48 48
  l 48 48
  l 48 -48
  " stroke="white" fill="white" stroke-width="6" stroke-linejoin="round"/>`
  }
  
  const svgText = `<text x="70" y="53" fill="${play==="HR" ? "black" : "white"}"" font-family="Arial" text-anchor="middle" alignment-baseline="middle" font-size="36px" font-weight="800">${play}</text>`;
  
  const closeSvg = `</g>`
  
  const playSvg = baseSvg + runPath + svgText + closeSvg;
  
  return playSvg
}