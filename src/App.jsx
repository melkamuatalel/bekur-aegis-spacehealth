import React, { useState } from 'react';
import MissionHeader from './components/MissionHeader';
import CrewSelector from './components/CrewSelector';
import VitalsGrid from './components/VitalsGrid';
import AnatomyHologram from './components/AnatomyHologram';
import EarthSyncQueue from './components/EarthSyncQueue';
import AIDoctorModal from './components/AIDoctorModal';
import NasaRiskDrawer from './components/NasaRiskDrawer';
import { CREW_MEMBERS } from './data/nasaHealthData';
import { ShieldAlert, AlertTriangle, Sparkles, Activity } from 'lucide-react';

export default function App() {
  const [crew, setCrew] = useState(CREW_MEMBERS);
  const [activeCrewId, setActiveCrewId] = useState('crew-02'); // Default to Abebe Worku (has interesting SANS & fatigue indicators)
  const [isAnomalyActive, setIsAnomalyActive] = useState(false);
  const [isAIDocOpen, setIsAIDocOpen] = useState(false);
  const [isNasaRiskOpen, setIsNasaRiskOpen] = useState(false);

  const activeCrew = crew.find((c) => c.id === activeCrewId) || crew[0];

  const handleToggleAnomaly = () => {
    setIsAnomalyActive((prev) => !prev);
  };

  return (
    <div className="min-h-screen p-3 sm:p-5 lg:p-8 max-w-7xl mx-auto flex flex-col justify-between">
      <div>
        {/* Master Mission Header */}
        <MissionHeader
          onTriggerAnomaly={handleToggleAnomaly}
          isAnomalyActive={isAnomalyActive}
          onOpenAIDoc={() => setIsAIDocOpen(true)}
          onOpenNasaEvidence={() => setIsNasaRiskOpen(true)}
        />

        {/* Emergency Alert Banner (visible when Anomaly is triggered) */}
        {isAnomalyActive && (
          <div className="hud-panel-danger rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6 text-hud-rose shrink-0" />
              <div>
                <h3 className="font-display font-bold text-white text-sm">
                  CRITICAL BIOMETRIC ALERT // SOLAR PARTICLE EVENT & ARRHYTHMIA DETECTED
                </h3>
                <p className="text-xs text-rose-200 font-mono">
                  Autonomous Edge AI has engaged clinical countermeasures. Earth comms lag: +04m 21s. No ground intervention possible.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAIDocOpen(true)}
              className="px-4 py-2 bg-hud-rose hover:bg-hud-rose/80 text-white font-mono font-bold text-xs rounded-lg uppercase tracking-wider shrink-0 transition"
            >
              LAUNCH AI TRIAGE
            </button>
          </div>
        )}

        {/* Crew Member Selector Tabs */}
        <CrewSelector
          crew={crew}
          activeCrewId={activeCrewId}
          onSelectCrew={setActiveCrewId}
          isAnomalyActive={isAnomalyActive}
        />

        {/* Main Telemetry & Diagnostic Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Left Column: Vitals Telemetry + Lead-II ECG (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <VitalsGrid
              crewMember={activeCrew}
              isEmergencyActive={isAnomalyActive}
            />
          </div>

          {/* Right Column: Holographic 3D Body Scan (5 Cols) */}
          <div className="lg:col-span-5">
            <AnatomyHologram
              crewMember={activeCrew}
              onSelectOrgan={(organId) => {
                // Clicking an organ can inspect or trigger AI triage
              }}
            />
          </div>
        </div>

        {/* Bottom Module: Deep Space Network Telemetry Buffer & Earth Sync */}
        <EarthSyncQueue isAnomalyActive={isAnomalyActive} />
      </div>

      {/* Footer / Space Apps Submission Credits */}
      <footer className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3">
        <div>
          <span className="text-slate-300 font-bold">BEKUR-AEGIS</span> • NASA Space Apps Challenge 2026 // Team BEKUR
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsNasaRiskOpen(true)} className="hover:text-hud-cyan transition">
            NASA HRP Standards
          </button>
          <span>•</span>
          <button onClick={() => setIsAIDocOpen(true)} className="hover:text-hud-cyan transition">
            Offline Edge AI
          </button>
          <span>•</span>
          <span className="text-hud-emerald">Mars Transit Ready</span>
        </div>
      </footer>

      {/* AI Doctor Modal */}
      <AIDoctorModal
        isOpen={isAIDocOpen}
        onClose={() => setIsAIDocOpen(false)}
        defaultCrew={activeCrew}
        onTriggerProtocol={() => {}}
      />

      {/* NASA Evidence Modal */}
      <NasaRiskDrawer
        isOpen={isNasaRiskOpen}
        onClose={() => setIsNasaRiskOpen(false)}
      />
    </div>
  );
}
