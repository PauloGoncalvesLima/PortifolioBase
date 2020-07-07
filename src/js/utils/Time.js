import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter {
  
  /**
   * Game clock. Contains info
   * for total runtime and
   * time since last frame (delta).
   */
  constructor() {
    super();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    this.tick = this.tick.bind(this);
    this.tick();
  }

  /**
   * Starts the frame clock,
   * running/unpausing the game.
   */
  tick() {
    this.ticker = window.requestAnimationFrame(this.tick);
    
    const current = Date.now();
    this.delta = current - this.current; // time since last frame
    this.elapsed = current - this.start; // time since first frame
    this.current = current; // update time now

    // cap delta at 60 ms
    if (this.delta > 60) {
      this.delta = 60;
    }

    // call update on frame
    this.trigger('update');
  }

  /**
   * Stops the frame clock,
   * pausing the game.
   */
  stop() {
    window.cancelAnimationFrame(this.ticker);
  }
}