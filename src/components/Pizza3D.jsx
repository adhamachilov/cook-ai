import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function Pizza3D({ size = 100 }) {
  const mountRef = useRef(null)

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 2.5
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(size, size)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.innerHTML = ''
    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Pizza container
    const pizzaGroup = new THREE.Group()
    scene.add(pizzaGroup)
    
    // Load 3D model
    const loader = new GLTFLoader()
    // Using relative path that will work in the browser context
    const modelPath = '/3d/pizza.glb'
    
    loader.load(
      modelPath,
      (gltf) => {
        pizzaGroup.add(gltf.scene)
        pizzaGroup.scale.set(1.2, 1.2, 1.2)
        pizzaGroup.position.y = -0.2
        pizzaGroup.rotation.x = 0.2
      },
      undefined,
      (error) => console.error('Error loading pizza model:', error)
    )

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      if (pizzaGroup) {
        pizzaGroup.rotation.y += 0.015
      }
      renderer.render(scene, camera)
    }
    animate()
    
    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [size])

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: size, 
        height: size, 
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
    />
  )
}
