import React from 'react';
import { Heart, Activity, Wind, Thermometer, Brain, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import ECGMonitor from './ECGMonitor';

export default function VitalsGrid({ crewMember, isEmergencyActive }) {
  const v = crewMember.vitals;

  const cards = [
    {
      title: "Heart Rate",
      val: isEmergencyActive ? 128 : v.heartRate,
      unit: v.hrUnit,
      icon: Heart,
      status: (isEmergencyActive || v.heartRate > 90) ? "ALERT" : "NOMINAL",
      target: "Normal: 60 - 80 BPM",
      color: (isEmergencyActive || v.heartRate > 90) ? "text-hud-rose border-hud-rose/40" : "text-hud-cyan border-hud-cyan/20"
    },
    {
      title: "Oxygen Saturation",
      val: isEmergencyActive ? 92.4 : v.spo2,
      unit: v.spo2Unit,
      icon: Wind,
      status: (isEmergencyActive || v.spo2 < 95) ? "ALERT" : "NOMINAL",
      target: "Target: > 97%",
      color: (isEmergencyActive || v.spo2 < 95) ? "text-hud-amber border-hud-amber/40" : "text-hud-emerald border-hud-emerald/20"
    },
    {
      title: "Blood Pressure",
      val: isEmergencyActive ? "152/98" : `${v.bloodPressureSys}/${v.bloodPressureDia}`,
      unit: v.bpUnit,
      icon: Activity,
      status: (isEmergencyActive || v.bloodPressureSys > 130) ? "ELEVATED" : "NOMINAL",
      target: "Resting: 120/80 mmHg",
      color: (isEmergencyActive || v.bloodPressureSys > 130) ? "text-hud-amber border-hud-amber/40" : "text-hud-cyan border-hud-cyan/20"
    },
    {
      title: "Respiration Rate",
      val: isEmergencyActive ? 24 : v.respirationRate,
      unit: v.respUnit,
      icon: Wind,
      status: isEmergencyActive ? "TACHYPNEA" : "NOMINAL",
      target: "Target: 12 - 16 br/min",
      color: isEmergencyActive ? "text-hud-rose border-hud-rose/40" : "text-hud-cyan border-hud-cyan/20"
    },
    {
      title: "Core Temperature",
      val: isEmergencyActive ? 38.2 : v.coreTemperature,
      unit: v.tempUnit,
      icon: Thermometer,
      status: isEmergencyActive ? "PYREXIA" : "NOMINAL",
      target: "Baseline: 36.5 - 37.2°C",
      color: isEmergencyActive ? "text-hud-rose border-hud-rose/40" : "text-hud-cyan border-hud-cyan/20"
    },
    {
      title: "Cognitive Fatigue",
      val: isEmergencyActive ? 86 : v.cognitiveLoadIndex,
      unit: "%",
      icon: Brain,
      status: (isEmergencyActive || v.cognitiveLoadIndex > 70) ? "FATIGUE" : "NOMINAL",
      target: "Optimal: < 45%",
      color: (isEmergencyActive || v.cognitiveLoadIndex > 70) ? "text-hud-amber border-hud-amber/40" : "text-hud-cyan border-hud-cyan/20"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Real-time Lead-II Electrocardiogram Sweep */}
      <ECGMonitor heartRate={isEmergencyActive ? 128 : v.heartRate} isElevated={isEmergencyActive || v.heartRate > 90} />

      {/* Numerical Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c, idx) => {
          const isWarning = c.status !== "NOMINAL";
          return (
            <div
              key={idx}
              className={`hud-panel p-3 rounded-xl border transition-all duration-300 ${c.color} ${
                isWarning ? 'bg-space-900/90 shadow-[0_0_12px_rgba(244,63,94,0.15)]' : 'bg-space-950/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 truncate">
                  {c.title}
                </span>
                <c.icon className={`w-3.5 h-3.5 ${isWarning ? 'animate-pulse' : 'text-slate-400'}`} />
              </div>

              <div className="flex items-baseline space-x-1.5 my-1">
                <span className="font-display text-2xl font-black text-white tracking-tight">
                  {c.val}
                </span>
                <span className="font-mono text-xs text-slate-400 font-bold">
                  {c.unit}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono">
                <span className={isWarning ? 'text-hud-rose font-bold' : 'text-hud-emerald font-bold'}>
                  {c.status}
                </span>
                <span className="text-slate-500 hidden sm:inline truncate text-[9px]">
                  {c.target}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
