//Modified from stewved/gameTemplate/initialize.s - part of my gameTemplate project.
//hopefully comprehensive HTML cancel fullscreen:
var killFS = (document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen)
//kick up fullscreen:
 getFS = (document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullscreen || document.documentElement.msRequestFullscreen)
//mousewheel event, based on the all-encompassing mozDev version
 mouseWheelType = 'onwheel'in document.createElement('div') ? 'wheel' : document.onmousewheel ? 'mousewheel' : 'DOMMouseScroll'
/*
 * Keys to ignore... alt-tab is annoying, so don't bother with alt for example
 * 16 = shift
 * 17 = Ctrl
 * 18 = Alt (and 17 if altGr)
 * 91 = windows key
 * 116 = F5 - browser refresh
 * 122 = F11 - Full Screen Toggle
 * 123 = F12 - Dev tools.
*/
, keysIgnore = [0, 16, 17, 18, 91, 116, 122, 123]
/*
 * left,up,right,down,A,B,X,Y   you can add more should your game require it.
*/
, keysDefault = {100:0 ,101:1 ,97:2 ,98:3}
/*
 * the currently used keys are loaded on init
*/
, keysCurrent = null
//Input events vars to hold the event info:
, inputType = null
// touch|gamePad|mouse|keyboard - depending on game type you could add GPS or whatever else HTML supports...
//Mouse:
, mouseVars = []
//Gamepad:
, gamePadVars = []
, gamepadReMap = [2, 3, 0, 1]
//keyboard:
, keyVars = []
//For touch-enabled devices
, touchVars = []
//from webtop project - 
, imgSocs = 'style="background:center/contain no-repeat url(\'images/'
//base64 code for an empty 1x1 png:
, imgDummy = ' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjAAIAAAQAASDSLW8AAAAASUVORK5CYII="'
//vars to hold variables for the window
, gameWindow = null
//tooltip system from Webtop project
, toolTips = {
  'zAge': '16+<br><br>For even more accuracy, include fraction of year.<br>eg. if your birthday was 3 months ago,<br>put (your age).25 (3 divided by 12)',
  'zSitting': '<span style="font-weight:bold;color:#acf">This is automatically calculated<br>by taking all of other activities<br>out of a full day.</span><br><br>This activity level includes:<ul><li>relaxing</li><li>Either sitting, reclining,</li><li>or standing still, quietly</li><li>reading</li><li>listening to music (Not dancing),</li><li>desk work.</li></ul>',
  'zLight': 'This activity level includes:<ul><li>light housework</li><li>walking</li><li>slow swimming</li></ul>',
  'zMedium': 'This activity level includes:<ul><li>hoovering</li><li>normal swimming</li><li>jogging</li></ul>',
  'zHeavy': 'This is High-intensity activty like:<ul><li>lifting weights</li><li>sprinting</li><li>very hard work</li></ul>Add only the time doing the work,<br>eg. 30 minutes weight training may only<br>be around 5 minutes of actual lifing. ',
  'dCals': 'Your daily maintenance calorie requirement.<br><br>' + 'Use this amount of calories to keep your current weight.<br><br>' + 'This should be a quite accurate amount, since<br>' + 'you customised your activity-levels.',
  'zBMI': 'An average adult&apos;s ideal BMI is in the 18.5 to 24.9 range.<br>If your BMI is less than 18.5, you likely weigh less than is ideal for your height,<br>but if your BMI is 25 or more, you may weigh more than is ideal for your height.<br><br><span style="color:#fa8;">(Use this only as a guide)<span>',
  'zWeight': 'Calculated using your height, and<br>the BMI of 21.75, which is the middle<br>of the healthy range for an average person.<br><br><span style="color:#fa8;">(As with BMI itself, Use this only as a guide)<span>',
  'zWaist': 'An average adult&apos;s ideal waist measurement<br>is simply half their height :-)<br><br><span style="color:#fa8;">(Use this only as a guide)<span>',
  'zTargCals': 'The NHS recommends the <br>National Institute for Health and Care Excellence (NICE)<br>guidline of 600 calories gain/defecit per day.<br><br>' + 'Everybody is diferent, and though this calorie calutator<br>should be more accurate than most available, your individual<br>body-type, metabolism, etc may differ from the average.<br><br>' + 'If your are losing more than 1kg a week, increase your<br>target calorie intake by 200 calories, and if you are<br>losing less than 0.5kg a week, decrease it by 200.<br>Simply reverse this if you are wanting to gain weight.',
  'zToLose': 'Simply the difference between<br>your current weight and your ideal weight.<br><br><span style="color:#fa8;">(Use this only as a guide)<span>',
  'zToGoal': 'Assuming an average of 0.7kg per week,<br>this is how many weeks it would<br>take to reach your ideal weight.<br><br><span style="color:#fa8;">(Use this only as a guide)<span>'
}
, LS1 = '@#~'
, LS2 = '~#@'
, globVol = .33 //the volume of the beeps in the game.
, saveY = 0; //whether the user allows saving to HTML5 local storage
;

function Init() {
  //Add event listeners to the game element
  addEventListeners();
  //initialize the mouse event
  mouseClear();
  //initialize the scroll vars
  scrollClear();
  //window management vars
  gameWindow = {
    initWidth: 640
  , initHeight: 360
  , width: 0
  , height: 0
  , scale: 1
  };

  gameVars = {
    go: 0 //only process changes on an event
  , tWoz: 0 //Time on Last Frame
  };

  //check for saved data. If set, the user has chosed to either save or not save data.
  storageCheck();

  //for the moment, just use the default keyset:
  keysCurrent = keysDefault;

  //check if the user has modified the volume level:
  var dataToLoad = storageLoad('vol');
  if (dataToLoad) {
    globVol = parseFloat(dataToLoad);
  }
  //add the stuff to the page.
  initContent();
  //see if there is a stored load of data:
  cc_dataLoad();
  //add my settings system to the project.
  settingsButton();
  //now that everything is set up, make a recurring checker for button presses:
  gamePadsButtonEventCheck();
  resize();
  //calculate now:
  cc_calc();
}
function initContent() {
  var pNone = 'style="clear:both;float:left;width:62%;margin:0;padding:3px;text-align:center;"'
  , pText = 'style="float:left;margin:0;padding:3px;width:30%;text-align:center;background:linear-gradient(#fff, #eee);border:1px solid #000;"'
  , pSel0 = 'style="float:left;width:calc(25% - 7px);margin:0;padding:3px;text-align:center;"'
  , pSel1 = 'style="float:left;width:calc(20% - 7px);margin:0;padding:3px;text-align:center;"'
  , pSel2 = 'style="float:left;margin:3px;padding:0px;width:calc(100% - 6px);text-align:center;background:linear-gradient(#fff, #eee);border:1px solid #000;"'
  , cont4 = 'style="float:left;width:calc(25% - 1px);margin:0px;padding:3px;text-align:center;overflow:hidden;box-sizing:border-box;"'
  , cont5 = 'style="float:left;width:calc(20% - 1px);margin:0px;padding:3px;text-align:center;overflow:hidden;box-sizing:border-box;"'
  , toolTipThingy = 'style="margin:auto;padding:0px 4px;"'
  , inputThingy = 'style="clear:both;float:left;margin:0px;padding:3px;width:100%;text-align:center;background:linear-gradient(#fff, #eee);border:1px solid #000;box-sizing:border-box;"'
  , butLeft = 'style="width:15%;margin-left:4px"'
  , butRight = 'style="width:15%;margin-right:4px"'
  ;

  document.body.innerHTML =
  '<div id="cont">'
  + '<div style="background:lightgreen;overflow:hidden;padding-top:4px;text-align:center;">'
    + '<button id="m" type="button" class="uButtonLeft uButtons uButtonGreen " ' + butLeft + ' value="1">Male</button>'
    + '<button id="f" type="button" class="uButtons uButtonGrey uButtonRight" ' + butRight + ' value="0">Female</button>' //default

    + '<button id="kg" type="button" class="uButtonLeft uButtons uButtonGreen " ' + butLeft + ' value="1">Kg</button>'
    + '<button id="lb" type="button" class="uButtons uButtonGrey uButtonRight" ' + butRight + ' value="0">lb</button>' //default

    + '<button id="cm" type="button" class="uButtonLeft uButtons uButtonGreen " ' + butLeft + ' value="1">cm</button>'
    + '<button id="in" type="button" class="uButtons uButtonGrey uButtonRight" ' + butRight + ' value="0">inch</button>' //default

    + '<div style="float:left;width:calc(12.5% - 4.5px);margin:0;padding:3px;"></div>'

    + '<div ' + cont4 + '>Height'
      + '<input type="text" id="h" class="editEnable" ' + inputThingy + ' size="3" value="176.5">' //176
    + '</div>'

    + '<div ' + cont4 + '>Weight'
      + '<input type="text" id="w" class="editEnable" ' + inputThingy + ' size="5" value="84.7">' //82
    + '</div>'

    + '<div ' + cont4 + '>'
      + '<div id="_zAge" class="toolTipclass" ' + toolTipThingy + '>Age (years)</div>'
      + '<input type="text" id="a" class="editEnable" ' + inputThingy + ' size="5" value="24.75">'
    + '</div>'
  + '</div>'

  + '<div style="background:lightsalmon;overflow:hidden;">'
    + '<div style="clear:both;float:left;width:100%;text-align:center;margin-top:5px;">Activity per day'
      + '<button id="hr" type="button" class="uButtons uButtonGreen uButtonLeft" ' + butLeft + ' value="1">hrs</button>'
      + '<button id="mn" type="button" class="uButtons uButtonGrey uButtonRight" ' + butRight + ' value="0">mins</button>' //default
    + '</div>'

    + '<div ' + cont5 + '>Sleep'
      + '<input type="text" id="s" class="editEnable" ' + inputThingy + ' size="5" value="8">'
    + '</div>'

    + '<div ' + cont5 + '>'
      + '<span id="_zSitting" class="toolTipclass" ' + toolTipThingy + '>Sitting</span>'
      + '<input type="text" id="na" class="editDisable" style="clear:both;float:left;margin:0px;padding:3px;width:100%;text-align:center;background:linear-gradient(#eee, #ccc);border:1px solid #000;box-sizing:border-box;" size="5" value="15.13">'
    + '</div>'

    + '<div ' + cont5 + '>'
      + '<span id="_zLight" class="toolTipclass" ' + toolTipThingy + '>light</span>'
      + '<input type="text" id="la" class="editEnable" ' + inputThingy + ' size="5" value="0.75">'
    + '</div>'

    + '<div ' + cont5 + '>'
      + '<span id="_zMedium" class="toolTipclass" ' + toolTipThingy + '>Medium</span>'
      + '<input type="text" id="ma" class="editEnable" ' + inputThingy + ' size="5" value="0.05">'
    + '</div>'

    + '<div ' + cont5 + '>'
      + '<span id="_zHeavy" class="toolTipclass" ' + toolTipThingy + '>Heavy</span>'
      + '<input type="text" id="ha" class="editEnable" ' + inputThingy + ' size="5" value="0.07">'
    + '</div>'
  + '</div>'

  + '<div style="clear:both;border-top:10px double;background-color:lightblue;overflow:hidden;box-sizing:border-box;">'
  + '<div ' + cont4 + '>'
    + '<span id="_dCals" class="toolTipclass" ' + toolTipThingy + '>Maint calories</span>'
    + '<input type="text" id="c" class="editEnable" ' + inputThingy + ' size="5" value="0000">'
  + '</div>'

  + '<div ' + cont4 + '>'
    + '<span id="_zBMI" class="toolTipclass" ' + toolTipThingy + '>BMI</span>'
    + '<input type="text" id="b" class="editEnable" ' + inputThingy + ' size="5" value="00.00">'
  + '</div>'

  + '<div ' + cont4 + '>'
    + '<span id="_zWeight" class="toolTipclass" ' + toolTipThingy + '>Ideal weight</span>'
    + '<input type="text" id="iW" class="editEnable" ' + inputThingy + ' size="5" value="00.00">'
  + '</div>'

  + '<div ' + cont4 + '>'
    + '<span id="_zWaist" class="toolTipclass" ' + toolTipThingy + '>Ideal waist</span>'
    + '<input type="text" id="d" class="editEnable" ' + inputThingy + ' size="5" value="00.00">'
  + '</div>'

  + '<div style="clear:both;float:left;width:calc(12.5% - 4.5px);margin:0;padding:3px;"></div>'

  + '<div ' + cont4 + '>'
    + '<span  id="_zTargCals" class="toolTipclass" ' + toolTipThingy + '>Target&nbsp;calories</span>'
    + '<input type="text" id="cl" class="editEnable" ' + inputThingy + ' size="5" value="0000">'
  + '</div>'

  + '<div ' + cont4 + '>'
    + '<span id="_zToLose" class="toolTipclass" ' + toolTipThingy + '>Lose&nbsp;target</span>'
    + '<input type="text" id="tl" class="editEnable" ' + inputThingy + ' size="5" value="00.00">'
  + '</div>'

  + '<div ' + cont4 + '>'
    + '<span id="_zToGoal" class="toolTipclass" ' + toolTipThingy + '>Weeks&nbsp;to&nbsp;target</span>'
    + '<input type="text" id="tg" class="editEnable" ' + inputThingy + ' size="5" value="00.00">'
  + '</div>'
+ '</div>';
}
function addEventListeners() {
  window.addEventListener('resize', resize, false);
  /*
    I only want to pick up input events on the game,
    if this doesn't work, go back to window/document
    and use blur/focus/pause.
  */
  window.addEventListener('contextmenu', bubbleStop, false);
  window.addEventListener('dblclick', bubbleStop, false);
  window.addEventListener(mouseWheelType, mouseWheel, false);
  window.addEventListener('touchstart', touchDown, false);
  window.addEventListener('touchmove', touchMove, false);
  window.addEventListener('touchcancel', touchUp, false);
  window.addEventListener('touchend', touchUp, false);
  window.addEventListener('touchleave', touchUp, false);
  window.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mousemove', mouseMove, false);
  window.addEventListener('mouseup', mouseUp, false);
  window.addEventListener('keydown', keyDown, false);
  window.addEventListener('keyup', keyUp, false);
}
