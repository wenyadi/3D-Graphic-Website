var container, stats;
var camera, controls, scene, renderer;
var objects = [];
var plane = new THREE.Plane();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
offset = new THREE.Vector3(),
intersection = new THREE.Vector3(),
INTERSECTED, SELECTED;

var controlContainerWidth = 250;

//add control container
var controlContainer = document.createElement('div');
controlContainer.className = 'controlView';
controlContainer.style.width = controlContainerWidth.toString() + 'px';
controlContainer.style.height = window.innerHeight.toString() + 'px';

var ctrlHtml = '<div> '
  + '<input type="text" placeholder="length" id="cubeL" />'
  + '<input type="text" placeholder="width" id="cubeW" />'
  + '<input type="text" placeholder="height" id="cubeH" />'
  + ' </div>'
  + '<input type="button" value="add a cube" class="addCubeBtn" onclick="addCubeWithSize()"/>';
controlContainer.innerHTML = ctrlHtml;


init();
animate();

function init() {

	container = document.createElement( 'div' );

	document.body.appendChild( container );
  document.body.appendChild( controlContainer );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	scene = new THREE.Scene();

	scene.add( new THREE.AmbientLight( 0x505050 ) );

	var light = new THREE.SpotLight( 0xffffff, 1.5 );
	light.position.set( 0, 500, 2000 );
	light.castShadow = true;

	light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 10000 ) );
	light.shadow.bias = - 0.00022;

	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;

	scene.add( light );


	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth - controlContainerWidth, window.innerHeight );
	renderer.sortObjects = false;

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

	container.appendChild( renderer.domElement );

	stats = new Stats();
	container.appendChild( stats.dom );

	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

	if ( SELECTED ) {

		if ( raycaster.ray.intersectPlane( plane, intersection ) ) {

			SELECTED.position.copy( intersection.sub( offset ) );

		}

		return;

	}

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {

		if ( INTERSECTED != intersects[ 0 ].object ) {

			if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

			plane.setFromNormalAndCoplanarPoint(
				camera.getWorldDirection( plane.normal ),
				INTERSECTED.position );

		}

		container.style.cursor = 'pointer';

	} else {

		if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

		INTERSECTED = null;

		container.style.cursor = 'auto';

	}

}

function onDocumentMouseDown( event ) {

	event.preventDefault();

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {

		controls.enabled = false;

		SELECTED = intersects[ 0 ].object;

		if ( raycaster.ray.intersectPlane( plane, intersection ) ) {

			offset.copy( intersection ).sub( SELECTED.position );

		}

		container.style.cursor = 'move';

	}

}

function onDocumentMouseUp( event ) {

	event.preventDefault();

	controls.enabled = true;

	if ( INTERSECTED ) {

		SELECTED = null;

	}

	container.style.cursor = 'auto';

}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	controls.update();

	renderer.render( scene, camera );

}

function randomColor() {
  return Math.random() * 0xffffff;
}

for addCubeWithSize() {
  var height = parsedocument.getElementById('cubeH');
  var geometry = new THREE.CubeGeometry( 200, 200, 200);
  var material = new THREE.MeshBasicMaterial( { color: randomColor() } );
  var mesh = new THREE.Mesh( geometry, material );
  scene.add(mesh);


}
