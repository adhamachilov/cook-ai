// Compatibility layer for Three.js
import * as THREE from 'three';

// Create a namespace to hold polyfilled constants
const ThreeCompat = {
  // Provide the constants that were removed in Three.js r152+
  LinearEncoding: 3000
};

// Apply the polyfill globally
// This uses window since we're in a browser context
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.LinearEncoding = ThreeCompat.LinearEncoding;
}

export { ThreeCompat };
export default THREE;
