import * as THREE from 'three';

import EventEmitter from './utils/EventEmitter';
import Loader from './utils/Loader';

// Matcaps
import matcapBeigeSource from '../assets/matcaps/beige.png';
import matcapBeigeLightSource from '../assets/matcaps/beigeLight.png';
import matcapBlackSource from '../assets/matcaps/black.png';
import matcapBlackMatteSource from '../assets/matcaps/blackMatte.png';
import matcapBlueSource from '../assets/matcaps/blue.png';
import matcapBlueClothSource from '../assets/matcaps/blueCloth.png';
import matcapBlueLightMatteSource from '../assets/matcaps/blueLightMatte.png';
import matcapBlueMatteSource from '../assets/matcaps/blueMatte.png';
import matcapBlueWaterSource from '../assets/matcaps/blueWater.png';
import matcapBrownDarkSource from '../assets/matcaps/brownDark.png';
import matcapBrownVeryDarkSource from '../assets/matcaps/brownVeryDark.png';
import matcapCyanMatteSource from '../assets/matcaps/cyanMatte.png';
import matcapGrassDarkSource from '../assets/matcaps/grassDark.png';
import matcapGrassLightSource from '../assets/matcaps/grassLight.png';
import matcapGrassMidSource from '../assets/matcaps/grassMid.png';
import matcapGrassVeryDarkSource from '../assets/matcaps/grassVeryDark.png';
import matcapGreenSource from '../assets/matcaps/green.png';
import matcapGreenBrightSource from '../assets/matcaps/greenBright.png';
import matcapGreenDarkSource from '../assets/matcaps/greenDark.png';
import matcapGreenMatteSource from '../assets/matcaps/greenMatte.png';
import matcapGreySource from '../assets/matcaps/grey.png';
import matcapGreyGreenSource from '../assets/matcaps/greyGreen.png';
import matcapGreyMetalSource from '../assets/matcaps/greyMetal.png';
import matcapMesaRockDarkSource from '../assets/matcaps/mesaRockDark.png';
import matcapMesaRockLightSource from '../assets/matcaps/mesaRockLight.png';
import matcapMesaRockMidSource from '../assets/matcaps/mesaRockMid.png';
import matcapMesaRockVeryDarkSource from '../assets/matcaps/mesaRockVeryDark.png';
import matcapOrangeMatteSource from '../assets/matcaps/orangeMatte.png';
import matcapOrangeMetalSource from '../assets/matcaps/orangeMetal.png';
import matcapPurpleSource from '../assets/matcaps/purple.png';
import matcapRedSource from '../assets/matcaps/red.png';
import matcapRedBrightSource from '../assets/matcaps/redBright.png';
import matcapRedClothSource from '../assets/matcaps/redCloth.png';
import matcapRedGlowSource from '../assets/matcaps/redGlow.png';
import matcapRedMatteSource from '../assets/matcaps/redMatte.png';
import matcapRedMetalSource from '../assets/matcaps/redMetal.png';
import matcapSandDarkSource from '../assets/matcaps/sandDark.png';
import matcapSandLightSource from '../assets/matcaps/sandLight.png';
import matcapSandMidSource from '../assets/matcaps/sandMid.png';
import matcapSandVeryDarkSource from '../assets/matcaps/sandVeryDark.png';
import matcapWhiteSource from '../assets/matcaps/white.png';
import matcapWhiteClothSource from '../assets/matcaps/whiteCloth.png';
import matcapYellowSource from '../assets/matcaps/yellow.png';
import matcapYellowGlowSource from '../assets/matcaps/yellowGlow.png';
import matcapYellowLightSource from '../assets/matcaps/yellowLight.png';

// Car
import carChassisSource from '../assets/models/car/chassis.glb';
import carWheelSource from '../assets/models/car/wheel.glb';

// Environment
import envRoadSource from '../assets/models/env/road.glb';
import envRoadCollisionSource from '../assets/models/env/collision.glb';
import treeSource from '../assets/models/tree.glb';

// Textures
import areaEnterSource from '../assets/textures/enter.png';
import areaKeyEnterSource from '../assets/textures/keyEnter.png';

import piston_topSource from '../assets/img/piston_top.png';
import piston_bottomSource from '../assets/img/piston_bottom.png';
import piston_sideSource from '../assets/img/piston_side.png';

export default class Resources extends EventEmitter {
  /**
   * Loads all game resources
   */
  constructor() {
      super();

      this.loader = new Loader();
      this.items = {};

      this.loader.load([
        // Matcaps
        { name: 'matcapBeige', source: matcapBeigeSource, type: 'texture' },
        { name: 'matcapBeigeLight', source: matcapBeigeLightSource, type: 'texture' },
        { name: 'matcapBlack', source: matcapBlackSource, type: 'texture' },
        { name: 'matcapBlackMatte', source: matcapBlackMatteSource, type: 'texture' },
        { name: 'matcapBlue', source: matcapBlueSource, type: 'texture' },
        { name: 'matcapBlueCloth', source: matcapBlueClothSource, type: 'texture' },
        { name: 'matcapBlueLightMatte', source: matcapBlueLightMatteSource, type: 'texture' },
        { name: 'matcapBlueMatte', source: matcapBlueMatteSource, type: 'texture' },
        { name: 'matcapBlueWater', source: matcapBlueWaterSource, type: 'texture' },
        { name: 'matcapBrownDark', source: matcapBrownDarkSource, type: 'texture' },
        { name: 'matcapBrownVeryDark', source: matcapBrownVeryDarkSource, type: 'texture' },
        { name: 'matcapCyanMatte', source: matcapCyanMatteSource, type: 'texture' },
        { name: 'matcapGrassDark', source: matcapGrassDarkSource, type: 'texture' },
        { name: 'matcapGrassLight', source: matcapGrassLightSource, type: 'texture' },
        { name: 'matcapGrassMid', source: matcapGrassMidSource, type: 'texture' },
        { name: 'matcapGrassVeryDark', source: matcapGrassVeryDarkSource, type: 'texture' },
        { name: 'matcapGreen', source: matcapGreenSource, type: 'texture' },
        { name: 'matcapGreenBright', source: matcapGreenBrightSource, type: 'texture' },
        { name: 'matcapGreenDark', source: matcapGreenDarkSource, type: 'texture' },
        { name: 'matcapGreenMatte', source: matcapGreenMatteSource, type: 'texture' },
        { name: 'matcapGrey', source: matcapGreySource, type: 'texture' },
        { name: 'matcapGreyGreen', source: matcapGreyGreenSource, type: 'texture' },
        { name: 'matcapGreyMetal', source: matcapGreyMetalSource, type: 'texture' },
        { name: 'matcapMesaRockDark', source: matcapMesaRockDarkSource, type: 'texture' },
        { name: 'matcapMesaRockLight', source: matcapMesaRockLightSource, type: 'texture' },
        { name: 'matcapMesaRockMid', source: matcapMesaRockMidSource, type: 'texture' },
        { name: 'matcapMesaRockVeryDark', source: matcapMesaRockVeryDarkSource, type: 'texture' },
        { name: 'matcapOrangeMatte', source: matcapOrangeMatteSource, type: 'texture' },
        { name: 'matcapOrangeMetal', source: matcapOrangeMetalSource, type: 'texture' },
        { name: 'matcapPurple', source: matcapPurpleSource, type: 'texture' },
        { name: 'matcapRed', source: matcapRedSource, type: 'texture' },
        { name: 'matcapRedBright', source: matcapRedBrightSource, type: 'texture' },
        { name: 'matcapRedCloth', source: matcapRedClothSource, type: 'texture' },
        { name: 'matcapRedGlow', source: matcapRedGlowSource, type: 'texture' },
        { name: 'matcapRedMatte', source: matcapRedMatteSource, type: 'texture' },
        { name: 'matcapRedMetal', source: matcapRedMetalSource, type: 'texture' },
        { name: 'matcapSandDark', source: matcapSandDarkSource, type: 'texture' },
        { name: 'matcapSandLight', source: matcapSandLightSource, type: 'texture' },
        { name: 'matcapSandMid', source: matcapSandMidSource, type: 'texture' },
        { name: 'matcapSandVeryDark', source: matcapSandVeryDarkSource, type: 'texture' },
        { name: 'matcapWhite', source: matcapWhiteSource, type: 'texture' },
        { name: 'matcapWhiteCloth', source: matcapWhiteClothSource, type: 'texture' },
        { name: 'matcapYellow', source: matcapYellowSource, type: 'texture' },
        { name: 'matcapYellowGlow', source: matcapYellowGlowSource, type: 'texture' },
        { name: 'matcapYellowLight', source: matcapYellowLightSource, type: 'texture' },

        // Car
        { name: 'carChassis', source: carChassisSource },
        { name: 'carWheel', source: carWheelSource },

        // Environment
        { name: 'envRoad', source: envRoadSource},
        { name: 'envRoadCollision', source: envRoadCollisionSource},
        { name: 'tree', source: treeSource },

        // Area Textures
        { name: 'areaKeyEnter', source: areaKeyEnterSource, type: 'texture' },
        { name: 'areaEnter', source: areaEnterSource, type: 'texture' },

        // Piston
        { name: 'piston_top', source: piston_topSource },
        { name: 'piston_bottom', source: piston_bottomSource },
        { name: 'piston_side', source: piston_sideSource }
      ]);

      // triggered for each file loaded
      this.loader.on('fileEnd', (_resource, _data) => {
        this.items[_resource.name] = _data;

        // texture
        if (_resource.type === 'texture') {
          const texture = new THREE.Texture(_data);
          texture.needsUpdate = true;

          this.items[`${_resource.name}Texture`] = texture;
        }

        // update progress bar
        // this.trigger('progress', [this.loader.loaded / this.loader.toLoad]);
      });

      // triggered on load complete
      this.loader.on('end', () => {
        this.trigger('ready');
      });
  }
}