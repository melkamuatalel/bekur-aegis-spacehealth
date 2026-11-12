import React, { useState } from 'react';
import PhotorealisticAnatomyScanner from './PhotorealisticAnatomyScanner';
import ThreeAstronautModel from './ThreeAstronautModel';
import VitalsGrid from './VitalsGrid';
import {
  Brain,
  Eye,
  Heart,
  Activity,
  Bone,
  Zap,
  Info,
  ShieldCheck,
  Layers,
  Box,
} from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function BiometricsTab({ activeCrew, isEmergencyActive }) {
  const [selectedOrgan, setSelectedOrgan] = useState('cardio');
  const [viewMode, setViewMode] = useState('photorealistic'); // 'photorealistic' | 'webgl3d'

  const organDetails = {
    cns: {
      name: 'Central Nervous System (Brain)',
      icon: Brain,
      riskLevel: 'Moderate Adapt.',
      metric: 'ICP +4.2 mmHg',
      statusColor: 'text-sky-400',
      pathophysiology:
        'Cephalad fluid redistribution causes upward brain displacement, narrowing the superior sagittal sinus and elevating resting intracranial pressure.',
      nasaReference: 'NASA HRP Risk of Adverse Cognitive or Behavioral Conditions (NASA-STD-3001)',
      countermeasure: 'Daily 2.5-hour resistance cycle ergometer (ARED) + lower-body negative pressure (LBNP).',
    },
    optic: {
      name: 'Optic Sheath & Retina (SANS)',
      icon: Eye,
      riskLevel: activeCrew.sansScore > 65 ? 'Elevated (Grade 2)' : 'Nominal (Grade 1)',
      metric: `SANS Index: ${activeCrew.sansScore}/100`,
      statusColor: activeCrew.sansScore > 65 ? 'text-amber-400' : 'text-emerald-400',
      pathophysiology:
        'Microgravity-induced optic nerve sheath diameter (ONSD) expansion (5.8mm vs 4.8mm baseline), posterior globe flattening, and hyperopic refractive shift.',
      nasaReference: 'Spaceflight-Associated Neuro-ocular Syndrome (HRP Evidence Report 2024)',
      countermeasure: 'Venous chokes, chorioretinal OCT scans every 14 days, adjustable focus lenses.',
    },
    cardio: {
      name: 'Cardiovascular Complex (Heart)',
      icon: Heart,
      riskLevel: isEmergencyActive ? 'Critical Ectopy' : 'Adapted',
      metric: `${activeCrew.vitals.bpm} BPM | SV: -8%`,
      statusColor: isEmergencyActive ? 'text-rose-400' : 'text-emerald-400',
      pathophysiology:
        'Loss of hydrostatic column results in 10-15% reduction in left ventricular mass over long duration missions, coupled with refractory sinus tachycardia upon EVA stress.',
      nasaReference: 'NASA HRP Cardiovascular Disease and Orthostatic Intolerance Risk',
      countermeasure: 'Pre-re-entry fluid loading (0.9% saline tablets) and continuous Lead-II telemetry.',
    },
    pulmo: {
      name: 'Pulmonary & Gas Exchange',
      icon: Activity,
      riskLevel: 'Optimal',
      metric: `${activeCrew.vitals.spo2}% SpO2 | 21.2% O2`,
      statusColor: 'text-cyan-400',
      pathophysiology:
        'Ventilation-perfusion ratio homogenization across alveolar zones in zero gravity. Carbon dioxide cabin accumulation monitored at 0.38% (well below 0.7% headache threshold).',
      nasaReference: 'NASA-STD-3001 Vol 2: Atmospheric Quality & Carbon Dioxide Management',
      countermeasure: 'Cabin LiOH scrubber monitoring, personal particulate scrubbers during hatch ops.',
    },
    renal: {
      name: 'Hepatorenal Clearance (Liver & Kidneys)',
      icon: Zap,
      riskLevel: 'Elevated Ca++',
      metric: 'GFR: +14% | Urinary Ca++: +18%',
      statusColor: 'text-amber-400',
      pathophysiology:
        'Accelerated bone resorption floods circulating plasma with ionized calcium, increasing urinary calcium oxalate saturation and acute nephrolithiasis (kidney stone) risk.',
      nasaReference: 'NASA HRP Risk of Renal Stone Formation in Long-Duration Spaceflight',
      countermeasure: 'Forced hydration (>2.5L/day), potassium citrate (20 mEq/day) urinary alkalization.',
    },
    musculo: {
      name: 'Musculoskeletal & Bone Density',
      icon: Bone,
      riskLevel: 'Calcium Excretion',
      metric: '-1.1% Bone Mass/mo',
      statusColor: 'text-slate-300',
      pathophysiology:
        'Osteoclast activity outpaces osteoblast mineralization due to absence of mechanical loading on calcaneus, femoral neck, and lumbar spine.',
      nasaReference: 'NASA HRP Risk of Early Onset Osteoporosis & Fractures',
      countermeasure: 'Bisphosphonates, dietary vitamin D3 supplementation, ARED high-load deadlifts.',
    },
  };

  const currentOrgan = organDetails[selectedOrgan] || organDetails.cardio;
  const CurrentIcon = currentOrgan.icon;

  return (
    <div className="space-y-6">
      {/* Top Mode Switcher Bar */}
      <div className="flex items-center justify-between p-2.5 px-4 rounded-xl bg-space-900/80 border border-hud-cyan/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-orbitron font-bold text-white uppercase tracking-wider">
            ANATOMICAL RENDER ENGINE:
          </span>
          <span className="text-xs font-mono text-hud-cyan font-bold">
            {viewMode === 'photorealistic' ? 'HIGH-RES IN-VIVO TOMOGRAPHY' : '3D WEBGL INTERACTIVE MESH'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-space-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              setViewMode('photorealistic');
              cockpitAudio.playBlip();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              viewMode === 'photorealistic'
                ? 'bg-hud-cyan text-space-950 font-bold shadow-md shadow-hud-cyan/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Photorealistic In-Vivo</span>
          </button>
          <button
            onClick={() => {
              setViewMode('webgl3d');
              cockpitAudio.playBlip();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              viewMode === 'webgl3d'
                ? 'bg-hud-cyan text-space-950 font-bold shadow-md shadow-hud-cyan/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Wireframe (360°)</span>
          </button>
        </div>
      </div>

      {/* Main Stage: Scanner + In-Depth Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Anatomical Scanner (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          {viewMode === 'photorealistic' ? (
            <PhotorealisticAnatomyScanner
              activeCrew={activeCrew}
              selectedOrgan={selectedOrgan}
              onSelectOrgan={setSelectedOrgan}
              isEmergencyActive={isEmergencyActive}
            />
          ) : (
            <ThreeAstronautModel
              activeCrew={activeCrew}
              selectedOrgan={selectedOrgan}
              onSelectOrgan={setSelectedOrgan}
              isAnomalyActive={isEmergencyActive}
            />
          )}
        </div>

        {/* Right Column: Selected Organ Clinical Telemetry & Action (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-space-900/90 border border-hud-cyan/30 shadow-2xl backdrop-blur-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-space-950 border border-slate-700">
                  <CurrentIcon className={`w-5 h-5 ${currentOrgan.statusColor}`} />
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-sm sm:text-base text-white">
                    {currentOrgan.name}
                  </h3>
                  <span className="font-mono text-xs text-slate-400">
                    SUBJECT: {activeCrew.name} ({activeCrew.gender})
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase">STATUS</span>
                <div className={`font-mono text-xs font-bold ${currentOrgan.statusColor}`}>
                  {currentOrgan.riskLevel}
                </div>
              </div>
            </div>

            {/* Metric pill */}
            <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">IN-VIVO VECTOR:</span>
              <span className="font-orbitron text-sm font-bold text-hud-cyan">
                {currentOrgan.metric}
              </span>
            </div>

            {/* Pathophysiology description */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-hud-cyan" />
                Microgravity Pathophysiology
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-space-950/50 p-3 rounded-xl border border-slate-800/60">
                {currentOrgan.pathophysiology}
              </p>
            </div>

            {/* Prescribed Countermeasure */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-hud-emerald" />
                Prescribed Countermeasure
              </span>
              <p className="text-xs text-emerald-300/90 leading-relaxed font-mono bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/40">
                {currentOrgan.countermeasure}
              </p>
            </div>
          </div>

          {/* NASA HRP Citation */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>NASA-STD-3001 Clinical Standard</span>
            <span className="text-hud-emerald font-bold">In-Flight Verified</span>
          </div>
        </div>
      </div>

      {/* Spacious 6-Card Live Biometrics Telemetry Grid */}
      <VitalsGrid crewMember={activeCrew} isEmergencyActive={isEmergencyActive} />
    </div>
  );
}
