import * as THREE from 'three';
import Physics from './Physics.js';
import Controls from './Controls.js';
import Car from './Car.js';
// TODO: Import the stuff needed

export default class {
    /**
     * Constructor
     */
    constructor(_options) {
        // options
        this.config = _options.config;
        this.debug = _options.debug;
        this.resources = _options.resources;
        this.time = _options.time;
        this.sizes = _options.sizes;
        this.camera = _options.camera;
        this.renderer = _options.renderer;
        this.passes = _options.passes;

        // set debug folder
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('world');
            this.debugFolder.open();
        }

        // set up
        this.container = new THREE.Object3D();
        this.container.matrixAutoUpdate = false;

        // TODO: setup functions pre-load
        // this.setSounds();
        this.setControls();
        // this.setFloor(); ?might not keep or change?
        // this.setAreas(); ?might keep single area initialization?
        // this.setStartingScreen();
        this.resources.on('ready', () => {
            console.log('scene is ready to load');
            this.start();
          });
    }

    /**
     * Runs all setup functions needed after pressing
     * start on the initial screen (post loading screen).
     */
    start() {
        // enables camera pan; TODO: implement camera pan
        // window.setTimeout(() => {
        //     this.camera.pan.enable();
        // }, 2000);

        // TODO: figure out all of these functions, scrap uneeded
        // this.setReveal();
        // this.setMaterials();
        // this.setShadows();
        this.setPhysics();
        // this.setZones();
        this.setObjects();
        this.setCar();
        // this.areas.car = this.car; // ??
        // this.setTiles();
        // this.setWalls();
        // this.setSections();
        // this.setEasterEggs();
    }

    /**
     * Initializes the controls.
     */
    setControls() {
        this.controls = new Controls({
            config: this.config,
            sizes: this.sizes,
            time: this.time,
            camera: this.camera,
            sounds: this.sounds
        });
    }

    /**
     * Initializes physics.
     */
    setPhysics() {
        this.physics = new Physics({
            config: this.config,
            debug: this.debug,
            time: this.time,
            sizes: this.sizes,
            controls: this.controls,
            sounds: this.sounds
        });

        // add physics models (wireframe) to world container
        this.container.add(this.physics.models.container);
    }

    /**
     * Initializes objects to world.
     */
    setObjects() {
        // TODO: waiting on .js equivalent
    }

     /**
     * Initializes car to world.
     */
    setCar() {
        this.car = new Car({
            config: this.config,
            debug: this.debugFolder,
            time: this.time,
            resources: this.resources,
            objects: this.objects,
            physics: this.physics,
            shadows: this.shadows,
            materials: this.materials,
            controls: this.controls,
            sounds: this.sounds,
            renderer: this.renderer,
            camera: this.camera
        });

        // add car object to world container
        this.container.add(this.car.container);
    }
}