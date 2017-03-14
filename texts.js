var zAll = '<span class="B'
  , zNew = zAll + ' Bl">New Stuff: </span>'
  , zImp = zAll + ' Gr">Improvement: </span>'
  , zBug = zAll + ' Re">Bug-Fix: </span>'
  , zDev = zAll + ' Or">Development: </span>'




var appCL =
  '<p class="B C">TODO</p> ' +
  '<ul><li>Tooltips should be scrollable if the content exceeds the available space.' +
  '</li></ul>' +
  'If you find a bug, or have a suggestion, please let me know at ' +
  '<a class=ubLink href="https://github.com/StewVed/calorieCalculator/issues" target=_blank>GitHub Issues</a>' +
  '<hr>' +
  '<p class="B C">14th March 2017</p> ' +
  '<ul><li>' + zImp + '(Not yet tested) calculator should move above an on-screen keyboard now, and make sure that where you are editing stays on the screen.' +
  '</li><li>' + zDev + 'Ripped out the service worker activated events that simply never fire, and replaced with localStoage version checking.' +
  '</li></ul>' +
  '<hr>' +
  '<p class="B C">13th March 2017</p> ' +
  '<ul><li>' + zNew + 'Replaced outdated and inaccurate (for non-average body-types) BMI, by universally more accurate Target Body Fat.' +
  '</li><li>' + zImp + 'Many small UI improvements.' +
  '</li><li>' + zImp + 'Tooltips should now be placed on whichever half has more space.' +
  '</li><li>' + zDev + 'Yet another go at getting the app let the user know when the app has successfully updated.' +
  '</li></ul>' +
  '<hr>' +
  '<p class="B C">8th March 2017</p> ' +
  '<ul><li>' + zImp + 'Tooltip tweaked quite a bit, and it&apos;s smooth fade-in was re-added.' +
  '</li><li>' + zImp + 'Greyed out Hips input for males as hips measurement is only used for females.' +
  '</li><li>' + zBug + 'Ignored resize calls when an input is focused. (likely caused from device&apos;s on-screen keyboards).' +
  '</li><li>' + zBug + 'Added the Neck, Waist, and Hips inputs to the inch/cm converter (fool... forgot!).' +
  '</li><li>' + zBug + 're-added code for letting the user know if the app has been updated, and user will see the new version after restarting the app.' +
  '</li><li>' + zBug + 'app font can get bigger again after not enough hight makes the font smaller.' +
  '</li></ul>' +
  '<hr>' +
  '<p class="B C">7th March 2017</p> ' +
  '<ul><li>' + zNew + 'Date Of Birth implemented for age. This makes for more accurate age, since you no longer have to keep updating it yourself as time goes by.' +
  '</li><li>' + zNew + 'As a little bonus and double check, your calculated age is shown by DOB. to 2 decimal points' +
  '</li><li>' + zNew + 'Finally got round to making the app it&apos;s own Favicon!' +
  '</li><li>' + zImp + 'The settings <q>hamburger</q> button now has an opaque background, so it can be seen more easily.' +
  '</li><li>' + zImp + 'font scaling is back to being the entire app, including <q>toast</q> popups, and settings.' +
  '</li><li>' + zImp + 'make the gradients more pronounced on the inputs. (rounded backgrounds).' +
  '</li><li>' + zImp + 'A bit more work to the tooltip system, and also improved tooltip descriptions here and there.' +
  '</li><li>' + zBug + 'fixed an issue with the <q>toast</q> popup, where we could not click any buttons.' +
  '</li><li>' + zDev + 'Tab and Return/enter should now remove input focus. Hopefully this will close on-screen keyboards on mobile devices.' +
  '</li></ul>' +
  '<hr>' +
  '<p class="B C">5th March 2017</p> ' +
  '<ul><li>' + zNew + 'Tooltips now functional (styled like the input windows)' +
  '</li><li>' + zImp + 'Hopefully, if the available screen area isn&apos;t high enough, the app will scale smaller until it does fit.' +
  '</li></ul>' +
  '<hr>' +
  '<p class="B C">4th March 2017</p> ' +
  '<ul><li>' + zNew + 'Added Body-Fat calculation (US Navy 2012).' +
  '</li><li>Tooltips not quite implemented from adapting the code from my Webtop. that is next I hope!'
  '</li></ul>' +
  '<hr>' +
  '<p class="B C">3rd March 2017</p> ' +
  '<ul><li>' + zNew + 'Made the app stand-alone, Open Source, and put it on GitHub.' +
  '</li><li>' + zDev + 'Used my latest Development code from my Toddlearner project as the base, so this app can be used offline and just like a native app.' +
  '</li></ul>' +
  '<hr>' +
  'Earlier development (from a year or two ago) was as a part of my Webtop.'
;


var appBugs =
  '<h1 style=text-align:center;margin-bottom:0;font-size:1.25em>StewVed\'s standard notice:</h1>' +
  '<p style=text-align:center;color:red;margin-top:0;line-height:1.5em;>' +
    'Warning: May contain Bugs!<br>' +
    'Cannot guarantee Bug free!<br>' +
    'Produced on a system where Buggy products are also made!' +
  '</p>';

var appAbout =
  '<img alt="The Author" src=images/StewVed.jpg style=float:left;' +
  'border-radius:0.7em;width:33%;margin-top:0.8em;margin-right:.3em;margin-bottom:.1em;>' +
  '<p>' +
    'Stewart Robinson (StewVed) was born in the United Kingdom, in the' +
    ' late 1970\'s.' +
  '</p>' +
  '<p>' +
    'He learned just about everything he knows about HTML/CSS/JavaScript' +
    ' programming from <a class=ubLink href=http://www.w3schools.com target=_blank>W3Schools</a>' +
  '</p>' +
  '<p>' +
    'He is a PC Gamer at heart, and though he generally games on Windows,' +
    ' he also uses GNU/Linux based Operating systems.' +
  '</p>' +
  '<br style=clear:both>' +
  '<hr>' + appBugs;
