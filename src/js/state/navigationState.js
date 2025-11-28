/**
 * Navigation State Module
 * Manages current section index and navigation events
 */

// Configuration
const TOTAL_SECTIONS = 7; // 0-6: Intro, Experience, Projects, Skills, Education, Contact, Download

// State
let currentSectionIndex = 0;
let sectionChangeCallback = null;

/**
 * Get current section index
 * @returns {number} Current section index (0-6)
 */
const getCurrentSection = () => {
  return currentSectionIndex;
};

/**
 * Navigate to next section
 */
const navigateNext = () => {
  const newIndex = Math.min(currentSectionIndex + 1, TOTAL_SECTIONS - 1);
  if (newIndex !== currentSectionIndex) {
    goTo(newIndex);
  }
};

/**
 * Navigate to previous section
 */
const navigatePrev = () => {
  const newIndex = Math.max(currentSectionIndex - 1, 0);
  if (newIndex !== currentSectionIndex) {
    goTo(newIndex);
  }
};

/**
 * Navigate to home (section 0)
 */
const navigateHome = () => {
  if (currentSectionIndex !== 0) {
    goTo(0);
  }
};

/**
 * Navigate to specific section index
 * @param {number} index - Target section index (0-6)
 */
const goTo = (index) => {
  if (index < 0 || index >= TOTAL_SECTIONS) {
    console.warn(`NavigationState: Invalid section index ${index}`);
    return;
  }

  const previousIndex = currentSectionIndex;
  currentSectionIndex = index;

  console.log(`NavigationState: Navigating from section ${previousIndex} to section ${currentSectionIndex}`);

  // Emit change event
  if (sectionChangeCallback) {
    sectionChangeCallback(currentSectionIndex, previousIndex);
  }
};

/**
 * Register callback for section change events
 * @param {Function} callback - Function called with (newIndex, oldIndex)
 */
const onSectionChange = (callback) => {
  sectionChangeCallback = callback;
};

export {
  getCurrentSection,
  navigateNext,
  navigatePrev,
  navigateHome,
  goTo,
  onSectionChange
};
