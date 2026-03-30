"use client";

import { useEffect, useRef } from 'react';
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

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2, width / 2, height / 2, height / -2, 1, 1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const currentCanvas = canvasRef.current;
    currentCanvas.appendChild(renderer.domElement);

    const filamentGroups: THREE.Group[] = [];

    const createBubblePath = (targetX: number, targetY: number) => {
      const group = new THREE.Group();
      const start = new THREE.Vector3(0, 0, 0);
      const end = new THREE.Vector3(targetX, targetY, 0);
      const curve = new THREE.QuadraticBezierCurve3(
        start, 
        new THREE.Vector3(targetX * 0.5, targetY * 0.5 + 40, 0),
        end
      );
      
      const bubbleCount = 6;
      const bubbles: THREE.Mesh[] = [];

      for (let i = 1; i <= bubbleCount; i++) {
        const t = 0.15 + (i / bubbleCount) * 0.75; 
        const pos = curve.getPoint(t);
        const size = i * 2.2; 
        
        // Solid, single material - NO STROKE, NO PULSE
        const geom = new THREE.SphereGeometry(size, 20, 20);
        const mat = new THREE.MeshBasicMaterial({ 
          color: 0x22d3ee, 
          transparent: true, 
          opacity: 0.7 // Exact cloud fill transparency
        });
        const bubble = new THREE.Mesh(geom, mat);
        
        bubble.position.copy(pos);
        bubble.scale.setScalar(0); 
        
        bubble.userData = { 
          originalPos: pos.clone(),
          entryProgress: 0,
          // Deterministic delay to prevent flickering on re-renders
          delay: (i * 0.1) + ((targetX % 10) * 0.02) 
        };

        group.add(bubble);
        bubbles.push(bubble);
      }

      group.userData = { bubbles };
      return group;
    };

    const updateFilaments = () => {
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

    let frameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) * 0.001;
      frameId = requestAnimationFrame(animate);

      filamentGroups.forEach(group => {
        const bubbles = group.userData.bubbles as THREE.Mesh[];
        bubbles.forEach((bubble) => {
          const { delay } = bubble.userData;
          if (elapsed > delay) {
            bubble.userData.entryProgress = Math.min(1, bubble.userData.entryProgress + 0.02);
            bubble.scale.setScalar(bubble.userData.entryProgress);
          }
        });
      });
      renderer.render(scene, camera);
    };

    requestAnimationFrame(animate);

    const handleResize = () => {
      const newWidth = parent.clientWidth;
      const newHeight = parent.clientHeight;
      camera.left = newWidth / -2; camera.right = newWidth / 2;
      camera.top = newHeight / 2; camera.bottom = newHeight / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      updateFilaments();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      filamentGroups.forEach(g => {
        g.children.forEach(c => {
          if (c instanceof THREE.Mesh) {
             c.geometry.dispose();
             (c.material as THREE.Material).dispose();
          }
        });
      });
      if (currentCanvas && currentCanvas.contains(renderer.domElement)) {
        currentCanvas.removeChild(renderer.domElement);
      }
    };
  }, [nodes, containerRef]);

  return (
    <div 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};
