import * as THREE from 'three';

export default class Env {
    /**
     * Constructor
     */
    constructor(_options) {
        // options
        this.resources = _options.resources;
        this.objects = _options.objects;
        this.config = _options.config;
        this.debug = _options.debug;

        // container
        this.container = new THREE.Object3D();

        // debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('floor');
        }

        this.setModels();
        this.setRoad();
        this.setDecour();
    }

    /**
     * Fetches needed models from loaded resources.
     */
    setModels() {
        this.models = {};
        this.models.road = this.resources.items.envRoad;
        this.models.tree = this.resources.items.tree;
    }

    // FIXME: make this only load the road, not decour
    /**
     * Creates and positions the road object.
     */
    setRoad() {
        this.road = {};

        // options
        this.road.options = {};
        this.road.options.position = new THREE.Vector3(72.5, -20, -0.172);

        // create
        this.road.object = this.objects.getConvertedMesh(this.models.road.scene.children);
        this.road.object.position.copy(this.road.options.position);
        this.container.add(this.road.object);
        // TODO: set collision, depends on Object.js

        // update properties on debug
        this.road.update = () => {
            this.road.object.position.copy(this.road.options.position);
        }

        // debug
        if (this.debug) {
            this.debugFolder.add(this.road.options.position, 'x').step(0.001).min(-100).max(100).name('posX').onFinishChange(this.road.update);
            this.debugFolder.add(this.road.options.position, 'y').step(0.001).min(-100).max(100).name('posY').onFinishChange(this.road.update);
            this.debugFolder.add(this.road.options.position, 'z').step(0.001).min(-30).max(30).name('posZ').onFinishChange(this.road.update);
        }
    }

    setDecour() {
        // TODO:
    }
}