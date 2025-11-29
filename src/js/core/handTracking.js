/**
 * Hand Tracking Module
 * Initializes MediaPipe Hands and processes video frames
 */

import { getDominantHand, updateLandmarks, clearLandmarks } from '../state/handState.js';

let hands = null;
let camera = null;
let onResultsCallback = null;

/**
 * Initialize MediaPipe Hands with video element
 * @param {HTMLVideoElement} videoElement - Video element with camera stream
 * @returns {Promise<void>}
 */
const initHandTracking = async (videoElement) => {
  if (!videoElement) {
    console.error('HandTracking: Video element is required');
    return;
  }

  // Check if MediaPipe libraries are loaded
  if (typeof window.Hands === 'undefined') {
    console.error('HandTracking: MediaPipe Hands library not loaded');
    return;
  }

  if (typeof window.Camera === 'undefined') {
    console.error('HandTracking: MediaPipe Camera library not loaded');
    return;
  }

  try {
    // Create Hands instance
    hands = new window.Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`;
      }
    });

    // Configure Hands
    await hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    });

    // Set up results callback
    hands.onResults(onResults);

    // Create Camera instance
    camera = new window.Camera(videoElement, {
      onFrame: async () => {
        if (hands) {
          await hands.send({ image: videoElement });
        }
      },
      width: 1280,
      height: 720
    });

    // Start camera processing
    await camera.start();

    console.log('HandTracking: Initialized successfully');
  } catch (error) {
    console.error('HandTracking: Initialization failed', error);
  }
};

/**
 * Process MediaPipe Hands results
 * @param {Object} results - MediaPipe results object
 */
const onResults = (results) => {
  const invokeCallback = (payload) => {
    if (onResultsCallback) {
      onResultsCallback(payload);
    }
  };

  const dominantHand = getDominantHand();

  if (results && results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    // Get handedness info
    const handedness = results.multiHandedness[0];
    let detectedHand = handedness.label; // 'Left' or 'Right'

    // IMPORTANT: For front-facing (selfie) cameras, MediaPipe reports handedness
    // from the camera's perspective, which is mirrored from user's perspective.
    // Since we flip the video display with CSS, we need to invert handedness
    // to match the user's actual hand.
    // Camera sees user's right hand on its left → reports "Left"
    // But user is holding up their right hand → we want to match "Right"
    detectedHand = detectedHand === 'Left' ? 'Right' : 'Left';

    // Only process if it matches dominant hand preference
    if (detectedHand === dominantHand) {
      const landmarks = results.multiHandLandmarks[0];
      updateLandmarks(landmarks);

      // Call external callback if set
      invokeCallback(results);
      return;
    }
  }

  // No valid hand detected for rendering
  clearLandmarks();
  invokeCallback({ multiHandLandmarks: [] });
};

/**
 * Set callback for hand tracking results
 * @param {Function} callback - Function to call with results
 */
const setOnResultsCallback = (callback) => {
  onResultsCallback = callback;
};

/**
 * Get current Hands instance
 * @returns {Object|null}
 */
const getHandsInstance = () => {
  return hands;
};

/**
 * Stop hand tracking and cleanup
 */
const stopHandTracking = () => {
  if (camera) {
    camera.stop();
    camera = null;
  }
  if (hands) {
    hands.close();
    hands = null;
  }
  clearLandmarks();
  console.log('HandTracking: Stopped');
};

export {
  initHandTracking,
  setOnResultsCallback,
  getHandsInstance,
  stopHandTracking
};
