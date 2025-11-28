/**
 * Section Panels Module
 * Creates and manages floating section panels in 3D space
 */

import * as THREE from 'three';
import { createPanelGeometry } from './panelGeometry.js';

// Section configuration - linear left-to-right layout for intuitive swipe navigation
// Swipe RIGHT = next section (move visually right)
// Swipe LEFT = prev section (move visually left)
// 8 sections arranged in a gentle horizontal arc
const SECTIONS = [
  { id: 0, title: 'Help', position: new THREE.Vector3(-9, 0.5, -3) },      // Far left
  { id: 1, title: 'Download', position: new THREE.Vector3(-6, 0.25, -1.5) }, // Left
  { id: 2, title: 'Contact', position: new THREE.Vector3(-3, 0, -0.5) },   // Center-left
  { id: 3, title: 'About', position: new THREE.Vector3(0, 0, 0) },         // CENTER (Home)
  { id: 4, title: 'Experience', position: new THREE.Vector3(3, 0, -0.5) }, // Center-right
  { id: 5, title: 'Projects', position: new THREE.Vector3(6, 0.25, -1.5) }, // Right
  { id: 6, title: 'Skills', position: new THREE.Vector3(9, 0.5, -3) },     // Far right
  { id: 7, title: 'Education', position: new THREE.Vector3(12, 0.75, -4.5) } // Furthest right
];

// Home section index (About)
const HOME_SECTION_INDEX = 3;

// Panel storage
let panelMeshes = [];
let currentHighlightIndex = 0;

/**
 * Create a canvas texture with section title
 * @param {string} title - Section title text
 * @returns {THREE.CanvasTexture}
 */
const createTitleTexture = (title) => {
  // Create canvas for text rendering
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Clear background (transparent)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw title text
  ctx.fillStyle = '#f5f5f5';
  ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, canvas.width / 2, canvas.height / 2);

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

/**
 * Create panel material with glass-like effect
 * @param {THREE.Texture} titleTexture - Title texture
 * @param {boolean} isHighlighted - Whether panel is highlighted
 * @returns {THREE.MeshStandardMaterial}
 */
const createPanelMaterial = (titleTexture, isHighlighted = false) => {
  return new THREE.MeshStandardMaterial({
    map: titleTexture,
    transparent: true,
    opacity: 0.85,
    color: isHighlighted ? 0x2a2a4e : 0x1a1a2e,
    emissive: isHighlighted ? 0x4a9eff : 0x000000,
    emissiveIntensity: isHighlighted ? 0.3 : 0,
    side: THREE.DoubleSide,
    metalness: 0.1,
    roughness: 0.8
  });
};

/**
 * Create all section panels and add to scene
 * @param {THREE.Scene} scene - Three.js scene
 * @returns {Array<THREE.Mesh>} Array of panel meshes
 */
const createSectionPanels = (scene) => {
  if (!scene) {
    console.error('SectionPanels: Scene is required');
    return [];
  }

  panelMeshes = [];

  SECTIONS.forEach((section, index) => {
    // Create geometry
    const geometry = createPanelGeometry(2.5, 3.5);

    // Create texture with title
    const titleTexture = createTitleTexture(section.title);

    // Create material (highlight first panel)
    const isHighlighted = index === currentHighlightIndex;
    const material = createPanelMaterial(titleTexture, isHighlighted);

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(section.position);

    // Store section data on mesh for easy access
    mesh.userData = {
      sectionId: section.id,
      sectionTitle: section.title
    };

    // Add to scene
    scene.add(mesh);
    panelMeshes.push(mesh);
  });

  console.log(`SectionPanels: Created ${panelMeshes.length} panels`);
  return panelMeshes;
};

/**
 * Get position of a specific panel
 * @param {number} sectionIndex - Section index (0-6)
 * @returns {THREE.Vector3|null}
 */
const getPanelPosition = (sectionIndex) => {
  if (sectionIndex < 0 || sectionIndex >= SECTIONS.length) {
    console.warn(`SectionPanels: Invalid section index ${sectionIndex}`);
    return null;
  }
  return SECTIONS[sectionIndex].position.clone();
};

/**
 * Highlight a specific panel
 * @param {number} index - Panel index to highlight
 */
const highlightPanel = (index) => {
  if (index < 0 || index >= panelMeshes.length) {
    console.warn(`SectionPanels: Invalid panel index ${index}`);
    return;
  }

  // Remove highlight from previous panel
  if (currentHighlightIndex >= 0 && currentHighlightIndex < panelMeshes.length) {
    const prevMesh = panelMeshes[currentHighlightIndex];
    prevMesh.material.color.setHex(0x1a1a2e);
    prevMesh.material.emissive.setHex(0x000000);
    prevMesh.material.emissiveIntensity = 0;
  }

  // Add highlight to new panel
  const mesh = panelMeshes[index];
  mesh.material.color.setHex(0x2a2a4e);
  mesh.material.emissive.setHex(0x4a9eff);
  mesh.material.emissiveIntensity = 0.3;

  currentHighlightIndex = index;
};

/**
 * Get section data
 * @returns {Array<Object>} Array of section info
 */
const getSectionData = () => {
  return SECTIONS.map(section => ({
    id: section.id,
    title: section.title,
    position: section.position.clone()
  }));
};

/**
 * Get panel meshes
 * @returns {Array<THREE.Mesh>}
 */
const getPanelMeshes = () => {
  return panelMeshes;
};

export {
  createSectionPanels,
  getPanelPosition,
  highlightPanel,
  getSectionData,
  getPanelMeshes,
  HOME_SECTION_INDEX
};
