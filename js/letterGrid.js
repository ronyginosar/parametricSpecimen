//////////////////////////////// VARIABLES ////////////////////////////////
// camera and zoom
var container;
var camera, scene, renderer;
var width = window.innerWidth*0.65; // align with css properties
var height = window.innerHeight;
var fov = 15;
var near = 700;
var far = 2000;
var zoom, view;
// letters
var message = "א";
var letterinstances = [];
var currentDisplay = [];
var centerVertice = "40,0,4";
var show = false;
// hex grid
var instances = 6;
var totalInstances = Math.pow(instances, 2);
var hexRadius = 25;
var hexWidth = hexRadius * 2 + 5;
var hexHeight = (Math.sqrt(3)/2 * (hexRadius * 2)) -5;
// visuals of zoom
var zoomLevel = 22; //TODO!
var zoomLevelShift = 2; //TODO!
var maxZoom = 31; //TODO!
// var zoomLevel = 18; //TODO!
// var zoomLevelShift = 8; //TODO!
// var maxZoom = 24; //TODO!
var currOpacity = 0;
var opacityVec = [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
var wghtInc = 8;
var ctrsInc = 8;
var initWght = 40;
var currRadi = 4;
var currNeighbors = [];


//////////////////////////////// FUNCTIONS ////////////////////////////////

//////////////////////// LETTERS ////////////////////////////

// DRAWLETTERS
function drawLetters(){
  for ( var i = -instances-1; i < instances+2; i += 1 ) {
    for ( var j = -instances-1; j < instances+2; j += 1 ) {
  // for ( var i = -instances+1; i < instances; i += 1 ) {
  //   for ( var j = -instances+1; j < instances; j += 1 ) {

      // create letter instance with css attrs
      var letter = document.createElement( 'div' );
      letter.className = 'letter';
      letter.textContent = message;
      logManager("switch to "+centerVertice);

      switch (centerVertice) {

        case "80,40,4":
          if (i>=0 && j>=0 && i>=j){ // I+
            var ctrs = i-5;
            ctrs = Math.abs(ctrs) * ctrsInc;
            var wght = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/2) + 5;
            wght = Math.abs(wght) * wghtInc + initWght;
            var styl = 4;
          } else if (i>=0 && j<0 && i>=Math.abs(j)-1){ // II+
            var wght = Math.floor(Math.abs(i) + (Math.abs(j) + Math.abs(j)%2)/4) - 5 ;
            wght = Math.abs(wght) * wghtInc + initWght;
            var ctrs = i-5 ;
            ctrs = Math.abs(ctrs) * (ctrsInc + 4);
            var styl = 4;
          } else if (i>=0 && j<0 && i<Math.abs(j)){ // II-
            var wght = (j+5) * wghtInc + initWght;
            var ctrs = Math.abs(i-5)*10;
            var styl = 4;
          } else if (i<0 && j<0 && Math.abs(i)>=Math.abs(j)){ // III+
            var wght = Math.floor(Math.abs(i) + (Math.abs(j) + Math.abs(j)%2)/4) - 6 ;
            wght = Math.abs(wght) * (wghtInc-2) + initWght;
            var ctrs = 40;
            var styl = Math.abs(Math.abs(i) - 5);
          } else if (i<0 && j<0 && Math.abs(i)<Math.abs(j)){ // III-
            var wght = (j+5) * (wghtInc-2) + initWght;
            var ctrs = 40;
            var styl = Math.abs(Math.abs(i) - 5);
          } else if (i>=0 && j>=0 && i<j){ // I-
            var wght = initWght+initWght;
            var ctrs =(Math.abs(j-5)) * ctrsInc;
            var styl = Math.floor(Math.abs(j/2)) - (Math.abs(i) - Math.abs(i)%2)/2 ;
            styl = Math.abs(styl-3);
          } else if (Math.abs(i)>=Math.abs(j)+1){ // IV+
            var wght = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/2) + 5;
            wght = Math.abs(wght) * wghtInc + initWght;
            var ctrs = 40;
            var styl = Math.abs(Math.abs(i) - 5);
          } else { // IV-
            var wght = initWght+initWght;
            var ctrs = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/3)-5;
            ctrs =(Math.abs(ctrs)) * ctrsInc;
            var styl = Math.abs(Math.abs(j) - 5);
          }
          break;

        case "40,0,4":
          if (i>=0 && j>=0 && i>=j){ // I+
            var ctrs = Math.floor(Math.abs(i) + (Math.abs(j) - Math.abs(j)%2)/3);
            ctrs *= ctrsInc;
            var wght = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/2);
            wght = Math.abs(wght) * wghtInc + initWght;
            var styl = 4;
          } else if (i>=0 && j<0 && i>=Math.abs(j)-1){ // II+
            var wght = Math.floor(Math.abs(i) + (Math.abs(j) + Math.abs(j)%2)/6);
            wght = wght * wghtInc + initWght;
            var ctrs = i * (ctrsInc) ;
            var styl = 4;
          } else if (i>=0 && j<0 && i<Math.abs(j)){ // II-
            var wght = (Math.abs(j) - 1) * wghtInc + initWght + 10;
            var ctrs = i * (ctrsInc + 4);
            var styl = 4;
          } else if (i<0 && j<0 && Math.abs(i)>=Math.abs(j)){ // III+
            var wght = Math.abs(j) * wghtInc + initWght;
            var ctrs = 0;
            var styl = Math.abs(Math.abs(i) - 4);
          } else if (i<0 && j<0 && Math.abs(i)<Math.abs(j)){ // III-
            var wght = (Math.abs(j) - 1) * wghtInc + initWght;
            var ctrs = 0;
            var styl = Math.abs(Math.abs(i) - 4);
          } else if (i>=0 && j>=0 && i<j){ // I-
            var wght = initWght;
            var ctrs =(Math.abs(j)) * ctrsInc;
            var styl = Math.floor(Math.abs(j/2)) - (Math.abs(i) - Math.abs(i)%2)/2 ;
            styl = Math.abs(styl-3);
          } else if (Math.abs(i)>=Math.abs(j)+1){ // IV+
            var wght = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/2);
            wght = Math.abs(wght) * wghtInc + initWght;
            var ctrs =(Math.abs(j)) * ctrsInc;
            var styl = Math.abs(Math.abs(i) - 4);
          } else { // IV-
            var ctrs = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/3);
            ctrs =(Math.abs(ctrs)) * ctrsInc;
            var wght = initWght;
            var styl = Math.abs(Math.abs(j) - 5);
          }
          break;
      }
      // set vars for section
      letter.style.fontVariationSettings = '"wght"' +wght+ ', "ctrs"' +ctrs+ ' ,"styl"' +styl;
      letter.id = i + ',' + j + ',' + 0;

      // create an element for the letter instance
      var object = new THREE.CSS3DObject( letter );
      object.name = letter.id; // set name to match id

      // place on hex grid
      var xSpacing = hexHeight * i;
			var ySpacing = hexWidth * j * .75;
      if ((i % 2) == 0)
			{
        object.position.x = xSpacing;
        object.position.y = ySpacing;
        object.position.z = 0;
      } else {
        object.position.x = xSpacing;
        object.position.y = ySpacing + hexWidth / 2;
        object.position.z = 0;
      }
      letterinstances.push( object ); // appened to end of list
      scene.add(object);
      // unless show toggle is on, init on opacity 0
      object.element.style.opacity = 0;
      if(show) object.element.style.opacity = 1; // if changing center while "show all" flag is on
    }
  }
} // end drawLetters function

function initialLetters(){
  // initial letter view
  // currRadi = 5; // 5 was for displaying masters. 4 for displaying full circles
  currRadi = 4; // reset currRadi before every draw
  var centerLetter = scene.getObjectByName("0,0,0");
  var currSet = centerLetter.element.style.fontVariationSettings;
  document.body.style.fontVariationSettings = currSet; //init
  // updateSettingsTag(currSet); // reset settings tag TODO
  // document.getElementsByClassName("tuner")[0].style.setProperty('font-variation-settings' , currSet );  //TODO
  currentDisplay.push(centerLetter); // appened center to start of list
  var centerNs = getNthNeighbors(centerLetter.name , currRadi);
  currentDisplay.push.apply(currentDisplay, centerNs);
  if(!show){
    for ( var i = 0; i < currentDisplay.length; i += 1 ) {
      currentDisplay[i].element.style.opacity = opacityVec[2];
      // currentDisplay[i].element.style.opacity = opacityVec[(zoomLevel-zoomLevelShift+1)%10];  // %10 gives the last digit of the num
    }
  }
  currRadi -= 2; // first shirnk by 2, seems like middle
}

function getNthNeighbors ( currCenter , cRadi){
  var currNeighbors = [];
  var centerSettings = currCenter.split(",");
  var nRadi = cRadi;
	var nShift = 1; // reset shift before every draw

  // adjustments in shifts based on position
	if (nRadi == 1){
    if (!(+centerSettings[1]%2) || !(+centerSettings[0]%2) ) nShift = 0; // 0 shift on even rows and cols
    if ((+centerSettings[0]%2) && !(+centerSettings[1]%2)) nShift += 1; // uneven col
  }
  if (nRadi>=4) nShift += 1;// first round
  if((nRadi==3)&&(+centerSettings[0]%2)) nShift += 1; // outer letters on second round

  // n1 is at 12 o'clock , numbering clockwise
  // if there is indeed a neighbor, add to temp display list that we return
  var n1 = (+centerSettings[0] + nRadi)+","+(+centerSettings[1] + nShift)+","+centerSettings[2];
  var l1 = scene.getObjectByName(n1);
  if (l1) currNeighbors.push(l1);

  var n2 = (+centerSettings[0])+","+(+centerSettings[1] + nRadi)+","+centerSettings[2];
  var l2 = scene.getObjectByName(n2);
  if (l2) currNeighbors.push(l2);

  var n3 = (+centerSettings[0] - nRadi )+","+(+centerSettings[1] +nShift)+","+centerSettings[2];
  var l3 = scene.getObjectByName(n3);
  if (l3) currNeighbors.push(l3);

  var n4 = (+centerSettings[0] - nRadi)+","+(+centerSettings[1] - nRadi +nShift)+","+(+centerSettings[2]);
  var l4 = scene.getObjectByName(n4);
  if (l4) currNeighbors.push(l4);

  var n5 = (+centerSettings[0])+","+(+centerSettings[1] - nRadi)+","+centerSettings[2];
  var l5 = scene.getObjectByName(n5);
  if (l5) currNeighbors.push(l5);

  var n6 = (+centerSettings[0] + nRadi)+","+(+centerSettings[1] - nRadi +nShift)+","+centerSettings[2];
  var l6 = scene.getObjectByName(n6);
  if (l6) currNeighbors.push(l6);

  return currNeighbors;
}

function updateSettingsTag(set){ // TODO
  // var settings = $(e.target).css('font-variation-settings');
  var settings = set;
  // cleaning string for parameter tag display
  settings = settings.replace(/[a-zA-Z]/g,'');
  settings = settings.replace(/""/g,'');
  settings = settings.replace(/ /g,'');

  var forSlider = settings.split(",");
  // console.log(forSlider);
  // update sliders
  // var currclass = document.getElementsByClassName("controlers");
  // console.log(currclass);
  // currclass.getElementsByClassName("wghtLabel")[0].innerHTML = forSlider[0];
  // // console.log(currclass.getElementsByClassName("wghtParam")[0].setAttribute('value', forSlider[0]));
  // document.getElementsByClassName("wghtParam")[0].value = forSlider[0];
  // currclass.getElementsByClassName("ctrsLabel")[0].innerHTML = forSlider[1];
  // document.getElementsByClassName("ctrsParam")[0].value = forSlider[1];
  // currclass.getElementsByClassName("stylLabel")[0].innerHTML = forSlider[2];
  // document.getElementsByClassName("stylParam")[0].value =  forSlider[2];

  settings = settings.replace(/,/g,'.');
  if(settings) settings += " סגנון.קונטרסט.משקל"
  $("#settingsTag").html(settings);
}

function updateSettingsTagByClick(set){ // TODO
  var settings = set;
  // cleaning string for parameter tag display
  settings = settings.replace(/[a-zA-Z]/g,'');
  settings = settings.replace(/""/g,'');
  settings = settings.replace(/ /g,'');
  var forSlider = settings.split(",");
  document.getElementsByClassName("wghtParam")[0].value = forSlider[0];
  document.getElementsByClassName("ctrsParam")[0].value = forSlider[1];
  document.getElementsByClassName("stylParam")[0].value =  forSlider[2];
  settings = settings.replace(/,/g,'.');
  if(settings) settings += " סגנון.קונטרסט.משקל"
  $("#settingsTag").html(settings);
}

var clicked = false;

// display neighboors on hover (only over letter class) as hint
// to use them - on zoom in, we add the temp currNeighbors to the general display list
$("#gridContainer").mouseover(function(e){
  if($(e.target).attr('class') == "letter"){
    currOpacity = $(e.target).css('opacity'); // reset currOpacity
    if(currOpacity != 0){ // only if curently displaying
      var settings = $(e.target).css('font-variation-settings');
      if (settings != "normal") logManager("hovering over "+settings);
      // change font to current hover settings
      document.body.style.setProperty('font-variation-settings' , settings );
      updateSettingsTag(settings);
      // revealing neighboors
      var currCenter = e.target.id;
      if (currCenter && (!show)){
        currNeighbors = getNthNeighbors(currCenter,currRadi);
        for ( var i = 0; i < currNeighbors.length; i += 1 ) {
          // traverse neighboors and set opacity to light spot
          // as long as i didn't use to be clicked ?
          if (currNeighbors[i].element.style.opacity != 1) currNeighbors[i].element.style.opacity = opacityVec[4];
        }
      }
      // light up letter on hover
      $(e.target).css('opacity' , 1);
      animate();
    }
  }
}).mouseout(function(e){
  // remove hints if not zoomed in
  if($(e.target).attr('class') == "letter"){
    if(currOpacity != 0){ // only if curently displaying
      // console.log("DEBUG opacity: "+ currOpacity)
      // console.log("DEBUG opacity: "+ $(e.target).css('opacity'))


      // if already bright - don't return to dark opacity level
      // if(!show && (currOpacity < opacityVec[2])){
      if(!show && !clicked){// && (currOpacity <= opacityVec[2])){
        // console.log("DEBUG opacity: "+ $(e.target).css('opacity'));
        // console.log("DEBUG currOpacity: "+ currOpacity);
      // if(!show && ($(e.target).css('opacity') < opacityVec[2])){
        $(e.target).css('opacity' , currOpacity); // restore opacity level

      } else if (!show && clicked) $(e.target).css('opacity' , 1); //TODO

      if (e.target.id && (!show)){
        for ( var i = 0; i < currNeighbors.length; i += 1 ) {
          if (!currentDisplay.includes(currNeighbors[i])){ // patch to make it stop disappearing
            currNeighbors[i].element.style.opacity = 0;
          }
        }
      }
      currNeighbors = []; // reset currNeighbors list when not hovering
      clicked = false;
      animate();
    }
  }
});


$("#gridContainer").on('click', function(e){
  if($(e.target).attr('class') == "letter"){
    if ($(e.target).css('opacity') != 0) {
      // toggle visibitily
      if($('.tuner').css('display') == 'none'){
        document.querySelector('.tuner').classList.toggle('expand');
      }
      // clicked letter change to white
      $(e.target).css('opacity' , 1);
      // if clicked lit letter but then hover off - we still want it lit
      currOpacity = 1;
      clicked = true;
      // console.log("DEBUG lighting letter on click"+currOpacity)
      // input to tuner
      var targetSettings = $(e.target).css('font-variation-settings');
      $(".tuner").css('font-variation-settings' , targetSettings); //TODO
      // settings on sliders
      updateSettingsTagByClick(targetSettings);
      // log
      logManager("clicked on: "+ $(e.target).css('font-variation-settings'));
    }
    // toggle visibitily if clicked outside of a lit letter
    else if ($(e.target).css('opacity') == 0){
      if($('.tuner').css('display') != 'none'){
        document.querySelector('.tuner').classList.toggle('expand');
      }
    }
    // turn off letter TODO
    // else if ($(e.target).css('opacity') == 1){
    //   clicked = false;
    //   currOpacity = opacityVec[4];
    //   $(e.target).css('opacity' , opacityVec[4]);
    // }
}});

// UPDATE FONT VIA TUNER, EVEN IF HOVERED ELSEWHERE
$(document).on('click', function(e){
  if ($(e.target).attr('id') == 'tunerspan'){
    // get current tuned settings
    var targetSettings = $(e.target).css('font-variation-settings');
    // update tester preview
    document.body.style.setProperty('font-variation-settings' , targetSettings );
    // settings on sliders
    updateSettingsTag(targetSettings);
    // log
    logManager("clicked on tuner display: "+ targetSettings);
  }
});


/////////////////////// EVENT MANAGERS ////////////////////////////

// CONSOLE LOG MANAGER
var entry;
function logManager(logEntry){
  if (entry != logEntry){ // don't print if didn't change
    console.log("log: " + logEntry); // added string to diff between console and manager
    entry = logEntry;
  }
}

// INIT DISPLAY
$("#opener").on('click', function(e){
  // decide which opening letter
  if($(e.target).attr('id') == 'optionA'){
    centerVertice = "40,0,4";
    $("#opener").css('display','none');
  }
  if($(e.target).attr('id') == 'optionB'){
    centerVertice = "80,40,4";
    $("#opener").css('display','none');
  }
  changeDisplay(centerVertice);
});

// DISPLAY MANAGER
function changeDisplay(center){
  while(scene.children.length > 0){
    scene.remove(scene.children[0]);
    animate();
  }
  currentDisplay = [];
  letterinstances = [];
  currNeighbors = [];
  drawLetters();
  initialLetters();
  animate(); // the secret is calling animate after every change.
  // change font to center font:
  var targetSettings = scene.getObjectByName("0,0,0").element.style.fontVariationSettings;
  logManager("changed to center settings " + targetSettings);
  document.body.style.setProperty('font-variation-settings' , targetSettings );
  $(".tuner").css('font-variation-settings' , targetSettings );
  updateSettingsTag(targetSettings); // reset settings tag TODO
}

// TOGGLE CENTER MANAGER
function toggleCheck() {
  if(document.getElementsByName("toggle")[0].checked === true){
    centerVertice = "40,0,4";
    changeDisplay(centerVertice);
  } else if(document.getElementsByName("toggle")[0].checked === false){
    centerVertice = "80,40,4";
    changeDisplay(centerVertice);
  }
}

// CHANGE LETTER ON INPUT IN BOX
$('#messageInputBox').on('input',function(e){
    message = ($(this).val());
    logManager("new message: " + message);
    $.each(letterinstances, function( index, value ) {
      value.element.textContent = message;
    });
    $(".tuner span")[0].innerHTML = message;
});

// disable enter on editable h2
$("h2[contenteditable]").keypress(function (evt) {
  var keycode = evt.charCode || evt.keyCode;
  if (keycode  == 13) { //Enter key's keycode
    return false;
  }
});

// SHOW ALL
function changeResolution(){
  if(!show){
    logManager("Show all");
    $(".letter").css('opacity' , 1);
    show = true;
    $("#showall").attr('src','data/hexiconFullW.png');
  } else{
    logManager("Hiding");
    show = false;
    $("#showall").attr('src','data/hexiconW.png');
    changeDisplay(centerVertice);
  }
}

//////////////////////// ZOOM behavior functions ////////////////////////////

function zoomHandler(d3_transform) {
  let scale = d3_transform.k;
  let x =  -(d3_transform.x - width/2) / scale;
  let y = (d3_transform.y - height/2) / scale;
  let z = getZFromScale(scale);
  camera.position.set(x, y, z);
  // let scale = d3_transform.k;
  // let x =  -1.5*(d3_transform.x - width/2) / scale;
  // let y = 1.5*(d3_transform.y - height/2) / scale;
  // let z = getZFromScale(scale);
  // camera.position.set(x+width*0.03, y, z);

  // zoom level counter:
  if (zoomLevel < Math.floor(d3_transform.k*10)){// && Math.floor(d3_transform.k*10) < maxZoom){
    zoomLevel = Math.floor(d3_transform.k*10);
    // if ((zoomLevel-zoomLevelShift)%10 > opacityVec.length-1){ // zoom too big for vec
    //   zoomLevel = opacityVec.length-1+zoomLevelShift; // TODO - not super working.
    // }
    addOnZoom();
    if(currRadi > 1) currRadi -= 1; // tighten circle
  }
  // DISABLED ALL ON ZOOM OUT:
  // zoomout ->  supposed to grow circle of neighboors, in reality no good ux
  if (zoomLevel > Math.floor(d3_transform.k*10)){
    zoomLevel = Math.floor(d3_transform.k*10);
  //   // if(currRadi <= 2) currRadi += 1;
  }
}

function redrawNeighbors(){
  // change opacity of new neighbors with an upper limit on change
  // var c = (zoomLevel-zoomLevelShift)%10 ;
  // if(zoomLevel > maxZoom){
  //   c = opacityVec.length-1;
  // }
  for ( var i = 0; i < currNeighbors.length; i += 1 ) {
    // currNeighbors[i].element.style.opacity = opacityVec[c];
    // as long as i didn't use to be clicked ?
    if (currNeighbors[i].element.style.opacity != 1) currNeighbors[i].element.style.opacity = opacityVec[4];
    // currNeighbors[i].element.style.opacity = opacityVec[opacityVec.length - 4];
  }
}

function addOnZoom(){
  // for ( var i = 0; i < currentDisplay.length; i += 1 ) {
  //   currentDisplay[i].element.style.opacity = opacityVec[1];
  // }
  // add new neighbors to currentDisplay
  if (currNeighbors.length){
    redrawNeighbors();
    // logManager("Adding Neighbors of current to display");
    var nPrint = [];
    currNeighbors.forEach(function(e) {
      nPrint.push(e.element.style.fontVariationSettings);
      nPrint.push("||");
    });
    logManager("Adding Neighbors of current to display: "+nPrint);
    currentDisplay.push.apply(currentDisplay, currNeighbors);
    currOpacity = opacityVec[4];
  }
}

function getScaleFromZ (camera_z_position) {
  let half_fov = fov/2;
  let half_fov_radians = toRadians(half_fov);
  let half_fov_height = Math.tan(half_fov_radians) * camera_z_position;
  let fov_height = half_fov_height * 2;
  let scale = height / fov_height; // Divide visualization height by height derived from field of view
  return scale;
}

function getZFromScale(scale) {
  let half_fov = fov/2;
  let half_fov_radians = toRadians(half_fov);
  let scale_height = height / scale;
  let camera_z_position = scale_height / (2 * Math.tan(half_fov_radians));
  return camera_z_position;
}

function setUpZoom() {
  view.call(zoom);
  let initial_scale = getScaleFromZ(far);
  var initial_transform = d3.zoomIdentity.translate(width/2, height/2).scale(initial_scale);
  zoom.transform(view, initial_transform);
  // camera.position.set(0, 0, far);
  camera.position.set(0, 0, far);
  // camera.position.set(width*0.03, 0, far);
}

// From https://github.com/anvaka/three.map.control, used for panning
function getCurrentScale() {
  var vFOV = camera.fov * Math.PI / 180
  var scale_height = 2 * Math.tan( vFOV / 2 ) * camera.position.z
  var currentScale = height / scale_height;
  return currentScale
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

///// SCENE & THREE FUNCTIONS ////

if ( WEBGL.isWebGLAvailable() === false ) {
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

init();
animate();

// INIT
function init() {
  var d = new Date();
  logManager("----Starting Session: " + d + " ---------");

  container = document.getElementById( 'gridContainer' );

  // SCENE
  scene = new THREE.Scene();

  // CAMERA
  camera = new THREE.PerspectiveCamera( fov, width / height, near, far );

  // DRAWING
  drawLetters();
  initialLetters();

  // RENDERER
  renderer = new THREE.CSS3DRenderer();
  renderer.setSize( width, height );
  document.getElementById( 'gridContainer' ).appendChild( renderer.domElement );

  // EVENTS
  window.addEventListener( 'resize', onWindowResize, false );

  // CONTROLS
  // Set up mouse-directed zoom behavior
  // https://observablehq.com/@grantcuster/using-three-js-for-2d-data-visualization

  // TODO
  // update - where?
  // zoomLevel = Math.floor(d3_transform.k*10);
  // zoomLevelShift = zoomLevel%10;

  zoom = d3.zoom()
    .scaleExtent([getScaleFromZ(far), getScaleFromZ(near)])
    // .translateExtent([-width, -height], [width, height])
    .on('zoom', () =>  {
      let d3_transform = d3.event.transform;
      zoomHandler(d3_transform);

    });
  view = d3.select(renderer.domElement);
  setUpZoom();
} //end init

function onDocumentMouseDown(){
  event.preventDefault();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  renderer.render( scene, camera );
}
