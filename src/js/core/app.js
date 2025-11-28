/**
 * Core Application Orchestrator
 * Manages lifecycle and coordinates all modules
 */

import { initCamera, getCameraStream, stopCamera } from './camera.js';
import { initHandTracking, setOnResultsCallback, stopHandTracking } from './handTracking.js';
import { initHandOverlay, renderLandmarks, destroyHandOverlay } from '../ui/handOverlay.js';

// Get DOM references
const getDomRefs = () => {
  const threeCanvas = document.getElementById('three-canvas');
  const videoElement = document.getElementById('camera-feed');
  const handCanvas = document.getElementById('hand-overlay');
  const overlay = document.getElementById('ui-overlay');
  return { threeCanvas, videoElement, handCanvas, overlay };
};

const createApp = () => {
  const dom = getDomRefs();
  let initialized = false;

  const init = async () => {
    if (!dom.threeCanvas || !dom.videoElement || !dom.handCanvas || !dom.overlay) {
      console.error('Gesture Portfolio: Required DOM elements missing');
      updateStatus('Error: Missing required elements', 'Please refresh the page');
      return;
    }

    if (initialized) {
      console.warn('Gesture Portfolio: Already initialized');
      return;
    }

    console.log('Gesture Portfolio: Initializing...');

    try {
      // Step 1: Initialize camera
      const cameraStream = await initCamera();

      if (cameraStream) {
        // Camera granted - initialize hand tracking
        console.log('Gesture Portfolio: Camera access granted, initializing hand tracking...');

        // Wait for video to be ready
        await new Promise((resolve) => {
          if (dom.videoElement.readyState >= 2) {
            resolve();
          } else {
            dom.videoElement.addEventListener('loadeddata', resolve, { once: true });
          }
        });

        // Initialize hand tracking
        await initHandTracking(dom.videoElement);

        // Initialize hand overlay
        initHandOverlay(dom.handCanvas, dom.videoElement);

        // Set up callback to render landmarks
        setOnResultsCallback((results) => {
          renderLandmarks(results);
        });

        console.log('Gesture Portfolio: Hand tracking active');

      } else {
        // Camera denied - fallback mode already handled by camera module
        console.log('Gesture Portfolio: Running in fallback mode (no camera)');
      }

      initialized = true;

    } catch (error) {
      console.error('Gesture Portfolio: Initialization error', error);
      updateStatus('Initialization Error', 'Please refresh the page and try again');
    }
  };

  /**
   * Update status overlay text
   * @param {string} status - Status text
   * @param {string} hint - Hint text
   */
  const updateStatus = (status, hint) => {
    const statusElement = document.getElementById('overlay-status');
    if (statusElement) {
      const statusText = statusElement.querySelector('.status-text');
      const hintText = statusElement.querySelector('.hint');
      if (statusText) statusText.textContent = status;
      if (hintText) hintText.textContent = hint;
    }
  };

  /**
   * Cleanup and destroy app
   */
  const destroy = () => {
    console.log('Gesture Portfolio: Cleaning up...');
    stopHandTracking();
    destroyHandOverlay();
    stopCamera();
    initialized = false;
  };

  return { init, destroy };
};

export { createApp };
