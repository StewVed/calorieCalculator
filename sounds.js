function soundPlay(a) {
  if (a) {
    var newSound = audioCtx.createBufferSource();
    var newGain = audioCtx.createGain();
    //specify the sound buffer to use
    newSound.buffer = audioSprite;
    //connect the volume to the audiobuffer
    newSound.connect(newGain);
    //connect the gain to the destination
    newGain.connect(audioCtx.destination);
    //set the (gain) volume of the sound
    newGain.gain.value = soundVol(1);
    //add event when the audio finishes
    newSound.addEventListener('ended', function(){soundEnded(this)})
    //play the sound, specifying when to start and how long to play for
    newSound.start(0, a.aStart, a.aDuration);//  - audioCtx.currentTime
  }
}
function soundEnded(zElem) {
  //this should fire when a buffer has stopped playing.
  //I will use this to play the next word in the sequence...
  /* TODO
    make an array with the words that have to be shown and played.
    eg.
    wordList = [0,1,2]
    for "Which is the"
    now, the bugger is, how do I do the colour and shape?
    multi array?
    might not be needed, since every time will be either,
    "Where is the", or "That is a" or, "Yes. That is the",
    followed by the color of the object,
    followed by the shape of the object.
    Later, I can also add how many of them there are, and make smaller
    versions of the shapes to fit more than one in a slot.

    Would I need this though? I could just set up delayed audiobuffers
    for all of the words. however, if I did that, I wouldn't know when
    
    debugger;

    right, how about copying all of the words into the wordList array?
    wordList[0] = 1;
    wordList[1] = {word:'yes!', start:7, duration:1};
  */
  wordList[0] ++;
  if (wordList[0] < wordList.length) {
    soundPlay(wordList[wordList[0]]);
  }
  else {
    var b = wordList[1];
    resetWordList();
    if (b === 'right') {
      createObjects();
    }
    if (b === 'wrong') {
      userAsk();
    }
  }
}


// example: soundBeep('sine', 500, 1, 100);setTimeout(function(){soundBeep('sine', 750, 1, 100)}, 100);
function soundBeep(type, frequency, volume, duration) {

  //make the entire game queiter.
  //create a HTML5 audio occilator thingy
  var zOscillator = audioCtx.createOscillator();
  //create a HTML5 audio volume thingy
  var zGain = audioCtx.createGain();
  //link the volume to the occilator
  zOscillator.connect(zGain);
  zGain.connect(audioCtx.destination);
  //set up the audio beep to what is needed:
  zOscillator.type = type;
  //default = 'sine' — other values are 'square', 'sawtooth', 'triangle' and 'custom'
  zOscillator.frequency.value = frequency;
  zGain.gain.value = soundVol(volume);
  //start the audio beep, and set a timeout to stop it:
  //zOscillator.start();
  // Wander whether I could to the newer start like above?
  zOscillator.start(0,0,(duration/1000));
  /*window.setTimeout(function() {
    window.setTimeout(function() {
      zOscillator.stop()
    }, 25);
    //stop once the volume is riiiight down.
    zGain.gain.value = 0.001;
    //hopefully stop that cilck at the end that can happen.
  }, duration);
  */
  //default to qurter of a second for the beep if no time is specified
}
function soundVol(num) {
  num *= globVol;  //make the volume comform to the globally set volume
  return (num * .5);  //make it half loud again.
}
