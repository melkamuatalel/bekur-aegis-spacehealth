import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw, ZoomIn, Eye, Heart, Brain, Bone, Activity, Sparkles } from 'lucide-react';

export default function ThreeAstronautModel({ activeCrew, selectedOrgan, onSelectOrgan, isAnomalyActive }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const organsRef = useRef({});
  const heartMeshRef = useRef(null);
  const targetCameraPos = useRef(new THREE.Vector3(0, 1.1, 3.6));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.9, 0));
  const isAutoRotate = useRef(true);
  const [autoRotateState, setAutoRotateState] = useState(true);

  // Organ target coordinates in 3D space
  const organFocusTargets = {
    cns: { cam: new THREE.Vector3(0, 1.85, 1.4), look: new THREE.Vector3(0, 1.75, 0) },
    optic: { cam: new THREE.Vector3(0, 1.75, 1.2), look: new THREE.Vector3(0, 1.7, 0.2) },
    cardio: { cam: new THREE.Vector3(-0.2, 1.15, 1.5), look: new THREE.Vector3(-0.12, 1.05, 0.15) },
    pulmo: { cam: new THREE.Vector3(0, 1.15, 1.6), look: new THREE.Vector3(0, 1.05, 0.15) },
    musculo: { cam: new THREE.Vector3(0, 0.6, 2.0), look: new THREE.Vector3(0, 0.5, 0) },
  };

  useEffect(() => {
    if (selectedOrgan && organFocusTargets[selectedOrgan]) {
      targetCameraPos.current.copy(organFocusTargets[selectedOrgan].cam);
      targetLookAt.current.copy(organFocusTargets[selectedOrgan].look);
      isAutoRotate.current = false;
      setAutoRotateState(false);
    } else {
      targetCameraPos.current.set(0, 1.1, 3.6);
      targetLookAt.current.set(0, 0.9, 0);
    }
  }, [selectedOrgan]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x030712, 0.08);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.copy(targetCameraPos.current);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 6.0;
    controls.minDistance = 1.0;
    controls.target.copy(targetLookAt.current);
    controlsRef.current = controls;

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0x00f0ff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.5);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff0055, 0.8);
    dirLight2.position.set(-3, -2, -3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x38bdf8, 2, 8);
    pointLight.position.set(0, 1.2, 1.5);
    scene.add(pointLight);

    // MATERIALS
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.2,
      metalness: 0.8,
    });

    const glowGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.22,
      roughness: 0.1,
      metalness: 0.9,
    });

    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // BUILD ASTRONAUT ANATOMICAL FIGURE
    // 1. Head
    const headGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const headMesh = new THREE.Mesh(headGeo, wireMat);
    const headInner = new THREE.Mesh(headGeo, glowGlassMat);
    headInner.scale.set(0.95, 0.95, 0.95);
    headMesh.add(headInner);
    headMesh.position.set(0, 1.75, 0);
    bodyGroup.add(headMesh);

    // 2. Visor/Face Shield
    const visorGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.16, 16, 1, false, -Math.PI / 2.5, Math.PI / 1.25);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 1.76, 0.12);
    visorMesh.rotation.y = Math.PI;
    bodyGroup.add(visorMesh);

    // 3. Neck
    const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.12, 16);
    const neckMesh = new THREE.Mesh(neckGeo, wireMat);
    neckMesh.position.set(0, 1.55, 0);
    bodyGroup.add(neckMesh);

    // 4. Chest / Torso
    const chestGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.5, 20);
    const chestMesh = new THREE.Mesh(chestGeo, wireMat);
    const chestInner = new THREE.Mesh(chestGeo, glowGlassMat);
    chestInner.scale.set(0.96, 0.96, 0.96);
    chestMesh.add(chestInner);
    chestMesh.position.set(0, 1.25, 0);
    bodyGroup.add(chestMesh);

    // 5. Abdomen & Pelvis
    const pelvisGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.35, 18);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, wireMat);
    pelvisMesh.position.set(0, 0.85, 0);
    bodyGroup.add(pelvisMesh);

    // 6. Arms & Shoulders
    const shoulderGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const leftShoulder = new THREE.Mesh(shoulderGeo, wireMat);
    leftShoulder.position.set(-0.38, 1.45, 0);
    bodyGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, wireMat);
    rightShoulder.position.set(0.38, 1.45, 0);
    bodyGroup.add(rightShoulder);

    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.45, 14);
    const leftArm = new THREE.Mesh(armGeo, wireMat);
    leftArm.position.set(-0.44, 1.15, 0);
    leftArm.rotation.z = 0.15;
    bodyGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, wireMat);
    rightArm.position.set(0.44, 1.15, 0);
    rightArm.rotation.z = -0.15;
    bodyGroup.add(rightArm);

    // Forearms
    const forearmGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.4, 14);
    const leftForearm = new THREE.Mesh(forearmGeo, wireMat);
    leftForearm.position.set(-0.48, 0.75, 0.08);
    leftForearm.rotation.x = -0.2;
    bodyGroup.add(leftForearm);

    const rightForearm = new THREE.Mesh(forearmGeo, wireMat);
    rightForearm.position.set(0.48, 0.75, 0.08);
    rightForearm.rotation.x = -0.2;
    bodyGroup.add(rightForearm);

    // 7. Legs
    const thighGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.55, 16);
    const leftThigh = new THREE.Mesh(thighGeo, wireMat);
    leftThigh.position.set(-0.16, 0.42, 0);
    bodyGroup.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo, wireMat);
    rightThigh.position.set(0.16, 0.42, 0);
    bodyGroup.add(rightThigh);

    const kneeGeo = new THREE.SphereGeometry(0.08, 14, 14);
    const leftKnee = new THREE.Mesh(kneeGeo, wireMat);
    leftKnee.position.set(-0.16, 0.12, 0);
    bodyGroup.add(leftKnee);

    const rightKnee = new THREE.Mesh(kneeGeo, wireMat);
    rightKnee.position.set(0.16, 0.12, 0);
    bodyGroup.add(rightKnee);

    const shinGeo = new THREE.CylinderGeometry(0.085, 0.07, 0.55, 16);
    const leftShin = new THREE.Mesh(shinGeo, wireMat);
    leftShin.position.set(-0.16, -0.2, 0);
    bodyGroup.add(leftShin);

    const rightShin = new THREE.Mesh(shinGeo, wireMat);
    rightShin.position.set(0.16, -0.2, 0);
    bodyGroup.add(rightShin);

    // Feet / Boots
    const bootGeo = new THREE.BoxGeometry(0.12, 0.08, 0.22);
    const leftBoot = new THREE.Mesh(bootGeo, wireMat);
    leftBoot.position.set(-0.16, -0.5, 0.04);
    bodyGroup.add(leftBoot);

    const rightBoot = new THREE.Mesh(bootGeo, wireMat);
    rightBoot.position.set(0.16, -0.5, 0.04);
    bodyGroup.add(rightBoot);

    // 8. GLOWING INTERNAL ORGANS IN 3D
    // Brain
    const brainGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const brainMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.3,
    });
    const brainMesh = new THREE.Mesh(brainGeo, brainMat);
    brainMesh.position.set(0, 1.75, 0);
    bodyGroup.add(brainMesh);
    organsRef.current.cns = brainMesh;

    // Optic Sheath (Eyes/SANS)
    const opticGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const opticMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 1.2,
    });
    const opticLeft = new THREE.Mesh(opticGeo, opticMat);
    opticLeft.position.set(-0.065, 1.76, 0.2);
    const opticRight = new THREE.Mesh(opticGeo, opticMat);
    opticRight.position.set(0.065, 1.76, 0.2);
    bodyGroup.add(opticLeft);
    bodyGroup.add(opticRight);
    organsRef.current.optic = opticLeft;

    // Heart
    const heartGeo = new THREE.DodecahedronGeometry(0.09, 2);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 1.5,
      roughness: 0.2,
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(-0.07, 1.22, 0.1);
    bodyGroup.add(heartMesh);
    heartMeshRef.current = heartMesh;
    organsRef.current.cardio = heartMesh;

    // Lungs
    const lungGeo = new THREE.SphereGeometry(0.09, 14, 14);
    const lungMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.7,
    });
    const lungL = new THREE.Mesh(lungGeo, lungMat);
    lungL.scale.set(0.8, 1.4, 0.6);
    lungL.position.set(-0.12, 1.22, -0.02);
    const lungR = new THREE.Mesh(lungGeo, lungMat);
    lungR.scale.set(0.8, 1.4, 0.6);
    lungR.position.set(0.12, 1.22, -0.02);
    bodyGroup.add(lungL);
    bodyGroup.add(lungR);
    organsRef.current.pulmo = lungL;

    // Spine (Vertebrae)
    const spineGroup = new THREE.Group();
    for (let i = 0; i < 9; i++) {
      const vGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.04, 8);
      const vMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        emissive: 0x64748b,
        emissiveIntensity: 0.5,
      });
      const vMesh = new THREE.Mesh(vGeo, vMat);
      vMesh.position.set(0, 1.4 - i * 0.07, -0.08);
      spineGroup.add(vMesh);
    }
    bodyGroup.add(spineGroup);
    organsRef.current.musculo = spineGroup;

    // 9. GROUND HOLOGRAPHIC SCAN RINGS & GRID
    const ringGeo1 = new THREE.RingGeometry(0.8, 0.84, 48);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = -0.55;
    scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(1.2, 1.22, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -0.55;
    scene.add(ring2);

    const gridHelper = new THREE.GridHelper(3, 12, 0x00f0ff, 0x034a66);
    gridHelper.position.y = -0.55;
    scene.add(gridHelper);

    // 10. FLOATING BIO-PARTICLES
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 2.2;
      particlePositions[i + 1] = Math.random() * 2.6 - 0.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 2.2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ANIMATION LOOP
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate ground holographic rings
      ring1.rotation.z = elapsedTime * 0.3;
      ring2.rotation.z = -elapsedTime * 0.15;

      // Heartbeat pulse simulation
      if (heartMeshRef.current) {
        const bpm = activeCrew?.vitals?.bpm || (isAnomalyActive ? 128 : 72);
        const beatFreq = (bpm / 60) * Math.PI * 2;
        const pulse = Math.sin(elapsedTime * beatFreq);
        const scale = 1 + (pulse > 0.7 ? (pulse - 0.7) * 0.4 : 0);
        heartMeshRef.current.scale.set(scale, scale, scale);
        heartMeshRef.current.material.emissiveIntensity = 1.0 + (pulse > 0.7 ? 1.5 : 0);
      }

      // Brain pulse
      if (organsRef.current.cns) {
        organsRef.current.cns.material.emissiveIntensity = 0.7 + Math.sin(elapsedTime * 2.5) * 0.4;
      }

      // Optic pulse if anomaly
      if (organsRef.current.optic) {
        organsRef.current.optic.material.emissiveIntensity = isAnomalyActive ? 1.5 + Math.sin(elapsedTime * 8) * 0.8 : 0.9;
      }

      // Auto-rotation when not focusing on organ
      if (isAutoRotate.current) {
        bodyGroup.rotation.y = elapsedTime * 0.25;
      }

      // Float particles
      const posArray = particleGeo.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        posArray[i] += 0.003;
        if (posArray[i] > 2.2) posArray[i] = -0.5;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Smooth camera interpolation towards target
      camera.position.lerp(targetCameraPos.current, 0.05);
      controls.target.lerp(targetLookAt.current, 0.05);
      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 480;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, [activeCrew, isAnomalyActive]);

  const handleToggleAutoRotate = () => {
    isAutoRotate.current = !isAutoRotate.current;
    setAutoRotateState(isAutoRotate.current);
  };

  const handleResetView = () => {
    targetCameraPos.current.set(0, 1.1, 3.6);
    targetLookAt.current.set(0, 0.9, 0);
    isAutoRotate.current = true;
    setAutoRotateState(true);
    onSelectOrgan(null);
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] rounded-2xl bg-gradient-to-b from-space-900/90 via-space-950/80 to-space-950 border border-hud-cyan/20 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay HUD Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hud-cyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-hud-cyan"></span>
        </span>
        <span className="font-mono text-xs uppercase tracking-widest text-hud-cyan bg-space-950/80 px-2.5 py-1 rounded-full border border-hud-cyan/30">
          WebGL 3D Biomechanical Telemetry
        </span>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={handleToggleAutoRotate}
          title="Toggle Auto-Rotation"
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
            autoRotateState
              ? 'bg-hud-cyan/20 border-hud-cyan text-hud-cyan'
              : 'bg-space-900/80 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          {autoRotateState ? '360° SPIN: ON' : '360° SPIN: OFF'}
        </button>
        <button
          onClick={handleResetView}
          title="Reset Camera View"
          className="p-1.5 rounded-lg bg-space-900/80 border border-slate-700 text-slate-300 hover:text-hud-cyan hover:border-hud-cyan transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Floating Interactive Organ Selector Pills */}
      <div className="absolute bottom-4 inset-x-4 flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
        {[
          { id: 'cns', name: 'Brain (CNS)', icon: Brain, color: 'hover:border-hud-cyan text-sky-400' },
          { id: 'optic', name: 'Optic / SANS', icon: Eye, color: 'hover:border-hud-amber text-amber-400' },
          { id: 'cardio', name: 'Heart', icon: Heart, color: 'hover:border-rose-500 text-rose-400' },
          { id: 'pulmo', name: 'Pulmonary', icon: Activity, color: 'hover:border-cyan-400 text-cyan-400' },
          { id: 'musculo', name: 'Spine & Bones', icon: Bone, color: 'hover:border-slate-300 text-slate-300' },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = selectedOrgan === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectOrgan(isSelected ? null : item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all backdrop-blur-md ${
                isSelected
                  ? 'bg-hud-cyan/25 border-2 border-hud-cyan text-white shadow-lg shadow-hud-cyan/30 scale-105'
                  : 'bg-space-900/80 border border-slate-700/80 text-slate-300 hover:bg-space-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Touch/Mouse hint */}
      <div className="absolute top-14 left-4 text-[10px] font-mono text-slate-400 pointer-events-none hidden sm:block">
        Drag to rotate 360° • Scroll to zoom • Click organ to focus
      </div>
    </div>
  );
}
