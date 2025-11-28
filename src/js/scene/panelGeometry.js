/**
 * Panel Geometry Module
 * Helper functions for creating panel geometries
 */

import * as THREE from 'three';

/**
 * Create a simple plane geometry for section panels
 * (Rounded corners can be added in Phase 4 for polish)
 * @param {number} width - Panel width
 * @param {number} height - Panel height
 * @returns {THREE.PlaneGeometry}
 */
const createPanelGeometry = (width = 2.5, height = 3.5) => {
  // Use simple PlaneGeometry for v1
  // Portrait orientation
  const geometry = new THREE.PlaneGeometry(width, height);
  return geometry;
};

export { createPanelGeometry };
