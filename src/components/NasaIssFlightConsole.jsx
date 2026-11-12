import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Heart,
  Brain,
  Eye,
  Bone,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Scan,
  Sparkles,
  Layers,
} from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function NasaIssFlightConsole({ activeCrew, isEmergencyActive }) {
  const ecgCanvasRef = useRef(null);
  const plethCanvasRef = useRef(null);
  const respCanvasRef = useRef(null);
  const trendCanvasRef = useRef(null);

  const [posture, setPosture] = useState('standing'); // 'standing' | 'seated'
  const [isLaserScanning, setIsLaserScanning] = useState(true);
  const [thermalFilter, setThermalFilter] = useState(false); // toggle thermal holographic overlay
  const [hoveredNode, setHoveredNode] = useState(null);

  const bpm = isEmergencyActive ? 128 : (activeCrew?.vitals?.bpm || activeCrew?.vitals?.heartRate || 72);
  const spo2 = isEmergencyActive ? 92.4 : (activeCrew?.vitals?.spo2 || 98.4);
  const respRate = isEmergencyActive ? 24 : (activeCrew?.vitals?.respirationRate || 14);
  const vo2Max = activeCrew?.vo2Max || 84;
  const gender = activeCrew?.gender?.toLowerCase() === 'female' ? 'female' : 'male';

  const currentImgSrc = `/anatomy/${gender}_${posture}.jpg`;

  // 1. LIVE WAVEFORMS (ECG, Arterial Pleth, Respiration, Trend)
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

      // ECG
      let ecgY = h / 2;
      if (pos >= 4 && pos <= 8) ecgY -= 6;
      else if (pos === 11) ecgY += 4;
      else if (pos >= 12 && pos <= 14) ecgY -= isEmergencyActive ? 28 : 22;
      else if (pos === 15) ecgY += 6;
      else if (pos >= 19 && pos <= 26) ecgY -= 8;

      // Arterial Pleth
      let plethY = h / 2;
      if (pos >= 14 && pos <= 24) {
        plethY -= Math.sin(((pos - 14) / 10) * Math.PI) * 16;
      }

      // Respiration
      const respY = h / 2 - Math.sin(phase * 0.05) * 12;

      const sx = Math.floor(sweepX);
      bufferEcg[sx] = ecgY;
      bufferPleth[sx] = plethY;
      bufferResp[sx] = respY;

      // Draw ECG
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

      // Draw Pleth
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

      // Draw Respiration
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

      // Trend Line
      if (ctxTrend && phase % 4 === 0) {
        ctxTrend.fillStyle = '#040711';
        ctxTrend.fillRect(0, 0, 240, 70);
        ctxTrend.strokeStyle = 'rgba(244, 63, 94, 0.5)';
        ctxTrend.lineWidth = 1;
        ctxTrend.beginPath();
        ctxTrend.moveTo(0, 16);
        ctxTrend.lineTo(240, 16);
        ctxTrend.stroke();

        ctxTrend.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        ctxTrend.beginPath();
        ctxTrend.moveTo(0, 52);
        ctxTrend.lineTo(240, 52);
        ctxTrend.stroke();

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

  // Organ target coordinates on the photorealistic image (Standing vs Seated)
  const hotspots = [
    {
      id: 'brain',
      label: 'BRAIN / CNS',
      metric: activeCrew?.organAlerts?.brain?.status === 'WARNING'
        ? 'ALERT: SANS ICP Elevated (+5.8 mmHg)'
        : (activeCrew?.organAlerts?.brain?.note || 'ICP +4.2 mmHg // Stable'),
      standing: { top: '10%', left: '50%' },
      seated: { top: '13%', left: '46%' },
      color: activeCrew?.organAlerts?.brain?.status === 'WARNING' ? 'hud-rose' : 'hud-cyan',
    },
    {
      id: 'heart',
      label: 'CARDIAC COMPLEX',
      metric: `${bpm} BPM // ${activeCrew?.organAlerts?.heart?.note || 'Stable Sinus Rhythm'}`,
      standing: { top: '27%', left: '48%' },
      seated: { top: '30%', left: '44%' },
      color: bpm > 90 ? 'hud-rose' : 'hud-cyan',
    },
    {
      id: 'lungs',
      label: 'PULMONARY BED',
      metric: `${spo2}% SpO2 // ${respRate} br/min`,
      standing: { top: '24%', left: '55%' },
      seated: { top: '28%', left: '52%' },
      color: 'hud-cyan',
    },
    {
      id: 'kidneys',
      label: 'HEPATORENAL',
      metric: activeCrew?.organAlerts?.bones?.note || 'Ca++ Excretion +18%',
      standing: { top: '36%', left: '50%' },
      seated: { top: '40%', left: '46%' },
      color: 'hud-amber',
    },
    {
      id: 'bones',
      label: 'SPINE & BONES',
      metric: `BMD: ${activeCrew?.vitals?.bmdLossRatePercentPerMonth || -1.1}%/mo`,
      standing: { top: '50%', left: '50%' },
      seated: { top: '58%', left: '42%' },
      color: 'slate-300',
    },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-b from-space-950 via-space-900 to-space-950 border border-hud-cyan/40 shadow-2xl p-4 sm:p-5 backdrop-blur-xl relative overflow-hidden font-mono">
      {/* Top Console Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-3">
          <span className="w-3 h-3 rounded-full bg-hud-emerald animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-orbitron font-bold text-sm text-white tracking-wider">
                BIOMEDICAL EVALUATION // ISS & ARES FLIGHT CONSOLE
              </h3>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold uppercase">
                {gender === 'female' ? '♀ FEMALE ASTRONAUT' : '♂ MALE ASTRONAUT'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Photorealistic In-Vivo Anatomy • In-Flight Multi-Channel Biometrics
            </p>
          </div>
        </div>

        {/* Console Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Posture Toggle */}
          <div className="flex items-center bg-space-950 border border-slate-800 rounded-xl p-0.5 text-xs font-mono">
            <button
              onClick={() => {
                setPosture('standing');
                cockpitAudio.playBlip();
              }}
              className={`px-3 py-1 rounded-lg transition ${
                posture === 'standing'
                  ? 'bg-hud-cyan text-space-950 font-bold shadow-md shadow-hud-cyan/30'
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
              className={`px-3 py-1 rounded-lg transition ${
                posture === 'seated'
                  ? 'bg-hud-cyan text-space-950 font-bold shadow-md shadow-hud-cyan/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Flight Couch
            </button>
          </div>

          {/* Thermal Hologram Filter Toggle */}
          <button
            onClick={() => {
              setThermalFilter(!thermalFilter);
              cockpitAudio.playBlip();
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs transition flex items-center gap-1.5 ${
              thermalFilter
                ? 'bg-hud-amber/20 border-hud-amber text-hud-amber'
                : 'bg-space-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Thermal Glow</span>
          </button>

          <span className="px-2.5 py-1.5 rounded-xl bg-space-950 border border-slate-800 text-slate-300 text-[10px]">
            {activeCrew?.name?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 3-Column NASA Flight Screen Layout */}
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
              <span>{respRate} br/min</span>
            </div>
            <canvas ref={respCanvasRef} className="w-full h-12 block rounded bg-black/60" />
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-[10px] text-slate-500">HEART RATE:</span>
              <div className={`font-orbitron font-bold text-2xl ${bpm > 90 ? 'text-hud-rose' : 'text-hud-emerald'}`}>
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

        {/* Center Column: REAL PHOTOREALISTIC ANATOMICAL ASTRONAUT BODY (4 Cols) */}
        <div className="lg:col-span-4 relative flex flex-col items-center justify-center rounded-2xl bg-space-950/80 border border-hud-cyan/40 p-2 overflow-hidden h-[500px]">
          {/* Top HUD Tag */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 text-[9px] pointer-events-none">
            <span className="px-2 py-0.5 rounded bg-space-950/90 border border-hud-cyan/30 text-hud-cyan">
              PHOTOREALISTIC IN-VIVO TOMOGRAPHY
            </span>
            <span className="px-2 py-0.5 rounded bg-space-950/90 border border-slate-700 text-slate-400">
              NASA IN-FLIGHT STANDARD
            </span>
          </div>

          {/* Background Cyber Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          {/* Laser Scan Sweep Animation */}
          {isLaserScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-hud-cyan to-transparent shadow-[0_0_20px_#00f0ff] animate-scanBeam pointer-events-none z-20 opacity-80" />
          )}

          {/* THE REAL PHOTOREALISTIC ANATOMICAL IMAGE (Provided by User) */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={currentImgSrc}
              alt="NASA Astronaut Anatomy"
              className={`h-[450px] w-auto max-w-full object-contain filter drop-shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-500 ${
                thermalFilter ? 'hue-rotate-180 contrast-125 saturate-150 brightness-110' : ''
              }`}
            />

            {/* Glowing Pulsing Heart Wave Reticle on Real Chest */}
            <div
              style={{
                top: posture === 'standing' ? '27%' : '30%',
                left: posture === 'standing' ? '48%' : '44%',
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-rose-500 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-hud-rose border-2 border-white shadow-[0_0_15px_#f43f5e]"></span>
              </div>
            </div>

            {/* INTERACTIVE HOTSPOTS ON REAL ANATOMICAL IMAGE */}
            {hotspots.map((node) => {
              const pos = posture === 'standing' ? node.standing : node.seated;
              const isHovered = hoveredNode === node.id;

              return (
                <div
                  key={node.id}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <button className="w-5 h-5 rounded-full bg-space-950/80 border border-hud-cyan/80 hover:scale-125 hover:border-hud-cyan hover:bg-hud-cyan/30 transition shadow-lg flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-hud-cyan" />
                  </button>

                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2.5 py-1 rounded-lg bg-space-950/95 border border-hud-cyan/60 text-[9px] font-mono text-white whitespace-nowrap shadow-xl z-40">
                      <div className="font-bold text-hud-cyan">{node.label}</div>
                      <div className="text-slate-300">{node.metric}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Coordinates Status */}
          <div className="absolute bottom-2 inset-x-4 flex items-center justify-between text-[9px] z-20 bg-space-950/90 px-3 py-1 rounded-xl border border-slate-800">
            <span className="text-slate-300 font-bold">SUBJECT: {activeCrew?.name} ({activeCrew?.callsign})</span>
            <span className="text-hud-cyan font-bold">{gender.toUpperCase()} IN-VIVO ANATOMY • {activeCrew?.role}</span>
          </div>
        </div>

        {/* Right Column: Bio-Gauges, Telemetry Channels & Trend Line (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Circular Bio-Gauge (Mirrors the `72 / TU` dial in NASA Photo) */}
          <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">CARDIOVASCULAR RESERVE</span>
              <div className="font-orbitron font-bold text-lg text-white mt-0.5">
                {vo2Max} <span className="text-xs text-hud-cyan font-normal">% VO2 MAX</span>
              </div>
              <span className={`text-[10px] ${vo2Max < 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {vo2Max < 75 ? 'Aerobic Reserve Guarded' : 'Aerobic Tolerance High'}
              </span>
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
                  stroke={bpm > 90 ? "#f43f5e" : "#10b981"}
                  strokeWidth="3.5"
                  strokeDasharray={`${vo2Max}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute font-orbitron font-bold text-xs ${bpm > 90 ? 'text-hud-rose' : 'text-hud-emerald'}`}>
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
