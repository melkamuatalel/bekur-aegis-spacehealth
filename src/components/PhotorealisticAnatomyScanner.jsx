import React, { useState, useEffect } from 'react';
import {
  Brain,
  Eye,
  Heart,
  Activity,
  Bone,
  Crosshair,
  Sparkles,
  Zap,
  Maximize2,
  Scan,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function PhotorealisticAnatomyScanner({
  activeCrew,
  selectedOrgan,
  onSelectOrgan,
  isEmergencyActive,
}) {
  const [gender, setGender] = useState('male');
  const [posture, setPosture] = useState('standing'); // 'standing' | 'seated'
  const [isLaserScanning, setIsLaserScanning] = useState(true);
  const [hoveredOrgan, setHoveredOrgan] = useState(null);

  // Automatically sync gender with activeCrew
  useEffect(() => {
    if (activeCrew?.gender) {
      const g = activeCrew.gender.toLowerCase();
      setGender(g === 'female' ? 'female' : 'male');
    }
  }, [activeCrew]);

  // Determine current image source
  const currentImageSrc = `/anatomy/${gender}_${posture}.jpg`;

  // Organ hotspots positions in percentage of container for standing vs seated
  const organHotspots = [
    {
      id: 'cns',
      name: 'Brain & Intracranial Cavity (CNS)',
      short: 'CNS / BRAIN',
      icon: Brain,
      color: 'hud-cyan',
      standingPos: { top: '10%', left: '50%' },
      seatedPos: { top: '13%', left: '46%' },
      metric: 'ICP: +4.2 mmHg',
      status: activeCrew?.organAlerts?.brain?.status || 'NOMINAL',
    },
    {
      id: 'optic',
      name: 'Optic Nerve Sheath (SANS / Vision)',
      short: 'OPTIC / SANS',
      icon: Eye,
      color: 'hud-amber',
      standingPos: { top: '13.5%', left: '50%' },
      seatedPos: { top: '16.5%', left: '46%' },
      metric: activeCrew?.sansScore > 65 ? 'ONSD: 5.8mm (STAGE 2)' : 'ONSD: 4.8mm',
      status: activeCrew?.organAlerts?.eyes?.status || 'MONITOR',
    },
    {
      id: 'pulmo',
      name: 'Pulmonary Complex & Alveolar Beds',
      short: 'PULMONARY',
      icon: Activity,
      color: 'hud-cyan',
      standingPos: { top: '25%', left: '51%' },
      seatedPos: { top: '28%', left: '47%' },
      metric: `${activeCrew?.vitals?.spo2 || 98.4}% SpO2`,
      status: activeCrew?.organAlerts?.lungs?.status || 'NOMINAL',
    },
    {
      id: 'cardio',
      name: 'Cardiovascular Complex & Myocardium',
      short: 'CARDIAC',
      icon: Heart,
      color: 'rose-500',
      standingPos: { top: '27.5%', left: '48%' },
      seatedPos: { top: '30.5%', left: '44%' },
      metric: `${activeCrew?.vitals?.bpm || (isEmergencyActive ? 128 : 74)} BPM`,
      status: isEmergencyActive ? 'CRITICAL' : activeCrew?.organAlerts?.heart?.status || 'NOMINAL',
    },
    {
      id: 'renal',
      name: 'Hepatorenal Clearance (Liver & Kidneys)',
      short: 'HEPATORENAL',
      icon: Zap,
      color: 'amber-400',
      standingPos: { top: '35%', left: '50%' },
      seatedPos: { top: '39%', left: '46%' },
      metric: 'Ca++ Excretion: +18%',
      status: activeCrew?.organAlerts?.bones?.status || 'MONITOR',
    },
    {
      id: 'musculo',
      name: 'Vertebral Spine & Femoral Skeletal Cage',
      short: 'SPINE / BONES',
      icon: Bone,
      color: 'slate-300',
      standingPos: { top: '48%', left: '50%' },
      seatedPos: { top: '56%', left: '42%' },
      metric: 'BMD: -1.1%/mo',
      status: activeCrew?.organAlerts?.bones?.status || 'MONITOR',
    },
  ];

  const handleSelect = (id) => {
    cockpitAudio.playBlip();
    onSelectOrgan(selectedOrgan === id ? null : id);
  };

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-space-950 via-space-900 to-space-950 border border-hud-cyan/30 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Top Aerospace Scanner Header Bar */}
      <div className="p-3 sm:p-4 bg-space-950/90 border-b border-hud-cyan/20 flex flex-wrap items-center justify-between gap-2.5 z-20 relative">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hud-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-hud-cyan"></span>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-orbitron font-bold text-xs sm:text-sm text-white tracking-wider">
                PHOTOREALISTIC ANATOMICAL TOMOGRAPHY
              </h3>
              <span className="hidden sm:inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-hud-cyan/15 border border-hud-cyan/40 text-hud-cyan uppercase">
                {gender === 'female' ? '♀ FEMALE MORPHOLOGY' : '♂ MALE MORPHOLOGY'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              High-Resolution Internal Organ & Skeletal In-Vivo Telemetry
            </p>
          </div>
        </div>

        {/* Gender & Posture Selector Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Gender Switch */}
          <div className="flex items-center bg-space-900 border border-slate-700/80 rounded-xl p-0.5 text-xs font-mono">
            <button
              onClick={() => {
                setGender('male');
                cockpitAudio.playBlip();
              }}
              className={`px-2.5 py-1 rounded-lg transition ${
                gender === 'male'
                  ? 'bg-hud-cyan text-space-950 font-bold shadow-md shadow-hud-cyan/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ♂ Male (Abebe)
            </button>
            <button
              onClick={() => {
                setGender('female');
                cockpitAudio.playBlip();
              }}
              className={`px-2.5 py-1 rounded-lg transition ${
                gender === 'female'
                  ? 'bg-hud-cyan text-space-950 font-bold shadow-md shadow-hud-cyan/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ♀ Female (Sarah)
            </button>
          </div>

          {/* Posture Switch (Standing vs Seated Flight Couch) */}
          <div className="flex items-center bg-space-900 border border-slate-700/80 rounded-xl p-0.5 text-xs font-mono">
            <button
              onClick={() => {
                setPosture('standing');
                cockpitAudio.playBlip();
              }}
              className={`px-2.5 py-1 rounded-lg transition ${
                posture === 'standing'
                  ? 'bg-hud-amber text-space-950 font-bold shadow-md shadow-hud-amber/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Stand (EVA)
            </button>
            <button
              onClick={() => {
                setPosture('seated');
                cockpitAudio.playBlip();
              }}
              className={`px-2.5 py-1 rounded-lg transition ${
                posture === 'seated'
                  ? 'bg-hud-amber text-space-950 font-bold shadow-md shadow-hud-amber/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Flight Couch
            </button>
          </div>

          {/* Laser Scanner Toggle */}
          <button
            onClick={() => setIsLaserScanning(!isLaserScanning)}
            title="Toggle Laser Scan Beam"
            className={`p-1.5 rounded-lg border transition ${
              isLaserScanning
                ? 'bg-hud-cyan/20 border-hud-cyan text-hud-cyan'
                : 'bg-space-900 border-slate-700 text-slate-500'
            }`}
          >
            <Scan className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Stage with Hotspots and Cyber HUD */}
      <div className="relative w-full h-[520px] sm:h-[580px] bg-space-950 flex items-center justify-center overflow-hidden select-none">
        {/* Background Cyber Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* The Photorealistic Anatomical Astronaut Image */}
        <img
          src={currentImageSrc}
          alt={`Anatomical ${gender} ${posture}`}
          className="h-full w-auto max-w-full object-contain filter drop-shadow-[0_0_35px_rgba(0,240,255,0.25)] transition-all duration-500"
        />

        {/* Laser Scan Sweep Animation */}
        {isLaserScanning && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-hud-cyan to-transparent shadow-[0_0_20px_#00f0ff] animate-scanBeam pointer-events-none z-10 opacity-75" />
        )}

        {/* Circular Targeting Crosshairs HUD Watermark */}
        <div className="absolute top-6 left-6 pointer-events-none font-mono text-[10px] text-hud-cyan/70 space-y-0.5">
          <div>LOC: MTV-1 // MEDICAL LAB BAY 4</div>
          <div>SCAN_MODE: MULTISPECTRAL IN-VIVO</div>
          <div>SUBJECT: {activeCrew?.name?.toUpperCase()}</div>
          <div className="text-slate-500">RES: 1024x682 32-BIT COLORMETRIC</div>
        </div>

        <div className="absolute bottom-6 right-6 pointer-events-none font-mono text-[10px] text-right text-slate-400 space-y-0.5">
          <div className="text-hud-cyan font-bold">COORDINATES LOCKED</div>
          <div>GRAV: 0.00 G (MICROGRAVITY)</div>
          <div>RAD: 184 µSv/h GCR</div>
        </div>

        {/* INTERACTIVE ORGAN HOTSPOTS */}
        {organHotspots.map((organ) => {
          const pos = posture === 'standing' ? organ.standingPos : organ.seatedPos;
          const isSelected = selectedOrgan === organ.id;
          const isHovered = hoveredOrgan === organ.id;
          const Icon = organ.icon;

          return (
            <div
              key={organ.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group"
              onMouseEnter={() => setHoveredOrgan(organ.id)}
              onMouseLeave={() => setHoveredOrgan(null)}
            >
              {/* Outer Pulsing Target Ring */}
              <button
                onClick={() => handleSelect(organ.id)}
                className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-300 ${
                  isSelected
                    ? 'scale-125 bg-hud-cyan/30 border-2 border-hud-cyan shadow-[0_0_25px_#00f0ff]'
                    : isHovered
                    ? 'scale-110 bg-space-950/90 border-2 border-hud-cyan shadow-[0_0_15px_#00f0ff]'
                    : 'bg-space-950/80 border border-hud-cyan/50 hover:border-hud-cyan hover:scale-110'
                }`}
              >
                {/* Ping wave */}
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hud-cyan opacity-40"></span>
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isSelected ? 'text-white' : 'text-hud-cyan'
                  }`}
                />
              </button>

              {/* Floating Holographic Tooltip Banner */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 sm:w-56 p-2.5 rounded-xl bg-space-950/95 border border-hud-cyan/50 shadow-2xl backdrop-blur-md pointer-events-none transition-all duration-200 z-40 ${
                  isSelected || isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
                  <span className="font-orbitron font-bold text-[11px] text-white">
                    {organ.short}
                  </span>
                  <span
                    className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      organ.status === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : organ.status === 'WARNING'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {organ.status}
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-hud-cyan">
                  {organ.metric}
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                  Click to inspect NASA microgravity countermeasure
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Quick Selector Organ Strip */}
      <div className="p-3 bg-space-950/90 border-t border-slate-800 flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider hidden md:inline-block mr-2">
          TARGET ORGAN:
        </span>
        {organHotspots.map((organ) => {
          const isSelected = selectedOrgan === organ.id;
          const Icon = organ.icon;
          return (
            <button
              key={organ.id}
              onClick={() => handleSelect(organ.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-hud-cyan text-space-950 font-bold shadow-lg shadow-hud-cyan/30 scale-105'
                  : 'bg-space-900 border border-slate-800 text-slate-300 hover:border-hud-cyan hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{organ.short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
