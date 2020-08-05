import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
    this.container.matrixAutoUpdate = false; // save updates to resize

    this.target = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.targetEased = new THREE.Vector3();
    this.easing = 0.15;

    // debug folder
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('camera');
    }

    this.setAngle();
    this.setInstance();
    // this.setZoom();
    this.setOrbitControls();
  }

  setAngle() {
    // set up
    this.angle = {};
    this.angle.value = new THREE.Vector3();
    this.angle.height = 0.5;
    this.angle.lerpAlpha = 0.125;

    // debug
    if(this.debug)
    {
      this.debugFolder.add(this.angle, 'lerpAlpha').step(0.0001).min(0).max(1).name('lerpAlpha');
      this.debugFolder.add(this.angle, 'height').step(0.0001).min(0).max(100).name('height');
    }

    // update event
    this.time.on('update', () => {
      let targetAngle = this.direction.clone().negate().add(new THREE.Vector3(0, 0, this.angle.height));
      this.angle.value.lerp(targetAngle, this.angle.lerpAlpha);
    });
  }

  setInstance() {
    // set up
    this.instance = new THREE.PerspectiveCamera(70, this.sizes.viewport.width / this.sizes.viewport.height, 1, 80);
    this.instance.up.set(0, 0, 1);
    this.instance.position.copy(this.angle.value);
    this.instance.distance = 8;
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
        this.instance.position.copy(this.target).add(this.angle.value.clone().multiplyScalar(this.instance.distance));
        this.instance.lookAt(this.target);
      }
    });
  }
  
  // TODO: Zoom mouse wheel
  // setZoom() {
  //   this.zoom = {};
  //   this.zoom.distance = 0.8;
  // }

  setOrbitControls() {
    // set up
    this.orbitControls = new OrbitControls(this.instance, this.renderer.domElement);
    this.orbitControls.enabled = false;
    this.orbitControls.enableKeys = false;
    this.orbitControls.zoomSpeed = 0.5;

    // debug (enable/disable)
    if (this.debug) {
      this.debugFolder.add(this.orbitControls, 'enabled').name('orbitControlsEnabled');
    }
  }
}