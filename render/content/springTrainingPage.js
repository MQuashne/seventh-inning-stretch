export function stFragment() {
const stCont = document.createRange().createContextualFragment(`<div class="accordion-sec" id="st-title-sec">
        <div class="accordion-content">
          <h3 class="text-white">Spring Training</h3>
          <div id="roster-instructions">
            <div class="instructions">
              Welcome to camp, coach. We have some guys returning and some new callups. Let's see what we're working with.
            </div>
            <button class="btn btn-team" id="meet-team" style="margin:5%;">Meet the Team</button>
          </div>
        </div>
      </div>
      <div class="accordion-sec" id="st-ros-title">
        <div class="accordion-content" data-part="content" style="max-height: 2rem;">
          <h3 style="color: white;">Roster</h3>
        </div>
      </div>
      <div class="trough-outer hidden" style="align-self: start; width: 100%;" id="st-tr-out">
        <div class="trough-felt" id="st-tr-out">
          <div class="lineup-scroll" id="st-lineup-scroll"></div>
        </div>
      </div>
      <div class="accordion-sec" id="st-sign-inst">
        <div class="accordion-content" data-part="content" style="display: flex; flex-direction: column; align-items: center; gap: 10%;">
          <div class="instructions">There's more. The GM wants your input on which of these free agents to sign. Pick one, we'll see the other as an opponent.</div>
          <button class="btn btn-team" id="st-choose-btn" style="margin: 5%;">What are my options?</button>
        </div>
      </div>
      <div class="accordion-sec" id="st-sign-sec">
        <div class="accordion-content" data-part="content" style="text-align: center;">
          <h3 style="color: white;">Sign one, face the other. (1 of 3)</h3>
          <div class="instructions" style="font-size: 0.8em;">Choose one player to sign to your team. The opponent on the back of the other player goes onto your schedule.</div>
          <div class="card-stage" id="st-card-stage">
            <div class="card-scene" style="order: 1;">
              <div class="flip-card" data-part="card">
                <div class="card-face front card" data-part="front">
                </div>
                <div class="card-face back card" data-part="back">
                </div>
              </div>
            </div>
            <div class="card-scene" style="order: 3;">
              <div class="flip-card flipped" data-part="card">
                <div class="card-face front card" data-part="front">
                </div>
                <div class="card-face back card" data-part="back">
                </div>
              </div>
            </div><button class="btn btn-team" style="order: 2;" id="st-flip-btn">Flip</button>
          </div><button class="btn btn-team" style="margin: 0.5em auto;" id="st-sign-btn">Sign Scooter McKnight</button>
        </div>
      </div>
      <div class="accordion-sec" id="st-close-sec">
        <div class="accordion-content" data-part="content">
          <h3 style="color: white;">Good camp, coach.</h3>
          <div class="instructions">Close down camp when you're ready and we'll get to the season.</div><button class="btn btn-team" id="st-close-btn" style="margin-top: 1em;">Finish Camp</button>
        </div>
      </div>`);
return stCont
}