import * as THREE from 'three';
import * as dat from 'dat.gui';

// utils
import Sizes from './utils/Sizes.js';
import Time from './utils/Time.js';

import Resources from './Resources.js';
import Camera from './Camera.js';

// postprocess effects
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import BlurPass from './Passes/Blur.js'
import GlowsPass from './Passes/Glows.js'

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
        this.setPasses();
        this.setWorld();
        // this.setTitle();
    }

    // TODO: rest of config setup
    setConfig() {
        this.config = {};
        this.config.debug = window.location.hash === '#debug';
    }

    /**
     * Creates the debug folder.
     */
    setDebug() {
        if (this.config.debug) {
            this.debug = new dat.GUI({ width: 420 });
        }
    }

    /**
     * Initializes the THREE scene and renderer to
     * the canvas given in constructor options.
     */
    setRenderer() {
        // set up scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( "#92DFF7" );


        // set up renderer
        this.renderer = new THREE.WebGLRenderer ({
            canvas: this.$canvas,
            alpha: true
        });
        this.renderer.setClearColor("white", 1);
        this.renderer.setPixelRatio(2); // improves anti-aliasing
        this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.gammaFactor = 2.2;
        this.renderer.gammaOutPut = true;
        this.renderer.autoClear = false;

        // adjust aspect on resize event
        this.sizes.on('resize', () => {
            this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height);
        });

        // render scene TODO: must change if post process passes are added.
        // this.time.on('update', () => {
        //     // console.log('rendering stuff');
        //     this.renderer.render(this.scene, this.camera.instance);
        // });
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
                this.camera.target.z = this.world.car.chassis.object.position.z;
                this.camera.direction.x = this.world.car.movement.direction.x;
                this.camera.direction.y = this.world.car.movement.direction.y;
            }
        });
    }

    /**
     * Sets post processing effects for rendering,
     * as well as rendering image on each update.
     */
    setPasses() {
        this.passes = {};

        // composer
        this.passes.composer = new EffectComposer(this.renderer);

        // create each pass
        this.passes.renderPass = new RenderPass(this.scene, this.camera.instance);

        // blur passes
        // horizontal
        this.passes.horizontalBlurPass = new ShaderPass(BlurPass);
        this.passes.horizontalBlurPass.strength = this.config.touch ? 0 : 1;
        this.passes.horizontalBlurPass.material.uniforms.uResolution.value = new THREE.Vector2(this.sizes.viewport.width, this.sizes.viewport.height);
        this.passes.horizontalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(this.passes.horizontalBlurPass.strength, 0);

        // vertical
        this.passes.verticalBlurPass = new ShaderPass(BlurPass);
        this.passes.verticalBlurPass.strength = this.config.touch ? 0 : 1;
        this.passes.verticalBlurPass.material.uniforms.uResolution.value = new THREE.Vector2(this.sizes.viewport.width, this.sizes.viewport.height);
        this.passes.verticalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(this.passes.horizontalBlurPass.strength, 0);

        // glow pass
        this.passes.glowsPass = new ShaderPass(GlowsPass);
        this.passes.glowsPass.color = '#FFF2BB' // light pink/red
        this.passes.glowsPass.material.uniforms.uPosition.value = new THREE.Vector2(0, 1);
        this.passes.glowsPass.material.uniforms.uRadius.value = 0.5;
        this.passes.glowsPass.material.uniforms.uColor.value = new THREE.Color(this.passes.glowsPass.color);
        this.passes.glowsPass.material.uniforms.uAlpha.value = 0.4;

        // debug
        if (this.debug) {
            this.passes.debugFolder = this.debug.addFolder('postprocess');
            
            const blurFolder = this.passes.debugFolder.addFolder('blur');
            blurFolder.add(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, 'x').step(0.001).min(0).max(10);
            blurFolder.add(this.passes.verticalBlurPass.material.uniforms.uStrength.value, 'y').step(0.001).min(0).max(10);
            blurFolder.open();

            const glowsFolder = this.passes.debugFolder.addFolder('glows');
            glowsFolder.add(this.passes.glowsPass.material.uniforms.uPosition.value, 'x').step(0.001).min(-1).max(2).name('positionX');
            glowsFolder.add(this.passes.glowsPass.material.uniforms.uPosition.value, 'y').step(0.001).min(-1).max(2).name('positionY');
            glowsFolder.add(this.passes.glowsPass.material.uniforms.uRadius, 'value').step(0.001).min(0).max(2).name('radius');
            glowsFolder.addColor(this.passes.glowsPass, 'color').name('color').onChange(() => {
                this.passes.glowsPass.material.uniforms.uColor.value = new THREE.Color(this.passes.glowsPass.color);
            });
            glowsFolder.add(this.passes.glowsPass.material.uniforms.uAlpha, 'value').step(0.001).min(0).max(1).name('alpha');
            glowsFolder.open();
        }

        // add passes to composer
        this.passes.composer.addPass(this.passes.renderPass);
        this.passes.composer.addPass(this.passes.horizontalBlurPass);
        this.passes.composer.addPass(this.passes.verticalBlurPass);
        this.passes.composer.addPass(this.passes.glowsPass);

        // resize
        this.sizes.on('resize', () => {
            this.passes.composer.setSize(this.sizes.viewport.width, this.sizes.viewport.height);
            this.passes.horizontalBlurPass.material.uniforms.uResolution.value.x = this.sizes.viewport.width;
            this.passes.horizontalBlurPass.material.uniforms.uResolution.value.y = this.sizes.viewport.height;
            this.passes.verticalBlurPass.material.uniforms.uResolution.value.x = this.sizes.viewport.width;
            this.passes.verticalBlurPass.material.uniforms.uResolution.value.y = this.sizes.viewport.height;
        });

        // update
        this.time.on('update', () => {
            // disable at zero value
            this.passes.horizontalBlurPass.enabled = this.passes.horizontalBlurPass.material.uniforms.uStrength.value.x > 0;
            this.passes.verticalBlurPass.enabled = this.passes.verticalBlurPass.material.uniforms.uStrength.value.y > 0;

            // render
            this.passes.composer.render();
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