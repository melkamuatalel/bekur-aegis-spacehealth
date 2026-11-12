import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeAIAvatar({ isThinking, isSpeaking, stateText = "SYSTEM ONLINE // EDGE READY" }) {
  const mountRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // AI HOLOGRAM ROOT
    const aiGroup = new THREE.Group();
    scene.add(aiGroup);

    // 1. NEURAL CORE (Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    aiGroup.add(coreMesh);

    // Inner Glowing Plasma Sphere
    const plasmaGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const plasmaMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.8,
    });
    const plasmaMesh = new THREE.Mesh(plasmaGeo, plasmaMat);
    aiGroup.add(plasmaMesh);

    // 2. ORBITAL GYRO RINGS
    const ringGeo1 = new THREE.TorusGeometry(1.2, 0.018, 16, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    aiGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(1.4, 0.015, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    aiGroup.add(ring2);

    const ringGeo3 = new THREE.TorusGeometry(1.6, 0.012, 16, 64);
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.4 });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    aiGroup.add(ring3);

    // 3. SCAN LASER LINE
    const scanGeo = new THREE.RingGeometry(0.2, 1.5, 32);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const scanDisc = new THREE.Mesh(scanGeo, scanMat);
    scanDisc.rotation.x = Math.PI / 2;
    aiGroup.add(scanDisc);

    // 4. NEURAL PARTICLES
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 1.0 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.045,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    aiGroup.add(particles);

    // LIGHTS
    const pLight = new THREE.PointLight(0x00f0ff, 2, 6);
    pLight.position.set(0, 0, 2);
    scene.add(pLight);

    const ambLight = new THREE.AmbientLight(0x034a66, 0.8);
    scene.add(ambLight);

    // MOUSE TRACKING
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current = { x, y };
    };
    container.addEventListener('mousemove', onMouseMove);

    // ANIMATION
    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const speedMult = isThinking ? 2.5 : isSpeaking ? 1.8 : 1.0;

      // Orbit rotations
      ring1.rotation.x = time * 0.8 * speedMult;
      ring1.rotation.y = time * 0.5 * speedMult;

      ring2.rotation.y = -time * 0.9 * speedMult;
      ring2.rotation.z = time * 0.6 * speedMult;

      ring3.rotation.z = time * 0.4 * speedMult;
      ring3.rotation.x = -time * 0.7 * speedMult;

      // Core rotation & pulse
      coreMesh.rotation.y = time * 0.3 * speedMult;
      coreMesh.rotation.x = time * 0.2 * speedMult;

      const pulse = 1 + Math.sin(time * 3 * speedMult) * (isThinking ? 0.12 : 0.05);
      plasmaMesh.scale.set(pulse, pulse, pulse);

      // Scanning disc sweep
      scanDisc.position.y = Math.sin(time * 2) * 0.7;

      // Particles orbit
      particles.rotation.y = time * 0.15 * speedMult;

      // Mouse tracking interpolation
      aiGroup.rotation.y = THREE.MathUtils.lerp(aiGroup.rotation.y, mousePos.current.x * 0.4, 0.05);
      aiGroup.rotation.x = THREE.MathUtils.lerp(aiGroup.rotation.x, -mousePos.current.y * 0.3, 0.05);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 280;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    };
  }, [isThinking, isSpeaking]);

  return (
    <div className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-space-900/80 to-space-950/90 border border-hud-cyan/30 shadow-xl backdrop-blur-md">
      <div ref={mountRef} className="w-full h-56 sm:h-64 cursor-crosshair" />

      {/* State badge below avatar */}
      <div className="mt-2 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-hud-cyan animate-ping" />
          <span className="font-orbitron text-xs tracking-wider text-hud-cyan font-bold">
            DR. BEKUR-AI // CMO HOLOGRAM
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">
          {stateText}
        </span>
      </div>
    </div>
  );
}
