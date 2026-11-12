import React, { useState } from 'react';
import ECGMonitor from './ECGMonitor';
import { Heart, Activity, AlertOctagon, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';

export default function CardiacTab({ activeCrew, isEmergencyActive }) {
  const [selectedLead, setSelectedLead] = useState('Lead-II');

  const hr = activeCrew?.vitals?.bpm || (isEmergencyActive ? 128 : 74);

  return (
    <div className="space-y-6">
      {/* Top Banner / Lead Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-space-900/80 border border-hud-cyan/20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-space-950 border border-slate-700">
            <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-white text-base">
              CARDIAC ELECTROPHYSIOLOGY & HOLTER VECTOR ANALYSIS
            </h2>
            <p className="text-xs font-mono text-slate-400">
              NASA Deep Space Autonomous Telemetry • Einthoven Triangle Alignment
            </p>
          </div>
        </div>

        {/* Lead Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-space-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {['Lead-I', 'Lead-II', 'Lead-III', 'V1-Precordial'].map((lead) => (
            <button
              key={lead}
              onClick={() => setSelectedLead(lead)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedLead === lead
                  ? 'bg-hud-cyan text-space-950 font-bold shadow-lg shadow-hud-cyan/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lead}
            </button>
          ))}
        </div>
      </div>

      {/* Main High-Resolution ECG Canvas */}
      <ECGMonitor heartRate={hr} isElevated={isEmergencyActive} />

      {/* Two-Column Deep Aerospace Cardiology Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Einthoven Triangle & Mathematical Vector Modeling */}
        <div className="p-5 sm:p-6 rounded-2xl bg-space-900/90 border border-hud-cyan/20 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Activity className="w-4 h-4 text-hud-cyan" />
            <h3 className="font-orbitron font-bold text-sm text-white">
              EINTHOVEN TRIANGLE // LEAD-II VECTOR GEOMETRY
            </h3>
          </div>

          {/* ASCII / Graphical SVG representation of Einthoven's Triangle */}
          <div className="relative h-44 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-center p-3">
            <svg viewBox="0 0 320 160" className="w-full h-full">
              {/* Inverted Triangle */}
              <polygon
                points="60,30 260,30 160,140"
                fill="none"
                stroke="rgba(0, 240, 255, 0.25)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Electrodes */}
              {/* Right Arm (RA - Negative) */}
              <circle cx="60" cy="30" r="7" fill="#00f0ff" />
              <text x="35" y="24" fill="#00f0ff" fontSize="10" fontFamily="monospace">RA (-)</text>

              {/* Left Arm (LA) */}
              <circle cx="260" cy="30" r="7" fill="#64748b" />
              <text x="250" y="24" fill="#94a3b8" fontSize="10" fontFamily="monospace">LA (+)</text>

              {/* Left Leg (LL - Positive) */}
              <circle cx="160" cy="140" r="7" fill="#00f0ff" />
              <text x="145" y="155" fill="#00f0ff" fontSize="10" fontFamily="monospace">LL (+)</text>

              {/* Lead-II Vector Arrow (RA -> LL at +60 degrees) */}
              <line
                x1="60"
                y1="30"
                x2="155"
                y2="135"
                stroke="#00f0ff"
                strokeWidth="3"
                markerEnd="url(#arrow)"
              />
              <text x="75" y="95" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace">
                LEAD-II (+60°)
              </text>

              {/* Center Heart Node */}
              <circle cx="135" cy="72" r="14" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="2" />
              <text x="127" y="76" fill="#f43f5e" fontSize="9" fontWeight="bold">HEART</text>
            </svg>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            In microgravity, absence of gravity redistributes blood toward the upper thoracic cavity, causing a -10° to -15° leftward electrical axis deviation. Lead-II directly captures the ventricular depolarization wave vector from the SA node through the Bundle of His, yielding maximum sensitivity for NASA telemetry.
          </p>
        </div>

        {/* Right: Microgravity Hemodynamic Adaptations */}
        <div className="p-5 sm:p-6 rounded-2xl bg-space-900/90 border border-hud-cyan/20 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <TrendingUp className="w-4 h-4 text-hud-emerald" />
            <h3 className="font-orbitron font-bold text-sm text-white">
              HEMODYNAMIC ADAPTATION METRICS (ARES-3)
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Cephalad Fluid Shift:</span>
                <p className="text-slate-200">1.8 Liters thoracic migration</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                Compensated
              </span>
            </div>

            <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Left Ventricular Stroke Volume:</span>
                <p className="text-slate-200">62 mL/beat (-12% from 1G baseline)</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-sky-950/60 text-sky-400 border border-sky-800/50">
                Aerobic Maintained
              </span>
            </div>

            <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Baroreceptor Reset Sensitivity:</span>
                <p className="text-slate-200">7.2 ms/mmHg (Elevated Orthostatic Risk)</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-400 border border-amber-800/50">
                G-Suit Req. on Entry
              </span>
            </div>

            <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Premature Ventricular Contractions (PVC):</span>
                <p className="text-slate-200">{isEmergencyActive ? '18 events / hr (CRITICAL)' : '2 events / hr (NOMINAL)'}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-md font-bold ${isEmergencyActive ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950/60 text-emerald-400'}`}>
                {isEmergencyActive ? 'ALERT: ENGAGE AI' : 'NOMINAL'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
