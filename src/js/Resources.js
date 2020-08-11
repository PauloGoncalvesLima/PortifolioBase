import * as THREE from 'three';

import EventEmitter from './utils/EventEmitter';
import Loader from './utils/Loader';

// Car
import carChassisSource from '../assets/models/car/chassis.glb';
import carWheelSource from '../assets/models/car/wheel.glb';

// Environment
import envRoadSource from '../assets/models/env/road.glb';

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
        // Car
        { name: 'carChassis', source: carChassisSource },
        { name: 'carWheel', source: carWheelSource },

        // Environment
        { name: 'envRoad', source: envRoadSource},

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