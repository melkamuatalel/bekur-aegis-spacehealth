import React, { useState } from 'react';
import MissionHeader from './components/MissionHeader';
import CrewSelector from './components/CrewSelector';
import BiometricsTab from './components/BiometricsTab';
import CardiacTab from './components/CardiacTab';
import DigitalTwinSimulator from './components/DigitalTwinSimulator';
import DrBekurAITab from './components/DrBekurAITab';
import CommsScienceTab from './components/CommsScienceTab';
import DataIntegrationModal from './components/DataIntegrationModal';
import AIDoctorModal from './components/AIDoctorModal';
import NasaRiskDrawer from './components/NasaRiskDrawer';
import { CREW_MEMBERS } from './data/nasaHealthData';
import { ShieldAlert, Activity, Heart, Bot, Radio, Cpu, Sparkles } from 'lucide-react';
import { cockpitAudio } from './utils/audioAlert';

export default function App() {
  const [crew, setCrew] = useState(CREW_MEMBERS);
  const [activeCrewId, setActiveCrewId] = useState('crew-02'); // Abebe Worku
  const [activeTab, setActiveTab] = useState('biometrics'); // 'biometrics' | 'cardiac' | 'digital-twin' | 'ai-doctor' | 'comms-science'
  const [isAnomalyActive, setIsAnomalyActive] = useState(false);
  const [isAIDocOpen, setIsAIDocOpen] = useState(false);
  const [isNasaRiskOpen, setIsNasaRiskOpen] = useState(false);
  const [isDataIntegrationOpen, setIsDataIntegrationOpen] = useState(false);

  const activeCrew = crew.find((c) => c.id === activeCrewId) || crew[0];

  const handleToggleAnomaly = () => {
    setIsAnomalyActive((prev) => !prev);
  };

  // Dynamically feed live Bluetooth sensor data or NASA dataset into active astronaut!
  const handleApplyCustomTelemetry = (customData) => {
    setCrew((prevCrew) =>
      prevCrew.map((c) => {
        if (c.id === activeCrewId) {
          return {
            ...c,
            vitals: {
              ...c.vitals,
              heartRate: customData.bpm || c.vitals.heartRate,
              bpm: customData.bpm || c.vitals.bpm,
              spo2: customData.spo2 || c.vitals.spo2,
            },
            sansScore: customData.sans !== undefined ? customData.sans : c.sansScore,
          };
        }
        return c;
      })
    );
  };

  const tabs = [
    { id: 'biometrics', label: '3D In-Vivo Biometrics', icon: Activity, badge: 'Gender Adaptive' },
    { id: 'cardiac', label: 'Lead-II Cardiac Vector', icon: Heart, badge: '25mm/s Sweep' },
    { id: 'digital-twin', label: '72h Digital Twin Lab', icon: Cpu, badge: 'Prognostic Novelty' },
    { id: 'ai-doctor', label: 'Dr. BEKUR-AI Clinic', icon: Bot, badge: '3D Hologram CMO' },
    { id: 'comms-science', label: 'DSN Comms & NASA Science', icon: Radio, badge: 'Store & Fwd' },
  ];

  return (
    <div className="min-h-screen p-3 sm:p-5 lg:p-8 max-w-7xl mx-auto flex flex-col justify-between selection:bg-hud-cyan selection:text-space-950">
      <div className="space-y-6">
        {/* Master Mission Header */}
        <MissionHeader
          onTriggerAnomaly={handleToggleAnomaly}
          isAnomalyActive={isAnomalyActive}
          onOpenAIDoc={() => setActiveTab('ai-doctor')}
          onOpenNasaEvidence={() => setActiveTab('comms-science')}
          onOpenDataIntegration={() => setIsDataIntegrationOpen(true)}
        />

        {/* Emergency Alert Banner (visible when Anomaly is triggered) */}
        {isAnomalyActive && (
          <div className="hud-panel-danger rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse shadow-xl">
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6 text-hud-rose shrink-0" />
              <div>
                <h3 className="font-orbitron font-bold text-white text-sm">
                  CRITICAL BIOMETRIC ALERT // SOLAR PARTICLE EVENT & ARRHYTHMIA DETECTED
                </h3>
                <p className="text-xs text-rose-200 font-mono">
                  Autonomous Edge AI has engaged clinical countermeasures. Earth comms lag: +04m 21s. No ground intervention possible.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab('ai-doctor');
                cockpitAudio.playBlip();
              }}
              className="px-4 py-2 bg-hud-rose hover:bg-hud-rose/80 text-white font-mono font-bold text-xs rounded-xl uppercase tracking-wider shrink-0 transition shadow-lg shadow-hud-rose/40"
            >
              LAUNCH DR. BEKUR-AI TRIAGE
            </button>
          </div>
        )}

        {/* Multi-Astronaut Selector Bar */}
        <CrewSelector
          crew={crew}
          activeCrewId={activeCrewId}
          onSelectCrew={setActiveCrewId}
          isAnomalyActive={isAnomalyActive}
        />

        {/* Spacious, Sleek Tab Navigation Bar (SpaceX / Apple Glassmorphism) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-space-900/90 border border-hud-cyan/25 backdrop-blur-md overflow-x-auto shadow-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  cockpitAudio.playBlip();
                }}
                className={`flex-1 min-w-[190px] flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl font-orbitron text-xs font-bold tracking-wider transition-all ${
                  isActive
                    ? 'bg-hud-cyan text-space-950 shadow-lg shadow-hud-cyan/30 scale-[1.01]'
                    : 'text-slate-400 hover:text-white hover:bg-space-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-space-950' : 'text-hud-cyan'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[8px] font-mono px-2 py-0.5 rounded-full uppercase ${
                    isActive ? 'bg-space-950/20 text-space-950' : 'bg-space-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Area (Spacious & Decluttered) */}
        <main className="transition-all duration-300">
          {activeTab === 'biometrics' && (
            <BiometricsTab
              crew={crew}
              activeCrew={activeCrew}
              onSelectCrew={setActiveCrewId}
              isEmergencyActive={isAnomalyActive}
            />
          )}

          {activeTab === 'cardiac' && (
            <CardiacTab
              activeCrew={activeCrew}
              isEmergencyActive={isAnomalyActive}
            />
          )}

          {activeTab === 'digital-twin' && (
            <DigitalTwinSimulator
              activeCrew={activeCrew}
              isEmergencyActive={isAnomalyActive}
            />
          )}

          {activeTab === 'ai-doctor' && (
            <DrBekurAITab
              activeCrew={activeCrew}
              isEmergencyActive={isAnomalyActive}
              onTriggerEmergency={handleToggleAnomaly}
            />
          )}

          {activeTab === 'comms-science' && (
            <CommsScienceTab
              isEmergencyActive={isAnomalyActive}
            />
          )}
        </main>
      </div>

      {/* Footer / NASA Space Apps Submission Bar */}
      <footer className="mt-12 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3">
        <div className="flex items-center gap-2">
          <span className="text-white font-orbitron font-bold">BEKUR-AEGIS</span>
          <span>•</span>
          <span>NASA Space Apps Challenge 2026 // Team BEKUR</span>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsDataIntegrationOpen(true)} className="hover:text-hud-cyan transition">
            Hardware Sensor Pairing (BLE)
          </button>
          <span>•</span>
          <button onClick={() => setActiveTab('digital-twin')} className="hover:text-hud-cyan transition">
            72h Digital Twin Lab
          </button>
          <span>•</span>
          <button onClick={() => setActiveTab('comms-science')} className="hover:text-hud-cyan transition">
            NASA HRP Standards
          </button>
          <span>•</span>
          <span className="text-hud-emerald">Autonomous Deep Space Avionics</span>
        </div>
      </footer>

      {/* Real Hardware & NASA Data Integration Modal */}
      <DataIntegrationModal
        isOpen={isDataIntegrationOpen}
        onClose={() => setIsDataIntegrationOpen(false)}
        onApplyCustomTelemetry={handleApplyCustomTelemetry}
      />

      {/* Modal for Legacy Quick AI Trigger if used */}
      <AIDoctorModal
        isOpen={isAIDocOpen}
        onClose={() => setIsAIDocOpen(false)}
        defaultCrew={activeCrew}
        onTriggerProtocol={() => {}}
      />

      <NasaRiskDrawer
        isOpen={isNasaRiskOpen}
        onClose={() => setIsNasaRiskOpen(false)}
      />
    </div>
  );
}
