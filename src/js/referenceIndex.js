import "../css/style.css"
import * as THREE from 'three';

import Resources from './Resources';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// RENDERER!!!!
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor("white", 1);
renderer.setPixelRatio(2);
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

var controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 3;

const resources = new Resources();
// add objects
resources.on('ready', () => {
  console.log('scene is ready to load');
  // add car
  scene.add(resources.items['car'].scene);
});

// lighting
var ambientLight = new THREE.AmbientLight("white", 1);
scene.add(ambientLight);

var pointLight = new THREE.PointLight("white", 75, 100);
pointLight.position.set(3, 3, 3)

var targetObject = new THREE.Object3D();
scene.add(targetObject);

var directionalLight = new THREE.DirectionalLight("white", 15);
directionalLight.position.set(0,7,10);

directionalLight.rotation.set(0, 90 * (Math.PI/180), 0);
targetObject.position.set(0,5, -3);
directionalLight.target = targetObject;

scene.add(directionalLight);

var spotLight = new THREE.SpotLight("white", 25);
spotLight.position.set(0, 3, 0);

// game logic
let update = () => {
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.005;

  // var time = Date.now() * 0.0005;

  // pointLight.position.x = Math.sin(time * 0.7) * 3;
  // pointLight.position.y = Math.sin(time * 0.5) * 4;
  // pointLight.position.z = Math.sin(time * 0.3) * 3;
}

// draw scene
let render = () => {
  renderer.render(scene, camera);
}

// run game loop (update, render, repeat)
let gameLoop = () => {
  requestAnimationFrame(gameLoop); // run every frame

  controls.update();
  update();
  render();
}

// run
gameLoop();