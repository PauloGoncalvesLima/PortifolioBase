import * as THREE from 'three';
import { MeshMatcapMaterial } from 'three';
// import FloorShadowMaterial from '../Materials/FloorShadow.js' // TODO: ? maybe implement shadows ?
import MatcapMaterial from '../Materials/Matcap.js' // TODO: implement matcap material

export default class Materials {
    /**
     * Constructor
     */
    constructor(_options) {
        // options
        this.resources = _options.resources;
        this.debug = _options.debug;

        // debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('materials');
            this.debugFolder.open();
        }

        // set up
        this.items = {};

        this.setPures();
        this.setShades();
        // this.setFloorShadow();
    }

    /**
     * Creates unshaded materials,
     * used in lights or UI. FIXME: maybe not UI
     */
    setPures() {
        this.pures = {};
        this.pures.items = {};
        this.pures.items.red = new THREE.MeshBasicMaterial({ color: "#FF0000" });
        this.pures.items.red.name = 'pureRed';
        this.pures.items.white = new THREE.MeshBasicMaterial({ color: "#FF0000" });
        this.pures.items.white.name = 'pureWhite';
        this.pures.items.yellow = new THREE.MeshBasicMaterial({ color: "#FF0000" });
        this.pures.items.yellow.name = 'pureYellow';
    }

    /**
     * Creates shaded matcap textures,
     * used throughout most 3D objects.
     */
    setShades() {
        this.shades = {};
        this.shades.items = {};
        
        // options
        this.shades.indirectColor = "#D04500";
        this.shades.uniforms = {
            uRevealProgress: 0,
            uIndirectDistanceAmplitude: 1.75,
            uIndirectDistanceStrength: 0.5,
            uIndirectDistancePower: 2.0,
            uIndirectAngleStrength: 1.5,
            uIndirectAngleOffset: 0.6,
            uIndirectAnglePower: 1.0,
            uIndirectColor: null
        }

        // orangeMetal
        this.shades.items.orangeMetal = new MatcapMaterial();
        this.shades.items.orangeMetal.name = 'shadeOrangeMetal';
        this.shades.items.orangeMetal.uniforms.matcap.value = this.resources.items.matcapOrangeMetalTexture;
        this.items.orangeMetal = this.shades.items.orangeMetal;

        // update uniforms for materials (used for debugging and first set)
        this.shades.updateMaterials = () => {
            this.shades.uniforms.uIndirectColor = new THREE.Color(this.shades.indirectColor);

            // for each uniform
            for (const _uniformName in this.shades.uniforms) {
                const _uniformValue = this.shades.uniforms[_uniformName];
                // for each material
                for (const _materialKey in this.shades.items) {
                    const material = this.shades.items[_materialKey];
                    material.uniforms[_uniformName].value = _uniformValue;
                }
            }
        }

        // initial update for default uniforms
        this.shades.updateMaterials();

        // debug
        if (this.debug) {
            this.shades.debugFolder = this.debugFolder.addFolder('shades');
            this.shades.debugFolder.open();

            this.shades.debugFolder.add(this.shades.uniforms, 'uIndirectDistanceAmplitude').step(0.001).min(0).max(3).onChange(this.shades.updateMaterials);
            this.shades.debugFolder.add(this.shades.uniforms, 'uIndirectDistanceStrength').step(0.001).min(0).max(2).onChange(this.shades.updateMaterials);
            this.shades.debugFolder.add(this.shades.uniforms, 'uIndirectDistancePower').step(0.001).min(0).max(5).onChange(this.shades.updateMaterials);
            this.shades.debugFolder.add(this.shades.uniforms, 'uIndirectAngleStrength').step(0.001).min(0).max(2).onChange(this.shades.updateMaterials);
            this.shades.debugFolder.add(this.shades.uniforms, 'uIndirectAngleOffset').step(0.001).min(-2).max(2).onChange(this.shades.updateMaterials);
            this.shades.debugFolder.add(this.shades.uniforms, 'uIndirectAnglePower').step(0.001).min(0).max(5).onChange(this.shades.updateMaterials);
            this.shades.debugFolder.addColor(this.shades, 'indirectColor').onChange(this.shades.updateMaterials);
        }
    }

    setFloorShadow() {
        // TODO: maybe if shadows are implemented
    }
}