function keyDownEvents() {
  //this is for an editEnable input element
}
function keyDownGameEvents(theKey) {
  //this is for in-game events.
}
function keyUpEvents() {
  //this is for an editEnable input element
  cc_calc();
}
function keyUpGameEvents(theKey) {
  //this is for in-game events.
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
  /*
    letScroll scroll events are handled in globalScripts
    put any other scrolling events here.
  */
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
function sliderEvents(sliderPercent, sve) {

}

