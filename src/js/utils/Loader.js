import EventEmitter from './EventEmitter.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default class Loader extends EventEmitter {
  /**
   * Constructor:
   * Initializes the wrapper for loading files.
   */
  constructor() {
    super(); // Create a instance of EventEmitter

    this.setLoaders();

    this.toLoad = 0;
    this.loaded = 0;
    this.items = {};
  }
  
  /**
   * Initializes all loaders and pushes them to 'loaders' array.
   * Loads:                              
   * Images (.jpg, .png),                
   * DRACO Compression (.drc),           
   * GLTF (.glb, .gltf),                 
   * FBX (.fbx).
   */
  setLoaders() {
    this.loaders = [];

    // images
    this.loaders.push({
      extensions: ['jpg', 'png'],
      action: (_resource) => {
        const image = new Image();

        image.addEventListener('load', () => {
          this.fileLoadEnd(_resource, image);
        });

        image.addEventListener('error', () => {
          this.fileLoadEnd(_resource, image);
        });
        
        image.src = _resource.source;
      }
    });

    // DRACO compression
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('draco/');
    dracoLoader.setDecoderConfig({type: 'js'});

    this.loaders.push({
      extensions: ['drc'],
      action: (_resource) => {
          
        dracoLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
          DRACOLoader.releaseDecoderModule();
          
        });
      }
    });

    // GLFT loader
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    this.loaders.push({
      extensions: ['glb', 'gltf'],
      action: (_resource) => {
        gltfLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      }
    });

    // FBX loader
    const fbxLoader = new FBXLoader();

    this.loaders.push({
      extensions: ['fbx'],
      action: (_resource) => {
        fbxLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      }
    });
  }

  /**
   * Handles the file type; Then loads it.
   * @param {object[]} _resources array of resources to be loaded.
   */
  load(_resources = []) {
    for (const _resource of _resources) {
      this.toLoad++ // add to load
      // match file extension
      const extensionMatch = _resource.source.match(/\.([a-z]+)$/);
      
      if (typeof extensionMatch[1] !== 'undefined') { // if extension exists
        // find appropriate loader based on extension
        const extension = extensionMatch[1];
        const loader = this.loaders.find((_loader) => _loader.extensions.find((_extension) => _extension === extension));

        if (loader) { // load resource
          loader.action(_resource);
        } else { // no loader error
          console.warn(`Cannot find loader for ${_resource}`);
        }
      } else { // no extension error
        console.warn(`Cannot find extension for ${_resource}`);
      }
    }
  }

  /**
   * Callback for end of load.
   * Works as wrapper.
   * @param {object} _resource resource that was loaded to be returned.
   * @param {object} _data loaded data to be returned.
   */
  fileLoadEnd(_resource, _data) {
    this.loaded++; // register loaded
    this.items[_resource.name] = _data;

    // lets know this load is finished
    this.trigger('fileEnd', [_resource, _data]);
    
    // lets know if all loads are finished
    if (this.loaded === this.toLoad) {
      this.trigger('end');
    }
  }
}