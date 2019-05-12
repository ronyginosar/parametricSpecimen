
console.clear();

if ( WEBGL.isWebGLAvailable() === false ) {
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

// VARIABLES
// camera and zoom
var container;
var camera, scene, renderer;
var width = window.innerWidth;
var height = window.innerHeight;
var fov = 15;
var near = 1;
var far = 1700;
var zoom, view;
// letters
var message = "פ";
var letterinstances = [];
var currentDisplay = [];
// hex grid
var instances = 18;
var totalInstances = instances*instances;
var hexRadius = 12;
var hexHeight = hexRadius * 2;
var hexWidth = Math.sqrt(3)/2 * hexHeight;
// zoom counters
var zoomLevel = 1;


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
  // interactLetters();

  // RENDERER
  renderer = new THREE.CSS3DRenderer();
  renderer.setSize( width, height );
  document.getElementById( 'gridContainer' ).appendChild( renderer.domElement );
  renderer

  // EVENTS
  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );

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
  for ( var i = 0; i < instances; i += 1 ) {
    for ( var j = 0; j < instances; j += 1 ) {
      // create letter instance with css attrs
      var letter = document.createElement( 'div' );
      letter.className = 'letter';
      // letter.textContent = message + i + '/' + j;
      letter.textContent = message;
      // letter.setAttribute('contenteditable', 'true');

      // parametric type settings, also use as id
      var wght = i*5;
      var ctrs = j*2.5;
      var styl = 4; // TODO: all styles
      letter.style.fontVariationSettings = '"wght"' +wght+ ', "ctrs"' +ctrs+ ' ,"styl"' +styl;
      letter.id = wght + ',' + ctrs + ',' + styl;

      // create an element for the letter instance
      var object = new THREE.CSS3DObject( letter );
      object.name = letter.id; // set name to match id
      // hex grid from https://www.openprocessing.org/sketch/169257
      var xSpacing = hexWidth * j;
      var ySpacing = hexHeight * .75 * i;

      if ( (i % 2) == 0 )
      {
        object.position.x = xSpacing;
        object.position.y = ySpacing;
        object.position.z = 0;
      } else {
        object.position.x = xSpacing + hexWidth / 2;
        object.position.y = ySpacing;
        object.position.z = 0;
      }
      letterinstances.push( object );
      scene.add( object );
      object.element.style.opacity = 0;

      // TODO clickable: object.element.onclick = function() { this.parent.position.y += 10; };
    }
  }
} // end drawLetters function

function initialLetters(){
  // // TODO: take out of lettergridjs!!!!
  // TODO when we add all 4 styles - add for centerSettings[3]

  // initial letter view

  // console.log(totalInstances);
  // var centerLetter = letterinstances[Math.floor(totalInstances/2)];
  var centerLetter = letterinstances[Math.floor(totalInstances/2)+instances/2];
  // var centerLetter = letterinstances[169];
  // centerLetter.element.style.color = 'blue';
  // console.log(centerLetter.name);
  // console.log(centerLetter.id);

  currentDisplay = getNthNeighbors(centerLetter.name,40,15,0);
  currentDisplay.push(centerLetter);

  for ( var i = 0; i < currentDisplay.length; i += 1 ) {
    currentDisplay[i].element.style.opacity = 1;
  }
}

function getNthNeighbors ( currCenter , wghtInc , ctrsInc , stylInc){
  var currNeighbors = [];
  var centerSettings = currCenter.split(",");
  // var centerSettings = currCenter.name.split(",");

  // n1 is at 12 o'clock , numbering clockwise
  // if there is indeed a neighbor, add to temp display list that we return
  var n1 = (+centerSettings[0] + wghtInc)+","+centerSettings[1]+","+centerSettings[2];
  var l1 = scene.getObjectByName(n1);
  if (l1) currNeighbors.push(l1);

  var n2 = (+centerSettings[0] + wghtInc/2 )+","+(+centerSettings[1] + ctrsInc)+","+centerSettings[2];
  var l2 = scene.getObjectByName(n2);
  if (l2) currNeighbors.push(l2);

  var n3 = (+centerSettings[0] - wghtInc/2 )+","+(+centerSettings[1] + ctrsInc)+","+centerSettings[2];
  var l3 = scene.getObjectByName(n3);
  if (l3) currNeighbors.push(l3);

  var n4 = (+centerSettings[0] - wghtInc)+","+centerSettings[1]+","+centerSettings[2];
  var l4 = scene.getObjectByName(n4);
  if (l4) currNeighbors.push(l4);

  // only for the left hand side indexing:
  if (ctrsInc <= 10) ctrsInc/=2;

  var n5 = (+centerSettings[0] - wghtInc/2)+","+(+centerSettings[1] - ctrsInc)+","+centerSettings[2];
  var l5 = scene.getObjectByName(n5);
  if (l5) currNeighbors.push(l5);

  var n6 = (+centerSettings[0] + wghtInc/2)+","+(+centerSettings[1] - ctrsInc)+","+centerSettings[2];
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

  return currNeighbors;
}



// TODO1: layers of gradient
// only current should be black
// #232323
// then gradient out by order of addition, in reverse
// let us define an opacity vector, of ex. 10 levels
var opacityVec = [0.7,0.6,0.5,0.4,0.3,0.2,0];
// on each zoom level - all opacities are moved one index down the line
// first spot is saved for currently hoverring options
// we shall add a counter to use and update opacity in hover?
var currRadi = 1;


// TODO2: radi of bullseye
// on each hover we want a tighter and tighter circle around the currCenter



// DISPLAY neighboors on hover as hint
// TODO to use them - zoom in and they are added to Current display
$(document).mouseover(function(e){
  if($(e.target).css('opacity')==1){ // only if curently displaying
    var currCenter = e.target.id;
    if (currCenter){
      var currNeighbors = getNthNeighbors(currCenter,10,5,0);
      // traverse neighboors
      for ( var i = 0; i < currNeighbors.length; i += 1 ) {
        currNeighbors[i].element.style.opacity = 0.65;
      }
    }
  }
});
// remove hints if not zoomed in
// ie on zoom in, add temp list to display list if we zoom in AROUND current center
$(document).mouseout(function(e){
  if($(e.target).css('opacity')!=0){ // only if curently displaying
    var currCenter = e.target.id;
    if (currCenter){
      // TODO get right the increments for N's
      var currNeighbors = getNthNeighbors(currCenter,10,5,0);
      for ( var i = 0; i < currNeighbors.length; i += 1 ) {
        currNeighbors[i].element.style.opacity = 0;
      }
    }
  }
});


// if clicked current center letter
// push neighboors to currentDisplay to display?

// TODO color when clicked, as bookmark?

// color based on display list

// incremental based on zoom level view



function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// used for RAYCAST
function onDocumentMouseMove( event ) {
  // event.preventDefault();
  // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onMouseWheel( event ) {
  // event.preventDefault();
  // TODO: clear cube before redraw (or different method)
  // if (event.deltaY > 0){
  //   // console.log(segments);
  //   segments += 1;
  //   // drawCube();
  // } else if (event.deltaY < 0 && segments > 0){
  //   // console.log(segments);
  //   segments -= 1;
  //   // drawCube();
  // }
}

function onDocumentMouseDown( event ) {
}

function onDocumentKeyDown( event ) {
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
  let scale = d3_transform.k;
  let x = totalInstances/2 -(d3_transform.x - width/2) / scale;
  let y = totalInstances/4+10 + (d3_transform.y - height/2) / scale;
  // let x = -(d3_transform.x - width/2) / scale;
  // let y = (d3_transform.y - height/2) / scale;
  let z = getZFromScale(scale);
  camera.position.set(x, y, z);
  // TODO make letters keep their size. ?????
  // zoom level counter:
  zoomLevel = Math.floor(d3_transform.k);
  // console.log(zoomLevel);
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
  camera.position.set(totalInstances/2, totalInstances/4+10 , far);
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
