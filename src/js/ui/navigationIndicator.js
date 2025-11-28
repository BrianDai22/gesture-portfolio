/**
 * Navigation Indicator Module
 * Shows which sections are to the left and right of current section
 */

import { getSectionData } from '../scene/sectionPanels.js';

let container = null;
let leftLabel = null;
let currentLabel = null;
let rightLabel = null;

const TOTAL_SECTIONS = 8;

/**
 * Initialize navigation indicator UI
 */
const initNavigationIndicator = () => {
  container = document.createElement('div');
  container.className = 'nav-indicator';

  // Left arrow and section
  const leftSection = document.createElement('div');
  leftSection.className = 'nav-section nav-left';
  leftLabel = document.createElement('span');
  leftLabel.className = 'nav-label';
  const leftArrow = document.createElement('span');
  leftArrow.className = 'nav-arrow';
  leftArrow.textContent = '← swipe left';
  leftSection.appendChild(leftArrow);
  leftSection.appendChild(leftLabel);

  // Current section (center)
  const centerSection = document.createElement('div');
  centerSection.className = 'nav-section nav-current';
  currentLabel = document.createElement('span');
  currentLabel.className = 'nav-label current';
  centerSection.appendChild(currentLabel);

  // Right arrow and section
  const rightSection = document.createElement('div');
  rightSection.className = 'nav-section nav-right';
  rightLabel = document.createElement('span');
  rightLabel.className = 'nav-label';
  const rightArrow = document.createElement('span');
  rightArrow.className = 'nav-arrow';
  rightArrow.textContent = 'swipe right →';
  rightSection.appendChild(rightLabel);
  rightSection.appendChild(rightArrow);

  container.appendChild(leftSection);
  container.appendChild(centerSection);
  container.appendChild(rightSection);

  document.body.appendChild(container);

  console.log('NavigationIndicator: Initialized');
};

/**
 * Update navigation indicator for current section
 * @param {number} currentIndex - Current section index
 */
const updateNavigationIndicator = (currentIndex) => {
  if (!container) return;

  const sections = getSectionData();
  if (!sections || sections.length === 0) return;

  // Get previous, current, and next section names
  const prevIndex = (currentIndex - 1 + TOTAL_SECTIONS) % TOTAL_SECTIONS;
  const nextIndex = (currentIndex + 1) % TOTAL_SECTIONS;

  const prevSection = sections[prevIndex];
  const currSection = sections[currentIndex];
  const nextSection = sections[nextIndex];

  // Update labels
  leftLabel.textContent = prevSection ? prevSection.title : '';
  currentLabel.textContent = currSection ? currSection.title : '';
  rightLabel.textContent = nextSection ? nextSection.title : '';
};

/**
 * Destroy navigation indicator
 */
const destroyNavigationIndicator = () => {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
  container = null;
  leftLabel = null;
  currentLabel = null;
  rightLabel = null;
};

export {
  initNavigationIndicator,
  updateNavigationIndicator,
  destroyNavigationIndicator
};
