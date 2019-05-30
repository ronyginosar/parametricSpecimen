// console.clear();

var centerVertice = "40,0,0";

// CONSOLE LOG MANAGER
var entry;
function logManager(logEntry){
  if (entry != logEntry){ // don't print if didn't change
    console.log("log: " + logEntry); // added string to diff between console and manager
    entry = logEntry;
  }
}

// TOGGLE VAR MANAGER
function toggleCheck() {
  if(document.getElementsByName("toggle")[0].checked === true){
    centerVertice = "40,0,0";
    while(scene.children.length > 0){
      scene.remove(scene.children[0]);
      animate();
    }
    // letterinstances.forEach(function(e) {
    //   console.log(e.element);
    //   e.element.display('none');
    // });
    currentDisplay = [];
    letterinstances = [];
    currNeighbors = [];
  } else if(document.getElementsByName("toggle")[0].checked === false){
    // console.log("ELSE");
    centerVertice = "80,40,4";
    while(scene.children.length > 0){
      scene.remove(scene.children[0]);
      animate();
    }
    // letterinstances.forEach(function(e) {
    //   console.log(e.element);
    //   e.element.display('none');
    // });

    currentDisplay = [];
    letterinstances = [];
    currNeighbors = [];
  }
  drawLetters();
  initialLetters();
  animate(); // the secret is calling animate after every change.
}

// CHANGE FONT ON HOVER
$(document).mouseover(function(e){
  if($(e.target).css('opacity')!=0){ // only if curently displaying
    // console.log("DEBUG "+$(e.target).attr('class'));
    var targetSettings = $(e.target).css('font-variation-settings');
    if (targetSettings){
      if (targetSettings != "normal") logManager("hovering over "+targetSettings);
      document.body.style.setProperty('font-variation-settings' , targetSettings );
    }
  }
});

// CHANGE LETTER ON INPUT
$('#messageInputBox').on('input',function(e){
    message = ($(this).val());
    logManager("new message: " + message);
    $.each(letterinstances, function( index, value ) {
      value.element.textContent = message;
    });
});



if ( WEBGL.isWebGLAvailable() === false ) {
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

// VARIABLES
// camera and zoom
var container;
var camera, scene, renderer;
var width = window.innerWidth*0.7; // align with css properties
var height = window.innerHeight;
var fov = 15;
var near = 1;
var far = 1700;
var zoom, view;
// letters
var message = "א";
var letterinstances = [];
var currentDisplay = [];
// hex grid
var instances = 6;
var totalInstances = Math.pow(instances, 2);
var hexRadius = 25;
var hexWidth = hexRadius * 2;
var hexHeight= (Math.sqrt(3)/2 * hexWidth) - 10;
// visuals of zoom
var zoomLevel = 11;
var zoomLevelShift = 1; //TODO!
var opacityVec = [0.2,0.3,0.4,0.5,0.6,0.7,0.8];
var wghtInc = 8;
var ctrsInc = 8;
var initWght = 40;
var currRadi = 4;
var currNeighbors = [];

init();
animate();

// INIT
function init() {
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
  zoom = d3.zoom()
    .scaleExtent([getScaleFromZ(far), getScaleFromZ(near)])
    .on('zoom', () =>  {
      let d3_transform = d3.event.transform;
      zoomHandler(d3_transform);
    });
  view = d3.select(renderer.domElement);
  setUpZoom();
} //end init

// DRAWLETTERS
function drawLetters(){
  for ( var i = -instances+1; i < instances; i += 1 ) {
    for ( var j = -instances+1; j < instances; j += 1 ) {

      // create letter instance with css attrs
      var letter = document.createElement( 'div' );
      letter.className = 'letter';
      letter.textContent = message;

      // var centerVertice = "40,0,0";
      // var centerVertice = "80,40,4";

      logManager("switch to "+centerVertice);

      switch (centerVertice) {

        case "80,40,4":
          // console.log("chosen 80,40,4");
          if (i>=0 && j>=0 && i>=j){ // I+
            // letter.style.color = "blue";
            var ctrs = i-5;
            ctrs = Math.abs(ctrs) * ctrsInc;
            var wght = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/2) + 5;
            wght = Math.abs(wght) * wghtInc + initWght;
            var styl = 4;
          } else if (i>=0 && j<0 && i>=Math.abs(j)-1){ // II+
            // letter.style.color = "red";
            var wght = Math.floor(Math.abs(i) + (Math.abs(j) + Math.abs(j)%2)/4) - 5 ;
            wght = Math.abs(wght) * wghtInc + initWght;
            var ctrs = i-5 ;
            ctrs = Math.abs(ctrs) * (ctrsInc + 4); //// TODO: +4?
            var styl = 4;
          } else if (i>=0 && j<0 && i<Math.abs(j)){ // II-
            // letter.style.color = "green";
            var wght = (j+5) * wghtInc + initWght;
            var ctrs = Math.abs(i-5)*10;
            var styl = 4;
          } else if (i<0 && j<0 && Math.abs(i)>=Math.abs(j)){ // III+
            // letter.style.color = "pink";
            var wght = Math.floor(Math.abs(i) + (Math.abs(j) + Math.abs(j)%2)/4) - 6 ;
            wght = Math.abs(wght) * (wghtInc-2) + initWght;
            var ctrs = 40;
            var styl = Math.abs(Math.abs(i) - 5);
          } else if (i<0 && j<0 && Math.abs(i)<Math.abs(j)){ // III-
            // letter.style.color = "orange";
            var wght = (j+5) * (wghtInc-2) + initWght;
            var ctrs = 40;
            var styl = Math.abs(Math.abs(i) - 5);
          } else if (i>=0 && j>=0 && i<j){ // I-
            // letter.style.color = "yellow";
            var wght = initWght+initWght;
            var ctrs =(Math.abs(j-5)) * ctrsInc;
            var styl = Math.floor(Math.abs(j/2)) - (Math.abs(i) - Math.abs(i)%2)/2 ;
            styl = Math.abs(styl-3);
          } else if (Math.abs(i)>=Math.abs(j)+1){ // IV+
            // letter.style.color = "gray";
            var wght = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/2) + 5;
            wght = Math.abs(wght) * wghtInc + initWght;
            var ctrs = 40;
            var styl = Math.abs(Math.abs(i) - 5);
          } else { // IV-
            // letter.style.color = "purple";
            var wght = initWght+initWght;
            var ctrs = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/3)-5;
            ctrs =(Math.abs(ctrs)) * ctrsInc;
            var styl = Math.abs(Math.abs(j) - 5);
          }
          break;

        case "40,0,0":
          // console.log("chosen 40,0,0");
          if (i>=0 && j>=0 && i>=j){ // I+
            // letter.style.color = "blue";
            var ctrs = Math.floor(Math.abs(i) + (Math.abs(j) - Math.abs(j)%2)/3);
            ctrs *= ctrsInc;
            // letter.textContent = ctrs ;
            var wght = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/2);
            wght = Math.abs(wght) * wghtInc + initWght;
            var styl = 0;
          } else if (i>=0 && j<0 && i>=Math.abs(j)-1){ // II+
            // letter.style.color = "red";
            var wght = Math.floor(Math.abs(i) + (Math.abs(j) + Math.abs(j)%2)/6); // or /2?
            wght = wght * wghtInc + initWght;
            // var ctrs =(Math.abs(j) - (Math.abs(i) + Math.abs(i)%2)/2) - 2 ;
            var ctrs = i * (ctrsInc) ;
            // letter.textContent = ctrs ;
            var styl = 0;
          } else if (i>=0 && j<0 && i<Math.abs(j)){ // II-
            // letter.style.color = "green";
            var wght = (Math.abs(j) - 1) * wghtInc + initWght + 10;
            var ctrs = i * (ctrsInc + 4) ;
            // var styl = Math.floor(Math.abs(j/2)) - (Math.abs(i) + Math.abs(i)%2)/2 - 1;
            var styl = 0;
          } else if (i<0 && j<0 && Math.abs(i)>=Math.abs(j)){ // III+
            // letter.style.color = "pink";
            var wght = Math.abs(j) * wghtInc + initWght;
            // letter.textContent = wght ;
            var ctrs = 0;
            var styl = Math.abs(i) - 1;
          } else if (i<0 && j<0 && Math.abs(i)<Math.abs(j)){ // III-
            // letter.style.color = "orange";
            var wght = (Math.abs(j) - 1) * wghtInc + initWght;
            // letter.textContent = wght ;
            var ctrs = 0;
            var styl = Math.abs(i) - 1;
          } else if (i>=0 && j>=0 && i<j){ // I-
            // letter.style.color = "yellow";
            var wght = initWght;
            var ctrs =(Math.abs(j)) * ctrsInc;
            var styl = Math.floor(Math.abs(j/2)) - (Math.abs(i) - Math.abs(i)%2)/2 ;
          } else if (Math.abs(i)>=Math.abs(j)+1){ // IV+
            // letter.style.color = "gray";
            var wght = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/2);
            wght = Math.abs(wght) * wghtInc + initWght;
            // letter.textContent = wght ;
            var ctrs =(Math.abs(j)) * ctrsInc;
            var styl = Math.abs(i) - 1;
          } else { // IV-
            // letter.style.color = "purple";
            var ctrs = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/3);
            ctrs =(Math.abs(ctrs)) * ctrsInc;
            var wght = initWght;
            var styl = Math.abs(i) - 1;
          }
          break;

          // case "80,40,4":
          //   console.log("chosen 80,40,4");
          //   if (i>=0 && j>=0 && i>=j){ // I+
          //     // letter.style.color = "blue";
          //     var ctrs = i-5;
          //     ctrs = Math.abs(ctrs) * ctrsInc;
          //     var wght = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/2) + 5;
          //     wght = Math.abs(wght) * wghtInc + initWght;
          //     var styl = 4;
          //   } else if (i>=0 && j<0 && i>=Math.abs(j)-1){ // II+
          //     // letter.style.color = "red";
          //     var wght = Math.floor(Math.abs(i) + (Math.abs(j) + Math.abs(j)%2)/4) - 5 ;
          //     wght = Math.abs(wght) * wghtInc + initWght;
          //     var ctrs = i-5 ;
          //     ctrs = Math.abs(ctrs) * (ctrsInc + 4); //// TODO: +4?
          //     var styl = 4;
          //   } else if (i>=0 && j<0 && i<Math.abs(j)){ // II-
          //     // letter.style.color = "green";
          //     var wght = (j+5) * wghtInc + initWght;
          //     var ctrs = Math.abs(i-5)*10;
          //     var styl = 4;
          //   } else if (i<0 && j<0 && Math.abs(i)>=Math.abs(j)){ // III+
          //     // letter.style.color = "pink";
          //     var wght = Math.floor(Math.abs(i) + (Math.abs(j) + Math.abs(j)%2)/4) - 6 ;
          //     wght = Math.abs(wght) * (wghtInc-2) + initWght;
          //     var ctrs = 40;
          //     var styl = Math.abs(Math.abs(i) - 5);
          //   } else if (i<0 && j<0 && Math.abs(i)<Math.abs(j)){ // III-
          //     // letter.style.color = "orange";
          //     var wght = (j+5) * (wghtInc-2) + initWght;
          //     var ctrs = 40;
          //     var styl = Math.abs(Math.abs(i) - 5);
          //   } else if (i>=0 && j>=0 && i<j){ // I-
          //     // letter.style.color = "yellow";
          //     var wght = initWght+initWght;
          //     var ctrs =(Math.abs(j-5)) * ctrsInc;
          //     var styl = Math.floor(Math.abs(j/2)) - (Math.abs(i) - Math.abs(i)%2)/2 ;
          //     styl = Math.abs(styl-3);
          //   } else if (Math.abs(i)>=Math.abs(j)+1){ // IV+
          //     // letter.style.color = "gray";
          //     var wght = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/2) + 5;
          //     wght = Math.abs(wght) * wghtInc + initWght;
          //     var ctrs = 40;
          //     var styl = Math.abs(Math.abs(i) - 5);
          //   } else { // IV-
          //     // letter.style.color = "purple";
          //     var wght = initWght+initWght;
          //     var ctrs = Math.floor(Math.abs(j) - (Math.abs(i) - Math.abs(i)%2)/3)-5;
          //     ctrs =(Math.abs(ctrs)) * ctrsInc;
          //     var styl = Math.abs(Math.abs(j) - 5);
          //   }
          //   break;

      }

      letter.style.fontVariationSettings = '"wght"' +wght+ ', "ctrs"' +ctrs+ ' ,"styl"' +styl;
      letter.id = i + ',' + j + ',' + 0;

      // create an element for the letter instance
      var object = new THREE.CSS3DObject( letter );
      object.name = letter.id; // set name to match id

      var xSpacing = hexHeight  * i;
			var ySpacing = hexWidth * j  * .75;
      if ( (i % 2) == 0 )
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
      // console.log(object.name);
      scene.add( object );
      object.element.style.opacity = 0;
      if(show) object.element.style.opacity = 1;
    }
  }
} // end drawLetters function


function initialLetters(){
  // initial letter view
  currRadi = 5;
  var centerLetter = scene.getObjectByName("0,0,0");
  centerLetter.element.style.opacity = 1;
  currentDisplay.push(centerLetter); // appened center to start of list
  var centerNs = getNthNeighbors(centerLetter.name , currRadi);
  currentDisplay.push.apply(currentDisplay, centerNs);
  for ( var i = 1; i < currentDisplay.length; i += 1 ) {
    currentDisplay[i].element.style.opacity = opacityVec[(zoomLevel-zoomLevelShift+1)%10];  // %10 gives the last digit of the num
  }
  currRadi -= 1;
}

function getNthNeighbors ( currCenter , cRadi){
  var currNeighbors = [];
  var centerSettings = currCenter.split(",");
  // console.log("DEBUG: " + currCenter);
  // console.log("DEBUG: " + cRadi);

  var nRadi = cRadi;
	var nShift = 1;
	if (nRadi == 1){ // smallest radi needs 0 shift on even rows and cols
    if (!(+centerSettings[1]%2) || !(+centerSettings[0]%2) ){
      nShift = 0;
    }
    if ((+centerSettings[0]%2) && !(+centerSettings[1]%2))  // uneven col
    {
        nShift += 1;
    }
  }
  // if((centerVertice == "80,40,4")&&(nRadi==5)) nShift += 1;

  if (nRadi==5)// first round
  {
      nShift += 1;
  }



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

  // DEBUG:
  // console.log(currCenter);
  // console.log(n1);
  // console.log(n2);
  // console.log(n3);
  // console.log(n4);
  // console.log(n5);
  // console.log(n6);
  // if (l1) l1.element.style.color = 'gray';
  // if (l2) l2.element.style.color = 'pink';
  // if (l3) l3.element.style.color = 'green';
  // if (l4) l4.element.style.color = 'yellow';
  // if (l5) l5.element.style.color = 'orange';
  // if (l6) l6.element.style.color = 'red';
  // l1.element.style.color = 'gray';
  // l2.element.style.color = 'pink';
  // l3.element.style.color = 'green';
  // l4.element.style.color = 'yellow';
  // l5.element.style.color = 'orange';
  // l6.element.style.color = 'red';

  return currNeighbors;
}

// display neighboors on hover (only over letter class) as hint
// to use them - on zoom in, we add the temp currNeighbors to the general display list
$("#gridContainer").mouseover(function(e){
  if($(e.target).attr('class') == "letter"){
    if($(e.target).css('opacity') != 0){ // only if curently displaying
      $(e.target).css('opacity' , 1); // black on hover
      var settings = $(e.target).css('font-variation-settings');
      // console.log("DEBUG"+e.target.id); // DEBUG
      // cleaning string for parameter tag display
      settings = settings.replace(/[a-zA-Z]/g,'');
      settings = settings.replace(/""/g,'');
      settings = settings.replace(/ /g,'');
      settings = settings.replace(/,/g,'.');
      if(settings) settings += " עט.קונטרסט.משקל "
      $("#settingsTag").html(settings);
      $("#settingsTag").css("opacity" , 1);
      $("#downloadIcon").css("opacity" , 1);
      // revealing neighboors
      var currCenter = e.target.id;
      if (currCenter && (!show)){
        // console.log("DEBUG IMNSI"+currCenter); // DEBUG
        currNeighbors = getNthNeighbors(currCenter,currRadi);
        for ( var i = 0; i < currNeighbors.length; i += 1 ) {
          // traverse neighboors and set opacity via zoom level indexing
          // console.log((zoomLevel-zoomLevelShift)%10); // DEBUG
          currNeighbors[i].element.style.opacity = opacityVec[(zoomLevel-zoomLevelShift)%10]; // %10 gives the last digit of the num
        }
      }
      // TODO: if zoomchanged && hover: redrawNeighbors + change to black
    }
    redrawNeighbors();
    animate();
  }
}).mouseout(function(e){ // remove hints if not zoomed in
  if($(e.target).attr('class') == "letter"){
    if($(e.target).css('opacity') != 0){ // only if curently displaying
      $("#settingsTag").css("opacity",0.5); // dont reset tag but lower opacity
      $("#downloadIcon").css("opacity" , 0.5);
      if(!show) $(e.target).css('opacity' , opacityVec[(zoomLevel-zoomLevelShift)%10]); // restore opacity level
      if (e.target.id && (!show)){
        for ( var i = 0; i < currNeighbors.length; i += 1 ) {
          if (!currentDisplay.includes(currNeighbors[i])){ // patch to make it stop disappearing
            currNeighbors[i].element.style.opacity = 0;
          }
        }
      }
      currNeighbors = []; // reset currNeighbors list when not hovering
      animate();
    }
  }
});

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

// ZOOM behavior functions
function zoomHandler(d3_transform) {
  // zoomLevel = Math.floor(d3_transform.k*10);
  // zoomLevelShift = zoomLevel%10;

  let scale = d3_transform.k;
  let x =  -(d3_transform.x - width/2) / scale;
  let y = (d3_transform.y - height/2) / scale;
  let z = getZFromScale(scale);
  camera.position.set(x, y, z);

  // zoom level counter:

  if (zoomLevel < Math.floor(d3_transform.k*10)){
    zoomLevel = Math.floor(d3_transform.k*10);
    if ((zoomLevel-zoomLevelShift)%10 > opacityVec.length-1){ // zoom too big for vec
      zoomLevel = opacityVec.length-1+zoomLevelShift; // TODO - not super working.
      // console.log(zoomLevel); // DEBUG
      // console.log((zoomLevel-zoomLevelShift)%10); // DEBUG
    }
    addOnZoom();
    if(currRadi > 1) currRadi -= 1; // tighten circle
  }
  // zoomout -> grow circle of neighboors
  if (zoomLevel > Math.floor(d3_transform.k*10)){
    zoomLevel = Math.floor(d3_transform.k*10);
    if(currRadi < 3) currRadi += 1;
  }
}

function addOnZoom(){
  logManager("AddingNeighbors of current");
  if (currNeighbors.length){
    redrawNeighbors();
    // add new neighbors to currentDisplay
    currentDisplay.push.apply(currentDisplay, currNeighbors);
  }
}

function redrawNeighbors(){
  // // change opacity of former neighbors? TODO
  // for ( var i = 0; i < currentDisplay.length; i += 1 ) {
  //   currentDisplay[i].element.style.opacity = opacityVec[(zoomLevel-zoomLevelShift+1)%10];
  // }
  // change opacity of new neighbors
  for ( var i = 0; i < currNeighbors.length; i += 1 ) {
    currNeighbors[i].element.style.opacity = opacityVec[(zoomLevel-zoomLevelShift)%10];
  }
  // keep center black
  $(".letter").mouseover(function(e){
    if($(e.target).css('opacity') != 0){
      $(e.target).css('opacity' , 1)}});
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
  view.call(zoom);//.on("click.zoom", null);
  let initial_scale = getScaleFromZ(far);
  var initial_transform = d3.zoomIdentity.translate(width/2, height/2).scale(initial_scale);
  zoom.transform(view, initial_transform);
  camera.position.set(0, 0, far);
}

// From https://github.com/anvaka/three.map.control, used for panning
function getCurrentScale() {
  var vFOV = camera.fov * Math.PI / 180
  var scale_height = 2 * Math.tan( vFOV / 2 ) * camera.position.z
  var currentScale = height / scale_height
  return currentScale
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}
