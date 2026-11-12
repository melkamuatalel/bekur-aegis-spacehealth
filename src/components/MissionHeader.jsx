import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  AlertOctagon,
  Bot,
  Radio,
  BookOpen,
  Activity,
  Compass,
  Cpu,
  ShieldAlert,
} from 'lucide-react';
import BekurLogo from './BekurLogo';
import { MISSION_METADATA } from '../data/nasaHealthData';
import { cockpitAudio } from '../utils/audioAlert';

export default function MissionHeader({
  onTriggerAnomaly,
  isAnomalyActive,
  onOpenAIDoc,
  onOpenNasaEvidence,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [earthTime, setEarthTime] = useState(new Date().toUTCString());
  const [distanceKm, setDistanceKm] = useState(MISSION_METADATA.currentDistanceKm);

  // Real-time ticking mission clocks
  useEffect(() => {
    const timer = setInterval(() => {
      setEarthTime(new Date().toUTCString());
      // Increment distance based on Mars Hohmann cruise velocity (~24 km/s)
      setDistanceKm((prev) => prev + 24);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleAudio = () => {
    const muted = cockpitAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="rounded-2xl p-4 md:p-6 bg-gradient-to-r from-space-950 via-space-900 to-space-950 border border-hud-cyan/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Top Ambient Glow Line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-hud-cyan to-transparent opacity-80" />

      {/* Main Top Header Deck */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        {/* Brand & Futuristic Aerospace Logo */}
        <BekurLogo size="default" />

        {/* Tactical Cockpit Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Simulate Emergency / Anomaly Toggle */}
          <button
            onClick={() => {
              if (!isAnomalyActive) {
                cockpitAudio.playWarningAlarm();
              } else {
                cockpitAudio.playBlip();
              }
              onTriggerAnomaly();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-orbitron font-bold flex items-center space-x-2 transition shadow-lg ${
              isAnomalyActive
                ? 'bg-hud-rose text-white border border-hud-rose animate-pulse shadow-[0_0_25px_rgba(244,63,94,0.7)]'
                : 'bg-space-950 hover:bg-space-900 text-hud-rose border border-hud-rose/40 hover:border-hud-rose shadow-md'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{isAnomalyActive ? 'RESET ANOMALY' : 'SIMULATE EMERGENCY'}</span>
          </button>

          {/* AI Chief Medical Officer Quick Launcher */}
          <button
            onClick={() => {
              cockpitAudio.playBlip();
              onOpenAIDoc();
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-orbitron font-bold bg-hud-cyan text-space-950 hover:bg-hud-cyan/85 flex items-center space-x-2 transition shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            <Bot className="w-4 h-4" />
            <span>AI CHIEF MEDICAL OFFICER</span>
          </button>

          {/* NASA HRP Evidence Quick Launcher */}
          <button
            onClick={() => {
              cockpitAudio.playBlip();
              onOpenNasaEvidence();
            }}
            className="px-3.5 py-2.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-space-950 border border-slate-800 hover:border-hud-cyan/60 flex items-center space-x-2 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-hud-cyan" />
            <span className="hidden sm:inline">NASA HRP EVIDENCE</span>
          </button>

          {/* Master Audio Mute Toggle */}
          <button
            onClick={handleToggleAudio}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-space-950 border border-slate-800 hover:border-hud-cyan/50 transition"
            title={isMuted ? 'Unmute Cockpit Audio' : 'Mute Cockpit Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-hud-rose" />
            ) : (
              <Volume2 className="w-4 h-4 text-hud-cyan" />
            )}
          </button>
        </div>
      </div>

      {/* Futuristic Real-Time Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-4 text-xs font-mono">
        {/* Mission Elapsed Time (MET) */}
        <div className="bg-space-950/70 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
            <span>MISSION CLOCK</span>
            <span className="w-1.5 h-1.5 rounded-full bg-hud-cyan animate-pulse" />
          </div>
          <div className="font-orbitron font-bold text-white text-sm mt-0.5">
            SOL {MISSION_METADATA.missionDay}{' '}
            <span className="text-[11px] text-slate-500 font-normal">/ {MISSION_METADATA.totalMissionDays}</span>
          </div>
          <span className="text-[10px] text-hud-cyan font-mono">Hohmann Transfer Arc</span>
        </div>

        {/* Earth Distance (Dynamic Kilometers) */}
        <div className="bg-space-950/70 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition">
          <span className="text-[10px] text-slate-400 uppercase block">DISTANCE TO EARTH</span>
          <div className="font-orbitron font-bold text-hud-cyan text-sm mt-0.5">
            {(distanceKm / 1_000_000).toFixed(2)} M km
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Velocity: 24.8 km/s</span>
        </div>

        {/* Speed-of-Light Radio Latency Clock */}
        <div className="bg-space-950/70 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase">ONE-WAY COMMS LAG</span>
            <Radio className="w-3.5 h-3.5 text-hud-amber animate-pulse" />
          </div>
          <div className="font-orbitron font-bold text-hud-amber text-sm mt-0.5">
            +04m 21s
          </div>
          <span className="text-[10px] text-rose-400/90 font-mono">Autonomous Edge Active</span>
        </div>

        {/* Cosmic Ray Dosimeter */}
        <div className="bg-space-950/70 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition">
          <span className="text-[10px] text-slate-400 uppercase block">GCR DOSIMETER FLUX</span>
          <div
            className={`font-orbitron font-bold text-sm mt-0.5 ${
              isAnomalyActive ? 'text-hud-rose' : 'text-slate-200'
            }`}
          >
            {isAnomalyActive ? '184.2' : MISSION_METADATA.radiationDosimetry.instantaneousDoseRateMicroSvHr}{' '}
            <span className="text-[10px] text-slate-500 font-normal">µSv/h</span>
          </div>
          <span
            className={`text-[10px] font-mono ${
              isAnomalyActive ? 'text-hud-rose font-bold' : 'text-emerald-400'
            }`}
          >
            {isAnomalyActive ? 'SPE SHIELDBOX ALERT' : 'Heliosphere Nominal'}
          </span>
        </div>

        {/* Life Support Environment (O2 / CO2 / Pressure) */}
        <div className="bg-space-950/70 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition col-span-2 sm:col-span-4 lg:col-span-1 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">CABIN AIR O2 / CO2</span>
            <div className="font-orbitron font-bold text-white text-sm mt-0.5">
              {MISSION_METADATA.cabinEnvironment.o2Percentage}%{' '}
              <span className="text-slate-500 text-xs">/ {MISSION_METADATA.cabinEnvironment.co2Percentage}%</span>
            </div>
            <span className="text-[10px] text-hud-emerald font-mono">Pressure: 101.3 kPa</span>
          </div>
          <span className="w-3 h-3 rounded-full bg-hud-emerald shadow-[0_0_12px_rgba(16,185,129,0.9)] animate-pulse" />
        </div>
      </div>
    </header>
  );
}
