/**
 * Scene Manager Module
 * Manages Three.js scene, renderer, camera, lighting, and render loop
 */

import * as THREE from 'three';

// Scene components
let scene = null;
let camera = null;
let renderer = null;
let animationFrameId = null;

// Update callbacks
const updateCallbacks = [];

/**
 * Initialize Three.js scene
 * @returns {Object} { scene, camera, renderer }
 */
const initScene = () => {
  // Get canvas element
  const canvas = document.getElementById('three-canvas');
  if (!canvas) {
    console.error('SceneManager: #three-canvas element not found');
    return null;
  }

  // Create scene
  scene = new THREE.Scene();

  // Create camera
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  // Create renderer with transparent background (to show camera feed behind)
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Max 2 for performance

  // Set up lighting
  setupLighting();

  // Handle window resize
  window.addEventListener('resize', handleResize);

  console.log('SceneManager: Scene initialized');

  return { scene, camera, renderer };
};

/**
 * Set up scene lighting
 */
const setupLighting = () => {
  if (!scene) return;

  // Ambient light - soft base illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Directional light - from top-right for subtle shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 5, 3);
  scene.add(directionalLight);

  console.log('SceneManager: Lighting configured');
};

/**
 * Handle window resize
 */
const handleResize = () => {
  if (!camera || !renderer) return;

  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
};

/**
 * Start render loop
 */
const startRenderLoop = () => {
  if (!scene || !camera || !renderer) {
    console.error('SceneManager: Cannot start render loop - scene not initialized');
    return;
  }

  const render = () => {
    // Call all update callbacks
    updateCallbacks.forEach(callback => callback());

    // Render scene
    renderer.render(scene, camera);

    // Request next frame
    animationFrameId = requestAnimationFrame(render);
  };

  render();
  console.log('SceneManager: Render loop started');
};

/**
 * Stop render loop
 */
const stopRenderLoop = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    console.log('SceneManager: Render loop stopped');
  }
};

/**
 * Register a callback to be called each frame
 * @param {Function} callback - Function to call each frame
 */
const onUpdate = (callback) => {
  if (typeof callback === 'function') {
    updateCallbacks.push(callback);
  }
};

/**
 * Get scene instance
 * @returns {THREE.Scene|null}
 */
const getScene = () => scene;

/**
 * Get camera instance
 * @returns {THREE.PerspectiveCamera|null}
 */
const getCamera = () => camera;

/**
 * Get renderer instance
 * @returns {THREE.WebGLRenderer|null}
 */
const getRenderer = () => renderer;

export {
  initScene,
  getScene,
  getCamera,
  getRenderer,
  onUpdate,
  startRenderLoop,
  stopRenderLoop
};
