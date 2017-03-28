var gs = 'https://stewved.github.io/globalscripts/'

, fileList = [
    //first add the scripts that are common to my projects
    //there is no problem with CORS cos tis the same origin :)
    //Later, once most of the bugs are fixed, and features done,
    //just lob everything in to one file for ease of downloading.
    [gs , 'gevents', 'js']
  , [gs , 'gtexts', 'js']
  , [gs , 'initialize', 'js']
  , [gs , 'inputs', 'js']
  , [gs , 'settings', 'js']
  , [gs , 'sounds', 'js']
  , [gs , 'storage', 'js']
  , [gs , 'toolTips', 'js']
  //now add the scripts that are just for this app
  , ['' , 'events', 'js']
  , ['' , 'main', 'js']
  , ['' , 'texts', 'js']
]


//now load the actual loader file from the globalscripts:
var a = document.createElement('script');
a.src = gs + 'loader.js';
document.head.appendChild(a);
//This loader file will then load all of the files in the list above,
//then call Init(); once all flies have loaded.