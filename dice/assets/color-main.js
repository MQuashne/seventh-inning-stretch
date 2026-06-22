import { teamColors, teamNames, teamUnis } from './teamColors.js'

const teams = teamColors;
const unis = teamUnis;

const container = document.getElementById("teams");

Object.entries(teams).forEach(([team, data]) => {
    
    const section = document.createElement("div");
    section.className = "team";
    
    const title = document.createElement("div");
    title.className = "team-name";
    title.textContent = teamNames[team];
    
    const tray = document.createElement("div");
    tray.className = "palette";
    
    Object.entries(teamUnis[team]).forEach(([uni, data]) => {
        const die = document.createElement('div');
        die.className = 'die-box';
        const dieShow = document.createElement('div');
        dieShow.className = 'die-show';
        const dieLabel = document.createElement('div');
        dieLabel.className = 'die-label';
        dieLabel.textContent = uni;
        
        
        if (data.stripe) {
            die.style.background = `linear-gradient(90deg,${data.jersey} 0%, ${data.jersey} 5%, ${data.stripe}a0 6%, ${data.jersey} 7%, ${data.jersey} 35%, ${data.stripe}a0 36%, ${data.jersey} 37%, ${data.jersey} 65%, ${data.stripe}a0 66%, ${data.jersey} 67%, ${data.jersey} 95%, ${data.stripe}a0 96%, ${data.jersey} 97%, ${data.jersey} 100%)`;
        } else {
            die.style.background = data.jersey;
        }
        die.style.color = data.text;
        die.style.webkitTextStroke = `2px ${data.outline}`;
        die.style.paintOrder = "stroke fill"
        die.textContent = "2"
        dieShow.appendChild(die);
        dieShow.appendChild(dieLabel);
        tray.appendChild(dieShow);
    });
    section.appendChild(title);
    section.appendChild(tray);
    container.appendChild(section);
    
});