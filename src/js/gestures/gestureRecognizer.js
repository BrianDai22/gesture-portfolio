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
const SWIPE_RESET_THRESHOLD = 0.1; // Velocity must drop below this before next swipe
const GESTURE_COOLDOWN_MS = 3000; // 3 second cooldown between ALL gestures
const GESTURE_BUFFER_MS = 500; // Extra hidden buffer after cooldown to prevent accidental triggers
const FIST_HOME_STABILITY_MS = 500; // Hold fist for 500ms to go home
const FIST_HOME_DEBOUNCE_MS = 1000;

// State
let gestureCallback = null;
let cooldownCallback = null;
let lastGestureTime = 0; // Global cooldown for all gestures
let lastFistHomeTime = 0;
let fistHomeStableStartTime = null;
let lastGestureType = null;
let swipeArmed = true; // Must reset velocity before next swipe

/**
 * Initialize gesture recognizer
 */
const initGestureRecognizer = () => {
  lastGestureTime = 0;
  lastFistHomeTime = 0;
  fistHomeStableStartTime = null;
  lastGestureType = null;
  swipeArmed = true;
  console.log('GestureRecognizer: Initialized');
};

/**
 * Check if we're in global cooldown (includes hidden buffer after timer)
 * @param {number} now - Current timestamp
 * @returns {boolean} True if in cooldown
 */
const isInCooldown = (now) => {
  const totalCooldown = GESTURE_COOLDOWN_MS + GESTURE_BUFFER_MS;
  return (now - lastGestureTime) < totalCooldown;
};

/**
 * Process a frame of hand landmarks and detect gestures
 * @param {Array} landmarks - MediaPipe hand landmarks (21 points)
 * @returns {Object|null} Detected gesture or null
 */
const processFrame = (landmarks) => {
  if (!landmarks || landmarks.length < 21) {
    // Reset fist-home timer if hand lost
    fistHomeStableStartTime = null;
    return null;
  }

  // Update gesture state
  updateGestureState(landmarks);

  // Get current state
  const velocity = getPalmVelocity();
  const fingers = getFingerStates();
  const stable = isHandStable();
  const now = performance.now();

  // Check global cooldown - block swipe and home gestures, but allow point
  const inCooldown = isInCooldown(now);

  // Detect gestures in priority order

  // 1. SWIPE DETECTION (highest priority - deliberate motion)
  if (!inCooldown) {
    const swipeGesture = detectSwipe(velocity, fingers, now);
    if (swipeGesture) {
      fistHomeStableStartTime = null; // Reset fist-home timer
      return swipeGesture;
    }
  }

  // 2. FIST-HOME DETECTION (requires stability, blocked during cooldown)
  if (!inCooldown) {
    const fistHomeGesture = detectFistHome(fingers, stable, now);
    if (fistHomeGesture) {
      return fistHomeGesture;
    }
  }

  // 3. POINT DETECTION (continuous, always allowed)
  const pointGesture = detectPoint(landmarks, fingers, stable);
  if (pointGesture) {
    fistHomeStableStartTime = null; // Reset fist-home timer
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
  const absVx = Math.abs(velocity.vx);

  // Re-arm swipe detection when velocity drops below reset threshold
  // This prevents accidental reverse swipes when returning hand to center
  if (absVx < SWIPE_RESET_THRESHOLD) {
    swipeArmed = true;
  }

  // Check if swipe is armed (velocity was reset)
  if (!swipeArmed) {
    return null;
  }

  // Require at least 3 fingers extended (open hand)
  const extendedCount = Object.values(fingers).filter(state => state === 'extended').length;
  if (extendedCount < 3) {
    return null;
  }

  // Check horizontal velocity threshold
  if (absVx < SWIPE_VELOCITY_THRESHOLD) {
    return null;
  }

  // Determine direction
  // NOTE: Video is CSS-flipped (scaleX(-1)), so velocity direction is inverted
  // User swipes left in real life → positive vx → we want 'swipe-left'
  const type = velocity.vx > 0 ? 'swipe-left' : 'swipe-right';

  // Update global cooldown and disarm swipe until velocity resets
  lastGestureTime = now;
  swipeArmed = false;

  const gesture = { type };

  // Emit gesture event
  emitGesture(gesture);

  // Start cooldown timer UI
  if (cooldownCallback) {
    cooldownCallback(GESTURE_COOLDOWN_MS);
  }

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
 * Detect fist (home) gesture - all fingers curled towards palm
 * @param {Object} fingers - Finger states
 * @param {boolean} stable - Hand stability
 * @param {number} now - Current timestamp
 * @returns {Object|null} Gesture object or null
 */
const detectFistHome = (fingers, stable, now) => {
  // Check debounce
  if (now - lastFistHomeTime < FIST_HOME_DEBOUNCE_MS) {
    fistHomeStableStartTime = null;
    return null;
  }

  // Count curled fingers - at least 4 should be curled for a fist
  // (thumb detection is less reliable)
  const curledCount = Object.entries(fingers)
    .filter(([name, state]) => name !== 'thumb' && state === 'curled')
    .length;

  const isFist = curledCount >= 4; // All 4 non-thumb fingers curled

  if (!isFist || !stable) {
    // Reset timer if conditions not met
    fistHomeStableStartTime = null;
    return null;
  }

  // Start timer if not already started
  if (fistHomeStableStartTime === null) {
    fistHomeStableStartTime = now;
    return null;
  }

  // Check if held stable long enough
  const stableDuration = now - fistHomeStableStartTime;
  if (stableDuration < FIST_HOME_STABILITY_MS) {
    return null;
  }

  // Gesture detected!
  lastFistHomeTime = now;
  lastGestureTime = now; // Also update global cooldown
  fistHomeStableStartTime = null;

  const gesture = { type: 'fist-home' };

  // Emit gesture event
  emitGesture(gesture);

  // Start cooldown timer UI
  if (cooldownCallback) {
    cooldownCallback(GESTURE_COOLDOWN_MS);
  }

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

/**
 * Register callback for cooldown timer (triggered after any navigation gesture)
 * @param {Function} callback - Function to call with cooldown duration in ms
 */
const onCooldown = (callback) => {
  cooldownCallback = callback;
};

export {
  initGestureRecognizer,
  processFrame,
  onGesture,
  onCooldown
};
