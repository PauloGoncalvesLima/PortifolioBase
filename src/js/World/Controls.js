import EventEmitter from '../utils/EventEmitter';

export default class Controls extends EventEmitter {
  
  /**
   * Initializes the Controls object.
   * @param {*} _options {config, sizes, time, camera}
   */
  constructor(_options) {
    // initialize event emitter
    super();

    this.config = _options.config;
    this.sizes = _options.sizes;
    this.time = _options.time;
    this.camera = _options.camera;
    // this.sounds = _options.sounds;

    this.setActions();
    this.setKeyboard();
  }

  /**
   * Initializes booleans for
   * each possible action.
   * Possible actions:
   * up, down, right, left,
   * brake, boost.
   */
  setActions() {
    this.actions = {};
    this.actions.up = false;
    this.actions.down = false;
    this.actions.right = false;
    this.actions.left = false;
    this.actions.brake = false;
    this.actions.boost = false;
    
    // reset actions on unhide
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.actions.up = false;
        this.actions.down = false;
        this.actions.right = false;
        this.actions.left = false;
        this.actions.brake = false;
        this.actions.boost = false;
      }
    });
  }
  
  /**
   * Sets the keyboard functions and
   * creates a EventListener for each key Press.
   * @function KeyDown(_event) - EventListener to keyDown
   * @function KeyUp(_event) - EventListener to keyUp
   */
  setKeyboard() {
    this.keyboard = {};
    this.keyboard.events = {};
    
    this.keyboard.events.KeyDown = (_event) => {
      switch (_event.key){
        case 'ArrowUp':
        case 'z':
        case 'w':
          // this.camera.pan.reset();
          
          this.actions.up = true;
          break;

        case 'ArrowRight':
        case 'd':
          this.actions.right = true;
          break;

        case 'ArrowDown':
        case 's':
          // this.camera.pan.reset();
          this.actions.down = true;
          break;

        case 'ArrowLeft':
        case 'q':
        case 'a':
          this.actions.left = true;
          break;

        case 'Control':
        case ' ':
          this.actions.brake = true;
          break;
        
        case 'Shift':
          this.actions.boost = true;
          break;
      }
    }

    this.keyboard.events.KeyUp = (_event) => {
      switch (_event.key){
        case 'ArrowUp':
        case 'z':
        case 'w':
          // this.camera.pan.reset();
          this.actions.up = false;
          break;

        case 'ArrowRight':
        case 'd':
          this.actions.right = false;
          break;

        case 'ArrowDown':
        case 's':
          // this.camera.pan.reset();
          this.actions.down = false;
          break;

        case 'ArrowLeft':
        case 'q':
        case 'a':
          this.actions.left = false;
          break;

        case 'Control':
        case ' ':
          this.actions.brake = false;
          break;
        
        case 'Shift':
          this.actions.boost = false;
          break;
      }
    }
    
    document.addEventListener('keydown', this.keyboard.events.KeyDown);
    document.addEventListener('keyup',   this.keyboard.events.KeyUp);
  }
}