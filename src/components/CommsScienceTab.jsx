import React from 'react';
import EarthSyncQueue from './EarthSyncQueue';
import { Radio, Database, ShieldCheck, BookOpen, ExternalLink, Satellite } from 'lucide-react';
import { NASA_HRP_RISKS } from '../data/nasaHealthData';

export default function CommsScienceTab({ isEmergencyActive }) {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-space-900/80 border border-hud-cyan/20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-space-950 border border-slate-700">
            <Radio className="w-5 h-5 text-hud-cyan animate-pulse" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-white text-base">
              DEEP SPACE NETWORK (DSN) & NASA EVIDENCE BASE
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Interplanetary Store-and-Forward Telemetry • NASA Human Research Program Standards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-full bg-space-950 border border-slate-700 text-slate-300">
            DSN STATION: GOLDSTONE (DSS-14)
          </span>
        </div>
      </div>

      {/* Earth Telemetry Buffer & DSN Packet Transmitter */}
      <EarthSyncQueue isAnomalyActive={isEmergencyActive} />

      {/* NASA Open Science & Evidence Repository Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          <Database className="w-4 h-4 text-hud-cyan" />
          <h3 className="font-orbitron font-bold text-sm text-white">
            NASA HUMAN RESEARCH PROGRAM (HRP) EVIDENCE REPOSITORY
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NASA_HRP_RISKS.map((risk) => (
            <div
              key={risk.id}
              className="p-5 rounded-2xl bg-space-900/90 border border-slate-800/80 hover:border-hud-cyan/40 transition-all shadow-xl backdrop-blur-md space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-950 border border-slate-700 text-hud-cyan">
                    {risk.code}
                  </span>
                  <h4 className="font-orbitron font-bold text-sm text-white mt-1.5">{risk.title}</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/50">
                  {risk.level}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {risk.summary}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Standard: {risk.standard}</span>
                <span className="text-hud-emerald">Validated 2026</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
