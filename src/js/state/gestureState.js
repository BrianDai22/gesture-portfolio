/**
 * Gesture State Module
 * Tracks hand position history, finger states, velocity, and stability for gesture recognition
 */

// Configuration
const POSITION_BUFFER_SIZE = 10;
const STABILITY_VELOCITY_THRESHOLD = 0.02; // Normalized units per frame
const FINGER_EXTENSION_THRESHOLD = 0.1; // Distance threshold for finger extension

// State
let palmPositionBuffer = []; // Rolling buffer of {x, y, timestamp}
let fingerStates = {
  thumb: 'curled',
  index: 'curled',
  middle: 'curled',
  ring: 'curled',
  pinky: 'curled'
};
let palmVelocity = { vx: 0, vy: 0 };

/**
 * Update gesture state with new hand landmarks
 * @param {Array} landmarks - MediaPipe hand landmarks (21 points with x, y, z)
 */
const updateGestureState = (landmarks) => {
  if (!landmarks || landmarks.length < 21) {
    return;
  }

  // Update palm position (wrist landmark, index 0)
  const wrist = landmarks[0];
  const timestamp = performance.now();

  palmPositionBuffer.push({
    x: wrist.x,
    y: wrist.y,
    timestamp
  });

  // Keep only last N positions
  if (palmPositionBuffer.length > POSITION_BUFFER_SIZE) {
    palmPositionBuffer.shift();
  }

  // Calculate palm velocity
  calculatePalmVelocity();

  // Update finger extension states
  updateFingerStates(landmarks);
};

/**
 * Calculate palm velocity from position buffer
 */
const calculatePalmVelocity = () => {
  if (palmPositionBuffer.length < 2) {
    palmVelocity = { vx: 0, vy: 0 };
    return;
  }

  // Use oldest and newest positions for smoother velocity
  const oldest = palmPositionBuffer[0];
  const newest = palmPositionBuffer[palmPositionBuffer.length - 1];

  const timeDelta = newest.timestamp - oldest.timestamp;

  if (timeDelta <= 0) {
    palmVelocity = { vx: 0, vy: 0 };
    return;
  }

  // Calculate velocity (change per millisecond, normalized)
  palmVelocity = {
    vx: (newest.x - oldest.x) / (timeDelta / 1000), // per second
    vy: (newest.y - oldest.y) / (timeDelta / 1000)
  };
};

/**
 * Update finger extension states based on landmarks
 * @param {Array} landmarks - MediaPipe hand landmarks
 */
const updateFingerStates = (landmarks) => {
  // Landmark indices for fingertips, PIP (middle joint), and MCP joints (knuckles)
  const fingerData = [
    { name: 'thumb', tip: 4, pip: 3, mcp: 2 },
    { name: 'index', tip: 8, pip: 6, mcp: 5 },
    { name: 'middle', tip: 12, pip: 10, mcp: 9 },
    { name: 'ring', tip: 16, pip: 14, mcp: 13 },
    { name: 'pinky', tip: 20, pip: 18, mcp: 17 }
  ];

  const wrist = landmarks[0];

  fingerData.forEach(finger => {
    const tip = landmarks[finger.tip];
    const pip = landmarks[finger.pip];
    const mcp = landmarks[finger.mcp];

    let isExtended = false;

    if (finger.name === 'thumb') {
      // Thumb: check if tip is far from wrist horizontally
      const thumbExtension = Math.abs(tip.x - wrist.x);
      isExtended = thumbExtension > 0.1;
    } else {
      // For other fingers, use multiple detection methods:

      // Method 1: Distance ratio (works when hand is sideways)
      const tipToWrist = Math.sqrt(
        Math.pow(tip.x - wrist.x, 2) +
        Math.pow(tip.y - wrist.y, 2)
      );
      const mcpToWrist = Math.sqrt(
        Math.pow(mcp.x - wrist.x, 2) +
        Math.pow(mcp.y - wrist.y, 2)
      );
      const extensionRatio = tipToWrist / (mcpToWrist + 0.001);
      const ratioExtended = extensionRatio > 1.3;

      // Method 2: Y-position (works when palm faces camera)
      // Extended finger: tip is above PIP, PIP is above MCP (lower Y = higher on screen)
      const yExtended = tip.y < pip.y && pip.y < mcp.y;

      // Method 3: Tip above MCP with significant margin
      const tipAboveMcp = (mcp.y - tip.y) > 0.05;

      // Finger is extended if ANY method detects it
      isExtended = ratioExtended || yExtended || tipAboveMcp;
    }

    fingerStates[finger.name] = isExtended ? 'extended' : 'curled';
  });
};

/**
 * Get current palm position
 * @returns {{x: number, y: number}|null} Palm position or null if no data
 */
const getPalmPosition = () => {
  if (palmPositionBuffer.length === 0) {
    return null;
  }
  const latest = palmPositionBuffer[palmPositionBuffer.length - 1];
  return { x: latest.x, y: latest.y };
};

/**
 * Get current palm velocity
 * @returns {{vx: number, vy: number}} Palm velocity
 */
const getPalmVelocity = () => {
  return { ...palmVelocity };
};

/**
 * Get current finger extension states
 * @returns {Object} Object with thumb, index, middle, ring, pinky states ('extended' | 'curled')
 */
const getFingerStates = () => {
  return { ...fingerStates };
};

/**
 * Check if hand is stable (low velocity)
 * @returns {boolean} True if hand is stable
 */
const isHandStable = () => {
  const speed = Math.sqrt(palmVelocity.vx * palmVelocity.vx + palmVelocity.vy * palmVelocity.vy);
  return speed < STABILITY_VELOCITY_THRESHOLD;
};

/**
 * Reset gesture state
 */
const resetGestureState = () => {
  palmPositionBuffer = [];
  fingerStates = {
    thumb: 'curled',
    index: 'curled',
    middle: 'curled',
    ring: 'curled',
    pinky: 'curled'
  };
  palmVelocity = { vx: 0, vy: 0 };
};

export {
  updateGestureState,
  getPalmPosition,
  getPalmVelocity,
  getFingerStates,
  isHandStable,
  resetGestureState
};
