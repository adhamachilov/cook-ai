import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Pizza3DSimple({ size = 100 }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 2.5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 5, 10);
    scene.add(directionalLight);
    
    // Create pizza group
    const pizzaGroup = new THREE.Group();
    scene.add(pizzaGroup);
    
    // For debugging: add a simple cube if model doesn't load
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    cube.visible = false; // Hidden by default
    scene.add(cube);
    
    // Load 3D model
    const loader = new GLTFLoader();
    let modelLoaded = false;
    
    loader.load(
      '/3d/pizza.glb', // Path to the 3D model in the public directory
      (gltf) => {
        console.log('Pizza model loaded successfully');
        pizzaGroup.add(gltf.scene);
        pizzaGroup.scale.set(1.5, 1.5, 1.5);
        pizzaGroup.rotation.x = 0.2;
        modelLoaded = true;
        cube.visible = false; // Hide debug cube
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('Error loading pizza model:', error);
        // Show debug cube if model fails to load
        cube.visible = true;
      }
    );
    
    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      if (pizzaGroup && modelLoaded) {
        pizzaGroup.rotation.y += 0.01;
      } else {
        // Rotate debug cube if model not loaded
        if (cube.visible) {
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
        }
      }
      
      renderer.render(scene, camera);
      
      return () => {
        cancelAnimationFrame(animationId);
      };
    };
    
    animate();
    
    // Clean up
    return () => {
      scene.clear();
      renderer.dispose();
    };
  }, [size]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
    />
  );
}
