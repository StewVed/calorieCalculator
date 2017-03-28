function keyDownEvents() {
  //this is for an editEnable input element
  //for game events, use anEvent()
}
function keyUpEvents() {
  //this is for an editEnable input element
  //for game events, use anEvent()
  cc_calc();
}
function mouseClickEvents() {
  cc_mClick(mouseVars.current.target);
}

function mouseDownEvents() {
  //custom mouse/touch down events for your app go here
}
function mouseMoveEvents() {
  //custom mouse/touch move events for your app go here
}
function mouseMoveEnter(targ) {
  /*
   * use this for hovering over things.
   * eg. when you enter a new thing, highlight it.
  */
}
function mouseMoveOut(targ) {
  /*
   * opposite of enter...
   * eg. unhighlight something as the mouse moves off of it.
   *
  */
}
function mouseMoveOver(targ) {
  /*
   * for actively tracking while on an object.
   * eg. moving, dynamic tooltip.
  */
}
function mouseUpEvents() {
  //custom mouse/touch up events for your app go here
}

function mouseWheelEvents(targ, d) {
  if (targ.classList.contains('letScroll')) {
    //very dodgy hard-code - only one thing can be scrolled.
    targ = document.getElementById('toastPopup');
    var zSpeed;
    if (d < 0) {
      zSpeed = -1000;
    } else {
      zSpeed = 1000;
    }
    divScroller(targ, zSpeed, new Date().getTime());
  }
}

function gamePadsButtonDown(zButton) {
  //custom gamepad button down events for your app go here
}
function gamePadsButtonUp(zButton) {
  //custom gamepad button down events for your app go here
}

function anEvent() {
  /*
    this one is for evergy-saving with static games.
    If your game waits for an input and then does something,
    then put something here to set it going.
  */

  /*
    If your game has a running animation loop, you can use this var
    in your main loop to trigger stuff happening!
  */
  //gameVars.go = 1; //obviously, you can call it whatever you want...lol
}


function resizeEvents() {
  //resizeRatio(16, 9); //for making it a specific aspect ratio...
}
//This should be the only function that has to be edited for sliders :)
function sliderEvents(sliderPercent) {
  var sliderType = mouseVars.start.target.id.split('-')[1];

  if (sliderType === 'vol') {
    //update the app's volume
    globVol = sliderPercent[0];
    gameVars.vol.gain.value = (globVol / 100);
    if (mouseVars.start.target.style.background.length) {
      storageSave('volume', globVol.toFixed(2));
    }
    sliderColors(sliderPercent);
  } else if (sliderType === 'freq') {
    //update the app's frequency
    tg_changeFreq(sliderPercent);
    if (mouseVars.start.target.style.background.length) {
      storageSave('frequency', sliderPercent[0].toFixed(2));
    }
    sliderColors(sliderPercent);
  }
}

