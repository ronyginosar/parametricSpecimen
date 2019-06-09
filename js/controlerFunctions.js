
// TYPOGRAPGIC SLIDERS:
function updateSize(c,t) {
  var currclass = document.getElementsByClassName(c)[0];
  var trgtclass = document.getElementsByTagName(t)[0];
  var v = currclass.getElementsByClassName("sizeInput")[0].value;
  trgtclass.style.fontSize = v + "px"; // update value
  var temp = document.getElementsByTagName('h2')[0].style.fontSize;
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

// PARAM SLIDERS FOR TUNER

function updateWght(c,t) {
  var currclass = document.getElementsByClassName(c)[1];
  var trgtclass = document.getElementsByClassName(t)[0];
  var v = currclass.getElementsByClassName("wghtParam")[0].value;
  trgtclass.style.fontVariationSettings = '"wght"' + v; // update value
  // currclass.getElementsByClassName("wghtLabel")[0].innerHTML = v; // update label
  updateText('"wght"' + v , 0);
}

function updateCtrs(c,t) {
  var currclass = document.getElementsByClassName(c)[1];
  var trgtclass = document.getElementsByClassName(t)[0];
  var v = currclass.getElementsByClassName("ctrsParam")[0].value;
  trgtclass.style.fontVariationSettings = '"ctrs"' + v; // update value
  // currclass.getElementsByClassName("ctrsLabel")[0].innerHTML = v; // update label
  updateText('"ctrs"' + v , 1);
}

function updateStyl(c,t) {
  var currclass = document.getElementsByClassName(c)[1];
  var trgtclass = document.getElementsByClassName(t)[0];
  var v = currclass.getElementsByClassName("stylParam")[0].value;
  trgtclass.style.fontVariationSettings = '"styl"' + v; // update value
  // currclass.getElementsByClassName("stylLabel")[0].innerHTML = v; // update label
  updateText('"styl"' + v , 2);
}

// var c ="";

function updateText(change , idx){
  var currSettings = document.body.style.fontVariationSettings;
  if(currSettings != "normal"){
    var varlist = currSettings.split(",");
    varlist[idx] = change;
    document.body.style.setProperty('font-variation-settings' , varlist.join() );
    document.getElementsByClassName("tuner")[0].style.setProperty('font-variation-settings' , varlist.join() );  //TODO
  } else {
    document.body.style.setProperty('font-variation-settings' , change );
    document.getElementsByClassName("tuner")[0].style.setProperty('font-variation-settings' , change );  //TODO

  }
  // format: "wght" 40, "ctrs" 1, "styl" 1;

  // LOG AND TAG
  currSettings = document.body.style.fontVariationSettings;
  logManager("changed params using tuner slider: " + change);
  logManager("current params are: " + currSettings); //TODO
  updateSettingsTag(currSettings);
  // c = change;
}

// $(".tuner .styleslider").mouseout(function(e){
// document.getElementsByClassName("tuner styleslider")[0].addEventListener("mouseleave",function(){
// document.getElementsByClassName("tuner styleslider")[0].addEventListener("mouseup",function(){
//   console.log("input event fired");
  // var currSettings = document.body.style.fontVariationSettings;
  // logManager("changed params using tuner slider: " + c);
  // logManager("current params are: " + currSettings); //TODO
  // updateSettingsTag(currSettings);
// }, false);

// .addEventListener("input", function() {
//     console.log("input event fired");
// }, false);


/// COLORS:

// B&W INVERT
function colorinvert(){
  if (document.body.style.getPropertyValue('--bg-color') != "#f7f6f4"){
    // CHANGE TO W
    document.body.style.setProperty('--bg-color' , "#f7f6f4" );
    // document.getElementsByClassName('block1')[0].style.backgroundColor = "white";
    // document.getElementsByClassName('tuner')[0].style.backgroundColor = "white";
    document.body.style.setProperty('--element-color' , "#191919" );
    $("#showall").attr('src','data/hexicon.png');
    $("#downloadIcon").attr('src','data/downloadIcon.png');
  } else {
    // CHANGE TO B
    document.body.style.setProperty('--bg-color' , "#191919" );
    // document.getElementsByClassName('block1')[0].style.backgroundColor = "#0e0d0d";
    // document.getElementsByClassName('tuner')[0].style.backgroundColor = "#0e0d0d";
    // document.getElementsByTagName('h1')[0].style.backgroundColor = "#0e0d0d";
    // document.getElementsByClassName('tuner')[0].style.color = "#f7f6f4";
    // document.getElementsByTagName('h1')[0].style.color = "#f7f6f4";
    document.body.style.setProperty('--element-color' , "#f7f6f4" );
    $("#showall").attr('src','data/hexiconW.png');
    $("#downloadIcon").attr('src','data/downloadIconW.png');
  }
}

// DOWNLOAD

function downloadParams() {
  // create the text file as a Blob:
  var blob = new Blob(["_"],{type: "text/plain"});
  var name = $("#settingsTag")[0].innerHTML;

  // download the file:
  var url = URL.createObjectURL(blob),
    div = document.createElement("div"),
    anch = document.createElement("a");

  document.body.appendChild(div);
  div.appendChild(anch);

  anch.innerHTML = "&nbsp;";
  div.style.width = "0";
  div.style.height = "0";
  anch.href = url;
  anch.download = name;

  var ev = new MouseEvent("click",{});
  anch.dispatchEvent(ev);
  document.body.removeChild(div);

  logManager("downloaded: " + name.split(" ")[0]);
}

// note: In chrome apps, Content Security Policy does not allow inline javascript.
// https://stackoverflow.com/questions/36324333/refused-to-execute-inline-event-handler-because-it-violates-csp-sandbox/36349056
