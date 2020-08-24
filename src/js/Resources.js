import * as THREE from 'three';

import EventEmitter from './utils/EventEmitter';
import Loader from './utils/Loader';

// Matcaps
import matcapBlackSource from '../assets/matcaps/black.png';
import matcapBlackMatteSource from '../assets/matcaps/blackMatte.png';
import matcapWhiteSource from '../assets/matcaps/white.png';
import matcapWhiteClothSource from '../assets/matcaps/whiteCloth.png';
import matcapGreySource from '../assets/matcaps/grey.png';
import matcapGreyGreenSource from '../assets/matcaps/greyGreen.png';
import matcapGreyMetalSource from '../assets/matcaps/greyMetal.png';
import matcapBeigeSource from '../assets/matcaps/beige.png';
import matcapBeigeLightSource from '../assets/matcaps/beigeLight.png';
import matcapBlueSource from '../assets/matcaps/blue.png';
import matcapBlueClothSource from '../assets/matcaps/blueCloth.png';
import matcapBlueLightMatteSource from '../assets/matcaps/blueLightMatte.png';
import matcapBlueMatteSource from '../assets/matcaps/blueMatte.png';
import matcapCyanMatteSource from '../assets/matcaps/cyanMatte.png';
import matcapBrownSource from '../assets/matcaps/brown.png';
import matcapBrownDarkSource from '../assets/matcaps/brownDark.png';
import matcapBrownVeryDarkSource from '../assets/matcaps/brownVeryDark.png';
import matcapGreenSource from '../assets/matcaps/green.png';
import matcapGreenBrightSource from '../assets/matcaps/greenBright.png';
import matcapGreenDarkSource from '../assets/matcaps/greenDark.png';
import matcapGreenMatteSource from '../assets/matcaps/greenMatte.png';
import matcapOrangeMatteSource from '../assets/matcaps/orangeMatte.png';
import matcapOrangeMetalSource from '../assets/matcaps/orangeMetal.png';
import matcapRedBrightSource from '../assets/matcaps/redBright.png';
import matcapRedClothSource from '../assets/matcaps/redCloth.png';
import matcapRedMatteSource from '../assets/matcaps/redMatte.png';
import matcapRedMetalSource from '../assets/matcaps/redMetal.png';
import matcapRedGlowSource from '../assets/matcaps/redGlow.png';
import matcapPurpleSource from '../assets/matcaps/purple.png';
import matcapYellowLightSource from '../assets/matcaps/yellowLight.png';
import matcapYellowGlowSource from '../assets/matcaps/yellowGlow.png';

// Car
import carChassisSource from '../assets/models/car/chassis.glb';
import carWheelSource from '../assets/models/car/wheel.glb';

// Environment
import envRoadSource from '../assets/models/env/road.glb';
import treeSource from '../assets/models/tree.glb';

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
        { name: 'matcapBlack', source: matcapBlackSource, type: 'texture' },
        { name: 'matcapBlackMatte', source: matcapBlackMatteSource, type: 'texture' },
        { name: 'matcapWhite', source: matcapWhiteSource, type: 'texture' },
        { name: 'matcapWhiteCloth', source: matcapWhiteClothSource, type: 'texture' },
        { name: 'matcapGrey', source: matcapGreySource, type: 'texture' },
        { name: 'matcapGreyGreen', source: matcapGreyGreenSource, type: 'texture' },
        { name: 'matcapGreyMetal', source: matcapGreyMetalSource, type: 'texture' },
        { name: 'matcapBeige', source: matcapBeigeSource, type: 'texture' },
        { name: 'matcapBeigeLight', source: matcapBeigeLightSource, type: 'texture' },
        { name: 'matcapBlue', source: matcapBlueSource, type: 'texture' },
        { name: 'matcapBlueCloth', source: matcapBlueClothSource, type: 'texture' },
        { name: 'matcapBlueLightMatte', source: matcapBlueLightMatteSource, type: 'texture' },
        { name: 'matcapBlueMatte', source: matcapBlueMatteSource, type: 'texture' },
        { name: 'matcapCyanMatte', source: matcapCyanMatteSource, type: 'texture' },
        { name: 'matcapBrown', source: matcapBrownSource, type: 'texture' },
        { name: 'matcapBrownDark', source: matcapBrownDarkSource, type: 'texture' },
        { name: 'matcapBrownVeryDark', source: matcapBrownVeryDarkSource, type: 'texture' },
        { name: 'matcapGreen', source: matcapGreenSource, type: 'texture' },
        { name: 'matcapGreenBright', source: matcapGreenBrightSource, type: 'texture' },
        { name: 'matcapGreenDark', source: matcapGreenDarkSource, type: 'texture' },
        { name: 'matcapGreenMatte', source: matcapGreenMatteSource, type: 'texture' },
        { name: 'matcapOrangeMatte', source: matcapOrangeMatteSource, type: 'texture' },
        { name: 'matcapOrangeMetal', source: matcapOrangeMetalSource, type: 'texture' },
        { name: 'matcapRedBright', source: matcapRedBrightSource, type: 'texture' },
        { name: 'matcapRedCloth', source: matcapRedClothSource, type: 'texture' },
        { name: 'matcapRedMatte', source: matcapRedMatteSource, type: 'texture' },
        { name: 'matcapRedMetal', source: matcapRedMetalSource, type: 'texture' },
        { name: 'matcapRedGlow', source: matcapRedGlowSource, type: 'texture' },
        { name: 'matcapPurple', source: matcapPurpleSource, type: 'texture'},
        { name: 'matcapYellowLight', source: matcapYellowLightSource, type: 'texture' },
        { name: 'matcapYellowGlow', source: matcapYellowGlowSource, type: 'texture' },

        // Car
        { name: 'carChassis', source: carChassisSource },
        { name: 'carWheel', source: carWheelSource },

        // Environment
        { name: 'envRoad', source: envRoadSource},
        { name: 'tree', source: treeSource },

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