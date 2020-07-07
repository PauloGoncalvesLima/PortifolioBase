export default class {
  /**
   *  That = this  Explanation 
   *  https://stackoverflow.com/questions/4886632/what-does-var-that-this-mean-in-javascript
   */

  /**
   * Constructor:
   * initializes EventEmitter with
   * namespace 'base' in callbacks
   * object.
   */
  constructor() {
    this.callbacks = {} // holds callback for each namespace
    this.callbacks.base = {}
  }

  /**
   * On:
   * Add namespaces and names with specified callback.
   * to the object callbacks.
   * @param {string} _names dot separated names to be added.
   * @param {function} callback specific callback tied to names.
   * @returns {EventEmitter} the event emmiter object or false on err.
   */
  on(_names, callback) {
    const that = this;

    // handle errors
    if (typeof _names === 'undefined' || names === '') {
      console.warn('wrong names');
      return false;
    }

    if (typeof callback === 'undefined') {
      console.warn('wrong callback');
      return false;
    }

    // resolve names
    const names = this.resolveNames(_names);

    // for each name
    names.forEach(_name => {
      // resolve individual name
      const name = that.resolveName(_name);

      // create namespace if nonexistant
      if (!(that.callbacks[name.namespace] instanceof Object)) {
        that.callbacks[name.namespace] = {};
      }

      // create callback if nonexistant
      if (!(that.callbacks[name.namespace][name.value] instanceof Array)) {
        that.callbacks[name.namespace][name.value] = [];
      }

      // Add callback
      that.callbacks[name.namespace][name.value].push(callback);
    });

    // debug
    console.log(this);
    console.log(that);

    return this;
  }

  /**
   * Off:
   * remove specified callback in specified namespace.
   * if no callback is specified, remove entire namespace.
   * if no namespace is specified, remove callback in every namespace.
   * @param {string} _names dot separated names to be removed.
   * @returns {EventEmitter} the event emmiter object or false on error.
   */
  off(_names) {
    const that = this;

    // handle errors
    if (typeof _names === 'undefined' || names === '') {
      console.warn('wrong names');
      return false;
    }

    // resolve names
    const names = this.resolveNames(_names);

    // for each name
    names.forEach(_name => {
      // resolve individual name
      const name = that.resolveName(_name);

      // remove namespace with all the name values
      if (name.namespace !== 'base' && name.value === '') {
        delete that.callbacks[name.namespace];
      } else { // remove specific callback in namespace
        
        // default namespace (all namespaces)
        if (name.namespace === 'base') {
          // remove from all namespaces
          for (const namespace in that.callbacks) {
            // if namespace and callback exists, remove callback
            if(that.callbacks[namespace] instanceof Object && that.callbacks[namespace][name.value] instanceof Array) {
              delete that.callbacks[namespace][name.value];

              // remove namespace if empty
              if (Object.keys(that.callbacks[namespace]).length === 0) {
                delete that.callbacks[namespace];
              }
            }
          }
        }

        // specified namespace (if namespace and callback exists, remove callback)
        else if (that.callbacks[name.namespace] instanceof Object && that.callbacks[name.namespace][name.value] instanceof Array) {
          delete that.callbacks[name.namespace][name.value];

          // remove namespace if empty
          if (Object.keys(that.callbacks[name.namespace]).length === 0) {
            delete that.callbacks[name.namespace];
          }
        }
      }
    });
    
    return this;
  }

  /**
   * Trigger:
   * triggers callback of specific namespace and
   * name with the given arguments (only first name will
   * be triggered per call).
   * @param {string} _names dot separated names to be triggered.
   * @param {Array} _args array of arguments for the callback or false on error.
   * @return {*} return argument of callbacks (first to return).
   */
  trigger(_names, _args) {
    const that = this;
    let finalResult = null;
    let result = null;

    // handle errors
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('wrong names');
      return false;
    }

    // set arguments (default fallback is [])
    const args = !(_args instanceof Array) ? [] : _args;

    // resolve names
    let name = this.resolveNames(_names);
    name = this.resolveName(name[0]);

    // default namespace (all namespaces)
    if (name.namespace === 'base') {
      // search for callback in all namespaces
      for (const namespace in that.callbacks) {
        // if namespace and callback exists, call all callback functions
        if(that.callbacks[namespace] instanceof Object && that.callbacks[namespace][name.value] instanceof Array) {
          that.callbacks[namespace][name.value].forEach(callback => {
            result = callback.apply(that, args);

            // get first returned result
            if (typeof finalResult === 'undefined') {
              finalResult = result;
            }
          });
        }
      }
    }

    // specified namespace
    else if (this.callbacks[name.namespace] instanceof Object) {
      
      // handle error
      if (name.value === '') {
        console.warn('wrong name');
        return false;
      }

      that.callbacks[name.namespace][name.value].forEach(callback => {
        result = callback.apply(that, args);

        // get first returned result
        if (typeof finalResult === 'undefined') {
          finalResult = result;
        }
      });
    }

    return finalResult;
  }

  /**
   * Resolve names:
   * given a string, cleans it and splits
   * it into its separate words.
   * @param {string} _names string to be cleaned.
   * @returns {Array} array of cleaned names.
   */
  resolveNames(_names) {
      let names = _names
      names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '') // remove special chars
      names = names.replace(/[,/]+/g, ' ') // merge ,/ into single space
      names = names.split(' ') // split string

      return names
  }
  
  /**
   * Resolve name:
   * converts a dot separated name
   * into a name object.
   * @param {string} name string to be converted.
   * name format = [value].[namespace].
   * (namespace is optional; default is 'base')
   * @returns {Object} returns an object with the
   * original name, value and the namespace.
   */
  resolveName(name) {
      const newName = {}
      const parts = name.split('.')

      newName.original  = name
      newName.value     = parts[ 0 ]
      newName.namespace = 'base' // base namespace

      // specified namespace
      if(parts.length > 1 && parts[ 1 ] !== '')
      {
          newName.namespace = parts[ 1 ]
      }

      return newName
  }
}