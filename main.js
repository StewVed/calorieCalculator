/*
REE = 9.99 x weight + 6.25 x height - 4.92 x age + 166 x sex (males, 1; females, 0) - 161
http://www.ncbi.nlm.nih.gov/pubmed/2305711
*/

/*
  2017-02-25 Omar did a great video about measuring body fat...
  https://www.youtube.com/watch?v=3Qqdgpwy0M0&t
  So, the plan now is to add the Navy's BF calculator algorythm
  and that Fat-Free Mass algorythm to my calculator, then 
  get rid of the cruddy BMI!

  Source of the stuff:
  http://www.dtic.mil/whs/directives/corres/pdf/130803p.pdf

  This is from 2002-11-05 - 15 years ago?!?!?!

  (All circumference and height measurements are in inches.)
  Males: % body fat = 86.010  x log10(abdomen - neck)   -   70.041 x log10(height) + 36.76
Females: % body fat = 163.205 x log10(waist + hip - neck) - 97.684 x log10(height) - 78.387

*/

function resize() {
  //little fix for on-screen keyboards resizing screen space:
  if (document.activeElement.classList.contains('editEnable')) {
    //also could double-check by checking that the width hasn't changed:
  //if (document.body.offsetWidth === window.innerWidth) - if needed...
    return;
  }
  //maybe I should make the game bit a squre, then have the scores bit
  //however amount of space is left? what if the available area is square?
  //regardless, let's begin by finding the smallest size out of length and width:
  var a
  , b
  , portraitLayout;

  document.body.style.width = window.innerWidth + 'px';
  document.body.style.height = window.innerHeight + 'px';

  if (window.innerWidth > window.innerHeight) {
    a = window.innerHeight;
    b = window.innerWidth;
    portraitLayout = 0;
  }
  else {
    a = window.innerWidth;
    b = window.innerHeight;
    portraitLayout = 1;
  }


  if (document.getElementById('cont')) {
    /*
      in my webtop, I hava a scaling system for each element.
      perhaps though, I can see if this newer idea would
      work well enough...
      See, just changing the font size of the body should
      make every element scale to the new font size anyway,
      and since that would be done by the browser, I expect
      it to be more efficient than my own dodgy scaling code!
    */
    //document.getElementById('cont').style.fontSize = vPup.style.fontSize = window.innerWidth * .002 + 'em';
    document.body.style.fontSize = window.innerWidth * .002 + 'em';
  /*
    var gWidth = document.body.offsetWidth;
    var gHeight = (gWidth / (16 / 9));
    if (gHeight > document.body.offsetHeight) {
    gHeight = document.body.offsetHeight;
    gWidth = gHeight * (16 / 9);
    }
    document.getElementById('cont').style.width = gWidth + 'px';
    document.getElementById('cont').style.height = gHeight + 'px';
  */
    //when the available screen is not 16/9, center the game.
    //this should default as 0px for both generaly.
    var zTop = resizeCenter(document.body.offsetHeight, document.getElementById('cont').offsetHeight);
    var zFont = window.innerWidth * .002;
    
    while (zTop < 0) {
      zFont *= .9;
      document.body.style.fontSize = zFont + 'em';
      zTop = resizeCenter(document.body.offsetHeight, document.getElementById('cont').offsetHeight);
    }

    zTop = resizeCenter(document.body.offsetHeight, document.getElementById('cont').offsetHeight);
    document.getElementById('cont').style.top = zTop + 'px'
    document.getElementById('cont').style.left = resizeCenter(document.body.offsetWidth, document.getElementById('cont').offsetWidth) + 'px';

  }

  if (document.getElementById('toastClose')) {
    closeButtonRight('toastClose');
  }
  if (document.getElementById('setsClose')) {
    closeButtonRight('setsClose');
  }
}
function resizeCenter(a, b) {
  return Math.round((a / 2) - (b / 2));
}

// fullscreen handling from webtop then simplified for this project...
function fullScreenToggle() {
  var isFS = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  if (isFS) {
    killFS.call(document, function() {});
    if (document.getElementById('fs')) {
      document.getElementById('fs').classList.remove('fsd')
      document.getElementById('fs').classList.add('fsu');
    }
  } else {
    getFS.call(document.documentElement, function() {});
    if (document.getElementById('fs')) {
      document.getElementById('fs').classList.remove('fsu')
      document.getElementById('fs').classList.add('fsd');
    }
  }
}
function cc_calc() {
  /*
  REE (males) = 10 x weight (kg) + 6.25 x height (cm) - 5 x age (y) + 5
  REE (females) = 10 x weight (kg) + 6.25 x height (cm) - 5 x age (y) - 161.
  so the difference between sexes is the =5 or -161 on the end :D
  original formula:
  REE = 9.99 x weight + 6.25 x height - 4.92 x age + 166 x sex (males, 1; females, 0) - 161
  http://www.ncbi.nlm.nih.gov/pubmed/2305711

  using http://www.drgily.com/basal-metabolic-rate-calculator.php
  it seems like:
  sedentry = 350
  Light Active = 525
  moderate active = 525
  Very active = 876
  extremely active = 1051

  @ 82kg
  You burned 758 calories through sleeping, for 480 minutes.
  You burned 2066 calories through reclining, reading, for 16 hours.
  2824 - no, that is not right.
  @ 80kg
  2016 + 758


To work out your BMI:
 divide your weight in kilograms (kg) by your height in metres (m)
 then divide the answer by your height again to get your BMI.

For example:
  If you weigh 70kg and you're 1.75m tall, divide 70 by 1.75. The answer is 40.
  Then divide 40 by 1.75. The answer is 22.9. This is your BMI.


optimal waist measurement is half your height I heard too.
*/
  var zWeight = parseFloat(document.getElementById('w').value)
  , zHeight = parseFloat(document.getElementById('h').value)
  , zSex = parseFloat(document.getElementById('m').value)
  , zKg = parseInt(document.getElementById('kg').value, 10)
  , zCm = parseInt(document.getElementById('cm').value, 10)
  , zNow = new Date().getTime()
  , zThen = new Date(document.getElementById('a').value).getTime()
  , zAge = (zNow - zThen) / 31556908800 // (86,400,000 × 365.242) milliseconds – one year (Source: https://en.wikipedia.org/wiki/Millisecond)
  ;

  //convert lb to kg, inch to cm if needed:
  if (!zKg)  {
    zWeight = parseFloat(document.getElementById('w').value) / zConvert[1];
  }
  if (!zCm)  {
    zHeight = parseFloat(document.getElementById('h').value) / zConvert[0];
  }

  if (isNaN(zHeight) || isNaN(zWeight) || isNaN(zNow) || isNaN(zThen) || isNaN(zAge)) {
    document.getElementById('c').value = document.getElementById('tbf').value = document.getElementById('iW').value = document.getElementById('d').value = document.getElementById('cl').value = document.getElementById('tl').value = document.getElementById('tg').value = 0;
    if (isNaN(zHeight)) {
      cc_changeInputBackColor('h', 'inputEn', 'inputNo');
    } else {
      cc_changeInputBackColor('h', 'inputNo', 'inputEn');
    }
    if (isNaN(zWeight)) {
      cc_changeInputBackColor('w', 'inputEn', 'inputNo');
    } else {
      cc_changeInputBackColor('w', 'inputNo', 'inputEn');
    }
    if (isNaN(zNow) || isNaN(zThen) || isNaN(zAge)) {
      cc_changeInputBackColor('a', 'inputEn', 'inputNo');
    } else {
      cc_changeInputBackColor('a', 'inputNo', 'inputEn');
    }
    return;
  } else {
    cc_changeInputBackColor('h', 'inputNo', 'inputEn');
    cc_changeInputBackColor('w', 'inputNo', 'inputEn');
    cc_changeInputBackColor('a', 'inputNo', 'inputEn');
  }

  //let the user know their age as a double-check:
  document.getElementById('_zDob').innerHTML = 'DOB&nbsp;(' + zAge.toFixed(2) + 'y)'

  //using REE = 9.99 x weight + 6.25 x height - 4.92 x age + 166 x sex (males, 1; females, 0) - 161
  //document.getElementById('c').value =
  //parseInt((zWeight * 9.99) + (zHeight * 6.25) - (zAge * 4.92) + ((zSex * 166) - 161), 10) + parseInt(document.getElementById('add').value, 10)
  /*
  height = 176 cm
  weight = 82kg
  age = 37 years
  the above gives 1742 BEE using mifflin

  now, lets add Metabolic Equivalent of Task  rates... 8hours sleep (0.9) then 16 hours of sitting (1.3)
  divide by 24 hours to get rate per hour:
  1742 / 24 = 72.58333333333333
  times that by 8 for sleep
  (72.58333333333333*8)*0.9 = 522.6
  and for the 16 hours sitting:
  1509.733333333333
  those give 2032.33 total :D

*/
  var totCals = 0;
  //do the Mifflin-ST Joan BMR equation (REAL not simplified)
  var BMRperH = ((zWeight * 9.99) + (zHeight * 6.25) - (zAge * 4.92) + ((zSex * 166) - 161)) / 24;
  var hr = parseInt(document.getElementById('hr').value, 10);
  //var the activity values:
  var s = parseFloat(document.getElementById('s').value);
  var na;
  var la = parseFloat(document.getElementById('la').value);
  var ma = parseFloat(document.getElementById('ma').value);
  var ha = parseFloat(document.getElementById('ha').value);
  if (hr) {
    //hours selected
    //calculate the sitting time in hours by subtracting everything else from 24
    na = document.getElementById('na').value = parseFloat((24 - s - la - ma - ha).toFixed(3));
  } else {
    //convert to hours for minutes
    //calculate the sitting time by subtracting everything else from 24*60
    na = document.getElementById('na').value = parseFloat((1440 - s - la - ma - ha).toFixed(3));
    //divide each f the values by 60 to get the amount in hours
    s /= 60;
    //document.getElementById('s').value / 60
    na /= 60;
    la /= 60;
    ma /= 60;
    ha /= 60;
  }
  //do sleep @ 0.9
  totCals += ((BMRperH * s) * 0.9);
  //do Not active @ 1.2 - really should be 1.3, but sitting quietly is 1.0
  totCals += ((BMRperH * na) * 1.3);
  //do lightly active @ 2.5 eg.washing up casually
  totCals += ((BMRperH * la) * 2.5);
  //do Moderately active @ 4  walking for pleasure is 3.5, brisk is 4.3, very brisk is 5.0
  totCals += ((BMRperH * ma) * 4);
  //do Heavily active @ 8
  totCals += ((BMRperH * ha) * 8);

  //if this isn't the first time, save the values now:
  if (document.getElementById('c').value !== '0000') {
    cc_dataSave();
  }
  //show the maintenance calories:
  document.getElementById('c').value = Math.round(totCals);

  //calculate Body-Fat here (new at 2017-03-04)
  var bfNum = 0;
  var zNeck = parseFloat(document.getElementById('dn').value);
  var zWaist = parseFloat(document.getElementById('dw').value);
  var zHip = parseFloat(document.getElementById('dh').value);
  var aHeight = zHeight * zConvert[0];
  //if the neck, waist, hips are in in CMs, convert to inches...
  if (zCm) {
    zNeck *= zConvert[0];
    zWaist *= zConvert[0];
    zHip *= zConvert[0];
  }
/*
  (All circumference and height measurements are in inches.)
  Males: % body fat = 86.010  x log10(abdomen - neck)   -   70.041 x log10(height) + 36.76
Females: % body fat = 163.205 x log10(waist + hip - neck) - 97.684 x log10(height) - 78.387
  let's assume that the calculation works as intended with not extra parentheses!!!!
*/
  if (zSex) {
    bfNum = 86.010 * Math.log10(zWaist - zNeck) - 70.041 * Math.log10(aHeight) + 36.76;
  } else {
    bfNum = 163.205 * Math.log10(zWaist + zHip - zNeck) - 97.684 * Math.log10(aHeight) - 78.387;
  }

  document.getElementById('bf').value = bfNum.toFixed(2);




/*
  from: https://www.livestrong.com/article/429402-how-to-calculate-your-muscle-to-fat-ratio/
  To determine your optimal fat to lean ratio and body weight, select a range based on your gender and goals.
  Use one of the available methods to assess your body fat percentage.
  TBM: your Total Body Mass (total Weight)
  BF%: body fat percentage.
  FW:  Fat Weight.
  LBM: Lean Body Mass
  GBF%:Goal Body Fat percentage
  TW:  Target Weight.
  WL:  how much Weight to Lose.
  The four-step formula looks like this:
  Step 1: TBM x BF%=FW;
  Step 2: TBM – FW=LBM;
  Step 3: LBM/(1-GBF%) = TW;
  Step 4: TBM–TW=WL.
  weirdly, this appears to be the only place I've found so far that
  gives any kind actual calculation!
*/


  var zToGain
  , tCals
  , tWeight // = (((zHeight / 100) * (zHeight / 100)) * 21.75);
  , iWaist = (zHeight / 2)
  , tBF = parseFloat(document.getElementById('tbf').value);


  //do BMI:
  //document.getElementById('b').value = (zWeight / ((zHeight / 100) * (zHeight / 100))).toFixed(2);

  //instead of BMI, I will allow the user to customize their target
  //body fat %, and work out the rest from that.

  /*
    first, calculate the weight of the lean-mass, since I will
    assume this will remain about the same (Keep dem GAINZ!)
    Step 1: TBM x BF%=FW;
    Step 2: TBM – FW=LBM;
    Step 3: LBM/(1-GBF%) = TW; - - why 1-tBF% ???
    Step 4: TBM–TW=WL.

  */
  var fatWeight = zWeight * (bfNum / 100);
  var leanBodyMass = zWeight - fatWeight;
/*
  Worked out how to calculate this with the help of my wife
  looking back at the step thing above, I now understand the 1-GBF..
  GBF would be in decimals... eg. .15 for 15%! 
*/
  tWeight = (leanBodyMass / (100 - tBF)) * 100;

  //is this the same as zWeight / (zHeight * zHeight)
  zToGain = (zWeight - tWeight);
  //if this is a minus, then add 600?
  if (zToGain > 0) {
    tCals = -600;
    document.getElementById('_zToLose').innerHTML = 'Lose&nbsp;target';
  } else {
    tCals = 600;
    zToGain = -zToGain;
    document.getElementById('_zToLose').innerHTML = 'Gain&nbsp;target';
  }
  //add/take 600 from the maintenance calories for target cals per day.
  document.getElementById('cl').value = Math.round(totCals + tCals);
  //amount of time it'd take to get to the ideal weight:
  //times by 2 to get 0.5 into weeks
  //my average appears to be 100g per day, 700g per week
  //2.1Kg should take 3 weeks 2100/7?
  document.getElementById('tg').value = Math.round(zToGain / .7);
  //convert kg back to lb, cm back to inch if needed:
  if (!zKg) {
    zToGain *= zConvert[1];
    tWeight *= zConvert[1];
  }
  if (!zCm) {
    iWaist *= zConvert[0];
  }
  //do ideal waist measurement
  document.getElementById('d').value = iWaist.toFixed(2);
  //do ideal weight
  document.getElementById('iW').value = tWeight.toFixed(2);
  //amount of kg to lose to get to the ideal BMI
  document.getElementById('tl').value = zToGain.toFixed(2);
}
function cc_changeInputBackColor(zID, zRem, zAdd) {
  var zElem = document.getElementById(zID);
  zElem.classList.remove(zRem);
  zElem.classList.add(zAdd);
}
function cc_dataLoad() {
  var dataToLoad = storageLoad('Calorie Calculator')
  var LSsplit1;
  if (dataToLoad) {
    try {
      LSsplit1 = dataToLoad.split(LS1);
      if (LSsplit1[0] === '0') {
        //if female was selected, change to female now
        cc_swapButton('f', 'm');
        document.getElementById('dh').classList.remove('inputDi');
        document.getElementById('dh').classList.add('inputEn');
      }
      if (LSsplit1[1] === '0') {
        cc_swapButton('in', 'cm');
      }
      if (LSsplit1[2] === '0') {
        cc_swapButton('lb', 'kg');
      }
      document.getElementById('h').value = LSsplit1[3];
      document.getElementById('w').value = LSsplit1[4];
      document.getElementById('a').value = LSsplit1[5];

      document.getElementById('dn').value = LSsplit1[6];
      document.getElementById('dw').value = LSsplit1[7];
      document.getElementById('dh').value = LSsplit1[8];
      if (LSsplit1[9] === '0') {
        cc_swapButton('mn', 'hr');
      }
      document.getElementById('s').value = LSsplit1[10];
      document.getElementById('na').value = LSsplit1[11];
      document.getElementById('la').value = LSsplit1[12];
      document.getElementById('ma').value = LSsplit1[13];
      document.getElementById('ha').value = LSsplit1[14];

      //new bit for the target bodyfat% (2017-03-12)
      if (LSsplit1.length == 17) {
        document.getElementById('tbf').value = LSsplit1[15];
      }
      else {
        if (LSsplit1[0] === '1') {
          document.getElementById('tbf').value = '17.00'; //middle of healthy range for Males.
        }
        else {
          document.getElementById('tbf').value = '26.00'; //+9 Males
        }
      }
    } catch (ex) {//notify of error.
    }
  }
}
function cc_dataSave() {
  var dataToSave =
    document.getElementById('m').value
  + LS1 + document.getElementById('cm').value
  + LS1 + document.getElementById('kg').value

  + LS1 + document.getElementById('h').value
  + LS1 + document.getElementById('w').value
  + LS1 + document.getElementById('a').value

  + LS1 + document.getElementById('dn').value
  + LS1 + document.getElementById('dw').value
  + LS1 + document.getElementById('dh').value

  + LS1 + document.getElementById('hr').value

  + LS1 + document.getElementById('s').value
  + LS1 + document.getElementById('na').value
  + LS1 + document.getElementById('la').value
  + LS1 + document.getElementById('ma').value
  + LS1 + document.getElementById('ha').value

  + LS1 + document.getElementById('tbf').value

  storageSave('Calorie Calculator', dataToSave + LS1);
}
function cc_mClick(zButton) {
  var zButtonID = zButton.id;
  if (zButtonID === 'm') {
    cc_swapButton('m', 'f');
    document.getElementById('dh').classList.remove('inputEn');
    document.getElementById('dh').classList.add('inputDi');
    document.getElementById('tbf').value = (parseFloat(document.getElementById('tbf').value) - 9).toFixed(2);
  } else if (zButtonID === 'f') {
    cc_swapButton('f', 'm');
    document.getElementById('dh').classList.remove('inputDi');
    document.getElementById('dh').classList.add('inputEn');
    document.getElementById('tbf').value = (parseFloat(document.getElementById('tbf').value) + 9).toFixed(2);
  } else {
    convertToggler(zButtonID, zButton);
  }
  cc_calc();
}
function cc_swapButton(zEnable, zDisable) {
  document.getElementById(zEnable).classList.remove('uButtonGrey');
  document.getElementById(zEnable).classList.add('uButtonGreen');
  document.getElementById(zEnable).value = 1;
  document.getElementById(zDisable).classList.remove('uButtonGreen');
  document.getElementById(zDisable).classList.add('uButtonGrey');
  document.getElementById(zDisable).value = 0;
}
function convertToggler(zButtonID, zButton) {
  // 1 cm is 0.39370078740157482544 inches
  if (zButtonID === 'cm' && zButton.classList.contains('uButtonGrey')) {
    cc_swapButton('cm', 'in');
    convertIt('h', 0, 0, 2);
    convertIt('dn', 0, 0, 2);
    convertIt('dw', 0, 0, 2);
    convertIt('dh', 0, 0, 2);
  } else if (zButtonID === 'in' && zButton.classList.contains('uButtonGrey')) {
    cc_swapButton('in', 'cm');
    convertIt('h', 1, 0, 2);
    convertIt('dn', 1, 0, 2);
    convertIt('dw', 1, 0, 2);
    convertIt('dh', 1, 0, 2);
  }
  //1 Kg = 2.20462262184877566540 lb
  if (zButtonID === 'kg' && zButton.classList.contains('uButtonGrey')) {
    cc_swapButton('kg', 'lb');
    convertIt('w', 0, 1, 2);
  } else if (zButtonID === 'lb' && zButton.classList.contains('uButtonGrey')) {
    cc_swapButton('lb', 'kg');
    convertIt('w', 1, 1, 2);
  }
  //next, check for the hours/minutes toggle
  else if (zButtonID === 'hr' && zButton.classList.contains('uButtonGrey')) {
    cc_swapButton('hr', 'mn');
    convertIt('s', 0, 2, 3);
    convertIt('la', 0, 2, 3);
    convertIt('ma', 0, 2, 3);
    convertIt('ha', 0, 2, 3);
  } else if (zButtonID === 'mn' && zButton.classList.contains('uButtonGrey')) {
    cc_swapButton('mn', 'hr');
    convertIt('s', 1, 2, 3);
    convertIt('la', 1, 2, 3);
    convertIt('ma', 1, 2, 3);
    convertIt('ha', 1, 2, 3);
  }
}
function convertIt(zId, multi, zNum, zFixed) {
  if (multi) {
    document.getElementById(zId).value = (document.getElementById(zId).value * zConvert[zNum]).toFixed(zFixed);
  }
  else {
    document.getElementById(zId).value = (document.getElementById(zId).value / zConvert[zNum]).toFixed(zFixed);
  }
}