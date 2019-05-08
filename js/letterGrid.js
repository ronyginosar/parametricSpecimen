
console.clear();

if ( WEBGL.isWebGLAvailable() === false ) {
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

var container;
var camera, scene, renderer;
var controls;
var width = window.innerWidth;
var height = window.innerHeight;
// var raycaster;
// var mouse = new THREE.Vector2(), INTERSECTED;
var mesh, line;

var material;
var message = "פ";
var letterinstances = [];
var instances = 9;
// hex grid
var hexRadius = 17;
var hexHeight = hexRadius * 2;
var hexWidth = Math.sqrt(3)/2 * hexHeight;


init();
animate();

function init() {
  container = document.getElementById( 'gridContainer' );

  // SCENE
  scene = new THREE.Scene();

  // CAMERA
  var fov = 15;
  camera = new THREE.PerspectiveCamera( fov, width / height, 1, 100 );
  camera.position.z = 1000;

  // DRAWING
  drawLetters();

  // RENDERER
  renderer = new THREE.CSS3DRenderer();
  renderer.setSize( width, height );
  document.getElementById( 'gridContainer' ).appendChild( renderer.domElement );

  // EVENTS
  window.addEventListener( 'resize', onWindowResize, false );
  // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  // window.addEventListener( 'wheel', onMouseWheel, false );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );

  // CONTROLS
  // https://threejs.org/docs/index.html#examples/controls/OrbitControls
  controls = new THREE.OrbitControls( camera );

  // Set up zoom behavior
  // https://codepen.io/anon/pen/LopPqR?editors=0010
  // https://blog.fastforwardlabs.com/2017/10/04/using-three-js-for-2d-data-visualization.html
  // const zoom = d3.zoom()
  //   .scaleExtent([near, far])
  //   .wheelDelta(function wheelDelta() {
  //     // this inverts d3 zoom direction, which makes it the rith zoom direction for setting the camera
  //     return d3.event.deltaY * (d3.event.deltaMode ? 120 : 1) / 500;
  //   })
  //   .on('zoom', () => {
  //     const event = d3.event;
  //     if (event.sourceEvent) {
  //
  //       // Get z from D3
  //       const new_z = event.transform.k;
  //
  //       if (new_z !== camera.position.z) {
  //
  //         // Handle a zoom event
  //         const { clientX, clientY } = event.sourceEvent;
  //
  //         // Project a vector from current mouse position and zoom level
  //         // Find the x and y coordinates for where that vector intersects the new
  //         // zoom level.
  //         // Code from WestLangley https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z/13091694#13091694
  //         const vector = new THREE.Vector3(
  //           clientX / width * 2 - 1,
  //           - (clientY / height) * 2 + 1,
  //           1
  //         );
  //         vector.unproject(camera);
  //         const dir = vector.sub(camera.position).normalize();
  //         const distance = (new_z - camera.position.z)/dir.z;
  //         const pos = camera.position.clone().add(dir.multiplyScalar(distance));
  //
  //
  //         // if (camera.position.z < 20) {
  //         //   scale = (20 -  camera.position.z)/camera.position.z;
  //         //   pointsMaterial.setValues({size: 6 + 3 * scale});
  //         // } else if (camera.position.z >= 20 && pointsMaterial.size !== 6) {
  //         //   pointsMaterial.setValues({size: 6});
  //         // }
  //
  //         // Set the camera to new coordinates
  //         camera.position.set(pos.x, pos.y, new_z);
  //
  //       } else {
  //
  //         // Handle panning
  //         const { movementX, movementY } = event.sourceEvent;
  //
  //         // Adjust mouse movement by current scale and set camera
  //         const current_scale = getCurrentScale();
  //         camera.position.set(camera.position.x - movementX/current_scale, camera.position.y +
  //           movementY/current_scale, camera.position.z);
  //       }
  //     }
  //   });
    //
    // // Add zoom listener
    // const view = d3.select(renderer.domElement);
    // view.call(zoom);
    //
    // // Disable double click to zoom because I'm not handling it in Three.js
    // view.on('dblclick.zoom', null);
    //
    // // Sync d3 zoom with camera z position
    // zoom.scaleTo(view, far);


} //end init

function drawLetters(){
  for ( var i = 0; i < instances; i += 1 ) {
    for ( var j = 0; j < instances; j += 1 ) {
      // create letter instance with css attrs
      var letter = document.createElement( 'div' );
      letter.className = 'letter';
      // DEBUG
      // letter.textContent = message + i + '/' + j;
      letter.textContent = message;
      letter.setAttribute('contenteditable', 'true');

      // parametric type settings, also use as id
      var wght = i*10;
      var ctrs = j*5;
      var styl = 4;
      letter.style.fontVariationSettings = '"wght"' +wght+ ', "ctrs"' +ctrs+ ' ,"styl"' +styl;
      letter.id = wght + ',' + ctrs + ',' + styl;
      // .getObjectById
      // DEBUG
      // console.log(letter.style.fontVariationSettings);

      // create an element for the letter instance
      var object = new THREE.CSS3DObject( letter );

      // hex grid
      // https://www.openprocessing.org/sketch/169257
      var xSpacing = hexWidth * j;
      var ySpacing = hexHeight * .75 * i;

      if ( (i % 2) == 0 )
      {
        object.position.x = xSpacing;
        object.position.y = ySpacing;
        object.position.z = 10;
      } else {
        object.position.x = xSpacing + hexWidth / 2;
        object.position.y = ySpacing;
        object.position.z = 10;
      }

      object.translateX(-window.innerWidth/instances*0.3);
			object.translateY(-window.innerHeight/instances);

      scene.add( object );
      letterinstances.push( object );

      // TODO clickable: object.element.onclick = function() { this.parent.position.y += 10; };
    } // end j loop
  } // end i loop
} // end drawLetters function

// From https://github.com/anvaka/three.map.control, used for panning
// function getCurrentScale() {
//   var vFOV = camera.fov * Math.PI / 180
//   var scale_height = 2 * Math.tan( vFOV / 2 ) * camera.position.z
//   var currentScale = height / scale_height
//   return currentScale
// }

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
  if (event.deltaY > 0){
    // console.log(segments);
    segments += 1;
    // drawCube();
  } else if (event.deltaY < 0 && segments > 0){
    // console.log(segments);
    segments -= 1;
    // drawCube();
  }
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
  // letterinstances.forEach(function(c) {
  //   c.lookAt( camera.position );
  // });
  // controls.update();

}
