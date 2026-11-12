import React, { useState } from 'react';
import { Eye, Heart, Brain, Bone, ShieldAlert, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function AnatomyHologram({ crewMember, onSelectOrgan }) {
  const [selectedOrgan, setSelectedOrgan] = useState('heart');

  const organs = [
    {
      id: 'brain',
      name: 'Central Nervous System',
      icon: Brain,
      x: 50,
      y: 12,
      status: crewMember.organAlerts.brain.status,
      info: crewMember.organAlerts.brain.note,
      metrics: [
        { label: 'Cognitive Load', val: `${crewMember.vitals.cognitiveLoadIndex}%` },
        { label: 'Sleep Quality', val: `${crewMember.vitals.sleepQualityIndex}/100` },
      ]
    },
    {
      id: 'eyes',
      name: 'Optic Sheath & Retina (SANS)',
      icon: Eye,
      x: 50,
      y: 19,
      status: crewMember.organAlerts.eyes.status,
      info: crewMember.organAlerts.eyes.note,
      metrics: [
        { label: 'SANS Index', val: crewMember.organAlerts.eyes.status === 'WARNING' ? 'Stage-2 Alert' : 'Stage-0 (Nominal)' },
        { label: 'Intraocular Pressure', val: crewMember.organAlerts.eyes.status === 'WARNING' ? '24 mmHg (Elevated)' : '15 mmHg (Normal)' },
      ]
    },
    {
      id: 'heart',
      name: 'Cardiovascular Complex',
      icon: Heart,
      x: 50,
      y: 35,
      status: crewMember.organAlerts.heart.status,
      info: crewMember.organAlerts.heart.note,
      metrics: [
        { label: 'HRV Index', val: `${crewMember.vitals.hrvMs} ms` },
        { label: 'Cardiac Output', val: '5.4 L/min' },
      ]
    },
    {
      id: 'lungs',
      name: 'Pulmonary Gas Exchange',
      icon: Activity,
      x: 42,
      y: 38,
      status: crewMember.organAlerts.lungs.status,
      info: crewMember.organAlerts.lungs.note,
      metrics: [
        { label: 'SpO2 Saturation', val: `${crewMember.vitals.spo2}%` },
        { label: 'Resp Frequency', val: `${crewMember.vitals.respirationRate} br/min` },
      ]
    },
    {
      id: 'bones',
      name: 'Musculoskeletal & Bone Matrix',
      icon: Bone,
      x: 50,
      y: 65,
      status: crewMember.organAlerts.bones.status,
      info: crewMember.organAlerts.bones.note,
      metrics: [
        { label: 'BMD Monthly Loss', val: `${crewMember.vitals.bmdLossRatePercentPerMonth}%` },
        { label: 'Calcium Excretion', val: crewMember.organAlerts.bones.status === 'MONITOR' ? '+18% (Stone Risk)' : 'Nominal' },
      ]
    }
  ];

  const activeOrganData = organs.find((o) => o.id === selectedOrgan) || organs[0];

  const handleSelect = (organId) => {
    cockpitAudio.playBlip();
    setSelectedOrgan(organId);
    if (onSelectOrgan) onSelectOrgan(organId);
  };

  const getStatusColor = (status) => {
    if (status === 'WARNING') return 'text-hud-rose border-hud-rose bg-hud-rose/20 shadow-hud-rose';
    if (status === 'MONITOR') return 'text-hud-amber border-hud-amber bg-hud-amber/20 shadow-hud-amber';
    return 'text-hud-cyan border-hud-cyan bg-hud-cyan/20 shadow-hud-cyan';
  };

  return (
    <div className="hud-panel rounded-xl p-5 border border-hud-cyan/30 flex flex-col md:flex-row gap-6 relative overflow-hidden">
      {/* Background cyber grid scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px] animate-scanline" />

      {/* Hologram Silhouette */}
      <div className="relative w-full md:w-56 h-80 flex items-center justify-center bg-space-950/80 rounded-lg border border-hud-cyan/15 p-2 shrink-0">
        <div className="absolute top-2 left-2 text-[10px] font-mono text-hud-cyan uppercase tracking-widest">
          BIO-SCAN // 3D PROJECTION
        </div>

        {/* Anatomical Vector Silhouette */}
        <svg
          viewBox="0 0 100 200"
          className="w-full h-full stroke-hud-cyan/40 fill-hud-cyan/5 drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]"
        >
          {/* Head & Neck */}
          <circle cx="50" cy="22" r="14" strokeWidth="1.5" />
          <path d="M44 35 L44 44 L56 44 L56 35" strokeWidth="1.5" />
          {/* Torso */}
          <path d="M30 46 L70 46 L64 105 L36 105 Z" strokeWidth="1.5" />
          {/* Shoulders & Arms */}
          <path d="M30 46 L18 80 L14 115" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M70 46 L82 80 L86 115" strokeWidth="1.5" strokeLinecap="round" />
          {/* Pelvis & Legs */}
          <path d="M36 105 L32 155 L30 195" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M64 105 L68 155 L70 195" strokeWidth="1.8" strokeLinecap="round" />
          {/* Spine indicator line */}
          <line x1="50" y1="44" x2="50" y2="105" stroke="rgba(0,240,255,0.2)" strokeDasharray="2,2" />
        </svg>

        {/* Interactive Organ Hotspots */}
        {organs.map((org) => {
          const isSelected = selectedOrgan === org.id;
          const isAlert = org.status === 'WARNING';
          return (
            <button
              key={org.id}
              onClick={() => handleSelect(org.id)}
              style={{ top: `${org.y}%`, left: `${org.x}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border transition-all duration-300 group ${getStatusColor(
                org.status
              )} ${isSelected ? 'scale-125 ring-2 ring-white/50' : 'hover:scale-110'}`}
              title={org.name}
            >
              <org.icon className={`w-3.5 h-3.5 ${isAlert ? 'animate-pulse' : ''}`} />
              <span className="sr-only">{org.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Organ Analysis Detail Card */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-hud-cyan/20 pb-3 mb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg border ${getStatusColor(activeOrganData.status)}`}>
                <activeOrganData.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white tracking-wide">
                  {activeOrganData.name}
                </h3>
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  MICROGRAVITY ADAPTATION PROFILE
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider border">
              {activeOrganData.status === 'WARNING' ? (
                <span className="text-hud-rose border-hud-rose flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 animate-bounce" /> HIGH RISK
                </span>
              ) : activeOrganData.status === 'MONITOR' ? (
                <span className="text-hud-amber border-hud-amber flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> MONITOR
                </span>
              ) : (
                <span className="text-hud-emerald border-hud-emerald flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> NOMINAL
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed bg-space-950/60 p-3 rounded-lg border border-hud-cyan/10 font-sans mb-4">
            {activeOrganData.info}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {activeOrganData.metrics.map((m, idx) => (
              <div key={idx} className="bg-space-900/80 p-2.5 rounded border border-hud-cyan/10">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  {m.label}
                </span>
                <span className="text-sm font-mono font-bold text-hud-cyan">
                  {m.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Click any hotspot on the silhouette to inspect organ status</span>
          <span className="font-mono text-hud-cyan text-[11px]">NASA-STD-3001 COMPLIANT</span>
        </div>
      </div>
    </div>
  );
}
