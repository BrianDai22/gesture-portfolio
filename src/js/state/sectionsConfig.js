/**
 * Sections Configuration
 * Single source of truth for section ordering, titles, and layout positions.
 */

import * as THREE from "three";

const SECTIONS = [
  { id: 0, title: "Help", position: new THREE.Vector3(-9, 0.5, -3) },
  { id: 1, title: "Download", position: new THREE.Vector3(-6, 0.25, -1.5) },
  { id: 2, title: "Contact", position: new THREE.Vector3(-3, 0, -0.5) },
  { id: 3, title: "About", position: new THREE.Vector3(0, 0, 0) },
  { id: 4, title: "Experience", position: new THREE.Vector3(3, 0, -0.5) },
  { id: 5, title: "Projects", position: new THREE.Vector3(6, 0.25, -1.5) },
  { id: 6, title: "Skills", position: new THREE.Vector3(9, 0.5, -3) },
  { id: 7, title: "Education", position: new THREE.Vector3(12, 0.75, -4.5) },
];

const HOME_SECTION_INDEX = 3;
const TOTAL_SECTIONS = SECTIONS.length;

const getSections = () =>
  SECTIONS.map((section) => ({
    ...section,
    position: section.position.clone(),
  }));

const getSection = (index) => {
  if (index < 0 || index >= SECTIONS.length) return null;
  const section = SECTIONS[index];
  return { ...section, position: section.position.clone() };
};

export {
  SECTIONS,
  TOTAL_SECTIONS,
  HOME_SECTION_INDEX,
  getSections,
  getSection,
};
