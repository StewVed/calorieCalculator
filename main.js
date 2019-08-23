var zAppVersion = '2019-08-23'
, zAppPrefix = 'cc'
, zRLPercent = 1
, measureTips = '<br><br>Try to keep the measuring tape as horizontal as you can.<br><br>repeat each set of measurements three times. eg. neck, waist, neck, waist, neck, waist for Males. (not neck, neck, neck, waist, waist, waist!)'
, useAsGuide = '<br><br><span style="color:hsl(30, 100%, 33%);">(Use this only as a guide)</span>'
, toolTips = {
  'zDob': 'Designed for 16+<br><br>Enter your date of birth in YYYY-MM-DD (ISO-8601) format.<br>eg, 1987-01-23 for the 23rd of January 1987.'
, 'zNeck': 'Measure just under the Adam&apos; apple, taking care to not include the traps.' + measureTips
, 'zWaist': 'Measure directly over the navel for Males, and a little above the navel for Females.' + measureTips
, 'zHips': 'Measure the biggest rounding of the glutes (bum).' + measureTips
, 'zSitting': '<span style="font-weight:bold;color:hsl(240, 100%, 33%)">This is automatically calculated by taking all of other activities out of a full day.</span><br><br>This activity level includes:<ul><li>relaxing</li><li>sitting or reclining</li><li>standing still, quietly</li><li>reading</li><li>listening to music (Not dancing)</li><li>desk work.</li></ul>'
, 'zLight': 'This activity level includes:<ul><li>light housework</li><li>walking</li><li>fidgeting</li><li>slow swimming</li></ul>'
, 'zMedium': 'This activity level includes:<ul><li>hoovering</li><li>normal swimming</li><li>jogging</li></ul>'
, 'zHeavy': 'This is High-intensity activity like:<ul><li>lifting weights</li><li>sprinting</li><li>very hard work</li></ul>Add only the time doing the work.<br>eg. 30 minutes weight training may only be around 5 minutes of actual lifting time. '
, 'zBFat': 'This uses the US Navy&apos;s calculation for body fat percentage, which is apparently within 3% accuracy when measurements are properly taken.' + measureTips
, 'zTBF': 'Specify what Body-Fat percentage you would like to be.<br><br>As a rough guide, healthy body fat ranges are:<br>Males between 12% and 22%,<br>Females between 21% and 31%'
, 'ziWeight': 'Calculated using your specified Target Body-Fat percentage, with your Lean Body Mass remaining the same.<br><br>(strength training can minimise muscle-loss during losing weight.)'
, 'ziWaist': 'An <span style="font-style:italic;font-weight:bold;">average</span> adult&apos;s ideal waist measurement is simply half their height :-)' + useAsGuide
, 'zCals': 'Your daily maintenance calorie requirement.<br><br>' + 'Use this amount of calories to keep your current weight.<br><br>' + 'This should be a quite accurate amount, since you customised your activity-levels.'
, 'zTargCals': 'Your target Calorie intake is 20% difference of your maintenance calories.<br><br>' + '20% is an average between fast weight loss which is hard but takes less time, and slow weight loss which is easy but takes a long time.'
, 'zToLose': 'Simply the difference between your current weight and your target weight.' + useAsGuide
, 'zToGoal': 'Assuming an average of 0.7kg per week, this is how many weeks it would take to reach your target weight.'
}
, zConvert = [0.39370078740157482544, 2.20462262184877566540, 60]
, gameVars = {
    go: 0
  }
;

/*
  ToDo: change toolTip wording for Target Calories (zTargCals) and Weeks to Target (zToGoal).
  also make the target calories raise and lower treaking dynamic - say 10% or maintenance instead of just 200.
*/

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

  This is from 2002-11-05

  (All circumference and height measurements are in inches.)
  Males: % body fat = 86.010  x log10(abdomen - neck)   -   70.041 x log10(height) + 36.76
Females: % body fat = 163.205 x log10(waist + hip - neck) - 97.684 x log10(height) - 78.387

*/

function initContent() {
  var butLeft = 'style="width:15%"'
  , butRight = 'style="width:15%;"'
  ;
  var stuff =
  '<div id="cont">'
  + '<div style="background:lightgreen;overflow:hidden;padding-top:4px;text-align:center;">'
    + '<button id="m" type="button" class="uButtonLeft uButtons uButtonGreen uB15" value="1">Male</button>'
    + '<button id="f" type="button" class="uButtons uButtonGrey uButtonRight uB15" value="0">Female</button>' //default

    + '<button id="kg" type="button" class="uButtonLeft uButtons uButtonGreen uB15" value="1">Kg</button>'
    + '<button id="lb" type="button" class="uButtons uButtonGrey uButtonRight uB15" value="0">lb</button>' //default

    + '<button id="cm" type="button" class="uButtonLeft uButtons uButtonGreen uB15" value="1">cm</button>'
    + '<button id="in" type="button" class="uButtons uButtonGrey uButtonRight uB15" value="0">inch</button>' //default
    //Height, Weight, and Date of Birth:
    + '<div style="clear:both;float:left;width:calc(12.5% - 4.5px);margin:0;padding:3px;"></div>'
    + '<div class="conty c4">Height'
      + '<input type="text" id="h" class="editEnable inputThingy inputEn" value="176.5">' //176
    + '</div>'

    + '<div class="conty c4">Weight'
      + '<input type="text" id="w" class="editEnable inputThingy inputEn" value="77.50">' //82
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_zDob" class="toolTipclass">DOB</div>'
      + '<input type="text" id="a" class="editEnable inputThingy inputEn" value="1987-01-23">'
    + '</div>'
    //Next are the neck, waist, and hips measurements for the Body Fat calculation.
    + '<div style="clear:both;float:left;width:calc(12.5% - 4.5px);margin:0;padding:3px;"></div>'
    + '<div class="conty c4">'
      + '<div id="_zNeck" class="toolTipclass">Neck</div>'
      + '<input type="text" id="dn" class="editEnable inputThingy inputEn" value="37.35">' //176
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_zWaist" class="toolTipclass">Waist</div>'
      + '<input type="text" id="dw" class="editEnable inputThingy inputEn" value="94.55">' //82
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_zHips" class="toolTipclass">Hips&nbsp;(female)</div>'
      + '<input type="text" id="dh" class="editEnable inputThingy inputDi" value="118.75">'
    + '</div>'
  + '</div>'

  //Activity stuff to make the calorie calculation much more accurate.
  + '<div style="background:lightsalmon;overflow:hidden;">'
    + '<div style="clear:both;float:left;width:100%;text-align:center;margin-top:5px;">Activity per day'
      + '<button id="hr" type="button" class="uButtons uButtonGreen uButtonLeft uB15" value="1">hrs</button>'
      + '<button id="mn" type="button" class="uButtons uButtonGrey uButtonRight uB15" value="0">mins</button>' //default
    + '</div>'

    + '<div class="conty c5">Sleep'
      + '<input type="text" id="s" class="editEnable inputThingy inputEn" value="8">'
    + '</div>'

    + '<div class="conty c5">'
      + '<div id="_zSitting" class="toolTipclass">Sitting</div>'
      + '<input type="text" id="na" class="editDisable inputThingy inputDi" value="15.13">'
    + '</div>'

    + '<div class="conty c5">'
      + '<div id="_zLight" class="toolTipclass">light</div>'
      + '<input type="text" id="la" class="editEnable inputThingy inputEn" value="0.75">'
    + '</div>'

    + '<div class="conty c5">'
      + '<div id="_zMedium" class="toolTipclass">Medium</div>'
      + '<input type="text" id="ma" class="editEnable inputThingy inputEn" value="0.05">'
    + '</div>'

    + '<div class="conty c5">'
      + '<div id="_zHeavy" class="toolTipclass">Heavy</div>'
      + '<input type="text" id="ha" class="editEnable inputThingy inputEn" value="0.07">'
    + '</div>'
  + '</div>'

  //Results!
  + '<div style="clear:both;border-top:10px double;background-color:lightblue;overflow:hidden;box-sizing:border-box;">'
    + '<div class="conty c4">'
      + '<div id="_zBFat" class="toolTipclass">Body&nbsp;Fat&nbsp;%</div>'
      + '<input type="text" id="bf" class="editEnable inputThingy inputEn" value="0000">'
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_zTBF" class="toolTipclass">Target&nbsp;BF%</div>'
      + '<input type="text" id="tbf" class="editEnable inputThingy inputEn" value="17.00">'
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_ziWeight" class="toolTipclass">Target&nbsp;weight</div>'
      + '<input type="text" id="iW" class="editEnable inputThingy inputEn" value="00.00">'
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_ziWaist" class="toolTipclass">Ideal&nbsp;waist</div>'
      + '<input type="text" id="d" class="editEnable inputThingy inputEn" value="00.00">'
    + '</div>'

    //+ '<div style="clear:both;float:left;width:calc(12.5% - 4.5px);margin:0;padding:3px;"></div>'
    + '<div class="conty c4">'
      + '<div id="_zCals" class="toolTipclass">Maint&nbsp;calories</div>'
      + '<input type="text" id="c" class="editEnable inputThingy inputEn" value="0000">'
    + '</div>'

    + '<div class="conty c4">'
      + '<div  id="_zTargCals" class="toolTipclass">Target&nbsp;calories</div>'
      + '<input type="text" id="cl" class="editEnable inputThingy inputEn" value="0000">'
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_zToLose" class="toolTipclass">Lose&nbsp;target</div>'
      + '<input type="text" id="tl" class="editEnable inputThingy inputEn" value="00.00">'
    + '</div>'

    + '<div class="conty c4">'
      + '<div id="_zToGoal" class="toolTipclass">Weeks&nbsp;to&nbsp;target</div>'
      + '<input type="text" id="tg" class="editEnable inputThingy inputEn" value="00.00">'
    + '</div>'
  + '</div>'

+ '</div>'
  ;
  return stuff;
}




function runApp() {
  cc_dataLoad();
  cc_calc();
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

  //calculate how many calories to add/remove if weight changes too much/little:
  zRLPercent = Math.round(totCals * .1);
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

  //2019-08-15 change from just using NICE recommended 600 cals to % of maintenance cals
  //first pass just use 20% - still better than the bog-standard 600 cals!
  /*
    ToDo: user-editable % with info on pros Vs. cons of higher and lower %s.
    Generally this is:
    lower percentages are easier, but it will take longer. Also more muscle mass is kept.
    Higher percentages are tougher, but it will be shorter. Also more muscle mass is lost.
    Either way, strength training can help keep more muscle mass while dieting.
    Eating a bit more protein can also help.
    Perhaps a volume-control style slider say from 5% - 30% ?
    The bugger in that is where would I put the slider?
    in the tooltip would be good for space, though perhaps it is time
    to split the parts of the calculator into three 'screens'?
  */
  tCals = (totCals * .2);

  // for the wording in Weeks to Target tooltip:
  var w1 = 'increase', w2 = 'decrease';

  // Give a little leeway for the target weight; 100g for now.
  if (zToGain > 0.1) {
    tCals = -tCals;
    document.getElementById('_zToLose').innerHTML = 'Lose&nbsp;target';
  } else if (zToGain < -0.1){
    w1 = 'decrease', w2 = 'increase';
    zToGain = -zToGain;
    document.getElementById('_zToLose').innerHTML = 'Gain&nbsp;target';
  } else {
    tCals = 0;
    document.getElementById('_zToLose').innerHTML = 'Target&nbsp;Achieved!';
  }
  //add target cals to the maintenance cals for target cals per day.
  document.getElementById('cl').value = Math.round(totCals + tCals);

  /*  amount of time it'd take to get to the ideal weight:
    I will make the assumption that losing 1kg of weight takes 7000 calories.
    I've seen many articles saying 3500 cals per lb or 7700 per kg

    I very much doubt this for real-world weight loss, because my last diet
    started at a weight of 83.0kg, and ended 215 days later at 67.3kg.
    In that time, I maintained a target calorie defecit of ~500cals though my
    average defecit ended up around 322 cals.
    My estimated total calorie defecit over the 215 days was -69309.

    83.0-67.3 = 15.7kg lost in total.
    69309/15.7 = 4414.586 calories per kg lost... well that is about half!

    Just to be clear, I recalculated my maintenance (required) and target calories every week,
    because as I lost weight, my required calories will decrease.

    Also, I've read some research into this that suggests that the amount of
    calories it takes to lose a kg depends on body composition - the more
    body fat % a person has, the more weight is lost will be from fat, as
    opposed to lean mass, glycogen, water, etc.

    This makes sense because if your body is say 50% fat, more of the 'weight'
    lost will be fat, but if your body is 10% fat, then it is much more likely
    that only a little of your weight loss will be from fat.

    (from https://www.nature.com/articles/0803720) - I spent the day looking
    around at various articles..
    The metabolizable energy densities of body:
    glycogen 17.6 MJ/kg
    protein  19.7 MJ/kg
    fat      39.5 MJ/kg

    another article says 7.6 MJ/kg for lean tissue, though same as above for fat

    The usual 3500cals/lb is 32.2 MJ/kg, and so takes an average of
    what of the body is metabolised to make up for a calorie defecit, but it is only an
    average, and only works for women around 80-100kg in weight as far as I can
    estimate, and even then the women's age, height, REE, etc. weren't there.

    Interestingly, I cannot find much info about males vs females though one of
    these articles says that because males have less body fat % than females,
    then the males would lose slightly less fat at the same height/weight/age/activity.

    I agree with this since that is also evident in the mifflin st. Joan REE calculation.
    Males and Females are slightly different.

    another one: https://www.cambridge.org/core/journals/british-journal-of-nutrition/article/body-fat-and-fatfree-mass-interrelationships-forbess-theory-revisited/E4058619DF9042AB22DF2CF7B0A88152
  */

  /*
    Also toDo:
    change to Days to target when weeks are < 2 or so?
    How about months or years going the other way?
  */
  document.getElementById('tg').value = Math.round(zToGain / .7);


  //Gains n Losses for the Weeks to Total tooltip
  var GnL = {a:'0.7kg',b:'1kg',c:'0.5kg'};
  //convert kg back to lb, cm back to inch if needed:
  if (!zKg) {
    zToGain *= zConvert[1];
    tWeight *= zConvert[1];
    GnL = {a:'1.5 lb',b:'2 lb',c:'1 lb'};
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

  //update the tooltip with the new calorie amount.
  toolTips.zToGoal =
  'Assuming an average of '+GnL.a+' per week, this is how many weeks it would take to reach your target weight.<br><br>'
  + 'Everybody is different, and though this calculator should be more accurate than most available, your individual body-type, metabolism, etc. may differ from the average.<br><br>'
  + 'If your weight '+w2+'s more than '+GnL.b+' a week, use your activity levels to '+w1+' your maintenance calories by ' + zRLPercent + '<br><br>'
  + 'If your weight '+w2+'s  less than '+GnL.c+' a week, use your activity levels to '+w2+' your maintenance calories by ' + zRLPercent
;

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