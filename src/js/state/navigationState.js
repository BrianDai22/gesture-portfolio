/**
 * Navigation State Module
 * Manages current section index and navigation events
 */

import { TOTAL_SECTIONS, HOME_SECTION_INDEX } from "./sectionsConfig.js";

let homeSectionIndex = HOME_SECTION_INDEX;

// State
let currentSectionIndex = HOME_SECTION_INDEX; // Start at home (About)
let sectionChangeCallbacks = [];

/**
 * Get current section index
 * @returns {number} Current section index (0-6)
 */
const getCurrentSection = () => {
  return currentSectionIndex;
};

/**
 * Navigate to next section (circular - wraps from last to first)
 */
const navigateNext = () => {
  const newIndex = (currentSectionIndex + 1) % TOTAL_SECTIONS;
  goTo(newIndex);
};

/**
 * Navigate to previous section (circular - wraps from first to last)
 */
const navigatePrev = () => {
  const newIndex = (currentSectionIndex - 1 + TOTAL_SECTIONS) % TOTAL_SECTIONS;
  goTo(newIndex);
};

/**
 * Navigate to home section (About)
 */
const navigateHome = () => {
  if (currentSectionIndex !== homeSectionIndex) {
    goTo(homeSectionIndex);
  }
};

/**
 * Set home section index
 * @param {number} index - Home section index
 */
const setHomeSectionIndex = (index) => {
  if (index >= 0 && index < TOTAL_SECTIONS) {
    homeSectionIndex = index;
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

  console.log(
    `NavigationState: Navigating from section ${previousIndex} to section ${currentSectionIndex}`,
  );

  // Emit change event to all listeners
  sectionChangeCallbacks.forEach((callback) => {
    callback(currentSectionIndex, previousIndex);
  });
};

/**
 * Register callback for section change events
 * @param {Function} callback - Function called with (newIndex, oldIndex)
 */
const onSectionChange = (callback) => {
  if (typeof callback === "function") {
    sectionChangeCallbacks.push(callback);
  }
};

const offSectionChange = (callback) => {
  sectionChangeCallbacks = sectionChangeCallbacks.filter(
    (cb) => cb !== callback,
  );
};

const clearSectionChangeCallbacks = () => {
  sectionChangeCallbacks = [];
};

export {
  getCurrentSection,
  navigateNext,
  navigatePrev,
  navigateHome,
  goTo,
  onSectionChange,
  offSectionChange,
  clearSectionChangeCallbacks,
  setHomeSectionIndex,
};
