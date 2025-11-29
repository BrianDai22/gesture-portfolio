/**
 * Hand Overlay Module
 * Renders hand landmarks as skeleton overlay on canvas
 */

let canvas = null;
let ctx = null;
let videoElement = null;
let resizeTimeoutId = null;

/**
 * Initialize hand overlay canvas
 * @param {HTMLCanvasElement} canvasElement - Canvas element for drawing
 * @param {HTMLVideoElement} video - Video element to match dimensions
 */
const initHandOverlay = (canvasElement, video) => {
  if (!canvasElement || !video) {
    console.error('HandOverlay: Canvas and video elements required');
    return;
  }

  canvas = canvasElement;
  ctx = canvas.getContext('2d');
  videoElement = video;

  // Set initial canvas size
  resizeCanvas();

  // Resize canvas on window resize with debounce
  window.addEventListener('resize', debouncedResize);

  console.log('HandOverlay: Initialized');
};

/**
 * Resize canvas to match video dimensions
 */
const resizeCanvas = () => {
  if (!canvas || !videoElement) return;

  // Prefer video intrinsic dimensions if available, otherwise fall back to window size
  const width = videoElement.videoWidth || window.innerWidth;
  const height = videoElement.videoHeight || window.innerHeight;

  canvas.width = width;
  canvas.height = height;
};

/**
 * Debounced resize handler to avoid excessive redraws
 */
const debouncedResize = () => {
  if (resizeTimeoutId !== null) {
    clearTimeout(resizeTimeoutId);
  }
  resizeTimeoutId = setTimeout(() => {
    resizeCanvas();
    resizeTimeoutId = null;
  }, 150);
};

// Define HAND_CONNECTIONS manually (MediaPipe hand skeleton connections)
// Format: [startIdx, endIdx] pairs for drawing lines between landmarks
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],           // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],           // Index finger
  [0, 9], [9, 10], [10, 11], [11, 12],      // Middle finger
  [0, 13], [13, 14], [14, 15], [15, 16],    // Ring finger
  [0, 17], [17, 18], [18, 19], [19, 20],    // Pinky
  [5, 9], [9, 13], [13, 17]                  // Palm connections
];

/**
 * Render hand landmarks on canvas
 * @param {Object} results - MediaPipe results object with landmarks
 */
const renderLandmarks = (results) => {
  if (!ctx || !canvas) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Only draw if we have hand landmarks
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];

    // Scale landmarks to canvas size
    const scaledLandmarks = landmarks.map(lm => ({
      x: lm.x * canvas.width,
      y: lm.y * canvas.height
    }));

    // Draw connection lines (cyan with glow)
    ctx.save();
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
    ctx.lineCap = 'round';

    for (const [start, end] of HAND_CONNECTIONS) {
      ctx.beginPath();
      ctx.moveTo(scaledLandmarks[start].x, scaledLandmarks[start].y);
      ctx.lineTo(scaledLandmarks[end].x, scaledLandmarks[end].y);
      ctx.stroke();
    }
    ctx.restore();

    // Draw landmark dots (white with glow)
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';

    for (const lm of scaledLandmarks) {
      ctx.beginPath();
      ctx.arc(lm.x, lm.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
};

/**
 * Cleanup overlay
 */
const destroyHandOverlay = () => {
  // Clear any pending resize timeout
  if (resizeTimeoutId !== null) {
    clearTimeout(resizeTimeoutId);
    resizeTimeoutId = null;
  }

  // Clear canvas
  if (canvas && ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Remove event listener
  window.removeEventListener('resize', debouncedResize);

  canvas = null;
  ctx = null;
  videoElement = null;
  console.log('HandOverlay: Destroyed');
};

export {
  initHandOverlay,
  renderLandmarks,
  destroyHandOverlay
};
