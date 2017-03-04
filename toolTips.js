function toolTipHide() {
  window.setTimeout(function() {
    toolTipHide2()
  }, 33);
}
function toolTipHide2() {
  if (!overToolTip) {
    toolTipStuffHide();
    tooltipVars = {over:false, was:null, is:null}
    vPup.innerHTML = '';
  }
}
function toolTipStuffHide() {
  window.clearTimeout(pupTimer);
  vPup.style.opacity = vPupc.style.opacity = vPupD.style.opacity = vPupDc.style.opacity = vPupB.style.opacity = 0;
  vPup.style.top = '-' + vPup.offsetHeight + 'px';
  vPupc.style.top = '-' + vPupc.offsetHeight + 'px';
  vPupc.style.width = '0px';
  vPupD.style.top = '-' + vPupD.offsetHeight + 'px';
  vPupDc.style.top = '-' + vPupDc.offsetHeight + 'px';
  vPupB.style.top = '-' + vPupB.offsetHeight + 'px';
}
function toolTipStuffShow() {
  vPup.style.opacity = vPupc.style.opacity = vPupD.style.opacity = vPupDc.style.opacity = 0.9;
}
function toolTipMouseMove(e) {
  if (vPup.style.opacity == 0.9) {
    toolTipSort(tooltipVars.was, true);
  }
}
function toolTipOver(zID) {
  if (tooltipVars.is != zID) {
    var tID = zID.split('_')[1];
    tooltipVars.was = tooltipVars.is = zID;
    ttText = '<span id="pupCapt">' + toolTips[tID] + '</span>';
    pupTimer = window.setTimeout(function() {
      toolTipSort(zID, false);
    }, 400);
  }
}
function toolTipPlace() {
  vPupD.style.left = (mEvent.cX - vPupD.offsetWidth / 2) + 'px';
  //that one is always the same.
  //build it as if it fits up top...
  vPupD.style.top = ((mEvent.cY - vPupD.offsetHeight) - WinPadding) + 'px';
  //-(ztmpDiv.offsetHeight+vPupD.offsetHeight)
  vPupB.style.top = (vPupD.offsetTop + WinPadding) + 'px';
  vPupB.style.height = vPupD.offsetHeight + 'px';
  vPup.style.top = (vPupD.offsetTop - (vPup.offsetHeight - (vPupD.offsetHeight / 1.5))) + 'px';
  var zLeft, zWidth = document.body.offsetWidth;
  if ((mEvent.cX + 2) + (vPup.offsetWidth / 2) > zWidth) {
    zLeft = ((zWidth - 2) - (vPup.offsetWidth));
  } else {
    zLeft = mEvent.cX - (vPup.offsetWidth / 2);
  }
  if (zLeft < 0) {
    zLeft = 1;
  }
  vPup.style.left = zLeft + 'px';
  //vPupB.style.width = ;
  //emulate a border around the square part of the popup, which should marry up with the diamond's border :D
  vPupc.style.left = vPupB.style.left = (vPup.offsetLeft - 1) + 'px';
  vPupc.style.top = (vPup.offsetTop - 1) + 'px';
  vPupc.style.width = vPupB.style.width = vPup.offsetWidth + 'px';
  vPupc.style.height = vPup.offsetHeight + 'px';
  //oddly +1 looks a little better.
  vPupDc.style.left = vPupD.offsetLeft + 'px';
  vPupDc.style.top = vPupD.offsetTop + 'px';
  vPupDc.style.width = vPupD.offsetWidth + 'px';
  vPupDc.style.height = (vPupD.offsetHeight + 1) + 'px';
  //oddly +1 looks a little better.
  //vPupc.style.opacity = vPupD.style.opacity = vPupDc.style.opacity = 1;
  vPupDc.style.border = '1px solid rgba(255,255,255,0.5)';
  vPupDc.style.borderTop = '0px';
  vPupDc.style.borderLeft = '0px';
}
function toolTipShow() {
  if (tooltipVars.is == tooltipVars.was) {
    Opac += 0.2;
    vPup.style.opacity = Opac;
    vPupc.style.opacity = vPupD.style.opacity = vPupDc.style.opacity = Opac - 0.2;
    if (Opac < 0.9) {
      pupTimer = window.setTimeout(function() {
        toolTipShow();
      }, 30);
    } else {
      toolTipStuffShow();
      vPupB.style.opacity = 0.1;
    }
  } else {
    toolTipStuffHide();
  }
}
function toolTipShowNow(e, zID) {
  toolTipMouseMove(e);
  overToolTip = true;
  toolTipOver(zID);
  toolTipSort(zID, false);
  window.clearTimeout(pupTimer);
}
function toolTipSort(whereFrom, showing) {
  if (tooltipVars.is == whereFrom) {
    tooltipVars.was = whereFrom;
    vPup.innerHTML = '<p style="margin:0;padding:0;text-align:center;">' + ttText.replace(/~#/g, '&').replace(/#Q/g, '&quot').replace(/-Q-/g, '\\"') + '</p>';
    //must be here to get around &lt; etc chars being translated into their < chars - happens (I assume) if the string the &lt is injected into is then copied.
    toolTipAddClass(vPup);
    //make each element have the class "ttElem"
    //ToDo:make the transparant half dependant on whether the popup is above or below the thingy :)
    vPupD.style.background = 'linear-gradient(315deg, rgba(0,0,0,1) 36%, rgba(0,0,0,0) 40%)';
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
