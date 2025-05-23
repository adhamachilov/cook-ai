import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
// TypeScript needs the specific import path for proper type detection
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type PizzaLogoProps = {
  className?: string;
  size?: number;
};

const PizzaLogo: React.FC<PizzaLogoProps> = ({ className = '', size = 80 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Set up the Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setPixelRatio(window.devicePixelRatio); // For better display quality
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Create a group to hold the pizza model
    const pizzaGroup = new THREE.Group();
    scene.add(pizzaGroup);
    
    // Load the 3D pizza model
    const loader = new GLTFLoader();
    loader.load(
      'd:/Projects/MBZUAI/CookAI/1-b/project-bolt-sb1-xszlzyre/project/3d/pizza.glb',
      (gltf: { scene: THREE.Object3D }) => {
        // Add the loaded model to the group
        pizzaGroup.add(gltf.scene);
        // Scale the model to fit
        pizzaGroup.scale.set(1.7, 1.7, 1.7);
        
        // Position the pizza to be more centered
        pizzaGroup.position.set(0, -0.2, 0);
        
        // Initial rotation for better display
        pizzaGroup.rotation.x = 0.3;
        pizzaGroup.rotation.y = -0.2;
      },
      undefined,
      (error: unknown) => {
        console.error('Error loading 3D model:', error);
      }
    );
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the pizza
      if (pizzaGroup) {
        pizzaGroup.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Clean up on unmount
    return () => {
      if (pizzaGroup) {
        scene.remove(pizzaGroup);
      }
      renderer.dispose();
    };
  }, [size]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`inline-block ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        verticalAlign: 'middle',
      }}
    />
  );
};

export default PizzaLogo;
