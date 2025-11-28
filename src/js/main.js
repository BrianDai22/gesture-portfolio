import { createApp } from './core/app.js';

/**
 * Initialize the Gesture Portfolio application
 */
const init = async () => {
  try {
    const app = createApp();
    await app.init();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      app.destroy();
    });

  } catch (error) {
    console.error('Gesture Portfolio: Failed to initialize', error);
    showFriendlyError();
  }
};

/**
 * Show user-friendly error message
 */
const showFriendlyError = () => {
  const statusElement = document.getElementById('overlay-status');
  if (statusElement) {
    const statusText = statusElement.querySelector('.status-text');
    const hint = statusElement.querySelector('.hint');
    if (statusText) statusText.textContent = 'Something went wrong';
    if (hint) hint.textContent = 'Please refresh the page. If the problem persists, try using a different browser.';
  }
};

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  // Don't show UI message for every error, just log it
  // The user will see specific error messages from our modules
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', init);

// Export for potential testing
export { init };
