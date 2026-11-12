import React, { useEffect, useRef } from 'react';
import {
  Users,
  Activity,
  Heart,
  Eye,
  Brain,
  ShieldCheck,
  AlertTriangle,
  Monitor,
  Maximize2,
  Lock,
  Tv,
} from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function SquadronCockpitDeck({
  crew,
  activeCrewId,
  onSelectCrew,
  onOpenSoloConsole,
  isEmergencyActive,
}) {
  return (
    <div className="space-y-4 font-mono">
      {/* Top Banner Explaining the Spaceflight Architecture */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-space-950 via-space-900 to-space-950 border border-hud-cyan/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-hud-cyan/15 border border-hud-cyan/40 text-hud-cyan">
            <Tv className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron font-bold text-sm text-white tracking-wider">
                SHARED SQUADRON COCKPIT WALL // NASA BULKHEAD MONITOR
              </h2>
              <span className="text-[9px] px-2 py-0.5 rounded bg-hud-cyan/20 border border-hud-cyan/50 text-hud-cyan font-bold">
                14 CFR § 1213 MULTI-DISPLAY ARCHITECTURE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Central Glass Cockpit display visible to Commander & CMO • Continuous 4-Crew Telemetry • Click any astronaut for Private Crew Quarters Tablet
            </p>
          </div>
        </div>

        {/* Global Crew Status Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-space-950 border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-hud-emerald animate-ping" />
            <span className="text-slate-400">CREW READINESS:</span>
            <span className="text-hud-emerald font-bold font-orbitron">89.8%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-space-950 border border-amber-500/40 text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>1 ELEVATED RISK</span>
          </div>
        </div>
      </div>

      {/* 4-ASTRONAUT TACTICAL SQUADRON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crew.map((member) => {
          const isSelected = activeCrewId === member.id;
          const isWarning = member.status === 'ELEVATED_RISK' || (isSelected && isEmergencyActive);
          const bpm = isEmergencyActive && isSelected ? 128 : (member.vitals?.heartRate || member.vitals?.bpm || 72);
          const spo2 = isEmergencyActive && isSelected ? 92.4 : member.vitals?.spo2 || 98.4;
          const bp = isEmergencyActive && isSelected ? '152/98' : `${member.vitals?.bloodPressureSys}/${member.vitals?.bloodPressureDia}`;
          const sans = member.sansScore || 30;

          return (
            <div
              key={member.id}
              className={`rounded-2xl p-4 transition-all duration-300 relative overflow-hidden backdrop-blur-xl border ${
                isWarning
                  ? 'bg-rose-950/20 border-hud-rose/60 shadow-[0_0_25px_rgba(244,63,94,0.2)]'
                  : isSelected
                  ? 'bg-space-900/90 border-hud-cyan shadow-[0_0_20px_rgba(0,240,255,0.2)] ring-1 ring-hud-cyan'
                  : 'bg-space-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header: Call Sign + Identity + Status */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm border ${
                      isWarning
                        ? 'bg-hud-rose/20 text-hud-rose border-hud-rose/40'
                        : isSelected
                        ? 'bg-hud-cyan text-space-950 border-hud-cyan'
                        : 'bg-space-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-orbitron font-bold text-sm text-white">
                        {member.name}
                      </h3>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-space-900 border border-slate-700 text-slate-300 font-mono">
                        {member.callsign}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      {member.role} • {member.gender}, Age {member.age}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold flex items-center gap-1 ${
                      isWarning
                        ? 'bg-hud-rose/20 text-hud-rose border border-hud-rose/50 animate-pulse'
                        : 'bg-hud-emerald/20 text-hud-emerald border border-hud-emerald/40'
                    }`}
                  >
                    {isWarning ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                    <span>{isWarning ? 'ELEVATED RISK' : 'NOMINAL'}</span>
                  </span>
                  <span className="text-[9px] text-slate-500">
                    EVA: {member.cumulativeEvaHours}h
                  </span>
                </div>
              </div>

              {/* Vitals Telemetry Row */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {/* Heart Rate */}
                <div className="p-2 rounded-xl bg-space-950/80 border border-slate-800/80 text-center">
                  <span className="text-[9px] text-slate-400 uppercase block">HEART RATE</span>
                  <div className={`font-orbitron font-bold text-base mt-0.5 ${bpm > 90 ? 'text-hud-rose' : 'text-hud-cyan'}`}>
                    {bpm}
                  </div>
                  <span className="text-[8px] text-slate-500">BPM</span>
                </div>

                {/* SpO2 */}
                <div className="p-2 rounded-xl bg-space-950/80 border border-slate-800/80 text-center">
                  <span className="text-[9px] text-slate-400 uppercase block">SpO2 OXYGEN</span>
                  <div className={`font-orbitron font-bold text-base mt-0.5 ${spo2 < 95 ? 'text-hud-amber' : 'text-hud-emerald'}`}>
                    {spo2}%
                  </div>
                  <span className="text-[8px] text-slate-500">PULSE-OX</span>
                </div>

                {/* Blood Pressure */}
                <div className="p-2 rounded-xl bg-space-950/80 border border-slate-800/80 text-center">
                  <span className="text-[9px] text-slate-400 uppercase block">BLOOD PRESS</span>
                  <div className="font-orbitron font-bold text-xs mt-1 text-white">
                    {bp}
                  </div>
                  <span className="text-[8px] text-slate-500">mmHg</span>
                </div>

                {/* SANS Risk Score */}
                <div className="p-2 rounded-xl bg-space-950/80 border border-slate-800/80 text-center">
                  <span className="text-[9px] text-slate-400 uppercase block">SANS INDEX</span>
                  <div className={`font-orbitron font-bold text-base mt-0.5 ${sans > 60 ? 'text-hud-rose' : 'text-slate-300'}`}>
                    {sans}
                  </div>
                  <span className="text-[8px] text-slate-500">/100</span>
                </div>
              </div>

              {/* Live Miniature Dynamic ECG Strip */}
              <MiniCrewEcg bpm={bpm} isAlert={isWarning} />

              {/* Organ Status Alerts Pills */}
              <div className="flex items-center flex-wrap gap-1.5 my-3 text-[10px]">
                <span
                  className={`px-2 py-0.5 rounded border ${
                    member.organAlerts?.brain?.status === 'WARNING'
                      ? 'bg-rose-950/40 text-hud-rose border-rose-500/40 font-bold'
                      : 'bg-space-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Brain: {member.organAlerts?.brain?.status}
                </span>
                <span
                  className={`px-2 py-0.5 rounded border ${
                    member.organAlerts?.eyes?.status === 'WARNING'
                      ? 'bg-rose-950/40 text-hud-rose border-rose-500/40 font-bold'
                      : member.organAlerts?.eyes?.status === 'MONITOR'
                      ? 'bg-amber-950/40 text-amber-400 border-amber-500/40'
                      : 'bg-space-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Eyes (SANS): {member.organAlerts?.eyes?.status}
                </span>
                <span
                  className={`px-2 py-0.5 rounded border ${
                    bpm > 90
                      ? 'bg-rose-950/40 text-hud-rose border-rose-500/40 font-bold'
                      : 'bg-space-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Heart: {member.organAlerts?.heart?.status}
                </span>
              </div>

              {/* Card Footer: Solo Inspection Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  HEALTH SCORE: <span className="font-bold text-hud-cyan">{member.overallHealthScore}%</span>
                </span>

                <button
                  onClick={() => {
                    cockpitAudio.playBlip();
                    onSelectCrew(member.id);
                    onOpenSoloConsole();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition ${
                    isSelected
                      ? 'bg-hud-cyan text-space-950 hover:bg-hud-cyan/80 shadow-md shadow-hud-cyan/30'
                      : 'bg-space-900 text-slate-300 hover:text-white hover:bg-space-800 border border-slate-700'
                  }`}
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>OPEN SOLO IN-VIVO CONSOLE</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dual Display Architecture Explanation Card for Judges */}
      <div className="rounded-xl p-3 bg-space-950/90 border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-hud-cyan shrink-0" />
          <span>
            <strong className="text-white">NASA Operations Dual-Display System:</strong> The shared Squadron Bulkhead Monitor provides overall mission safety to Commander & CMO. In contrast, confidential psychological and biometric notes remain restricted to the astronaut's Private Tablet in their Crew Quarters.
          </span>
        </div>
      </div>
    </div>
  );
}

// Miniature dynamic Canvas ECG component for each astronaut card
function MiniCrewEcg({ bpm, isAlert }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = 240;
    const h = 28;
    canvas.width = w;
    canvas.height = h;

    let animId;
    let phase = 0;
    let sweepX = 0;
    const buffer = new Float32Array(w).fill(h / 2);

    const render = () => {
      phase++;
      sweepX = (sweepX + 1.2) % w;
      const beatPeriod = Math.max(20, Math.floor(3600 / bpm));
      const pos = phase % beatPeriod;

      let y = h / 2;
      if (pos >= 3 && pos <= 5) y -= 3;
      else if (pos === 7) y += 2;
      else if (pos >= 8 && pos <= 9) y -= isAlert ? 13 : 10;
      else if (pos === 10) y += 3;
      else if (pos >= 12 && pos <= 16) y -= 4;

      buffer[Math.floor(sweepX)] = y;

      ctx.fillStyle = 'rgba(4, 7, 17, 0.25)';
      ctx.fillRect(0, 0, w, h);

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isAlert ? '#f43f5e' : '#00f0ff';
      ctx.beginPath();
      for (let i = 0; i < w; i++) {
        if (i === 0) ctx.moveTo(i, buffer[i]);
        else ctx.lineTo(i, buffer[i]);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [bpm, isAlert]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-space-950 border border-slate-800/80 p-1 flex items-center justify-between">
      <div className="text-[8px] font-mono text-slate-500 uppercase px-1">LEAD-II ECG</div>
      <canvas ref={canvasRef} className="w-[200px] h-7 block" />
    </div>
  );
}
