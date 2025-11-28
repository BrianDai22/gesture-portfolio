/**
 * Navigation Module
 * Handles camera animation and navigation between section panels
 */

import * as THREE from 'three';
import { onSectionChange } from '../state/navigationState.js';
import { getPanelPosition, highlightPanel, getPanelMeshes, HOME_SECTION_INDEX } from '../scene/sectionPanels.js';

// Camera animation state
let camera = null;
let isAnimating = false;
let animationStartTime = 0;
let startPosition = new THREE.Vector3();
let targetPosition = new THREE.Vector3();
let startLookAt = new THREE.Vector3();
let targetLookAt = new THREE.Vector3();

// Animation configuration
const ANIMATION_DURATION = 500; // ms
const CAMERA_OFFSET = 10; // Distance in front of panel (further for wider view)

/**
 * Linear interpolation helper
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number}
 */
const lerp = (start, end, t) => {
  return start + (end - start) * t;
};

/**
 * Initialize navigation system
 * @param {THREE.PerspectiveCamera} cam - Three.js camera
 * @param {Array<THREE.Mesh>} panels - Section panel meshes
 */
const initNavigation = (cam, panels) => {
  if (!cam) {
    console.error('Navigation: Camera is required');
    return;
  }

  camera = cam;

  // Listen for section changes
  onSectionChange((newIndex, oldIndex) => {
    console.log(`Navigation: Section changed to ${newIndex}`);
    navigateToSection(newIndex);
  });

  // Initialize camera at home section (About)
  navigateToSection(HOME_SECTION_INDEX, true); // Immediate, no animation

  console.log('Navigation: Initialized');
};

/**
 * Navigate camera to a specific section
 * @param {number} sectionIndex - Target section index
 * @param {boolean} immediate - Skip animation if true
 */
const navigateToSection = (sectionIndex, immediate = false) => {
  const panelPosition = getPanelPosition(sectionIndex);
  if (!panelPosition || !camera) {
    console.warn(`Navigation: Cannot navigate to section ${sectionIndex}`);
    return;
  }

  // Highlight the target panel
  highlightPanel(sectionIndex);

  // Calculate camera target position (offset in front of panel)
  const targetPos = panelPosition.clone();
  targetPos.z += CAMERA_OFFSET;

  if (immediate) {
    // Immediate positioning (no animation)
    camera.position.copy(targetPos);
    camera.lookAt(panelPosition);
    console.log(`Navigation: Jumped to section ${sectionIndex}`);
  } else {
    // Start smooth animation
    startPosition.copy(camera.position);
    targetPosition.copy(targetPos);

    // Store current look-at point
    const currentLookAt = new THREE.Vector3(0, 0, -1);
    currentLookAt.applyQuaternion(camera.quaternion);
    currentLookAt.add(camera.position);
    startLookAt.copy(currentLookAt);
    targetLookAt.copy(panelPosition);

    isAnimating = true;
    animationStartTime = Date.now();

    console.log(`Navigation: Animating to section ${sectionIndex}`);
  }
};

/**
 * Update camera animation (call each frame)
 */
const updateCameraAnimation = () => {
  if (!isAnimating || !camera) return;

  const elapsed = Date.now() - animationStartTime;
  const t = Math.min(elapsed / ANIMATION_DURATION, 1.0);

  // Lerp camera position
  camera.position.x = lerp(startPosition.x, targetPosition.x, t);
  camera.position.y = lerp(startPosition.y, targetPosition.y, t);
  camera.position.z = lerp(startPosition.z, targetPosition.z, t);

  // Lerp look-at target
  const currentLookAt = new THREE.Vector3(
    lerp(startLookAt.x, targetLookAt.x, t),
    lerp(startLookAt.y, targetLookAt.y, t),
    lerp(startLookAt.z, targetLookAt.z, t)
  );
  camera.lookAt(currentLookAt);

  // Check if animation is complete
  if (t >= 1.0) {
    isAnimating = false;
    camera.lookAt(targetLookAt); // Ensure exact final orientation
    console.log('Navigation: Animation complete');
  }
};

/**
 * Update pointer tracking for point gesture
 * Uses screen-space distance to find closest panel (more accurate than raycasting)
 * @param {Object} screenPosition - { x, y } in normalized screen coordinates (0-1)
 */
const updatePointer = (screenPosition) => {
  if (!camera || !screenPosition) return;

  // Invert x-coordinate to account for CSS scaleX(-1) flip on video
  const adjustedX = 1 - screenPosition.x;

  // Get panel meshes
  const panels = getPanelMeshes();
  if (!panels || panels.length === 0) return;

  // Project all panel positions to screen space and find closest to finger
  let closestPanel = null;
  let closestDistance = Infinity;
  const fingerScreenPos = new THREE.Vector2(adjustedX, screenPosition.y);

  panels.forEach(panel => {
    // Get panel center in world space
    const panelCenter = panel.position.clone();

    // Project to screen space (normalized 0-1)
    const projected = panelCenter.clone().project(camera);
    const panelScreenPos = new THREE.Vector2(
      (projected.x + 1) / 2,
      (-projected.y + 1) / 2
    );

    // Calculate distance to finger
    const distance = fingerScreenPos.distanceTo(panelScreenPos);

    // Only consider panels in front of camera (z < 1 after projection)
    if (projected.z < 1 && distance < closestDistance) {
      closestDistance = distance;
      closestPanel = panel;
    }
  });

  // Detection threshold - must be within 15% of screen to detect
  const DETECTION_THRESHOLD = 0.15;

  if (closestPanel && closestDistance < DETECTION_THRESHOLD) {
    const sectionTitle = closestPanel.userData.sectionTitle;
    console.log(`Navigation: Pointing at "${sectionTitle}" panel (distance: ${closestDistance.toFixed(3)})`);
    // Full selection behavior will be added in Phase 3
  }
};

export {
  initNavigation,
  navigateToSection,
  updateCameraAnimation,
  updatePointer
};
