/*
function toolTipAddEvents(WinNo) {
	zDivs = document.getElementById(WinNo).getElementsByClassName('toolTipclass');
	if (isNaN(WinNo)) {
		WinNo = 0;
	}

	if (zDivs.length > 0) {
		var zAm = zDivs.length;
		for (var x = 0; x < zAm; x++) {
			//recode these to have built-in stuff... from mousemove/down/up (which should also do touch.
			//zDivs[x].addEventListener('mouseover',function(){overToolTip=true;toolTipOver(WinNo,this.id);}, false);
			//zDivs[x].addEventListener('touchstart',toolTipMouseMove, false);
			//zDivs[x].addEventListener('touchstart',function(){overToolTip=true;toolTipOver(WinNo,this.id);toolTipSort(WinNo, this.id, false);}, false);
			//zDivs[x].addEventListener('mousedown',function(){toolTipSort(WinNo, this.id, false);}, false);
			//zDivs[x].addEventListener('mousemove',toolTipMouseMove, false);
			//zDivs[x].addEventListener('mouseout',function(){overToolTip=false;toolTipHide(WinNo);}, false);
		}
	}
}
*/
function toolTipHide(WinNo) {
  if (WinMenu.active != 'Quick') {
    window.setTimeout(function() {
      toolTipHide2(WinNo)
    }, 10);
  }
}
function toolTipHide2(WinNo) {
  if (overToolTip) {
    return;
  }
  toolTipStuffHide(WinNo);
  stillthere = '';
  vPup.innerHTML = '';
}
function toolTipStuffHide(WinNo) {
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
  var WinNo = parseFloat(Win_mAction(e).id);
  if (isNaN(WinNo)) {
    return;
  }
  if (vPup.style.opacity == 0.9) {
    toolTipSort(WinNo, whereFrom, true);
  }
}
function toolTipOver(WinNo, zID) {
  //2015-03-28 addition/change cos Google Closure doesn't respect single and double quotes :/
  //sure, how I am/was using them might not have been standard, but still, every browser was fine with it!
  if ((stillthere != zID) && isFinite(WinNo)) {
    var tID = zID.split('_')[1];
    var tT = WinMan[WinNo].toolTips[tID];
    whereFrom = stillthere = zID;
    ttText = '<span id="pupCapt">' + tT + '</span>';
    pupTimer = window.setTimeout(function() {
      toolTipSort(WinNo, zID, false);
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
  var zLeft, zWidth = document.getElementById('Wallpaper').offsetWidth;
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
function toolTipShow(WinNo) {
  if (stillthere == whatWas) {
    Opac += 0.2;
    vPup.style.opacity = Opac;
    vPupc.style.opacity = vPupD.style.opacity = vPupDc.style.opacity = Opac - 0.2;
    if (Opac < 0.9) {
      pupTimer = window.setTimeout(function() {
        toolTipShow(WinNo);
      }, 30);
    } else {
      toolTipStuffShow();
      vPupB.style.opacity = 0.1;
    }
  } else {
    toolTipStuffHide(WinNo);
  }
}
function toolTipShowNow(e, WinNo, zID) {
  toolTipMouseMove(e);
  overToolTip = true;
  toolTipOver(WinNo, zID);
  toolTipSort(WinNo, zID, false);
  window.clearTimeout(pupTimer);
}
function toolTipSort(WinNo, whereFrom, showing) {
  if (stillthere == whereFrom) {
    whatWas = whereFrom;
    vPup.innerHTML = '<p style="margin:0;padding:0;text-align:center;">' + ttText.replace(/~#/g, '&').replace(/#Q/g, '&quot').replace(/-Q-/g, '\\"') + '</p>';
    //must be here to get around &lt; etc chars being translated into their < chars - happens (I assume) if the string the &lt is injected into is then copied.
    toolTipAddClass(vPup);
    //make each element have the class "ttElem"
    //ToDo:make the transparant half dependant on whether the popup is above or below the thingy :)
    vPupD.style.background = 'linear-gradient(315deg, rgba(0,0,0,1) 36%, rgba(0,0,0,0) 40%)';
    toolTipPlace();
    if (!showing) {
      toolTipStuffShow();
      //Opac = 0;
      //pupTimer = window.setTimeout(function(){toolTipShow(WinNo);}, 30)
    }
  } else if (!showing) {
    toolTipStuffHide(WinNo);
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
