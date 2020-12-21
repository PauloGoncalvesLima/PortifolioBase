import * as THREE from 'three';
// TODO: Learn and import GSAP

import EventEmitter from '../utils/EventEmitter.js';
import AreaFloorBorderBufferGeometry from '../Geometries/AreaFloorBorderBuffer.js';
import AreaFenceBufferGeometry from '../Geometries/AreaFenceBuffer.js';
// TODO: Import area materials

export default class Area extends EventEmitter {
    constructor(_options) {
        super();

        // options
        this.config = _options.config;
        this.renderer = _options.renderer;
        this.resources = _options.resources;
        this.car = _options.car;
        this.sounds = _options.sounds;
        this.time = _options.time;
        this.position = _options.position;
        this.halfExtents = _options.halfExtents;
        this.hasKey = _options.hasKey;
        this.testCar = _options.testCar;
        this.active = _options.active;

        // set up
        this.container = new THREE.Object3D();
        this.container.position.x = this.position.x;
        this.container.position.y = this.position.y;
        this.container.matrixAutoUpdate = false;
        this.container.updateMatrix();

        this.initialTestCar = this.testCar; // ????
        this.isIn = false;

        // set up functions
        this.setFloorBorder();
        this.setFence();
        this.setInteractions();

        if (this.hasKey) {
            this.setKey();
        }
    }

    // Makes area interactable.
    activate() {
        this.active = true;

        if(this.isIn) {
            this.in();
        }
    }

    // Prevents interaction with area.
    deactivate() {
        this.active = false;

        if(this.isIn) {
            this.out();
        }
    }

    // TODO:
    setFloorBorder() {

    }

    // TODO:
    setFence() {

    }

    // TODO:
    setInteractions() {

    }

    // TODO:
    setKey() {

    }
}