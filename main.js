import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { createStraight, createCurve, createTangent } from './segments.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x444444 );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.z = 30;
const renderer = new THREE.WebGLRenderer();

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setSize(100, 100);
document.body.appendChild( renderer.domElement );


const lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );


const boxgeometry = new THREE.BoxGeometry( 1, 1, 1 );
const boxmaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( boxgeometry, boxmaterial );
scene.add( cube );

camera.position.z = 5;

const controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
//controls.autoRotate = true
controls.update();

let points = [];
const resolution = 30;
const yoffset = -20;

const BOTTOM_RADIUS = 20;
const BOTTOM_LENGTH = 10;
//const BOTTOM_CURVE_LENGTH = 10;
const BOTTOM_CURVE_RADIUS = 5;

const MIDDLE_LENGTH = 15;

const TOP_RADIUS = 5;
const TOP_LENGTH = 5;
//const TOP_CURVE_LENGTH = 3;
const TOP_CURVE_RADIUS = 5;


points = points.concat(createStraight(
	0, 
	BOTTOM_LENGTH, 
	BOTTOM_RADIUS));

const BOTTOM_BIGGER = BOTTOM_RADIUS > TOP_RADIUS;

// Figure out our tanget line, but don't add it to the points yet.
// We first need to add the bottom curve (which requires knowing the tangent line.)
const tangentPoints = createTangent(
	0,
	BOTTOM_CURVE_RADIUS,
	BOTTOM_RADIUS + (BOTTOM_BIGGER ? -1 : 1) * BOTTOM_CURVE_RADIUS,
	BOTTOM_LENGTH,
	TOP_CURVE_RADIUS,
	TOP_RADIUS + (BOTTOM_BIGGER ? 1 : -1) * TOP_CURVE_RADIUS,
	BOTTOM_LENGTH + MIDDLE_LENGTH
);

points = points.concat(createCurve(
	BOTTOM_RADIUS + (BOTTOM_BIGGER ? -1 : 1) * BOTTOM_CURVE_RADIUS , 
	BOTTOM_LENGTH, 
	(BOTTOM_BIGGER ? 1 : -1) * BOTTOM_CURVE_RADIUS, 
	tangentPoints[0].x,
	tangentPoints[0].y,
	resolution));

points = points.concat(tangentPoints);

points = points.concat(createCurve(
	TOP_RADIUS + (BOTTOM_BIGGER ? 1 : -1) * TOP_CURVE_RADIUS , 
	BOTTOM_LENGTH + MIDDLE_LENGTH, 
	(BOTTOM_BIGGER ? -1 : 1) * TOP_CURVE_RADIUS, 
	tangentPoints[1].x,
	tangentPoints[1].y,
	resolution));

points = points.concat(createStraight(BOTTOM_LENGTH + MIDDLE_LENGTH, TOP_LENGTH, TOP_RADIUS));

//console.log(points);
const geometry = new THREE.LatheGeometry( points, resolution * 2)
const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5} );
lineMaterial.linewidth = 5
const lineGeo = new THREE.BufferGeometry().setFromPoints( points );

const meshMaterial = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );

const line = new THREE.Line(lineGeo, lineMaterial);
//const latheLine = new THREE.LineSegments( geometry, lineMaterial );
const lathe = new THREE.Mesh( geometry, meshMaterial );

scene.add(line);
scene.add( lathe );
//scene.add( latheLine );


function animate() {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	renderer.render( scene, camera );

}

animate();