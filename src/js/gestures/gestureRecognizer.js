/**
 * Gesture Recognizer Module
 * Detects swipe, point, and palm-home gestures from hand landmarks
 */

import {
  updateGestureState,
  getPalmVelocity,
  getFingerStates,
  isHandStable
} from '../state/gestureState.js';

// Configuration
const SWIPE_VELOCITY_THRESHOLD = 0.4; // Normalized units/second (increased for deliberate swipes)
const SWIPE_DEBOUNCE_MS = 800; // Longer debounce to prevent rapid triggers
const PALM_HOME_STABILITY_MS = 500;
const PALM_HOME_DEBOUNCE_MS = 1000;

// State
let gestureCallback = null;
let lastSwipeTime = 0;
let lastPalmHomeTime = 0;
let palmHomeStableStartTime = null;
let lastGestureType = null;

/**
 * Initialize gesture recognizer
 */
const initGestureRecognizer = () => {
  lastSwipeTime = 0;
  lastPalmHomeTime = 0;
  palmHomeStableStartTime = null;
  lastGestureType = null;
  console.log('GestureRecognizer: Initialized');
};

/**
 * Process a frame of hand landmarks and detect gestures
 * @param {Array} landmarks - MediaPipe hand landmarks (21 points)
 * @returns {Object|null} Detected gesture or null
 */
const processFrame = (landmarks) => {
  if (!landmarks || landmarks.length < 21) {
    // Reset palm-home timer if hand lost
    palmHomeStableStartTime = null;
    return null;
  }

  // Update gesture state
  updateGestureState(landmarks);

  // Get current state
  const velocity = getPalmVelocity();
  const fingers = getFingerStates();
  const stable = isHandStable();
  const now = performance.now();

  // Detect gestures in priority order

  // 1. SWIPE DETECTION (highest priority - deliberate motion)
  const swipeGesture = detectSwipe(velocity, fingers, now);
  if (swipeGesture) {
    palmHomeStableStartTime = null; // Reset palm-home timer
    return swipeGesture;
  }

  // 2. PALM-HOME DETECTION (requires stability)
  const palmHomeGesture = detectPalmHome(fingers, stable, now);
  if (palmHomeGesture) {
    return palmHomeGesture;
  }

  // 3. POINT DETECTION (continuous, no debounce)
  const pointGesture = detectPoint(landmarks, fingers, stable);
  if (pointGesture) {
    palmHomeStableStartTime = null; // Reset palm-home timer
    return pointGesture;
  }

  return null;
};

/**
 * Detect swipe gesture
 * @param {Object} velocity - {vx, vy}
 * @param {Object} fingers - Finger states
 * @param {number} now - Current timestamp
 * @returns {Object|null} Gesture object or null
 */
const detectSwipe = (velocity, fingers, now) => {
  // Check debounce
  if (now - lastSwipeTime < SWIPE_DEBOUNCE_MS) {
    return null;
  }

  // Require at least 3 fingers extended (open hand)
  const extendedCount = Object.values(fingers).filter(state => state === 'extended').length;
  if (extendedCount < 3) {
    return null;
  }

  // Check horizontal velocity threshold
  const absVx = Math.abs(velocity.vx);
  if (absVx < SWIPE_VELOCITY_THRESHOLD) {
    return null;
  }

  // Determine direction
  // NOTE: Video is CSS-flipped (scaleX(-1)), so velocity direction is inverted
  // User swipes left in real life → positive vx → we want 'swipe-left'
  const type = velocity.vx > 0 ? 'swipe-left' : 'swipe-right';

  // Update debounce timer
  lastSwipeTime = now;

  const gesture = { type };

  // Emit gesture event
  emitGesture(gesture);

  return gesture;
};

/**
 * Detect point gesture
 * @param {Array} landmarks - Hand landmarks
 * @param {Object} fingers - Finger states
 * @param {boolean} stable - Hand stability
 * @returns {Object|null} Gesture object or null
 */
const detectPoint = (landmarks, fingers, stable) => {
  // Index finger extended, other fingers (except thumb) curled
  // Thumb can be in any position - it's natural to have thumb out while pointing
  const isPointing =
    fingers.index === 'extended' &&
    fingers.middle === 'curled' &&
    fingers.ring === 'curled' &&
    fingers.pinky === 'curled';

  if (isPointing) {
    // Get index fingertip position (landmark 8)
    const indexTip = landmarks[8];

    const gesture = {
      type: 'point',
      data: {
        x: indexTip.x,
        y: indexTip.y
      }
    };

    // Emit gesture event (continuous, no debounce for point)
    emitGesture(gesture);

    return gesture;
  }

  return null;
};

/**
 * Detect open palm (home) gesture
 * @param {Object} fingers - Finger states
 * @param {boolean} stable - Hand stability
 * @param {number} now - Current timestamp
 * @returns {Object|null} Gesture object or null
 */
const detectPalmHome = (fingers, stable, now) => {
  // Check debounce
  if (now - lastPalmHomeTime < PALM_HOME_DEBOUNCE_MS) {
    palmHomeStableStartTime = null;
    return null;
  }

  // All 5 fingers extended
  const allExtended = Object.values(fingers).every(state => state === 'extended');

  if (!allExtended || !stable) {
    // Reset timer if conditions not met
    palmHomeStableStartTime = null;
    return null;
  }

  // Start timer if not already started
  if (palmHomeStableStartTime === null) {
    palmHomeStableStartTime = now;
    return null;
  }

  // Check if held stable long enough
  const stableDuration = now - palmHomeStableStartTime;
  if (stableDuration < PALM_HOME_STABILITY_MS) {
    return null;
  }

  // Gesture detected!
  lastPalmHomeTime = now;
  palmHomeStableStartTime = null;

  const gesture = { type: 'palm-home' };

  // Emit gesture event
  emitGesture(gesture);

  return gesture;
};

/**
 * Emit gesture to registered callback
 * @param {Object} gesture - Detected gesture
 */
const emitGesture = (gesture) => {
  if (gestureCallback) {
    gestureCallback(gesture);
  }
};

/**
 * Register callback for gesture events
 * @param {Function} callback - Function to call with gesture objects
 */
const onGesture = (callback) => {
  gestureCallback = callback;
};

export {
  initGestureRecognizer,
  processFrame,
  onGesture
};
