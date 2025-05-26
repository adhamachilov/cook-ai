import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Create a public/3d directory and copy the pizza model there for browser access
const publicDir = resolve(__dirname, 'public');
const publicModelDir = resolve(publicDir, '3d');
const modelSource = resolve(__dirname, '3d/pizza.glb');
const modelDest = resolve(publicModelDir, 'pizza.glb');

// Create directory if it doesn't exist
if (!fs.existsSync(publicModelDir)) {
  fs.mkdirSync(publicModelDir, { recursive: true });
}

// Copy the model file to public directory
if (fs.existsSync(modelSource) && !fs.existsSync(modelDest)) {
  fs.copyFileSync(modelSource, modelDest);
  console.log('Copied 3D model to public directory for serving');
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: publicDir,  // Explicitly set the public directory
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
