import '../css/style.css';
import Application from './Application.js';

/**
 * Entry point for the entire app
 */
window.application = new Application ({
    $canvas: document.querySelector('.js-canvas')
});