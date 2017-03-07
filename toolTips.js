function toolTipHide() {
  window.setTimeout(function() {
    toolTipHide2()
  }, 33);
}
function toolTipHide2() {
  if (!tooltipVars.over) {
    tooTipTimerClear();
    vPup.innerHTML = '';
    toolTipStuffHide();
    tooltipVars = {opac:0, over:false, was:null, is:null, text:'', timer:null};
  }
}
function toolTipStuffHide() {
  vPup.style.top = -(vPup.offsetHeight + 20) + 'px';
  vPupc.style.top = -vPupc.offsetHeight + 'px';
  vPupD.style.top = -vPupD.offsetHeight + 'px';
  vPupDc.style.top = -vPupDc.offsetHeight + 'px';
  vPupB.style.top = -vPupB.offsetHeight + 'px';
  vPup.style.opacity = vPupc.style.opacity = vPupD.style.opacity = vPupDc.style.opacity = vPupB.style.opacity = 0;
}
function toolTipStuffShow() {
  vPup.style.opacity = vPupc.style.opacity = vPupD.style.opacity = 1;
}
function toolTipMouseMove(e) {
  if (vPup.style.opacity == 1) {
    toolTipSort(tooltipVars.was, true);
  }
}
function toolTipOver(zID) {
  if (tooltipVars.is != zID) {
    var tID = zID.split('_')[1];
    tooltipVars.was = tooltipVars.is = zID;
    tooltipVars.text = '<span id="pupCapt">' + toolTips[tID] + '</span>';
    if (!tooltipVars.timer) {
      tooltipVars.timer = window.setTimeout(function() {
        toolTipSort(zID, false);
      }, 400);
    }
  }
}
function toolTipPlace() {
  //move the tooltip to the left to make sure it has the most amount of room.
  vPup.style.left = 0;
  vPupD.style.left = (mouseVars.current.x - vPupD.offsetWidth / 2) + 'px';
  var zLeft = 0
  , zWidth = document.body.offsetWidth;
  if ((mouseVars.current.x) + (vPup.offsetWidth * .33) > zWidth) {
    zLeft = (zWidth  - vPup.offsetWidth);
  } else {
    zLeft = mouseVars.current.x - (vPup.offsetWidth * .66);
  }
  if (zLeft < 0) {
    zLeft = 0;
  }
  vPup.style.left = zLeft + 'px';

  vPupD.style.top = (mouseVars.current.y - vPupD.offsetHeight - 5) + 'px';
  vPupB.style.top = vPupD.offsetTop + 'px';
  vPupB.style.height = vPupD.offsetHeight + 'px';
  var zTop = vPupD.offsetTop + (vPupD.offsetHeight * .5);
  //debugger;
  zTop -= vPup.offsetHeight;
  //check if there is enough room at the top to show the tooltip
  if (zTop < 0) {
    //try placing the tooltip below the pointer instead of above
    vPupD.style.top = mouseVars.current.y + 5 + 'px';
    //now place the tooltip half-on the diamond arrow:
    zTop = vPupD.offsetTop; + (vPupD.offsetHeight * .5);
    vPupD.classList.remove('pupDB');
    vPupD.classList.add('pupDA');
    vPupDc.classList.remove('pupDcB');
    vPupDc.classList.add('pupDcA');
    vPupDc.style.opacity = 0.3;
  }
  else {
    vPupD.classList.remove('pupDA');
    vPupD.classList.add('pupDB');
    vPupDc.classList.remove('pupDcA');
    vPupDc.classList.add('pupDcB');
    vPupDc.style.opacity = 0.6;
  }
  vPup.style.top = zTop + 'px';
  //emulate a border around the square part of the popup, which should marry up with the diamond's border :D
  vPupc.style.left = vPupB.style.left = (vPup.offsetLeft - 1) + 'px';
  vPupc.style.top = (vPup.offsetTop - 1) + 'px';
  vPupc.style.width = vPupB.style.width = vPup.offsetWidth + 'px';
  vPupc.style.height = vPup.offsetHeight + 'px';
  vPupDc.style.left = vPupD.offsetLeft + 'px';
  vPupDc.style.top = vPupD.offsetTop + 'px';
  vPupDc.style.width = vPupD.offsetWidth + 'px';
  vPupDc.style.height = (vPupD.offsetHeight) + 'px';
}
function toolTipShowNow(e, zID) {
  toolTipMouseMove(e);
  tooltipVars.over = true;
  toolTipOver(zID);
  toolTipSort(zID, false);
  tooTipTimerClear();
}
function tooTipTimerClear() {
  window.clearTimeout(tooltipVars.timer);
  tooltipVars.timer = null;
}
function toolTipSort(whereFrom, showing) {
  if (tooltipVars.is == whereFrom) {
    tooltipVars.was = whereFrom;
    vPup.style.width = '100%';
    vPup.style.left = 0;
    vPup.innerHTML = '<p style="margin:0;padding:0;text-align:center;">' + tooltipVars.text.replace(/~#/g, '&').replace(/#Q/g, '&quot').replace(/-Q-/g, '\\"') + '</p>';
    //must be here to get around &lt; etc chars being translated into their < chars - happens (I assume) if the string the &lt is injected into is then copied.
    //make each element have the class "ttElem"
    toolTipAddClass(vPup);
    vPup.style.width = null;
    toolTipPlace();
    if (!showing) {
      toolTipStuffShow();
    }
  } else if (!showing) {
    toolTipStuffHide();
  }
}
function toolTipAddClass(zElem) {
  var zChildList = zElem.children;
  for (var zChilds = 0; zChilds < zChildList.length; zChilds++) {
    if (zChildList[zChilds].nodeName.toLowerCase() != 'br') {
      zChildList[zChilds].classList.add('ttElem');
    }
    if (zChildList[zChilds].childElementCount > 0) {
      toolTipAddClass(zChildList[zChilds]);
    }
  }
}
