/**
 * Camera Access Module
 * Handles getUserMedia with graceful permission handling and retry logic
 */

let cameraStream = null;
let denialCount = 0;

/**
 * Request camera access with user-friendly permission handling
 * @returns {Promise<MediaStream|null>} Camera stream or null if denied
 */
const initCamera = async () => {
  const videoElement = document.getElementById('camera-feed');
  const statusElement = document.getElementById('overlay-status');

  if (!videoElement) {
    console.error('Camera: #camera-feed element not found');
    return null;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    // Attach stream to video element
    videoElement.srcObject = stream;
    videoElement.play();

    // Remove hidden class to show video
    videoElement.classList.remove('hidden');
    document.body.classList.add('camera-active');

    // Update status
    if (statusElement) {
      const statusText = statusElement.querySelector('.status-text');
      const hint = statusElement.querySelector('.hint');
      if (statusText) statusText.textContent = 'Tracking your hand...';
      if (hint) hint.textContent = 'Move your hand in front of the camera to interact.';
    }

    cameraStream = stream;
    denialCount = 0;
    console.log('Camera: Access granted, stream active');
    return stream;

  } catch (error) {
    console.warn('Camera: Access denied or error', error);
    denialCount++;

    if (denialCount === 1) {
      // First denial - show reassuring retry prompt
      if (statusElement) {
        const statusText = statusElement.querySelector('.status-text');
        const hint = statusElement.querySelector('.hint');
        if (statusText) statusText.textContent = 'Camera access needed for gestures';
        if (hint) {
          hint.textContent = 'Your video stays 100% on your device - we never store or transmit any camera data. Gesture control is just for fun navigation! Please allow camera access and refresh to try again.';
        }
      }
    } else {
      // Second denial - fall back to keyboard/mouse
      document.body.classList.add('camera-denied');
      if (statusElement) {
        const statusText = statusElement.querySelector('.status-text');
        const hint = statusElement.querySelector('.hint');
        if (statusText) statusText.textContent = 'No problem!';
        if (hint) {
          hint.textContent = 'Use mouse/keyboard to navigate (swipe gestures will be enabled in next phase).';
        }
      }
    }

    return null;
  }
};

/**
 * Get the current camera stream
 * @returns {MediaStream|null}
 */
const getCameraStream = () => {
  return cameraStream;
};

/**
 * Stop camera stream and cleanup
 */
const stopCamera = () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    console.log('Camera: Stream stopped');
  }
};

export { initCamera, getCameraStream, stopCamera };
