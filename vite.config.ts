import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

// Get the current directory
const currentDir = __dirname || process.cwd();

// Create a public/3d directory and copy the pizza model there for browser access
const publicDir = resolve(currentDir, 'public');
const publicModelDir = resolve(publicDir, '3d');
const modelSource = resolve(currentDir, '3d/pizza.glb');
const modelDest = resolve(publicModelDir, 'pizza.glb');

// Create directory if it doesn't exist
if (!existsSync(publicModelDir)) {
  mkdirSync(publicModelDir, { recursive: true });
}

// Copy the model file to public directory
if (existsSync(modelSource)) {
  copyFileSync(modelSource, modelDest);
  console.log(`Copied 3D model to public directory for serving: ${modelDest}`);
} else {
  console.warn(`3D model source not found: ${modelSource}`);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: publicDir,  // Explicitly set the public directory
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,  // Don't inline any assets as base64
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable code splitting for simpler debugging
      },
    },
  },
});
