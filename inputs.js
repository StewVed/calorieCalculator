/*
 * Ideally, I would have only two different tpes of input;
 * pointer (for touch and mouse)
 * gamepad for gamepads, and keybnoards
 *
 * having said that, I could make the mouse into a 3-button, 1 axis gamepad, and touches similar, but more axis and buttons.
 * and gamepads and keyboards could be used to move a pointer around too.
 *
 * Sensetivity should be adjustable, and axes and buttons would be configurable
*/
function anEvent() {
  //An event has fired, so let the gameLoop run through.
  gameVars.go = 1;
}
function bubbleStop(e) {
  if (e.cancelable) {
    e.preventDefault();//stop browser doing it's default action.
    e.stopPropagation(); //stop the event bubbling
  }
}
function findTarget(e) {
  if (!e) {
    var e = window.event;
  }
  targ = e.target || e.srcElement;
  if (targ.nodeType != 1) {
    //element nodes are 1, attribute, text, comment, etc. nodes are other numbers... I want the element.
    targ = targ.parentNode;
  }
  return targ;
}
function gamePadUpdate() {
  var gamePads = navigator.getGamepads();
  for (var x = 0; x < gamePads.length; x++) {
    if (gamePads[x]) {
      //only add if the gamepad exists - NOT FOOLPROOF!
      //initialize/clear the gamePadVar
      gamePadVars[x] = [];
      //only shallow-copy the buttons and axes - don't need the rest (yet!)
      gamePadVars[x].buttons = gamePads[x].buttons.slice(0);
      gamePadVars[x].axes = gamePads[x].axes.slice(0);
    }
  }
}
function gamePadsButtonEventCheck() {
  //only worry about gamePadVar[0] for this version
  var oldButtons = []
  if (gamePadVars[0]) {
    //shallow-copy cos it is an (object) array:
    for (var x = 0; x < gamePadVars[0].buttons.length; x++) {
      oldButtons[x] = gamePadVars[0].buttons[x].pressed;
    }
  }
  gamePadUpdate();
  //if there is at least 1 gamepad being used:
  if (gamePadVars[0]) {
    //if there has been any change to the buttons:
    if (oldButtons.length === gamePadVars[0].buttons.length) {
      //cycle through the newButtons, comparing them to the oldButtons
      for (var x = 0; x < gamePadVars[0].buttons.length; x++) {
        if (oldButtons[x] !== gamePadVars[0].buttons[x].pressed) {
          if (gamePadVars[0].buttons[x].pressed) {
            gamePadsButtonDown(x);
          } else {
            gamePadsButtonUp(x);
          }
          anEvent();
        }
      }
    }
  }
  //because there are no events for a gamepad, I must check for them myself...
  //use animationFrame:
  window.requestAnimationFrame(function() {
    gamePadsButtonEventCheck();
  });
}
function gamePadsButtonDown(zButton) {
  var stopHere = 'blah';
  //I think it'd be nice to have the button lighten here, and play the first beep here...
}
function gamePadsButtonUp(zButton) {
  var stopHere = 'blah';
  //then the right/wrong beep here, with the button's color going back as well.
  //and now this would be the same as mouseClick...
  endUp(gamepadReMap[zButton]);
}
function keyNum(e) {
  return e.keyCode || window.event.keyCode;
  //this is called when there is a keydown or keyup:
  anEvent();
}
function keyDown(e) {
  if (!document.activeElement.classList.contains('editEnable')) {
    var theKey = keyNum(e);
    if (keysIgnore.indexOf(theKey) === -1) {
      bubbleStop(e);
      if (isFinite(keysCurrent[theKey])) {
        //because there is a 0, I gotta check whether it is null/undefined.
        endUp(keysCurrent[theKey]);
      }
      //simply add the newly pressed key into the WinKeys array.
      keyVars.push(theKey);
      anEvent();
    }
  }
}
function keyRedefine(theKey) {
  // left,up,right,down,A,B,X,Y   you can add more should your game require it.
  var theKey = keyNum(e);
  if (keysIgnore.indexOf(theKey) === -1) {
    bubbleStop(e);
    //simply add the newly pressed key into the WinKeys array.
    keyVars.push(theKey);
  }
}
function keyUp(e) {
  if (!document.activeElement.classList.contains('editEnable')) {
    var theKey = keyNum(e);
    if (keysIgnore.indexOf(theKey) === -1) {
      bubbleStop(e);
      while (keyVars.indexOf(theKey) != -1) {
        //updates array length while delete() doesn't
        keyVars.splice(keyVars.indexOf(theKey), 1);
      }
      anEvent();
    }
  }
  else {
    cc_calc();
  }
}
function mouseClear() {
  if (mouseVars.clickTimer) {
    window.clearTimeout(mouseVars.clickTimer);
  }
  mouseVars = {
      button: null
    , type: null
    , cursorStyle: null
    , clickTimer: null
    , current:{target:null, time:null, x:null, y:null}
    , start:{target:null, time:null, x:null, y:null}
    , moved: 0
  }
  document.body.style.cursor = 'default';
}
function scrollClear() {
  scrollVars = {
    targ: null,
    leftDiff: null,
    TopDiff: null,
  }
}
function mouseDown(e) {
  var targ = findTarget(e);

  if (targ.id.slice(0, 4) === 'game') {
    gameVars.gameObject = findObject(e);
  }
  mouseVars.button = null == e.which ? e.button : e.which;

  mouseVars.type = 'click';
  mouseVars.clickTimer = window.setTimeout(function() {
    mouseLongClick()
  }, 500);
  mouseVars.current.target  = targ;
  mouseVars.current.time = new Date().getTime();
  mouseVars.current.x = e.clientX;
  mouseVars.current.y = e.clientY;
  mouseVars.start.target = targ;
  mouseVars.start.time = new Date().getTime();
  mouseVars.start.x = e.clientX;
  mouseVars.start.y = e.clientY;

  if (targ.classList.contains('editEnable')) {
    return;
  }

  bubbleStop(e);
  //mouse down events can go here, or point to another function
  //look for tooltip
  if (targ.classList.contains('toolTipclass')) {
    tooltipVars.over = true;
    toolTipOver(targ.id);
    toolTipSort(targ.id, 1);
  }
  //look for volume control slider
  if (targ.id.slice(0, 3) === 'vol') {
    volDown();
  }
  anEvent();
}
function mouseMove(e) {
  //make sure that only one mouse movement is done per frame to reduce cpu usage.
  if (mouseVars.moved) {
    return;
  }
  mMoved = 1;
  window.requestAnimationFrame(function() {
    mMoved = 0;
  });


  var zTime = new Date().getTime();

  var targ = findTarget(e);
  if (targ.id.slice(0, 4) === 'game') {
    gameVars.gameObjectLast = gameVars.gameObject;
    gameVars.gameObject = findObject(e);
  }

  if (mouseVars.current.target) {
    if (mouseVars.current.target.classList.contains('editEnable')) {
      mouseVars.current = {target:targ, time:zTime, x:e.clientX, y:e.clientY};

      return;
    }
  }

  bubbleStop(e);
  //check for onmouseout/onmousein events!
  if (gameVars.gameObjectLast !== gameVars.gameObject) {
    if (mouseVars.type === 'click') {
      mouseVars.type = 'drag';
      window.clearTimeout(mouseVars.clickTimer);
    }
    mouseMoveEnter(targ);
    mouseMoveOut(targ);
  }
  //now onmouseover - this one is done always.
  mouseMoveOver(targ);
  //scroll the about/changelogs type dialogues
  if (mouseVars.type === 'scrollable' && (e.clientY != mouseVars.current.y)) {
    var framesPerSecond = (1000 / (scrollVars.time - mouseVars.current.time));
    var pixlesMoved = (mouseVars.current.y - scrollVars.y);
    var speedInPixelsPerSecond = pixlesMoved * framesPerSecond;
    //console.log(speedInPixelsPerSecond);
    if (pixlesMoved) {
      scroller(mouseVars.start.target, pixlesMoved);
    }

    scrollVars.time = mouseVars.current.time;
    scrollVars.x = mouseVars.current.x;
    scrollVars.y = mouseVars.current.y;
  }
  else if (mouseVars.start.target) {
    if (mouseVars.start.target.classList.contains('letScroll')) {
      mouseVars.type = 'scrollable';
      mouseVars.start.target = document.getElementById('toastPopup');
      scrollVars.time = mouseVars.current.time;
      scrollVars.x = mouseVars.current.x;
      scrollVars.y = mouseVars.current.y;
    }
  }

  //update the mouse object with the current stuff:
  /*
  mouseVars.current.target  = targ;
  mouseVars.current.time = zTime;
  mouseVars.current.x = e.clientX;
  mouseVars.current.y = e.clientY;
  */
  mouseVars.current = {target:targ, time:zTime, x:e.clientX, y:e.clientY};


  if (targ.classList.contains('toolTipclass')) {
    toolTipOver(targ.id);
    toolTipMouseMove(e);
    tooltipVars.over = true;
  } else if (tooltipVars.over && !targ.classList.contains('ttElem')) {
    tooltipVars.over = false;
    toolTipHide();
  }

  if (mouseVars.type === 'vol') {
    volMove();
  } else if (mouseVars.type === 'click') {
    if (((mouseVars.start.x + 25) < e.clientX) || ((mouseVars.start.x - 25) > e.clientX) || ((mouseVars.start.y + 25) < e.clientY) || ((mouseVars.start.y - 25) > e.clientY)) {
      mouseVars.type = 'drag';
      window.clearTimeout(mouseVars.clickTimer);
    }
  }
  //only render is a button is pressed... like if the user is dragging.
  if (mouseVars.button) {
    anEvent();
  }
}
function mouseMoveVarsUpdate(targ) {
  mouseVars.current.target  = targ;
  mouseVars.current.time = zTime;
  mouseVars.current.x = e.clientX;
  mouseVars.current.y = e.clientY;
}
function mouseMoveEnter(targ) {/*
   * use this for hovering over things.
   * eg. when you enter a new thing, highlight it.
  */
}
function mouseMoveOut(targ) {/*
   * opposite of enter...
   * eg. unhighlight something as the mouse moves off of it.
   *
  */
}
function mouseMoveOver(targ) {/*
   * for actively tracking while on an object.
   * eg. moving, dynamic tooltip.
  */
}
function mouseUp(e) {
  if (mouseVars.current.target.classList.contains('editEnable')) {
    return;
  }

  bubbleStop(e);
  //do any mouseup stuff here, eg. flinging or animated panning
  if (mouseVars.type == 'click') {
    if (mouseVars.button == 1) {
      mouseClick();
    } else if (mouseVars.button == 2) {
      mouseLongClick();
    }
  }
  //extra bit for moving the volume, so it's new value can be saved.
  if (mouseVars.type == 'vol') {
    storageSave('vol', globVol.toFixed(2));
    //no point in recording something like 15.00000033
  } else if (mouseVars.button == 1) {
    if (mouseVars.type == 'scrollable' || mouseVars.type === 'scrolling') {
      //console.log('begin auto scroll...');
      var tNow = new Date().getTime();
      var framesPerSecond = (1000 / (scrollVars.time - mouseVars.current.time));
      var pixlesMoved = (mouseVars.current.y - scrollVars.y);
      var speedInPixelsPerSecond = pixlesMoved * framesPerSecond;
      //console.log(speedInPixelsPerSecond);

      if (pixlesMoved) {
        scroller(mouseVars.start.target, pixlesMoved);
      }
      //speed should now be pixels per second, averaged over the last 5 frames.
      //console.log('average speed = ' + zSpeed);
      //mouseVars.start.target gets cleared, so make a seperate pointer.
      var zDiv = document.getElementById(mouseVars.start.target.id);
      window.requestAnimationFrame(function() {
        divScroller(zDiv, -speedInPixelsPerSecond, tNow)
      });
    }
  }
  //tooltip stuff for touch and click support
  if (tooltipVars.over && vPup.style.opacity > 0 && !mouseVars.start.target.classList.contains('toolTipclass')) {
    toolTipStuffHide(mouseVars.start.target.id);
  } else if (mouseVars.start.target.classList) {
    if (mouseVars.start.target.classList.contains('toolTipclass')) {
      //show tooltip immediatly
      toolTipShowNow(e, mouseVars.start.target.id);
    }
  }

  mouseClear();
  anEvent();
}
function mouseWheel(e) {//for zooming in/out, changing speed, etc.
  var targ = findTarget(e);
  if (targ.id.slice(0, 4) === 'game') {
    gameVars.gameObjectLast = gameVars.gameObject;
    gameVars.gameObject = findObject(e);
  }

  bubbleStop(e);

  var delta;
  if (e.deltaY) {
    delta = -e.deltaY;
    //seems like the main one
  } else if ('wheelDelta'in e) {
    delta = e.wheelDelta;
  } else {
    delta = -40 * e.detail;
    //fallback!
  }
  if (delta > 0) {
    delta = 1;
  } else {
    delta = -1;
  }
  mouseWheelEvents(targ, delta);
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

function mouseClick() {
  var targID = mouseVars.current.target.id;
  if (targID === 'toastClose') {
    upNotClose();
  } else if (targID === 'sets') {
    settingsCreate();
  } else if (targID === 'setsClose') {
    settingsClose1();
  } else if (targID === 'bAbout') {
    upNotOpen('About the Developer', appAbout);
  } else if (targID === 'bChange') {
    upNotOpen('Todlearner ChangeLog', appCL);
  } else if (targID.slice(0, 3) === 'vol') {
    volDown();
  } else if (targID.slice(0, 4) === 'stor') { //storage question.
    storageChoose(targID.slice(-1));
    upNotClose();
  } else if (targID === 'fsI' || targID === 'fs') {//fullscreen button
    fullScreenToggle();
  } else {
    cc_mClick(mouseVars.current.target);
  }
}
function mouseLongClick() {//this is also the right-click.
//for right click, and long taps.
}
function touchChange(e) {
  return {
    button: 1,
    target: e.target,
    id: e.identifier,
    clientX: e.clientX,
    clientY: e.clientY,
    preventDefault: function() {},
    stopPropagation: function() {}
  };
  //return a new event object back with only the things I want in it :)
}
function touchDown(e) {
  var cTouches = e.changedTouches;
  for (var x = 0; x < cTouches.length; x++) {
    var zID = cTouches[x].identifier;
    touchVars[zID] = touchChange(cTouches[x]);
    //would overwrite existing event if a finger was not deleted - from aen error for example.
    if (touchVars[zID].target) {
      if (zID == 0) {
        if (!touchVars[zID].target.classList.contains('editEnable')) {
          bubbleStop(e);
          //should change the mouse cursor if needed.
          mouseDown(touchVars[zID]);
          //only do the mouse events on the first finger.
          //mouseMove(touchVars[zID]);
        }
      }
      else {
        bubbleStop(e);
      }
    }
  }
}
function touchMove(e) {
  bubbleStop(e);
  var cTouches = e.changedTouches;
  for (var x = 0; x < cTouches.length; x++) {
    var zID = cTouches[x].identifier;
    if (zID >= 0) {
      touchVars.splice(zID, 1, touchChange(cTouches[x]));
      // swap in the new touch record
    }

    if (zID == 0) {
      if (!touchVars[zID].target.classList.contains('editEnable')) {
        bubbleStop(e);
        //only do the mouse events on the first finger.
         mouseMove(touchVars[zID]);
      }
    }
    else {
      bubbleStop(e);
    }
  }
}
function touchUp(e) {
  var cTouches = e.changedTouches;
  //new array for all current events
  for (var x = 0; x < cTouches.length; x++) {
    var zID = cTouches[x].identifier;
    if (zID >= 0) {
      if (touchVars[zID]) {
        mouseMoveOut(touchVars[zID].target);
      } else {
        touchVars[zID].target = document.body;
      }

      if (zID == 0) {
        if (!touchVars[zID].target.classList.contains('editEnable')) {
          bubbleStop(e);
          mouseUp(touchVars[zID]);
        }
      } else {
        bubbleStop(e);
      }

      //should change the mouse cursor if needed.
      delete touchVars[zID];
    }
  }
}
function volDown() {
  mouseVars.start.target = document.getElementById('vol-Iv');
  mouseVars.type = 'vol';
  volMove();
}
function volMove() {
  //find the percentage of the the slider's left
  var zWidth = mouseVars.start.target.parentNode.offsetWidth;
  var zLeft = mouseVars.start.target.parentNode.offsetLeft + document.getElementById('cont').offsetLeft;
  var sliderLeft = mouseVars.current.x - zLeft + 2;
  sliderLeft -= (mouseVars.start.target.offsetWidth / 2);
  var sliderPercent = (sliderLeft / (zWidth - mouseVars.start.target.offsetWidth)) * 100;
  if (sliderPercent < 0) {
    sliderPercent = 0;
  } else if (sliderPercent > 100) {
    sliderPercent = 100;
  }
  globVol = (sliderPercent / 100);
  //document.getElementById('vol%').innerHTML = Math.round(sliderPercent) + '%';
  //change the color of the slider ball to where the ball is
  var zNum = Math.round((240/100) * (100-sliderPercent));
  var zBack = 'radial-gradient(farthest-side at 33% 33% , hsl(' + zNum + 
  ',100%,90%), hsl(' + zNum + ',100%,40%))';
  mouseVars.start.target.style.background = zBack;
  //recalculate to offset width of the slider iteself
  var zDiff = (zWidth - mouseVars.start.target.offsetWidth) / zWidth;
  sliderPercent *= zDiff;
  mouseVars.start.target.style.left = sliderPercent + '%';
}
function volUpdate() {
  var sliderPercent = (globVol * 100);
  //recalculate to offset width of the slider iteself
  var zDiff = (document.getElementById('vol-Cv').offsetWidth - document.getElementById('vol-Iv').offsetWidth) / document.getElementById('vol-Cv').offsetWidth;
  sliderPercent *= zDiff;
  document.getElementById('vol-Iv').style.left = sliderPercent + '%';
  //now change the color of the slider
  var zVol = (globVol*100).toFixed(0);  
  var zNum = Math.round((240/100) * (100 - (globVol*100)));
  var zBack = 'radial-gradient(farthest-side at 33% 33% , hsl(' + zNum + 
  ',100%,90%), hsl(' + zNum + ',100%,55%), hsl(' + zNum + ',100%,33%))';

  document.getElementById('vol-Iv').style.background = zBack;
}
function scroller(targ, toScrollBy) {
  //console.log(toScrollBy);
  var zTop = (targ.offsetTop + toScrollBy);
  var tcTop = document.getElementById('toastContainer').offsetTop;
  var longest = document.body.offsetHeight - (targ.clientHeight + tcTop);//don't include border on targ.

  if (longest > zTop) {
    zTop = longest;
  }
  else if (zTop > 0) {
    zTop = 0;
  }
  targ.style.top = zTop + 'px';
  //if there is a close button, make sure it stays on-screen.
  if (document.getElementById('toastClose')) {
    //might be the scroll value perhaps... dunno yet.
    if (zTop < -tcTop) {
      document.getElementById('toastClose').style.top = (-zTop - tcTop) + 'px';
    }
  }
}
function divScroller(targ, zSpeed, zTime) {
  if (!targ || mouseVars.button) {
    //if the element no longer exists, there is nothing to do.
    return;
  }
  var tNow = new Date().getTime();
  var tDiff = (tNow - zTime) / 1000;
  var newSpeed = zSpeed;
  var toScrollBy = (zSpeed * tDiff);
  if ((tDiff > 0) && (zSpeed != 0) && (toScrollBy < 0.25 && toScrollBy > -0.25)) {
    //scroll speed is too slow. Just stop the scrolling animation.
    return;
  }

  //scroller(targ, (e.clientY - mouseVars.current.y));
  scroller(targ, toScrollBy);
  //now to calculate the next frame's scroll amount:
  if (tDiff) {
    /*
      NOTE:
      I've tried lots of different varients, but the scrolling up always takes longer than scrolling down
      I've given up tring to understand that, and just reversing the speed to compensate
      I am now just taking off a little more for scrolling up.
      Hopefully, that will prove about right no matter what browser is used!
    */
    if (newSpeed < 0) {
      newSpeed *= .925;
    } else {
      newSpeed *= .95;
    }
    //check for whether the newSpeed is going in the opposite direction
    if ((zSpeed > 0 && newSpeed < 0) || (zSpeed < 0 && newSpeed > 0)) {
      newSpeed = 0;
    }
  }
  if (newSpeed) {
    window.requestAnimationFrame(function() {
      divScroller(targ, newSpeed, tNow)
    });
  }
}

