import React from 'react';
import { User, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function CrewSelector({ crew, activeCrewId, onSelectCrew, isAnomalyActive }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {crew.map((member) => {
        const isSelected = activeCrewId === member.id;
        const hasWarning = member.status === 'ELEVATED_RISK' || (isSelected && isAnomalyActive);

        return (
          <button
            key={member.id}
            onClick={() => {
              cockpitAudio.playBlip();
              onSelectCrew(member.id);
            }}
            className={`hud-panel p-3 rounded-xl border text-left transition-all duration-300 relative overflow-hidden ${
              isSelected
                ? 'border-hud-cyan bg-hud-cyan/15 shadow-[0_0_16px_rgba(0,240,255,0.25)] ring-1 ring-hud-cyan'
                : 'border-slate-800 bg-space-950/60 hover:border-slate-700'
            }`}
          >
            {/* Active Crew Indicator line */}
            {isSelected && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-hud-cyan via-white to-hud-cyan" />
            )}

            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-slate-400 font-bold tracking-wider">
                {member.callsign}
              </span>
              <span
                className={`flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  hasWarning
                    ? 'bg-hud-rose/20 text-hud-rose border border-hud-rose/40 animate-pulse'
                    : 'bg-hud-emerald/20 text-hud-emerald border border-hud-emerald/40'
                }`}
              >
                {hasWarning ? (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    <span>ALERT</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3" />
                    <span>NOMINAL</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm ${
                  isSelected
                    ? 'bg-hud-cyan text-space-950'
                    : 'bg-space-900 text-slate-300 border border-slate-700'
                }`}
              >
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="truncate">
                <div className="font-display font-bold text-sm text-white truncate">
                  {member.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate font-sans">
                  {member.role}
                </div>
              </div>
            </div>

            {/* Health Score Progress */}
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 text-[10px]">HEALTH INDEX</span>
              <span className={`font-bold ${hasWarning ? 'text-hud-rose' : 'text-hud-cyan'}`}>
                {hasWarning ? 68 : member.overallHealthScore}%
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
