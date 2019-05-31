
// TYPOGRAPGIC SLIDERS:
function updateSize(c,t) {
  var currclass = document.getElementsByClassName(c)[0];
  var trgtclass = document.getElementsByTagName(t)[0];
  var v = currclass.getElementsByClassName("sizeInput")[0].value;
  trgtclass.style.fontSize = v + "px"; // update value
  currclass.getElementsByClassName("sizeLabel")[0].innerHTML = v; // update label
  // update line height upon size update
  var updatedHeight = +v + +3;
  trgtclass.style.lineHeight = updatedHeight + "px"; // update value
  currclass.getElementsByClassName("heightLabel")[0].innerHTML = updatedHeight; // update label
  currclass.getElementsByClassName("heightInput")[0].value = updatedHeight;
}

function updateSpacing(c,t) {
  var currclass = document.getElementsByClassName(c)[0];
  var trgtclass = document.getElementsByTagName(t)[0];
  var v = currclass.getElementsByClassName("spacingInput")[0].value;
  trgtclass.style.letterSpacing = v + "px"; // update value
  currclass.getElementsByClassName("spacingLabel")[0].innerHTML = v; // update label
}

function updateHeight(c,t) {
  var currclass = document.getElementsByClassName(c)[0];
  var trgtclass = document.getElementsByTagName(t)[0];
  var v = currclass.getElementsByClassName("heightInput")[0].value;
  trgtclass.style.lineHeight = v + "px"; // update value
  currclass.getElementsByClassName("heightLabel")[0].innerHTML = v; // update label
}

/// COLORS:

// B&W INVERT
function colorinvert(){
  if (document.body.style.getPropertyValue('--bg-color') != "#232323"){
    document.body.style.setProperty('--bg-color' , "#232323" );
    document.getElementsByClassName('block1')[0].style.backgroundColor = "#0e0d0d";
    document.body.style.setProperty('--element-color' , "#f7f6f4" );
    $("#showall").attr('src','data/hexiconW.png')
  } else {
    document.body.style.setProperty('--bg-color' , "#f7f6f4" );
    document.getElementsByClassName('block1')[0].style.backgroundColor = "white";
    document.body.style.setProperty('--element-color' , "#232323" );
    $("#showall").attr('src','data/hexicon.png')
  }
}



// note: In chrome apps, Content Security Policy does not allow inline javascript.
// https://stackoverflow.com/questions/36324333/refused-to-execute-inline-event-handler-because-it-violates-csp-sandbox/36349056
