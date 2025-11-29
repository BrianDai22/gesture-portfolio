/**
 * Hand State Module
 * Stores current hand landmarks and dominant hand preference
 */

import { getItem, setItem } from "./safeStorage.js";

const STORAGE_KEY = "gesturePortfolio_dominantHand";
const DEFAULT_HAND = "Right";

let currentLandmarks = null;
let dominantHand = getItem(STORAGE_KEY) || DEFAULT_HAND;

/**
 * Set dominant hand preference (Left or Right)
 * @param {string} hand - 'Left' or 'Right'
 */
const setDominantHand = (hand) => {
  if (hand !== "Left" && hand !== "Right") {
    console.warn("HandState: Invalid hand preference, expected Left or Right");
    return;
  }
  dominantHand = hand;
  setItem(STORAGE_KEY, hand);
  console.log(`HandState: Dominant hand set to ${hand}`);
};

/**
 * Get dominant hand preference
 * @returns {string} 'Left' or 'Right'
 */
const getDominantHand = () => {
  return dominantHand;
};

/**
 * Update current hand landmarks
 * @param {Object} landmarks - MediaPipe hand landmarks (21 points with x, y, z)
 */
const updateLandmarks = (landmarks) => {
  currentLandmarks = landmarks;
};

/**
 * Get current hand landmarks
 * @returns {Object|null} Hand landmarks or null if no hand detected
 */
const getLandmarks = () => {
  return currentLandmarks;
};

/**
 * Clear current landmarks
 */
const clearLandmarks = () => {
  currentLandmarks = null;
};

export {
  setDominantHand,
  getDominantHand,
  updateLandmarks,
  getLandmarks,
  clearLandmarks,
};
