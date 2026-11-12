import React, { useEffect, useRef, useState } from 'react';
import { Activity, Heart, ShieldCheck, AlertTriangle, Sparkles, Layers, Sliders, Scan } from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function NasaIssFlightConsole({ activeCrew, isEmergencyActive }) {
  const ecgCanvasRef = useRef(null);
  const plethCanvasRef = useRef(null);
  const respCanvasRef = useRef(null);
  const trendCanvasRef = useRef(null);

  const [centerMode, setCenterMode] = useState('heatmap-silhouette'); // 'heatmap-silhouette' | 'photorealistic'
  const [isLaserScanning, setIsLaserScanning] = useState(true);

  const bpm = activeCrew?.vitals?.bpm || (isEmergencyActive ? 128 : 72);
  const spo2 = activeCrew?.vitals?.spo2 || 98.4;
  const gender = activeCrew?.gender?.toLowerCase() === 'female' ? 'female' : 'male';

  // 1. WAVEFORMS ANIMATION (ECG, Arterial Plethysmograph, Capnography & Trend)
  useEffect(() => {
    let animId;
    let phase = 0;

    const ecgC = ecgCanvasRef.current;
    const plethC = plethCanvasRef.current;
    const respC = respCanvasRef.current;
    const trendC = trendCanvasRef.current;

    if (!ecgC || !plethC || !respC) return;

    const ctxEcg = ecgC.getContext('2d');
    const ctxPleth = plethC.getContext('2d');
    const ctxResp = respC.getContext('2d');
    const ctxTrend = trendC ? trendC.getContext('2d') : null;

    const w = 260;
    const h = 50;
    ecgC.width = w;
    ecgC.height = h;
    plethC.width = w;
    plethC.height = h;
    respC.width = w;
    respC.height = h;

    if (trendC) {
      trendC.width = 240;
      trendC.height = 70;
    }

    const bufferEcg = new Float32Array(w).fill(h / 2);
    const bufferPleth = new Float32Array(w).fill(h / 2);
    const bufferResp = new Float32Array(w).fill(h / 2);
    let sweepX = 0;

    const renderWaves = () => {
      phase++;
      sweepX = (sweepX + 1.2) % w;
      const beatPeriod = Math.max(25, Math.floor(3600 / bpm));
      const pos = phase % beatPeriod;

      // 1. Lead-II ECG Point
      let ecgY = h / 2;
      if (pos >= 4 && pos <= 8) ecgY -= 6; // P
      else if (pos === 11) ecgY += 4; // Q
      else if (pos >= 12 && pos <= 14) ecgY -= isEmergencyActive ? 28 : 22; // R peak
      else if (pos === 15) ecgY += 6; // S
      else if (pos >= 19 && pos <= 26) ecgY -= 8; // T

      // 2. Plethysmograph (Arterial Pulse Triangular wave)
      let plethY = h / 2;
      if (pos >= 14 && pos <= 24) {
        plethY -= Math.sin(((pos - 14) / 10) * Math.PI) * 16;
      }

      // 3. Respiration Wave
      const respY = h / 2 - Math.sin(phase * 0.05) * 12;

      const sx = Math.floor(sweepX);
      bufferEcg[sx] = ecgY;
      bufferPleth[sx] = plethY;
      bufferResp[sx] = respY;

      // Draw ECG (Red/Rose)
      ctxEcg.fillStyle = 'rgba(4, 7, 17, 0.2)';
      ctxEcg.fillRect(0, 0, w, h);
      ctxEcg.strokeStyle = isEmergencyActive ? '#f43f5e' : '#f43f5e';
      ctxEcg.lineWidth = 1.8;
      ctxEcg.shadowColor = '#f43f5e';
      ctxEcg.shadowBlur = 4;
      ctxEcg.beginPath();
      for (let x = 0; x < w; x++) {
        if (Math.abs(x - sx) < 8) continue;
        if (x === 0) ctxEcg.moveTo(x, bufferEcg[x]);
        else ctxEcg.lineTo(x, bufferEcg[x]);
      }
      ctxEcg.stroke();

      // Draw Pleth (Cyan/Green)
      ctxPleth.fillStyle = 'rgba(4, 7, 17, 0.2)';
      ctxPleth.fillRect(0, 0, w, h);
      ctxPleth.strokeStyle = '#00f0ff';
      ctxPleth.lineWidth = 1.8;
      ctxPleth.shadowColor = '#00f0ff';
      ctxPleth.shadowBlur = 4;
      ctxPleth.beginPath();
      for (let x = 0; x < w; x++) {
        if (Math.abs(x - sx) < 8) continue;
        if (x === 0) ctxPleth.moveTo(x, bufferPleth[x]);
        else ctxPleth.lineTo(x, bufferPleth[x]);
      }
      ctxPleth.stroke();

      // Draw Respiration (Amber/Yellow)
      ctxResp.fillStyle = 'rgba(4, 7, 17, 0.2)';
      ctxResp.fillRect(0, 0, w, h);
      ctxResp.strokeStyle = '#10b981';
      ctxResp.lineWidth = 1.8;
      ctxResp.shadowColor = '#10b981';
      ctxResp.shadowBlur = 4;
      ctxResp.beginPath();
      for (let x = 0; x < w; x++) {
        if (Math.abs(x - sx) < 8) continue;
        if (x === 0) ctxResp.moveTo(x, bufferResp[x]);
        else ctxResp.lineTo(x, bufferResp[x]);
      }
      ctxResp.stroke();

      // Draw Historical Trend Line (Bottom Right)
      if (ctxTrend && phase % 4 === 0) {
        ctxTrend.fillStyle = '#040711';
        ctxTrend.fillRect(0, 0, 240, 70);
        // Red threshold upper line
        ctxTrend.strokeStyle = 'rgba(244, 63, 94, 0.5)';
        ctxTrend.lineWidth = 1;
        ctxTrend.beginPath();
        ctxTrend.moveTo(0, 16);
        ctxTrend.lineTo(240, 16);
        ctxTrend.stroke();
        // Green nominal baseline
        ctxTrend.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        ctxTrend.beginPath();
        ctxTrend.moveTo(0, 52);
        ctxTrend.lineTo(240, 52);
        ctxTrend.stroke();
        // Dynamic trend curve
        ctxTrend.strokeStyle = '#00f0ff';
        ctxTrend.lineWidth = 2;
        ctxTrend.beginPath();
        for (let tx = 0; tx < 240; tx += 6) {
          const ty = 40 + Math.sin((tx + phase) * 0.05) * 8 - (isEmergencyActive ? 18 : 0);
          if (tx === 0) ctxTrend.moveTo(tx, ty);
          else ctxTrend.lineTo(tx, ty);
        }
        ctxTrend.stroke();
      }

      animId = requestAnimationFrame(renderWaves);
    };

    renderWaves();

    return () => cancelAnimationFrame(animId);
  }, [bpm, isEmergencyActive]);

  return (
    <div className="rounded-2xl bg-gradient-to-b from-space-950 via-space-900 to-space-950 border border-hud-cyan/40 shadow-2xl p-4 sm:p-5 backdrop-blur-xl relative overflow-hidden font-mono">
      {/* Top Banner mirroring NASA ISS Expedition 68 Operational Screen */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-3">
          <span className="w-3 h-3 rounded-full bg-hud-emerald animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-orbitron font-bold text-sm text-white tracking-wider">
                BIOMEDICAL EVALUATION // ISS & ARES FLIGHT CONSOLE
              </h3>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold uppercase">
                EXACT NASA CHALLENGE SCREEN MATCH
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              In-Flight Continuous Ergometric Telemetry • Biomechanical Stress Heatmap
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Toggle between NASA Thermal Heatmap and Photorealistic In-Vivo */}
          <div className="flex items-center bg-space-950 border border-slate-800 rounded-xl p-0.5 text-xs font-mono">
            <button
              onClick={() => {
                setCenterMode('heatmap-silhouette');
                cockpitAudio.playBlip();
              }}
              className={`px-3 py-1 rounded-lg transition ${
                centerMode === 'heatmap-silhouette'
                  ? 'bg-hud-cyan text-space-950 font-bold shadow-md shadow-hud-cyan/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              NASA Heatmap Silhouette
            </button>
            <button
              onClick={() => {
                setCenterMode('photorealistic');
                cockpitAudio.playBlip();
              }}
              className={`px-3 py-1 rounded-lg transition ${
                centerMode === 'photorealistic'
                  ? 'bg-hud-cyan text-space-950 font-bold shadow-md shadow-hud-cyan/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Photorealistic In-Vivo
            </button>
          </div>

          <span className="px-2.5 py-1.5 rounded-xl bg-space-950 border border-slate-800 text-slate-300 text-[10px]">
            {activeCrew?.name?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 3-Column NASA Flight Screen Layout (Identical to NASA Official Photo) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left Column: 3 Waveforms (ECG, Arterial Pleth, Respiration) + Log (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Waveform 1: ECG */}
          <div className="p-2.5 rounded-xl bg-space-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="text-hud-rose font-bold">CH-01: LEAD-II ECG</span>
              <span>100 Hz</span>
            </div>
            <canvas ref={ecgCanvasRef} className="w-full h-12 block rounded bg-black/60" />
          </div>

          {/* Waveform 2: Plethysmograph (Arterial Pulse) */}
          <div className="p-2.5 rounded-xl bg-space-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="text-hud-cyan font-bold">CH-02: ARTERIAL PULSE (PLETH)</span>
              <span>SpO2: {spo2}%</span>
            </div>
            <canvas ref={plethCanvasRef} className="w-full h-12 block rounded bg-black/60" />
          </div>

          {/* Waveform 3: Capnography / Respiration + Big Pulse Rate */}
          <div className="p-2.5 rounded-xl bg-space-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="text-hud-emerald font-bold">CH-03: RESPIRATION</span>
              <span>14 br/min</span>
            </div>
            <canvas ref={respCanvasRef} className="w-full h-12 block rounded bg-black/60" />
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-[10px] text-slate-500">HEART RATE:</span>
              <div className="font-orbitron font-bold text-2xl text-hud-emerald">
                {bpm} <span className="text-xs font-mono text-slate-400">BPM</span>
              </div>
            </div>
          </div>

          {/* Color-coded Console Log (Mirrors Bottom-Left of NASA Photo) */}
          <div className="p-3 rounded-xl bg-space-950/90 border border-slate-800/80 text-[10px] space-y-1">
            <div className="text-emerald-400">● BIOSENSOR BUS: 100% ONLINE</div>
            <div className="text-hud-cyan">● LEAD-II VECTOR: STABLE 60° AXIS</div>
            <div className="text-amber-400">● THORACIC FLUID: +1.8L CEPHALAD SHIFT</div>
            <div className="text-emerald-400">● CABIN CO2: 0.38% WITHIN HRP MARGIN</div>
          </div>
        </div>

        {/* Center Column: AUTHENTIC REALISTIC NASA THERMAL HEATMAP SILHOUETTE (4 Cols) */}
        <div className="lg:col-span-4 relative flex flex-col items-center justify-center rounded-2xl bg-space-950/80 border border-hud-cyan/30 p-3 overflow-hidden h-[500px]">
          {/* Top HUD Tag */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 text-[9px] pointer-events-none">
            <span className="px-2 py-0.5 rounded bg-space-950/90 border border-hud-cyan/30 text-hud-cyan">
              {centerMode === 'heatmap-silhouette' ? 'THERMAL BIOMECHANICAL STRESS' : 'IN-VIVO ANATOMY'}
            </span>
            <span className="px-2 py-0.5 rounded bg-space-950/90 border border-slate-700 text-slate-400">
              IN-FLIGHT TELEMETRY
            </span>
          </div>

          {/* Laser Scan Sweep Animation */}
          {isLaserScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-hud-cyan to-transparent shadow-[0_0_15px_#00f0ff] animate-scanBeam pointer-events-none z-10 opacity-75" />
          )}

          {/* Background Tech Crosshair Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          {/* CENTER VIEW 1: AUTHENTIC NASA THERMAL HEATMAP HUMAN SILHOUETTE (Exact Match to NASA Screen Photo!) */}
          {centerMode === 'heatmap-silhouette' ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg
                viewBox="0 0 200 440"
                className="h-[430px] w-auto max-w-full drop-shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all duration-300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* NASA ISS Thermal Stress Gradient: Blue Legs -> Cyan Waist -> Green Torso -> Radiant Red/Amber Chest Core */}
                  <linearGradient id="nasaThermalGrad" x1="100" y1="20" x2="100" y2="420" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38bdf8" />      {/* Head: Cyan */}
                    <stop offset="12%" stopColor="#0284c7" />     {/* Neck: Blue-cyan */}
                    <stop offset="22%" stopColor="#10b981" />     {/* Upper Torso: Emerald */}
                    <stop offset="28%" stopColor={isEmergencyActive ? '#ef4444' : '#f59e0b'} /> {/* Myocardium Heat Stress: Red/Amber */}
                    <stop offset="34%" stopColor="#10b981" />     {/* Abdomen: Emerald */}
                    <stop offset="46%" stopColor="#06b6d4" />     {/* Pelvis: Cyan */}
                    <stop offset="65%" stopColor="#0284c7" />     {/* Thighs: Blue */}
                    <stop offset="85%" stopColor="#2563eb" />     {/* Calves: Deep Blue */}
                    <stop offset="100%" stopColor="#1d4ed8" />    {/* Feet: Royal Blue */}
                  </linearGradient>

                  {/* Pulsing Radial Heat Core on Heart */}
                  <radialGradient id="heartHeatGlow" cx="47%" cy="28%" r="18%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="40%" stopColor="#ef4444" stopOpacity="0.8" />
                    <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>

                  {/* Body Hologram Outer Rim Filter */}
                  <filter id="hologramGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Ground Telemetry Ellipse Grid (Under Astronaut Feet) */}
                <ellipse cx="100" cy="425" rx="55" ry="12" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
                <ellipse cx="100" cy="425" rx="35" ry="8" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" />

                {/* REALISTIC CONTOURED HUMAN SILHOUETTE (Trapezius, Deltoids, Pectorals, Waist, Hips, Thighs, Calves, Feet) */}
                <path
                  d="
                    M 100,22 
                    C 112,22 120,32 120,44 
                    C 120,56 114,64 108,68 
                    C 107,72 108,76 114,79 
                    C 126,82 144,90 148,102 
                    C 152,112 156,135 158,155 
                    C 160,175 164,200 166,220 
                    C 167,230 166,236 163,238 
                    C 160,240 157,236 156,228 
                    C 153,205 149,180 147,162 
                    C 144,170 142,190 141,208 
                    C 140,218 136,226 130,228 
                    C 126,230 123,222 124,212 
                    C 126,192 127,175 125,160 
                    C 122,172 120,188 121,208 
                    C 122,230 124,258 123,285 
                    C 122,310 120,332 119,355 
                    C 118,375 119,395 121,412 
                    C 122,418 120,422 115,422 
                    C 110,422 108,416 107,405 
                    C 105,385 104,360 104,335 
                    C 103,310 102,280 101,250 
                    L 99,250 
                    C 98,280 97,310 96,335 
                    C 96,360 95,385 93,405 
                    C 92,416 90,422 85,422 
                    C 80,422 78,418 79,412 
                    C 81,395 82,375 81,355 
                    C 80,332 78,310 77,285 
                    C 76,258 78,230 79,208 
                    C 80,188 78,172 75,160 
                    C 73,175 74,192 76,212 
                    C 77,222 74,230 70,228 
                    C 64,226 60,218 59,208 
                    C 58,190 56,170 53,162 
                    C 51,180 47,205 44,228 
                    C 43,236 40,240 37,238 
                    C 34,236 33,230 34,220 
                    C 36,200 40,175 42,155 
                    C 44,135 48,112 52,102 
                    C 56,90 74,82 86,79 
                    C 92,76 93,72 92,68 
                    C 86,64 80,56 80,44 
                    C 80,32 88,22 100,22 
                    Z
                  "
                  fill="url(#nasaThermalGrad)"
                  stroke="#00f0ff"
                  strokeWidth="1.2"
                  filter="url(#hologramGlow)"
                />

                {/* Internal Anatomical Ribcage & Vertebral Guidelines */}
                <path
                  d="
                    M 100,85 L 100,210
                    M 85,105 Q 100,112 115,105
                    M 83,118 Q 100,126 117,118
                    M 84,132 Q 100,140 116,132
                    M 86,146 Q 100,154 114,146
                  "
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Heart Radiation Heat Node (Glowing Red Heatmap Core) */}
                <circle cx="94" cy="122" r="14" fill="url(#heartHeatGlow)" />
                <circle cx="94" cy="122" r="4.5" fill="#ffffff" />
                <circle cx="94" cy="122" r="8" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" className="animate-ping origin-center" />

                {/* SANS Brain Pressure Point */}
                <circle cx="100" cy="44" r="5" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" strokeWidth="1" />
                <circle cx="100" cy="44" r="2" fill="#ffffff" />

                {/* Concentric Telemetry Target Reticle on Heart */}
                <circle cx="94" cy="122" r="22" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="68" y1="122" x2="88" y2="122" stroke="#f43f5e" strokeWidth="1" />
                <line x1="100" y1="122" x2="120" y2="122" stroke="#f43f5e" strokeWidth="1" />
                <line x1="94" y1="96" x2="94" y2="116" stroke="#f43f5e" strokeWidth="1" />
                <line x1="94" y1="128" x2="94" y2="148" stroke="#f43f5e" strokeWidth="1" />

                {/* Callout Label */}
                <text x="126" y="120" fill="#f43f5e" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  MYOCARDIAL LOAD
                </text>
                <text x="126" y="130" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                  {bpm} BPM // STABLE
                </text>
              </svg>
            </div>
          ) : (
            /* CENTER VIEW 2: PHOTOREALISTIC IN-VIVO ANATOMY SCANNER */
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <img
                src={`/anatomy/${gender}_standing.jpg`}
                alt="In-Vivo Astronaut"
                className="h-[430px] w-auto max-w-full object-contain filter drop-shadow-[0_0_25px_rgba(0,240,255,0.4)] rounded-xl"
              />
            </div>
          )}

          {/* Heat Gradient Legend Bar at bottom */}
          <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[9px] z-10 bg-space-950/90 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-sky-400">0.0G ADAPTATION</span>
            <div className="w-28 h-2 rounded-full bg-gradient-to-r from-blue-600 via-emerald-500 to-rose-500 mx-2" />
            <span className="text-rose-400 font-bold">CARDIAC STRESS</span>
          </div>
        </div>

        {/* Right Column: Bio-Gauges, Telemetry Channels & Trend Line (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Circular Bio-Gauge (Mirrors the `72 / TU` dial in NASA Photo) */}
          <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">CARDIOVASCULAR RESERVE</span>
              <div className="font-orbitron font-bold text-lg text-white mt-0.5">
                84 <span className="text-xs text-hud-cyan font-normal">% VO2 MAX</span>
              </div>
              <span className="text-[10px] text-emerald-400">Aerobic Tolerance High</span>
            </div>

            {/* Circular Gauge SVG */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeDasharray="84, 100"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-orbitron font-bold text-xs text-hud-emerald">
                {bpm}
              </span>
            </div>
          </div>

          {/* Telemetry Channel Bar Meters (Ch 1 - 6) */}
          <div className="p-3 rounded-xl bg-space-950 border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase block">
              MULTI-CHANNEL TELEMETRY SPECTRUM
            </span>
            <div className="grid grid-cols-6 gap-1.5 h-16 items-end pt-1">
              {[72, 88, 64, 94, 78, 55].map((val, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full bg-space-900 rounded-t overflow-hidden flex-1 flex items-end">
                    <div
                      className={`w-full rounded-t transition-all duration-500 ${
                        idx === 3 && isEmergencyActive ? 'bg-hud-rose' : 'bg-hud-cyan'
                      }`}
                      style={{ height: `${val}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-500 font-mono">C0{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Trend Line (Mirrors Bottom-Right of NASA Photo) */}
          <div className="p-3 rounded-xl bg-space-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-bold text-white">HISTORICAL STRESS TREND</span>
              <span className="text-hud-rose text-[9px]">UPPER CRITICAL</span>
            </div>
            <canvas ref={trendCanvasRef} className="w-full h-16 block rounded bg-black/60" />
            <div className="flex items-center justify-between text-[9px] text-slate-500">
              <span>-10 MIN</span>
              <span className="text-hud-emerald">NOMINAL BASELINE</span>
              <span>NOW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
