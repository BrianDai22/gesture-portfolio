/**
 * Gesture Indicator Module
 * Displays visual feedback when gestures are detected
 */

// DOM references
let swipeIndicator = null;
let pointIndicator = null;
let fistIndicator = null;
let container = null;

// Timeout tracking
let swipeTimeoutId = null;
let fistTimeoutId = null;

/**
 * Initialize gesture indicator elements
 */
const initGestureIndicator = () => {
  // Create container
  container = document.createElement('div');
  container.id = 'gesture-indicators';
  container.className = 'gesture-indicator-container';
  document.body.appendChild(container);

  // Create swipe indicator
  swipeIndicator = document.createElement('div');
  swipeIndicator.className = 'gesture-indicator gesture-swipe';
  const swipeArrow = document.createElement('span');
  swipeArrow.className = 'arrow';
  swipeArrow.textContent = '→';
  swipeIndicator.appendChild(swipeArrow);
  container.appendChild(swipeIndicator);

  // Create point indicator
  pointIndicator = document.createElement('div');
  pointIndicator.className = 'gesture-indicator gesture-point';
  const pointDot = document.createElement('span');
  pointDot.className = 'dot';
  pointIndicator.appendChild(pointDot);
  container.appendChild(pointIndicator);

  // Create fist indicator (for home gesture)
  fistIndicator = document.createElement('div');
  fistIndicator.className = 'gesture-indicator gesture-fist';
  const fistIcon = document.createElement('span');
  fistIcon.className = 'fist-icon';
  fistIcon.textContent = '✊🏠';
  fistIndicator.appendChild(fistIcon);
  container.appendChild(fistIndicator);

  console.log('GestureIndicator: Initialized');
};

/**
 * Show gesture indicator
 * @param {string} gestureType - Type of gesture ('swipe-left', 'swipe-right', 'point', 'fist-home')
 * @param {Object} position - Optional position for point gesture {x, y}
 */
const showGestureIndicator = (gestureType, position = null) => {
  if (!container) {
    console.warn('GestureIndicator: Not initialized');
    return;
  }

  switch (gestureType) {
    case 'swipe-left':
      showSwipe('left');
      break;
    case 'swipe-right':
      showSwipe('right');
      break;
    case 'point':
      showPoint(position);
      break;
    case 'fist-home':
      showFistHome();
      break;
    default:
      console.warn(`GestureIndicator: Unknown gesture type ${gestureType}`);
  }
};

/**
 * Show swipe indicator
 * @param {string} direction - 'left' or 'right'
 */
const showSwipe = (direction) => {
  // Clear existing timeout
  if (swipeTimeoutId !== null) {
    clearTimeout(swipeTimeoutId);
    swipeTimeoutId = null;
  }

  // Update arrow direction
  const arrow = swipeIndicator.querySelector('.arrow');
  arrow.textContent = direction === 'left' ? '←' : '→';

  // Position at center-left or center-right
  swipeIndicator.style.left = direction === 'left' ? '20%' : '80%';
  swipeIndicator.style.top = '50%';

  // Show and animate
  swipeIndicator.classList.add('active');

  // Hide after animation
  swipeTimeoutId = setTimeout(() => {
    swipeIndicator.classList.remove('active');
    swipeTimeoutId = null;
  }, 300);
};

/**
 * Show point indicator
 * @param {Object} position - {x, y} normalized coordinates (0-1)
 */
const showPoint = (position) => {
  if (!position) return;

  // Convert normalized coordinates to viewport coordinates
  // NOTE: Video is CSS-flipped (scaleX(-1)), so we need to invert x coordinate
  // MediaPipe gives us coordinates in original (unflipped) space
  const x = (1 - position.x) * window.innerWidth;
  const y = position.y * window.innerHeight;

  // Position indicator at fingertip
  pointIndicator.style.left = `${x}px`;
  pointIndicator.style.top = `${y}px`;

  // Show indicator (continuous for point)
  pointIndicator.classList.add('active');
};

/**
 * Hide point indicator (called when pointing stops)
 */
const hidePointIndicator = () => {
  pointIndicator.classList.remove('active');
};

/**
 * Show fist-home indicator
 */
const showFistHome = () => {
  // Clear existing timeout
  if (fistTimeoutId !== null) {
    clearTimeout(fistTimeoutId);
    fistTimeoutId = null;
  }

  // Position at center
  fistIndicator.style.left = '50%';
  fistIndicator.style.top = '50%';

  // Show and animate
  fistIndicator.classList.add('active');

  // Hide after animation
  fistTimeoutId = setTimeout(() => {
    fistIndicator.classList.remove('active');
    fistTimeoutId = null;
  }, 800);
};

/**
 * Cleanup gesture indicators
 */
const destroyGestureIndicator = () => {
  // Clear any pending timeouts
  if (swipeTimeoutId !== null) {
    clearTimeout(swipeTimeoutId);
    swipeTimeoutId = null;
  }
  if (fistTimeoutId !== null) {
    clearTimeout(fistTimeoutId);
    fistTimeoutId = null;
  }

  // Remove DOM elements
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
  container = null;
  swipeIndicator = null;
  pointIndicator = null;
  fistIndicator = null;
};

export {
  initGestureIndicator,
  showGestureIndicator,
  hidePointIndicator,
  destroyGestureIndicator
};
