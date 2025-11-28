import { createApp } from './core/app.js';

/**
 * Initialize the Gesture Portfolio application (Phase I placeholder).
 * Phase II will add camera + Three.js + MediaPipe wiring here.
 */
const init = () => {
  const app = createApp();
  app.init();
};

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', init);

// Export for potential testing
export { init };
