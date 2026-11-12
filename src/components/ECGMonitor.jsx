import React, { useEffect, useRef, useState } from 'react';
import { cockpitAudio } from '../utils/audioAlert';
import { Activity, Zap, Volume2, VolumeX, Info, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ECGMonitor({ heartRate = 72, isElevated = false }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [speed, setSpeed] = useState(25); // mm/s (25 or 50)
  const [gain, setGain] = useState(10); // mm/mV (5, 10, or 20)
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [showEinthovenInfo, setShowEinthovenInfo] = useState(false);

  // Derived electrophysiological intervals
  const rrIntervalMs = Math.round(60000 / (heartRate || 72));
  const prIntervalMs = isElevated ? 135 : 155; // normal 120-200ms
  const qrsDurationMs = isElevated ? 104 : 86; // normal 80-120ms
  const qtIntervalMs = Math.round(390 * Math.sqrt(rrIntervalMs / 1000)); // Bazett's formula QTc
  const stSegmentMv = isElevated ? '+0.18 mV (SPE Stress)' : '0.00 mV (Isoelectric)';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.clientWidth || 700;
    const height = canvas.clientHeight || 260;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Sweep Bar State (Phosphor-decay sweep algorithm)
    let sweepX = 0;
    const sweepWidth = 14; // width of the erase-head bar
    const waveformBuffer = new Float32Array(Math.floor(width));
    waveformBuffer.fill(height / 2);

    let phase = 0;
    const beatInterval = Math.max(30, Math.floor(3600 / (heartRate || 72)));
    const pxPerSec = speed === 50 ? 2.0 : 1.0;
    const gainFactor = gain / 10;

    const render = () => {
      // 1. CLEAR & REDRAW MEDICAL GRID BACKGROUND
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Minor grid (1mm squares ~= 4px)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 0.5;
      for (let y = 0; y < height; y += 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let x = 0; x < width; x += 8) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Major grid (5mm squares ~= 20px)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Voltage Reference Labels (+1.0mV, 0mV, -0.5mV)
      ctx.fillStyle = 'rgba(100, 116, 139, 0.6)';
      ctx.font = '9px monospace';
      const midY = height / 2;
      ctx.fillText('+1.0 mV', 8, midY - 40 * gainFactor + 3);
      ctx.fillText(' 0.0 mV', 8, midY + 3);
      ctx.fillText('-0.5 mV', 8, midY + 20 * gainFactor + 3);

      // 2. ADVANCE SWEEP HEAD AND CALCULATE NEW VOLTAGE POINT
      const cyclePos = phase % beatInterval;
      let yOffset = 0;

      // Heartbeat audio trigger at R-wave
      if (cyclePos === 15 && !isAudioMuted) {
        cockpitAudio.playHeartbeat();
      }

      // Mathematical synthesis of Lead-II P-Q-R-S-T vector
      if (cyclePos >= 4 && cyclePos < 10) {
        // P-Wave (Atrial Depolarization): ~0.15 mV
        yOffset = -Math.sin(((cyclePos - 4) / 6) * Math.PI) * (8 * gainFactor);
      } else if (cyclePos === 13) {
        // Q-Wave (Septal Depolarization): -0.1 mV
        yOffset = 4 * gainFactor;
      } else if (cyclePos >= 14 && cyclePos <= 16) {
        // R-Wave (Ventricular Depolarization Spike): +1.2 to +1.8 mV
        const rHeight = isElevated ? 58 : 46;
        yOffset = -rHeight * gainFactor;
      } else if (cyclePos === 17) {
        // S-Wave (Basal Ventricular Depolarization): -0.3 mV
        yOffset = 12 * gainFactor;
      } else if (cyclePos >= 24 && cyclePos < 34) {
        // T-Wave (Ventricular Repolarization Dome): +0.3 mV
        yOffset = -Math.sin(((cyclePos - 24) / 10) * Math.PI) * (14 * gainFactor);
      } else {
        // Baseline with slight biological isometric artifact / micro-noise
        yOffset = (Math.random() - 0.5) * 1.5;
      }

      const newY = midY + yOffset;

      // Update sweep buffer
      const stepInt = Math.max(1, Math.floor(pxPerSec));
      for (let s = 0; s < stepInt; s++) {
        const targetX = (Math.floor(sweepX) + s) % Math.floor(width);
        waveformBuffer[targetX] = newY;
      }

      // 3. DRAW CONTINUOUS PHOSPHOR WAVEFORM
      ctx.strokeStyle = isElevated ? '#f43f5e' : '#00f0ff';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = isElevated ? 'rgba(244, 63, 94, 0.9)' : 'rgba(0, 240, 255, 0.9)';
      ctx.shadowBlur = 10;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      ctx.beginPath();
      let isFirst = true;
      for (let x = 0; x < width; x++) {
        // Skip drawing inside the erase-head sweep gap
        const distFromSweep = (x - sweepX + width) % width;
        if (distFromSweep >= 0 && distFromSweep < sweepWidth) {
          isFirst = true;
          continue;
        }

        const y = waveformBuffer[x];
        if (isFirst) {
          ctx.moveTo(x, y);
          isFirst = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // 4. DRAW GLOWING ERASE-HEAD & PHOSPHOR DECAY
      const headX = Math.floor(sweepX);
      const headY = waveformBuffer[headX] || midY;

      // Erase-head gradient fade bar
      const grad = ctx.createLinearGradient(headX - sweepWidth, 0, headX, 0);
      grad.addColorStop(0, 'rgba(3, 7, 18, 0)');
      grad.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(Math.max(0, headX - sweepWidth), 0, sweepWidth, height);

      // Glowing bright cyan/red sweep dot
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = isElevated ? '#f43f5e' : '#00f0ff';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(headX, headY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Advance sweep
      sweepX = (sweepX + pxPerSec) % width;
      phase++;
      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [heartRate, isElevated, speed, gain, isAudioMuted]);

  return (
    <div className="rounded-2xl bg-space-900/90 border border-hud-cyan/30 shadow-2xl overflow-hidden backdrop-blur-md p-4 sm:p-6 space-y-4">
      {/* Top Telemetry Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-3">
          <span className="relative flex h-3.5 w-3.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isElevated ? 'bg-hud-rose' : 'bg-hud-cyan'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                isElevated ? 'bg-hud-rose' : 'bg-hud-cyan'
              }`}
            />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-orbitron font-bold text-sm tracking-wider text-white">
                LEAD-II CARDIAC VECTOR TELEMETRY
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-hud-cyan/15 border border-hud-cyan/30 text-hud-cyan">
                EINTHOVEN AXIS (+60°)
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              High-DPI Phosphor Sweep • Continuous Surface Electrophysiology
            </p>
          </div>
        </div>

        {/* Action Buttons & Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Speed Toggle */}
          <div className="flex items-center bg-space-950 border border-slate-700/80 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setSpeed(25)}
              className={`px-2.5 py-1 rounded transition ${
                speed === 25 ? 'bg-hud-cyan text-space-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              25 mm/s
            </button>
            <button
              onClick={() => setSpeed(50)}
              className={`px-2.5 py-1 rounded transition ${
                speed === 50 ? 'bg-hud-cyan text-space-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              50 mm/s
            </button>
          </div>

          {/* Gain Toggle */}
          <div className="flex items-center bg-space-950 border border-slate-700/80 rounded-lg p-0.5 text-xs font-mono">
            {[5, 10, 20].map((g) => (
              <button
                key={g}
                onClick={() => setGain(g)}
                className={`px-2 py-1 rounded transition ${
                  gain === g ? 'bg-hud-cyan text-space-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {g}mm/mV
              </button>
            ))}
          </div>

          {/* Audio Beep Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            title={isAudioMuted ? 'Unmute Systolic Beep' : 'Mute Systolic Beep'}
            className={`p-1.5 rounded-lg border transition ${
              !isAudioMuted
                ? 'bg-hud-cyan/20 border-hud-cyan text-hud-cyan'
                : 'bg-space-950 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Science Info Toggle */}
          <button
            onClick={() => setShowEinthovenInfo(!showEinthovenInfo)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-space-950 border border-slate-700 text-xs font-mono text-slate-300 hover:border-hud-cyan hover:text-hud-cyan transition"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Science</span>
          </button>
        </div>
      </div>

      {/* Main High-Resolution Canvas Display */}
      <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-space-950 border border-slate-800">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Live Rhythm Status Overlay */}
        <div className="absolute bottom-3 left-4 flex items-center gap-3 font-mono text-xs z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-space-900/90 border border-slate-700 backdrop-blur-md">
            <span className="text-slate-400">RHYTHM:</span>
            <span className={`font-bold ${isElevated ? 'text-hud-rose' : 'text-hud-emerald'}`}>
              {isElevated ? 'SINUS TACHYCARDIA // PVC RISK' : 'NORMAL SINUS RHYTHM'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-space-900/90 border border-slate-700 backdrop-blur-md">
            <span className="text-slate-400">ST SEGMENT:</span>
            <span className="text-hud-cyan font-bold">{stSegmentMv}</span>
          </div>
        </div>

        {/* Live BPM Badge Overlay */}
        <div className="absolute top-3 right-4 flex items-center gap-2 font-mono z-10 pointer-events-none">
          <div className="px-3 py-1.5 rounded-lg bg-space-900/90 border border-hud-cyan/40 backdrop-blur-md text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">PULSE RATE</div>
            <div className={`text-2xl font-orbitron font-bold ${isElevated ? 'text-hud-rose' : 'text-hud-cyan'}`}>
              {heartRate} <span className="text-xs font-mono text-slate-400">BPM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Calculated Electrophysiological Intervals (NASA Telemetry Grade) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase">PR Interval</span>
          <div className="text-base font-orbitron font-bold text-slate-200 mt-0.5">{prIntervalMs} ms</div>
          <span className="text-[10px] font-mono text-emerald-400">Normal (120-200)</span>
        </div>
        <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase">QRS Duration</span>
          <div className="text-base font-orbitron font-bold text-slate-200 mt-0.5">{qrsDurationMs} ms</div>
          <span className="text-[10px] font-mono text-emerald-400">Narrow Complex</span>
        </div>
        <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase">QT / QTc (Bazett)</span>
          <div className={`text-base font-orbitron font-bold mt-0.5 ${isElevated ? 'text-hud-amber' : 'text-slate-200'}`}>
            {qtIntervalMs} ms
          </div>
          <span className="text-[10px] font-mono text-slate-400">Rate-Corrected</span>
        </div>
        <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase">R-R Interval</span>
          <div className="text-base font-orbitron font-bold text-slate-200 mt-0.5">{rrIntervalMs} ms</div>
          <span className="text-[10px] font-mono text-hud-cyan">Instantaneous</span>
        </div>
      </div>

      {/* Science Explanation Drawer (Expandable) */}
      {showEinthovenInfo && (
        <div className="p-4 rounded-xl bg-space-950 border border-hud-cyan/40 text-xs text-slate-300 font-mono space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-orbitron font-bold text-hud-cyan">
              NASA HUMAN RESEARCH: LEAD-II IN MICROGRAVITY
            </span>
            <button onClick={() => setShowEinthovenInfo(false)} className="text-slate-400 hover:text-white">
              ✕ Close
            </button>
          </div>
          <p>
            <strong className="text-white">Why Lead-II?</strong> Lead-II measures electrical voltage between the Right Arm (-) and Left Leg (+), pointing at +60° along the anatomical cardiac axis. In aerospace medicine, Lead-II yields the most prominent P and R waves, making it the gold standard for continuous astronaut arrhythmia detection.
          </p>
          <p>
            <strong className="text-white">Microgravity Fluid Shift & Electrical Axis:</strong> In microgravity (0g), 1.5 to 2.0 liters of blood and interstitial fluid shift towards the head (cephalad shift). This causes cardiac rounding, a slight leftward axis rotation (-10° to -15°), and increased susceptibility to ventricular ectopic beats during high-stress EVA maneuvers.
          </p>
        </div>
      )}
    </div>
  );
}
