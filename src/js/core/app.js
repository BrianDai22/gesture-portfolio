/**
 * Core Application Orchestrator
 * Manages lifecycle and coordinates all modules
 */

import { initCamera, getCameraStream, stopCamera } from './camera.js';
import { initHandTracking, setOnResultsCallback, stopHandTracking } from './handTracking.js';
import { initHandOverlay, renderLandmarks, destroyHandOverlay } from '../ui/handOverlay.js';
import { getDominantHand, setDominantHand, getLandmarks } from '../state/handState.js';
import { initGestureRecognizer, processFrame, onGesture } from '../gestures/gestureRecognizer.js';
import { getCurrentSection, navigateNext, navigatePrev, navigateHome, onSectionChange } from '../state/navigationState.js';
import { initGestureIndicator, showGestureIndicator, hidePointIndicator, destroyGestureIndicator } from '../ui/gestureIndicator.js';

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
  let lastGestureType = null;

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

        // Initialize gesture recognition system
        initGestureRecognizer();
        initGestureIndicator();

        // Set up callback to render landmarks and process gestures
        setOnResultsCallback((results) => {
          renderLandmarks(results);

          // Process gestures from landmarks
          const landmarks = getLandmarks();
          if (landmarks) {
            const gesture = processFrame(landmarks);

            // Hide point indicator if we're not pointing anymore
            if (lastGestureType === 'point' && (!gesture || gesture.type !== 'point')) {
              hidePointIndicator();
            }

            lastGestureType = gesture ? gesture.type : null;
          }
        });

        // Set up gesture event handler
        onGesture((gesture) => {
          handleGesture(gesture);
        });

        // Set up navigation change handler
        onSectionChange((newIndex, oldIndex) => {
          console.log(`Navigation: Section changed from ${oldIndex} to ${newIndex}`);
        });

        // Show hand selector and initialize it
        initHandSelector();

        console.log('Gesture Portfolio: Hand tracking active');
        console.log('Gesture Portfolio: Gesture recognition active');

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
   * Handle detected gestures
   * @param {Object} gesture - Gesture object from recognizer
   */
  const handleGesture = (gesture) => {
    console.log('Gesture detected:', gesture);

    // Show visual indicator
    showGestureIndicator(gesture.type, gesture.data);

    // Map gestures to navigation actions
    switch (gesture.type) {
      case 'swipe-left':
        console.log('Action: Navigate to next section');
        navigateNext();
        break;

      case 'swipe-right':
        console.log('Action: Navigate to previous section');
        navigatePrev();
        break;

      case 'palm-home':
        console.log('Action: Navigate to home');
        navigateHome();
        break;

      case 'point':
        // Point gesture is continuous - just track position for now
        // Will be used for selecting items in Phase 2 Plan 3
        if (gesture.data) {
          console.log(`Point position: x=${gesture.data.x.toFixed(3)}, y=${gesture.data.y.toFixed(3)}`);
        }
        break;

      default:
        console.warn(`Unknown gesture type: ${gesture.type}`);
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
   * Initialize hand selector UI
   */
  const initHandSelector = () => {
    const selector = document.getElementById('hand-selector');
    if (!selector) return;

    // Show the selector
    selector.classList.remove('hidden');

    // Get current preference and update button states
    const currentHand = getDominantHand();
    updateHandButtons(currentHand);

    // Add click handlers to buttons
    const buttons = selector.querySelectorAll('.hand-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const hand = btn.dataset.hand;
        setDominantHand(hand);
        updateHandButtons(hand);
      });
    });
  };

  /**
   * Update hand button visual states
   * @param {string} activeHand - 'Left' or 'Right'
   */
  const updateHandButtons = (activeHand) => {
    const buttons = document.querySelectorAll('.hand-btn');
    buttons.forEach(btn => {
      const isActive = btn.dataset.hand === activeHand;
      btn.setAttribute('aria-pressed', isActive.toString());
    });
  };

  /**
   * Cleanup and destroy app
   */
  const destroy = () => {
    console.log('Gesture Portfolio: Cleaning up...');
    stopHandTracking();
    destroyHandOverlay();
    destroyGestureIndicator();
    stopCamera();
    initialized = false;
  };

  return { init, destroy };
};

export { createApp };
