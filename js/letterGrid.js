
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
var far = 1000;
var zoom, view;
// letters
var message = "פ";
var letterinstances = [];
var currentDisplay = [];
var instances = 9;
// hex grid
var hexRadius = 12;
var hexHeight = hexRadius * 2;
var hexWidth = Math.sqrt(3)/2 * hexHeight;


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

  for ( var i = 0; i < letterinstances.length; i += 1 ) {
    scene.add( letterinstances[i] );
    letterinstances[i].element.style.opacity = 0;
  }

  initLetters();

  // interactLetters();



  // RENDERER
  // renderer = new THREE.CSS2DRenderer();
  renderer = new THREE.CSS3DRenderer();
  renderer.setSize( width, height );
  document.getElementById( 'gridContainer' ).appendChild( renderer.domElement );

  // EVENTS
  window.addEventListener( 'resize', onWindowResize, false );
  // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  // window.addEventListener( 'wheel', onMouseWheel, false );
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
      var wght = i*10;
      var ctrs = j*5;
      var styl = 4; // TODO: all styles
      letter.style.fontVariationSettings = '"wght"' +wght+ ', "ctrs"' +ctrs+ ' ,"styl"' +styl;
      letter.id = wght + ',' + ctrs + ',' + styl;

      // create an element for the letter instance
      var object = new THREE.CSS3DObject( letter );
      object.name = letter.id;
      // hex grid
      // https://www.openprocessing.org/sketch/169257
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

      object.translateX(-window.innerWidth/instances*0.3);
			object.translateY(-window.innerHeight/instances);

      letterinstances.push( object );
      // scene.add( object );


      // TODO clickable: object.element.onclick = function() { this.parent.position.y += 10; };
    }
  }
} // end drawLetters function

function initLetters(){
  // // TODO: take out of lettergridjs!!!!
  // TODO when we add all 4 styles - add for centerSettings[3]

  // initial letter view
  var totalInstances = instances*instances;
  var centerLetter = letterinstances[Math.floor(totalInstances/2)];
  currentDisplay.push(centerLetter);
  var centerSettings = centerLetter.name.split(",");
  // var diffRadius = 2;

  var n1 = (+centerSettings[0] + +centerSettings[0])+","+centerSettings[1]+","+centerSettings[2];
  var l1 = scene.getObjectByName(n1);
  currentDisplay.push(l1);

  var n2 = (+centerSettings[0] + +centerSettings[0] - 20 )+","+(+centerSettings[1] + +centerSettings[1] - 5)+","+centerSettings[2];
  var l2 = scene.getObjectByName(n2);
  currentDisplay.push(l2);

  var n3 = (+centerSettings[0] - +centerSettings[0] + 20 )+","+(+centerSettings[1] + +centerSettings[1] - 5)+","+centerSettings[2];
  var l3 = scene.getObjectByName(n3);
  currentDisplay.push(l3);

  var n4 = (+centerSettings[0] - +centerSettings[0])+","+centerSettings[1]+","+centerSettings[2];
  var l4 = scene.getObjectByName(n4);
  currentDisplay.push(l4);

  var n5 = (+centerSettings[0] - +centerSettings[0] + 20 )+","+(+centerSettings[1] - +centerSettings[1] + 5)+","+centerSettings[2];
  var l5 = scene.getObjectByName(n5);
  currentDisplay.push(l5);

  var n6 = (+centerSettings[0] + +centerSettings[0] - 20 )+","+(+centerSettings[1] - +centerSettings[1] + 5)+","+centerSettings[2];
  var l6 = scene.getObjectByName(n6);
  currentDisplay.push(l6);

  for ( var i = 0; i < currentDisplay.length; i += 1 ) {
    currentDisplay[i].element.style.opacity = 1;
  }


  // based on position view:
  // traverse neighboors
  // if there is a letter from the current side
  // show letter (push to temp list) on hover
  // if clicked current center letter
  // push neighboors to currentDisplay to display

  // color based on display list

  // incremental based on zoom level view


}

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
  let x = -(d3_transform.x - width/2) / scale;
  let y = (d3_transform.y - height/2) / scale;
  let z = getZFromScale(scale);
  camera.position.set(x, y, z);
  // TODO make letters keep their size. ?????
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