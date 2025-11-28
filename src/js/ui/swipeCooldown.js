/**
 * Swipe Cooldown Timer UI
 * Shows visual countdown until next swipe is available
 */

let timerElement = null;
let progressElement = null;
let timeTextElement = null;
let animationId = null;

/**
 * Initialize cooldown timer UI
 */
const initSwipeCooldown = () => {
  // Create timer container
  timerElement = document.createElement('div');
  timerElement.className = 'swipe-cooldown hidden';

  // Create text element
  const textDiv = document.createElement('div');
  textDiv.className = 'cooldown-text';
  textDiv.textContent = 'Next gesture in';
  timerElement.appendChild(textDiv);

  // Create progress container
  const progressContainer = document.createElement('div');
  progressContainer.className = 'cooldown-progress';

  // Create progress bar
  progressElement = document.createElement('div');
  progressElement.className = 'cooldown-bar';
  progressContainer.appendChild(progressElement);
  timerElement.appendChild(progressContainer);

  // Create time text
  timeTextElement = document.createElement('div');
  timeTextElement.className = 'cooldown-time';
  timeTextElement.textContent = '3s';
  timerElement.appendChild(timeTextElement);

  document.body.appendChild(timerElement);

  console.log('SwipeCooldown: Initialized');
};

/**
 * Start cooldown timer
 * @param {number} durationMs - Cooldown duration in milliseconds
 */
const startCooldown = (durationMs) => {
  if (!timerElement) return;

  // Cancel any existing animation
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  // Show timer
  timerElement.classList.remove('hidden');

  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const remaining = Math.max(0, durationMs - elapsed);
    const progress = 1 - (remaining / durationMs);

    // Update progress bar
    progressElement.style.width = `${progress * 100}%`;

    // Update time text
    const seconds = Math.ceil(remaining / 1000);
    timeTextElement.textContent = `${seconds}s`;

    if (remaining > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Hide timer when complete
      timerElement.classList.add('hidden');
      animationId = null;
    }
  };

  animationId = requestAnimationFrame(animate);
};

/**
 * Destroy cooldown timer UI
 */
const destroySwipeCooldown = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (timerElement && timerElement.parentNode) {
    timerElement.parentNode.removeChild(timerElement);
  }
  timerElement = null;
  progressElement = null;
  timeTextElement = null;
};

export {
  initSwipeCooldown,
  startCooldown,
  destroySwipeCooldown
};
