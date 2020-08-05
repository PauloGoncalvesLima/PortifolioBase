import * as THREE from 'three';

// utils
import Sizes from './utils/Sizes.js';
import Time from './utils/Time.js';

import Resources from './Resources.js';
import Camera from './Camera.js';

import World from './World/World.js';

export default class Application {
    /**
     * Constructor
     */
    constructor(_options) {
        // options
        this.$canvas = _options.$canvas;

        // set up
        this.time = new Time();
        this.sizes = new Sizes();
        this.resources = new Resources();

        // TODO: finish setup functions
        this.setConfig();
        this.setDebug();
        this.setRenderer();
        this.setCamera();
        // this.setPasses();
        this.setWorld();
        // this.setTitle();
    }

    // TODO:
    setConfig() {

    }

    // TODO:
    setDebug() {

    }

    /**
     * Initializes the THREE scene and renderer to
     * the canvas given in constructor options.
     */
    setRenderer() {
        // set up scene
        this.scene = new THREE.Scene();

        // set up renderer
        this.renderer = new THREE.WebGLRenderer ({
            canvas: this.$canvas,
            alpha: true
        });
        this.renderer.setClearColor("black", 1);
        this.renderer.setPixelRatio(2); // improves anti-aliasing
        this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height);
        // this.renderer.physicallyCorrectLights = true;
        this.renderer.gammaFactor = 2.2;
        this.renderer.gammaOutPut = true;
        this.renderer.autoClear = false;

        // adjust aspect on resize event
        this.sizes.on('resize', () => {
            this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height);
        });
    }

    /**
     * Initializes camera and updates its
     * movement through the car position and
     * facing direction.
     */
    setCamera() {
        // set up camera
        this.camera = new Camera({
            time: this.time,
            sizes: this.sizes,
            renderer: this.renderer,
            debug: this.debug,
            config: this.config
        });

        // add to scene
        this.scene.add(this.camera.container);

        // update camera position per frame
        this.time.on('update', () => {
            if (this.world && this.world.car) { // if car is on the scene
                this.camera.target.x = this.world.car.chassis.object.position.x;
                this.camera.target.y = this.world.car.chassis.object.position.y;
                this.camera.direction.x = this.world.car.movement.direction.x;
                this.camera.direction.y = this.world.car.movement.direction.y;
            }
        });
    }

    /**
     * Initializes the world and adds
     * it to the scene.
     */
    setWorld() {
        this.world = new World({
            config: this.config,
            debug: this.debug,
            resources: this.resources,
            time: this.time,
            sizes: this.sizes,
            camera: this.camera,
            renderer: this.renderer,
            passes: this.passes
        });

        // add world to scene
        this.scene.add(this.world.container);
    }
}