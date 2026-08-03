import { teamColors, teamNames, teamUnis, evergreenJerseys, leagueNames } from './teamColors.js'

const leagues = leagueNames;
const teams = teamNames;
const unis = evergreenJerseys;

const container = document.getElementById("teams");

Object.entries(leagues).forEach(([league, data]) => {
    
    const leaSection = document.createElement("div");
    leaSection.className = "team";
    const leaTitle = document.createElement('div');
    leaTitle.className = "team-name";
    leaTitle.textContent = leagueNames[league] + " (" + league + ")";
    leaSection.appendChild(leaTitle);
    console.log(league)
    console.log(teams[league])
    Object.entries(teams[league]).forEach(([team, data]) => {
        const section = document.createElement("div");
        section.className = "team";
        
        const title = document.createElement("div");
        title.className = "team-name";
        title.textContent = teamNames[league][team] + " (" + team + ")";
        
        const tray = document.createElement("div");
        tray.className = "palette";
        console.log(league + " " + team)
        console.log(evergreenJerseys[league][team])
        Object.entries(evergreenJerseys[league][team]).forEach(([uni, data]) => {
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
        leaSection.appendChild(section);
    });
    
    
    container.appendChild(leaSection);
});