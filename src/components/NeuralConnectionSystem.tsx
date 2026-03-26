"use client";

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

interface NeuralConnectionSystemProps {
  nodes: { id: number; top: string; left: string }[];
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const NeuralConnectionSystem = ({ nodes, containerRef }: NeuralConnectionSystemProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const parent = containerRef.current;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    // --- SETUP SCENE ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2, width / 2, height / 2, height / -2, 1, 1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);

    // --- FILAMENTS (Synapses) ---
    const filamentGroups: THREE.Group[] = [];

    const createBubblePath = (targetX: number, targetY: number) => {
      const group = new THREE.Group();
      
      const start = new THREE.Vector3(0, 0, 0);
      const end = new THREE.Vector3(targetX, targetY, 0);
      
      // Control point for a gentle curve
      const mid = new THREE.Vector3(
        targetX * 0.5 + (Math.random() - 0.5) * 50,
        targetY * 0.5 + (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 20
      );

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      
      // Create 5 bubbles of increasing size (The "tail")
      const bubbleCount = 5;
      const bubbles: THREE.Mesh[] = [];

      for (let i = 1; i <= bubbleCount; i++) {
        // Position them from near the center (small) up to the cloud (large)
        const t = 0.18 + (i / bubbleCount) * 0.72; // Start closer to center, end closer to balloon
        const pos = curve.getPoint(t);
        const size = i * 2.5; 
        
        // 1. Inner Black Core
        const coreGeom = new THREE.SphereGeometry(size, 20, 20);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const core = new THREE.Mesh(coreGeom, coreMat);
        
        // 2. Outer White Stroke (Inverted Hull)
        const strokeGeom = new THREE.SphereGeometry(size * 1.15, 20, 20);
        const strokeMat = new THREE.MeshBasicMaterial({ 
          color: 0xffffff, 
          side: THREE.BackSide,
          transparent: true,
          opacity: 1.0
        });
        const stroke = new THREE.Mesh(strokeGeom, strokeMat);

        const bubble = new THREE.Group();
        bubble.add(core);
        bubble.add(stroke);
        
        bubble.position.copy(pos);
        bubble.scale.setScalar(0); // Start at scale 0
        
        bubble.userData = { 
          originalPos: pos.clone(),
          offset: i * 1.2,
          speed: 0.012,
          entryProgress: 0,
          strokeMesh: stroke, // Reference for pulsing
          // Staggered entry
          delay: (i * 0.12) + (Math.random() * 0.2) 
        };

        group.add(bubble);
        bubbles.push(bubble as any); // Cast as Mesh for simpler loop if needed, or handle Group
      }

      group.userData = { bubbles };
      return group;
    };

    // Initialize bubble paths for each node
    const updateFilaments = () => {
      // Clear old
      filamentGroups.forEach(g => scene.remove(g));
      filamentGroups.length = 0;

      nodes.forEach(node => {
        const top = parseFloat(node.top);
        const left = parseFloat(node.left);

        const x = (left / 100) * width - (width / 2);
        const y = (height / 2) - (top / 100) * height;

        const f = createBubblePath(x, y);
        filamentGroups.push(f);
        scene.add(f);
      });
    };

    updateFilaments();

    // --- ANIMATION ---
    let frameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) * 0.001; // Seconds since start
      
      frameId = requestAnimationFrame(animate);

      filamentGroups.forEach(group => {
        const bubbles = group.userData.bubbles as THREE.Group[];
        bubbles.forEach((bubble) => {
          const { originalPos, offset, speed, delay, strokeMesh } = bubble.userData;
          
          // Entry Animation (Match cloud arrival)
          if (elapsed > delay) {
            bubble.userData.entryProgress = Math.min(1, bubble.userData.entryProgress + 0.02);
          }
          const scale = bubble.userData.entryProgress;
          bubble.scale.setScalar(scale);

          // Subtle floating movement
          bubble.position.x = originalPos.x + Math.sin(elapsed * speed * 2 + offset) * 5;
          bubble.position.y = originalPos.y + Math.cos(elapsed * speed * 1.5 + offset) * 5;
          
          // Pulsing glow for the stroke (using opacity)
          if (strokeMesh && strokeMesh.material) {
            (strokeMesh.material as THREE.MeshBasicMaterial).opacity = (0.7 + Math.sin(elapsed * 4 + offset) * 0.3);
          }
        });
      });

      renderer.render(scene, camera);
    };

    requestAnimationFrame(animate);

    // --- RESIZE ---
    const handleResize = () => {
      const newWidth = parent.clientWidth;
      const newHeight = parent.clientHeight;
      
      camera.left = newWidth / -2;
      camera.right = newWidth / 2;
      camera.top = newHeight / 2;
      camera.bottom = newHeight / -2;
      camera.updateProjectionMatrix();
      
      renderer.setSize(newWidth, newHeight);
      updateFilaments();
    };

    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      filamentGroups.forEach(g => {
        g.children.forEach(c => {
          if (c instanceof THREE.Mesh) {
            c.geometry.dispose();
            (c.material as THREE.Material).dispose();
          } else if (c instanceof THREE.Line) {
            c.geometry.dispose();
            (c.material as THREE.Material).dispose();
          }
        });
      });
      if (canvasRef.current && canvasRef.current.contains(renderer.domElement)) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, [nodes]);

  return (
    <div 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
