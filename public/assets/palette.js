import { teams } from '../../model/teams.js'
import { $n, $t, $c, $a, on, findKey, loadCard, randInt } from '../../util.js'

const tdl = [
  "ARI", "LAA", "BOS", "BAL", "CIN", "CHC", "COL", "CWS", "ATH", "ATL", "CLE", "DET", "DTN", "HOU", "KC", "LAD", "MIA", "MIL", "MIN", "MRB", "NYM", "NYY", "PHI", "PIT", "SD", "SEA", "SF", "SOM", "SPR", "STL", "TB", "TEX", "TOR", "WSH"
]

const slate = $t("slate");

teams.forEach(tm => {
  const title = $n("div", "tray-title", slate);
  title.textContent = `${tm.league} - ${tm.city} ${tm.name} (${tm.code})`;
  const tray = $n("div", "tray", slate);
  tray.id = tm.code;
  const tp = $n("div", "swatch", tray);
  tp.style.background = tm.tp;
  tp.style.color = tm.tpText;
  tp.textContent = `TP ${tm.tp}`
  const ts = $n("div", "swatch", tray);
  ts.style.background = tm.ts;
  ts.style.color = tm.tsText;
  ts.textContent = `TS ${tm.ts}`
  
  const tsplit = $n("div", "swatch", tray)
  tsplit.style.color = "white";
  tsplit.id = `${tm.code}-sp`
  
  const logo = $n("img", "swatch", tray);
  logo.src = `logos/${tm.code}.svg`
  const spot = $n("img", "swatch", tray);
  spot.src = `spot/${tm.code}.svg`;
  
  tm.tpLogo = tdl.find(dl => tm.code === dl) ? `${tm.code}-D` : tm.code;
});

console.log(JSON.stringify(teams,null,2))