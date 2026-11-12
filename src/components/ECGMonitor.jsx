import React, { useEffect, useRef } from 'react';
import { cockpitAudio } from '../utils/audioAlert';

export default function ECGMonitor({ heartRate = 72, isElevated = false }) {
  const canvasRef = useRef(null);
  const dataRef = useRef([]);
  const animRef = useRef(null);
  const beatCooldown = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Scale for high-DPI displays
    const width = canvas.clientWidth || 360;
    const height = canvas.clientHeight || 120;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    let x = 0;
    const points = [];
    const maxPoints = Math.floor(width);
    
    // Beat timing calculation
    let phase = 0;
    const beatInterval = Math.max(30, Math.floor(3600 / (heartRate || 72)));

    const render = () => {
      // Clear with slight trail for cathode ray phosphor persistence
      ctx.fillStyle = 'rgba(8, 13, 26, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Draw medical grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let gy = 0; gy < height; gy += 15) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }
      for (let gx = 0; gx < width; gx += 20) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }

      // Generate ECG waveform point (P-Q-R-S-T curve)
      const midY = height / 2;
      let yOffset = 0;
      const cyclePos = phase % beatInterval;

      if (cyclePos === 0) {
        cockpitAudio.playHeartbeat();
      }

      if (cyclePos >= 4 && cyclePos < 10) {
        // P-wave (atrial depolarization)
        yOffset = -Math.sin(((cyclePos - 4) / 6) * Math.PI) * 7;
      } else if (cyclePos === 14) {
        // Q-drop
        yOffset = 4;
      } else if (cyclePos === 15) {
        // R-peak (ventricular depolarization)
        yOffset = isElevated ? -48 : -38;
      } else if (cyclePos === 16) {
        // S-drop
        yOffset = 10;
      } else if (cyclePos >= 22 && cyclePos < 32) {
        // T-wave (ventricular repolarization)
        yOffset = -Math.sin(((cyclePos - 22) / 10) * Math.PI) * 11;
      } else {
        // Baseline with slight micro-noise
        yOffset = (Math.random() - 0.5) * 1.2;
      }

      const currentY = midY + yOffset;
      points.push(currentY);
      if (points.length > maxPoints) {
        points.shift();
      }

      // Draw the ECG line
      ctx.strokeStyle = isElevated ? '#f43f5e' : '#00f0ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = isElevated ? 'rgba(244, 63, 94, 0.8)' : 'rgba(0, 240, 255, 0.8)';
      ctx.shadowBlur = 8;
      ctx.lineJoin = 'round';

      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          ctx.moveTo(i, points[i]);
        } else {
          ctx.lineTo(i, points[i]);
        }
      }
      ctx.stroke();

      // Draw glowing lead sweep head
      if (points.length > 0) {
        const headX = points.length - 1;
        const headY = points[headX];
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(headX, headY, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      phase++;
      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [heartRate, isElevated]);

  return (
    <div className="relative w-full h-28 rounded-lg overflow-hidden bg-space-950 border border-hud-cyan/20">
      <div className="absolute top-2 left-3 flex items-center space-x-2 z-10">
        <span className="inline-block w-2 h-2 rounded-full animate-ping bg-hud-cyan" />
        <span className="text-[10px] font-mono tracking-wider text-hud-cyan uppercase">
          LEAD-II TELEMETRY // REAL-TIME SWEEP
        </span>
      </div>
      <div className="absolute top-2 right-3 font-mono text-xs text-slate-400 z-10">
        GAIN: 10mm/mV | 25mm/s
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
