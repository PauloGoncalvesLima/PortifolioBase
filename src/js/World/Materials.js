import * as THREE from 'three';
// import FloorShadowMaterial from '../Materials/FloorShadow.js' // TODO: ? maybe implement shadows ?
import MatcapMaterial from '../Materials/Matcap.js'

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
        this.shades.indirectColor = "#0E0E34";
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

        // black
        this.shades.items.black = new MatcapMaterial();
        this.shades.items.black.name = 'shadeBlack';
        this.shades.items.black.uniforms.matcap.value = this.resources.items.matcapBlackTexture;
        this.items.black = this.shades.items.black;

        // blackMatte
        this.shades.items.blackMatte = new MatcapMaterial();
        this.shades.items.blackMatte.name = 'shadeBlackMatte';
        this.shades.items.blackMatte.uniforms.matcap.value = this.resources.items.matcapBlackMatteTexture;
        this.items.blackMatte = this.shades.items.blackMatte;

        // white
        this.shades.items.white = new MatcapMaterial();
        this.shades.items.white.name = 'shadeWhite';
        this.shades.items.white.uniforms.matcap.value = this.resources.items.matcapWhiteTexture;
        this.items.white = this.shades.items.white;

        // whiteCloth
        this.shades.items.whiteCloth = new MatcapMaterial();
        this.shades.items.whiteCloth.name = 'shadeWhiteCloth';
        this.shades.items.whiteCloth.uniforms.matcap.value = this.resources.items.matcapWhiteClothTexture;
        this.items.whiteCloth = this.shades.items.whiteCloth;

        // grey
        this.shades.items.grey = new MatcapMaterial();
        this.shades.items.grey.name = 'shadeGrey';
        this.shades.items.grey.uniforms.matcap.value = this.resources.items.matcapGreyTexture;
        this.items.grey = this.shades.items.grey;

        // greyGreen
        this.shades.items.greyGreen = new MatcapMaterial();
        this.shades.items.greyGreen.name = 'shadeGreyGreen';
        this.shades.items.greyGreen.uniforms.matcap.value = this.resources.items.matcapGreyGreenTexture;
        this.items.greyGreen = this.shades.items.greyGreen;

        // greyMetal
        this.shades.items.greyMetal = new MatcapMaterial();
        this.shades.items.greyMetal.name = 'shadeGreyMetal';
        this.shades.items.greyMetal.uniforms.matcap.value = this.resources.items.matcapGreyMetalTexture;
        this.items.greyMetal = this.shades.items.greyMetal;

        // beige
        this.shades.items.beige = new MatcapMaterial();
        this.shades.items.beige.name = 'shadeBeige';
        this.shades.items.beige.uniforms.matcap.value = this.resources.items.matcapBeigeTexture;
        this.items.beige = this.shades.items.beige;

        // beigeLight
        this.shades.items.beigeLight = new MatcapMaterial();
        this.shades.items.beigeLight.name = 'shadeBeigeLight';
        this.shades.items.beigeLight.uniforms.matcap.value = this.resources.items.matcapBeigeLightTexture;
        this.items.beigeLight = this.shades.items.beigeLight;

        // blue
        this.shades.items.blue = new MatcapMaterial();
        this.shades.items.blue.name = 'shadeBlue';
        this.shades.items.blue.uniforms.matcap.value = this.resources.items.matcapBlueTexture;
        this.items.blue = this.shades.items.blue;

        // blueCloth
        this.shades.items.blueCloth = new MatcapMaterial();
        this.shades.items.blueCloth.name = 'shadeBlueCloth';
        this.shades.items.blueCloth.uniforms.matcap.value = this.resources.items.matcapBlueClothTexture;
        this.items.blueCloth = this.shades.items.blueCloth;

        // blueLightMatte
        this.shades.items.blueLightMatte = new MatcapMaterial();
        this.shades.items.blueLightMatte.name = 'shadeBlueLightMatte';
        this.shades.items.blueLightMatte.uniforms.matcap.value = this.resources.items.matcapBlueLightMatteTexture;
        this.items.blueLightMatte = this.shades.items.blueLightMatte;

        // blueMatte
        this.shades.items.blueMatte = new MatcapMaterial();
        this.shades.items.blueMatte.name = 'shadeBlueMatte';
        this.shades.items.blueMatte.uniforms.matcap.value = this.resources.items.matcapBlueMatteTexture;
        this.items.blueMatte = this.shades.items.blueMatte;

        // cyanMatte
        this.shades.items.cyanMatte = new MatcapMaterial();
        this.shades.items.cyanMatte.name = 'shadeCyanMatte';
        this.shades.items.cyanMatte.uniforms.matcap.value = this.resources.items.matcapCyanMatteTexture;
        this.items.cyanMatte = this.shades.items.cyanMatte;

        // brown
        this.shades.items.brown = new MatcapMaterial();
        this.shades.items.brown.name = 'shadeBrown';
        this.shades.items.brown.uniforms.matcap.value = this.resources.items.matcapBrownTexture;
        this.items.brown = this.shades.items.brown;

        // brownDark
        this.shades.items.brownDark = new MatcapMaterial();
        this.shades.items.brownDark.name = 'shadeBrownDark';
        this.shades.items.brownDark.uniforms.matcap.value = this.resources.items.matcapBrownDarkTexture;
        this.items.brownDark = this.shades.items.brownDark;

        // brownVeryDark
        this.shades.items.brownVeryDark = new MatcapMaterial();
        this.shades.items.brownVeryDark.name = 'shadeBrownVeryDark';
        this.shades.items.brownVeryDark.uniforms.matcap.value = this.resources.items.matcapBrownVeryDarkTexture;
        this.items.brownVeryDark = this.shades.items.brownVeryDark;

        // green
        this.shades.items.green = new MatcapMaterial();
        this.shades.items.green.name = 'shadeGreen';
        this.shades.items.green.uniforms.matcap.value = this.resources.items.matcapGreenTexture;
        this.items.green = this.shades.items.green;

        // greenBright
        this.shades.items.greenBright = new MatcapMaterial();
        this.shades.items.greenBright.name = 'shadeGreenBright';
        this.shades.items.greenBright.uniforms.matcap.value = this.resources.items.matcapGreenBrightTexture;
        this.items.greenBright = this.shades.items.greenBright;

        // greenDark
        this.shades.items.greenDark = new MatcapMaterial();
        this.shades.items.greenDark.name = 'shadeGreenDark';
        this.shades.items.greenDark.uniforms.matcap.value = this.resources.items.matcapGreenDarkTexture;
        this.items.greenDark = this.shades.items.greenDark;

        // greenMatte
        this.shades.items.greenMatte = new MatcapMaterial();
        this.shades.items.greenMatte.name = 'shadeGreenMatte';
        this.shades.items.greenMatte.uniforms.matcap.value = this.resources.items.matcapGreenMatteTexture;
        this.items.greenMatte = this.shades.items.greenMatte;

        // orangeMatte
        this.shades.items.orangeMatte = new MatcapMaterial();
        this.shades.items.orangeMatte.name = 'shadeOrangeMatte';
        this.shades.items.orangeMatte.uniforms.matcap.value = this.resources.items.matcapOrangeMatteTexture;
        this.items.orangeMatte = this.shades.items.orangeMatte;

        // orangeMetal
        this.shades.items.orangeMetal = new MatcapMaterial();
        this.shades.items.orangeMetal.name = 'shadeOrangeMetal';
        this.shades.items.orangeMetal.uniforms.matcap.value = this.resources.items.matcapOrangeMetalTexture;
        this.items.orangeMetal = this.shades.items.orangeMetal;

        // redBright
        this.shades.items.redBright = new MatcapMaterial();
        this.shades.items.redBright.name = 'shadeRedBright';
        this.shades.items.redBright.uniforms.matcap.value = this.resources.items.matcapRedBrightTexture;
        this.items.redBright = this.shades.items.redBright;

        // redCloth
        this.shades.items.redCloth = new MatcapMaterial();
        this.shades.items.redCloth.name = 'shadeRedCloth';
        this.shades.items.redCloth.uniforms.matcap.value = this.resources.items.matcapRedClothTexture;
        this.items.redCloth = this.shades.items.redCloth;

        // redMatte
        this.shades.items.redMatte = new MatcapMaterial();
        this.shades.items.redMatte.name = 'shadeRedMatte';
        this.shades.items.redMatte.uniforms.matcap.value = this.resources.items.matcapRedMatteTexture;
        this.items.redMatte = this.shades.items.redMatte;

        // redMetal
        this.shades.items.redMetal = new MatcapMaterial();
        this.shades.items.redMetal.name = 'shadeRedMetal';
        this.shades.items.redMetal.uniforms.matcap.value = this.resources.items.matcapRedMetalTexture;
        this.items.redMetal = this.shades.items.redMetal;

        // redGlow
        this.shades.items.redGlow = new MatcapMaterial();
        this.shades.items.redGlow.name = 'shadeRedGlow';
        this.shades.items.redGlow.uniforms.matcap.value = this.resources.items.matcapRedGlowTexture;
        this.items.redGlow = this.shades.items.redGlow;

        // purple
        this.shades.items.purple = new MatcapMaterial();
        this.shades.items.purple.name = 'shadePurple';
        this.shades.items.purple.uniforms.matcap.value = this.resources.items.matcapPurpleTexture;
        this.items.purple = this.shades.items.purple;

        // yellowLight
        this.shades.items.yellowLight = new MatcapMaterial();
        this.shades.items.yellowLight.name = 'shadeYellowLight';
        this.shades.items.yellowLight.uniforms.matcap.value = this.resources.items.matcapYellowLightTexture;
        this.items.yellowLight = this.shades.items.yellowLight;

        // yellowGlow
        this.shades.items.yellowGlow = new MatcapMaterial();
        this.shades.items.yellowGlow.name = 'shadeYellowGlow';
        this.shades.items.yellowGlow.uniforms.matcap.value = this.resources.items.matcapYellowGlowTexture;
        this.items.yellowGlow = this.shades.items.yellowGlow;

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