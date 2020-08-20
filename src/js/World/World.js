import * as THREE from 'three';
import Materials from './Materials.js';
import Physics from './Physics.js';
import Objects from './Objects.js';
import Controls from './Controls.js';
import Env from './Env.js';
import Car from './Car.js';
import Lights from './Lights.js';
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
        this.setReveal();
        this.setMaterials();
        // this.setShadows();
        this.setPhysics();
        this.setLights();
        // this.setZones();
        this.setObjects();
        this.setEnv();
        this.setCar();
        // this.areas.car = this.car; // ??
        // this.setTiles();
        // this.setWalls();
        // this.setSections();
        // this.setEasterEggs();
    }

    setReveal() {
        this.reveal = {};
        this.reveal.matcapsProgress = 0;
        // this.reveal.floorShadowsProgress = 0;
        this.reveal.previousMatcapsProgress = null;
        // this.reveal.previousFloorShadowsProgress = null;

        // method to initiate reveal process
        this.reveal.go = () => {
            // matcap reveal
            let step = this.reveal.matcapsProgress + (1 - this.reveal.matcapsProgress) / 2;
            this.reveal.matcapsProgress = step > 1 ? 1 : step;
            // TODO: shadows

            // car setup
            this.physics.car.chassis.body.sleep();
            this.physics.car.chassis.body.position.set(0,0,12);
            window.setTimeout(() => {
                this.physics.car.chassis.body.wakeUp();
            }, 300);

            // sound TODO:
            // touch controls TODO:
        }

        // update function
        this.time.on('update', () => {
            // matcap progress changed
            if(this.reveal.matcapsProgress !== this.reveal.previousMatcapsProgress) {
                // update each material
                for(const _materialKey in this.materials.shades.items) {
                    const material = this.materials.shades.items[_materialKey];
                    material.uniforms.uRevealProgress.value = this.reveal.matcapsProgress;
                }
                // save previous
                this.reveal.previousMatcapsProgress = this.reveal.matcapsProgress;
            }
            // TODO: shadows
        });

        // debug
        if (this.debug) {
            this.debugFolder.add(this.reveal, 'matcapsProgress').step(0.0001).min(0).max(1).name('matcapsProgress');
            // this.debugFolder.add(this.reveal, 'floorShadowProgress').step(0.0001).min(0).max(1).name('floorShadowProgress');
            this.debugFolder.add(this.reveal, 'go').name('reveal');
        }
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
     * Initializes the shading materials.
     */
    setMaterials() {
        this.materials = new Materials({
            resources: this.resources,
            debug: this.debugFolder
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
     * Initializes the world lights.
     */
    setLights() {
        this.lights = new Lights({
            debug: this.debug
        });

        // add lights to world container
        this.container.add(this.lights.container);
    }

    /**
     * Initializes objects to world.
     */
    setObjects() {
        this.objects = new Objects({
            time: this.time,
            resources: this.resources,
            materials: this.materials,
            physics: this.physics,
            shadows: this.shadows,
            sounds: this.sounds,
            debug: this.debugFolder
        });

        // add objects to world container
        this.container.add(this.objects.container);
    }

    /**
     * Initializes the playable environment.
     */
    setEnv() {
        this.env = new Env({
            resources: this.resources,
            config: this.config,
            debug: this.debug
        });

        // add environment to world container
        this.container.add(this.env.container);
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