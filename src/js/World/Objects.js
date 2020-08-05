// HARD TODO: most likely very different from original if we don't wish to parse shapes into buffer geometry.

import * as THREE from 'three';

export default class Objects {
    constructor(_options) {
        // options
        this.time = _options.time;
        this.resources = _options.resources;
        // this.materials = _options.materials
        this.physics = _options.physics;
        // this.shadows = _options.shadows
        // this.sounds = _options.sounds
        this.debug = _options.debug;

        // set up
        this.container = new THREE.Object3D();
        this.container.matrixAutoUpdate = false;

        // TODO:
    }

    add(_options) {
        // TODO:
    }
}