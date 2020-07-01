import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// TODO: GSAP

export default class Camera {

  constructor(_options) {
    // load options
    this.time = _options.time;
    this.sizes = _options.sizes;
    this.renderer = _options.renderer;
    this.debug = _options.debug;
    this.config = _options.config;

    // set up
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false; // ???

    this.target = new THREE.Vector3();
    this.targetEased = new THREE.Vector3();
    this.easing = 0.15;

    // debug folder
    if (this.debug) {
      // this.debugFolder = this.debug.addFolder('camera');
    }

    this.setAngle();
    this.setInstance();
    this.setZoom();
    this.setPan();
    this.setOrbitControls();
  }

  setAngle() {
    // TODO: Brainstorm a way to get the camera angle relative to the car
    // set up
    this.angle = {};

    // each possible angle
    this.angle.items = {
      default: new THREE.Vector3()
    }
  }

  setInstance() {
    // set up
    this.instance = new THREE.PerspectiveCamera(70, this.sizes.viewport.width / this.sizes.viewport.height, 1, 80);
    this.instance.up.set(0, 0, 1);
    this.instance.position.copy(this.angle.value);
    this.instance.lookAt(new THREE.Vector3());
    this.container.add(this.instance);

    // resize event
    this.sizes.on('resize', () => {
      // update aspect ratio to new size
      this.instance.aspect = this.sizes.viewport.width / this.sizes.viewport.height;
      this.instance.updateProjectionMatrix();
    });

    // update event
    this.time.on('update', () => {
      // out of debug camera
      if (!this.orbitControls.enabled) {
        // TODO: Easing
        
      }
    });
  }

  setZoom() {

  }

  setPan() {

  }

  setOrbitControls() {
    // set up
    this.orbitControls = new OrbitControls(this.instance, this.renderer.domElement);
    this.orbitControls.enabled = false;
    this.orbitControls.enableKeys = false;
    this.orbitControls.zoomSpeed = 0.5;

    // debug (enable/disable)
    if (this.debug) {
      // this.debugFolder.add(this.orbitControls, 'enabled').name('orbitControlsEnabled');
    }
  }
}