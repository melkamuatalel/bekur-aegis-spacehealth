import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, AlertOctagon, Bot, Radio, Compass, Orbit, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { MISSION_METADATA } from '../data/nasaHealthData';
import { cockpitAudio } from '../utils/audioAlert';

export default function MissionHeader({
  onTriggerAnomaly,
  isAnomalyActive,
  onOpenAIDoc,
  onOpenNasaEvidence
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [earthTime, setEarthTime] = useState(new Date().toUTCString());

  useEffect(() => {
    const timer = setInterval(() => {
      setEarthTime(new Date().toUTCString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleAudio = () => {
    const muted = cockpitAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="hud-panel rounded-2xl p-4 md:p-5 border border-hud-cyan/30 mb-6 relative overflow-hidden">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        
        {/* Brand & Mission Title */}
        <div className="flex items-center space-x-3.5">
          {/* BEKUR Emblem */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-hud-cyan/20 to-purple-600/30 border border-hud-cyan/50 flex items-center justify-center font-display text-xl font-black text-hud-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            በኩር
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-widest text-hud-cyan uppercase">
                TEAM BEKUR // NASA SPACE APPS 2026
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-hud-emerald/20 border border-hud-emerald/40 text-hud-emerald font-bold">
                OPERATIONAL
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-white tracking-wide">
              BEKUR-AEGIS <span className="text-hud-cyan text-base font-sans font-normal">// Autonomous Astronaut Health Intelligence</span>
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Anomaly Simulation Button (Key for Judges!) */}
          <button
            onClick={() => {
              if (!isAnomalyActive) cockpitAudio.playWarningAlarm();
              onTriggerAnomaly();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition shadow-lg ${
              isAnomalyActive
                ? 'bg-hud-rose text-white border border-hud-rose animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                : 'bg-space-900 hover:bg-space-850 text-hud-rose border border-hud-rose/40 hover:border-hud-rose'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{isAnomalyActive ? 'RESET ANOMALY' : 'SIMULATE EMERGENCY'}</span>
          </button>

          {/* AI Doctor Assistant */}
          <button
            onClick={onOpenAIDoc}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-hud-cyan text-space-950 hover:bg-hud-cyan/80 flex items-center space-x-2 transition shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <Bot className="w-4 h-4" />
            <span>AI CHIEF MEDICAL OFFICER</span>
          </button>

          {/* NASA Evidence Guide */}
          <button
            onClick={onOpenNasaEvidence}
            className="px-3 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-space-900 border border-slate-700 hover:border-hud-cyan flex items-center space-x-1.5 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-hud-cyan" />
            <span className="hidden sm:inline">NASA HRP EVIDENCE</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={handleToggleAudio}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-space-900 border border-slate-700 transition"
            title={isMuted ? "Unmute Telemetry Audio" : "Mute Telemetry Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-hud-rose" /> : <Volume2 className="w-4 h-4 text-hud-cyan" />}
          </button>
        </div>
      </div>

      {/* Telemetry Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 text-xs font-mono">
        {/* Mission MET */}
        <div className="bg-space-950/60 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">MISSION ELAPSED TIME</span>
          <span className="font-bold text-white text-sm">
            MET DAY {MISSION_METADATA.missionDay} <span className="text-slate-500 font-normal">/ {MISSION_METADATA.totalMissionDays}</span>
          </span>
        </div>

        {/* Earth Distance */}
        <div className="bg-space-950/60 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">DISTANCE FROM EARTH</span>
          <span className="font-bold text-hud-cyan text-sm">
            {(MISSION_METADATA.currentDistanceKm / 1_000_000).toFixed(1)} M km
          </span>
        </div>

        {/* Radio Latency Clock */}
        <div className="bg-space-950/60 p-2.5 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase">ONE-WAY RADIO DELAY</span>
            <Radio className="w-3 h-3 text-hud-amber animate-pulse" />
          </div>
          <span className="font-bold text-hud-amber text-sm">
            +04m 21s <span className="text-[10px] text-slate-500 font-normal">(NO LIVE 911)</span>
          </span>
        </div>

        {/* Cosmic Radiation */}
        <div className="bg-space-950/60 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">COSMIC RADIATION RATE</span>
          <span className={`font-bold text-sm ${isAnomalyActive ? 'text-hud-rose' : 'text-slate-200'}`}>
            {isAnomalyActive ? '184.2' : MISSION_METADATA.radiationDosimetry.instantaneousDoseRateMicroSvHr} <span className="text-[10px] text-slate-500">µSv/h</span>
          </span>
        </div>

        {/* Cabin Atmosphere */}
        <div className="bg-space-950/60 p-2.5 rounded-lg border border-slate-800 col-span-2 sm:col-span-4 lg:col-span-1 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">CABIN AIR O2 / CO2</span>
            <span className="font-bold text-white text-sm">
              {MISSION_METADATA.cabinEnvironment.o2Percentage}% <span className="text-slate-500 text-xs">/ {MISSION_METADATA.cabinEnvironment.co2Percentage}%</span>
            </span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-hud-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>
      </div>
    </header>
  );
}
