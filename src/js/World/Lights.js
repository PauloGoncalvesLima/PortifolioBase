import * as THREE from 'three';
import { Vector3 } from 'three';

export default class Lights {
    /**
     * Constructor
     */
    constructor(_options) {
        // options
        this.debug = _options.debug;

        // set up
        this.container = new THREE.Object3D();

        // debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('lights');
        }

        this.setAmbient();
        this.setSun();
    }

    setAmbient() {
        this.ambient = {};

        // options
        this.ambient.options = {}
        this.ambient.options.color = '#FFFFFF';
        this.ambient.options.strength = 1;
        
        // create
        this.ambient.create = () => {
            this.ambient.object = new THREE.AmbientLight(this.ambient.options.color, this.ambient.options.strength);
            this.container.add(this.ambient.object);
        }

        // destroy
        this.ambient.destroy = () => {
            this.container.remove(this.ambient.object);
        }

        // recreate
        this.ambient.recreate = () => {
            this.ambient.destroy();
            this.ambient.create();
        }

        // create the initial light
        this.ambient.create();

        // debug
        if (this.debug) {
            this.ambient.debugFolder = this.debugFolder.addFolder('ambient');
            this.ambient.debugFolder.open();

            this.ambient.debugFolder.addColor(this.ambient.options, 'color').name('color').onFinishChange(this.ambient.recreate);
            this.ambient.debugFolder.add(this.ambient.options, 'strength').step(0.001).min(0).max(5).name('strength').onFinishChange(this.ambient.recreate);
        }
    }

    setSun() {
        this.sun = {};

        // options
        this.sun.options = {};
        this.sun.options.color = '#FFFFFF';
        this.sun.options.strength = 15;
        this.sun.options.position = new Vector3(0, 7, 10);
        // default target is (0, 0, 0)

        // create
        this.sun.create = () => {
            this.sun.object = new THREE.DirectionalLight(this.sun.options.color, this.sun.options.strength);
            this.sun.object.position.copy(this.sun.options.position);
            this.container.add(this.sun.object);
        }
        
        // destroy
        this.sun.destroy = () => {
            this.container.remove(this.sun.object);
        }

        // recreate
        this.sun.recreate = () => {
            this.sun.destroy();
            this.sun.create();
        }

        // create the initial light
        this.sun.create();

        // debug
        if (this.debug) {
            this.sun.debugFolder = this.debugFolder.addFolder('sun');
            this.sun.debugFolder.open();

            this.sun.debugFolder.addColor(this.sun.options, 'color').name('color').onFinishChange(this.sun.recreate);
            this.sun.debugFolder.add(this.sun.options, 'strength').step(0.001).min(0).max(30).name('strength').onFinishChange(this.sun.recreate);

            this.sun.debugFolder.add(this.sun.options.position, 'x').step(0.001).min(-30).max(30).name('posX').onFinishChange(this.sun.recreate);
            this.sun.debugFolder.add(this.sun.options.position, 'y').step(0.001).min(-30).max(30).name('posY').onFinishChange(this.sun.recreate);
            this.sun.debugFolder.add(this.sun.options.position, 'z').step(0.001).min(-30).max(30).name('posZ').onFinishChange(this.sun.recreate);
        }
    }
}