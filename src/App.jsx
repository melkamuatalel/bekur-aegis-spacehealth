import React, { useState, useEffect } from 'react';
import MissionHeader from './components/MissionHeader';
import CrewSelector from './components/CrewSelector';
import BiometricsTab from './components/BiometricsTab';
import CardiacTab from './components/CardiacTab';
import DigitalTwinSimulator from './components/DigitalTwinSimulator';
import DrBekurAITab from './components/DrBekurAITab';
import CommsScienceTab from './components/CommsScienceTab';
import SquadronCockpitDeck from './components/SquadronCockpitDeck';
import BiometricLoginGate from './components/BiometricLoginGate';
import GenomicDnaRadiationSuite from './components/GenomicDnaRadiationSuite';
import AcousticVoiceTriageSuite from './components/AcousticVoiceTriageSuite';
import EarthImpactRoadmapSuite from './components/EarthImpactRoadmapSuite';
import AutoPitchWalkthroughModal from './components/AutoPitchWalkthroughModal';
import DataIntegrationModal from './components/DataIntegrationModal';
import AIDoctorModal from './components/AIDoctorModal';
import NasaRiskDrawer from './components/NasaRiskDrawer';
import OpticalRPPGScannerModal from './components/OpticalRPPGScannerModal';
import GeneralMedicalDossierModal from './components/GeneralMedicalDossierModal';
import { CREW_MEMBERS } from './data/nasaHealthData';
import {
  ShieldAlert,
  Activity,
  Heart,
  Bot,
  Radio,
  Cpu,
  Sparkles,
  Tv,
  Lock,
  LogOut,
  UserCheck,
  Shield,
  Dna,
  Mic,
  Globe,
} from 'lucide-react';
import { cockpitAudio } from './utils/audioAlert';

export default function App() {
  const [crew, setCrew] = useState(CREW_MEMBERS);
  const [activeCrewId, setActiveCrewId] = useState('crew-02'); // Abebe Worku
  const [authenticatedCrewId, setAuthenticatedCrewId] = useState('crew-02'); // Abebe Worku default authenticated
  const [activeQuarterTab, setActiveQuarterTab] = useState('biometrics'); // 'biometrics' | 'cardiac' | 'digital-twin' | 'ai-doctor' | 'comms-science'
  const [isAnomalyActive, setIsAnomalyActive] = useState(false);
  const [isAIDocOpen, setIsAIDocOpen] = useState(false);
  const [isNasaRiskOpen, setIsNasaRiskOpen] = useState(false);
  const [isDataIntegrationOpen, setIsDataIntegrationOpen] = useState(false);
  const [isPitchWalkthroughOpen, setIsPitchWalkthroughOpen] = useState(false);
  const [isRPPGOpen, setIsRPPGOpen] = useState(false);
  const [isMedicalDossierOpen, setIsMedicalDossierOpen] = useState(false);

  // Hash-based Full Page Router: Default to NASA Biometric Security Gate ('login') for authentic aerospace privacy
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#/', '');
    const validPages = ['cockpit', 'quarters', 'genomics', 'voice-triage', 'ai-doctor', 'comms-science', 'earth-roadmap', 'login'];
    return validPages.includes(hash) ? hash : 'login';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      const validPages = ['cockpit', 'quarters', 'genomics', 'voice-triage', 'ai-doctor', 'comms-science', 'earth-roadmap', 'login'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (pageId) => {
    window.location.hash = `#/${pageId}`;
    setCurrentPage(pageId);
    cockpitAudio.playBlip();
  };

  const activeCrew = crew.find((c) => c.id === activeCrewId) || crew[0];
  const authenticatedCrew = crew.find((c) => c.id === authenticatedCrewId);

  const handleToggleAnomaly = () => {
    setIsAnomalyActive((prev) => !prev);
  };

  const handleApplyCustomTelemetry = (customData) => {
    setCrew((prevCrew) =>
      prevCrew.map((c) => {
        if (c.id === activeCrewId) {
          return {
            ...c,
            sansScore: customData.sans ?? c.sansScore,
            status: customData.bpm > 115 || (customData.sans && customData.sans > 70) ? 'ELEVATED' : c.status,
            vitals: {
              ...c.vitals,
              heartRate: customData.bpm ?? c.vitals.heartRate,
              bpm: customData.bpm ?? c.vitals.bpm,
              spo2: customData.spo2 ?? c.vitals.spo2,
            },
          };
        }
        return c;
      })
    );
    cockpitAudio.playHeartbeat();
  };

  // Navigation Pages Definition (Optimized concise labels for 100% all-screen visibility with zero truncation)
  const NAV_PAGES = [
    { id: 'cockpit', label: 'Cockpit Deck', icon: Tv, badge: 'Shared Bridge' },
    { id: 'quarters', label: 'Crew Quarters', icon: Lock, badge: 'In-Vivo Suite' },
    { id: 'genomics', label: 'DNA Radiation', icon: Dna, badge: 'NASA GeneLab' },
    { id: 'voice-triage', label: 'Voice Triage', icon: Mic, badge: 'Acoustic FFT' },
    { id: 'ai-doctor', label: 'Dr. BEKUR-AI', icon: Bot, badge: '96.4% Accuracy' },
    { id: 'earth-roadmap', label: 'Earth & Roadmap', icon: Globe, badge: 'Dual-Use & TRL 7' },
    { id: 'comms-science', label: 'DSN Comms', icon: Radio, badge: 'Deep Space' },
  ];

  // Sub-tabs inside Crew Quarters
  const quarterTabs = [
    { id: 'biometrics', label: '3D In-Vivo Biometrics', icon: Activity, badge: 'Gender Adaptive' },
    { id: 'cardiac', label: 'Lead-II Cardiac Vector', icon: Heart, badge: '25mm/s Sweep' },
    { id: 'digital-twin', label: '72h Digital Twin Lab', icon: Cpu, badge: 'Prognostic Novelty' },
    { id: 'ai-doctor', label: 'Dr. BEKUR-AI Clinic', icon: Bot, badge: '3D Hologram CMO' },
    { id: 'comms-science', label: 'DSN Comms & NASA Science', icon: Radio, badge: 'Store & Fwd' },
  ];

  return (
    <div className="min-h-screen p-2.5 sm:p-4 lg:p-6 w-full max-w-[1720px] mx-auto flex flex-col justify-between selection:bg-hud-cyan selection:text-space-950">
      <div className="space-y-6">
        {/* Master Mission Header */}
        <MissionHeader
          onTriggerAnomaly={handleToggleAnomaly}
          isAnomalyActive={isAnomalyActive}
          onOpenAIDoc={() => navigateTo('ai-doctor')}
          onOpenNasaEvidence={() => navigateTo('comms-science')}
          onOpenDataIntegration={() => setIsDataIntegrationOpen(true)}
          onOpenPitchWalkthrough={() => setIsPitchWalkthroughOpen(true)}
          onOpenRPPG={() => setIsRPPGOpen(true)}
          onOpenMedicalDossier={() => setIsMedicalDossierOpen(true)}
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
              onClick={() => navigateTo('ai-doctor')}
              className="px-4 py-2 bg-hud-rose hover:bg-hud-rose/80 text-white font-mono font-bold text-xs rounded-xl uppercase tracking-wider shrink-0 transition shadow-lg shadow-hud-rose/40"
            >
              LAUNCH DR. BEKUR-AI TRIAGE
            </button>
          </div>
        )}

        {/* TOP-LEVEL ENTERPRISE NAVIGATION HUB (All-Screen Full-Width Responsive Navigation) */}
        <nav aria-label="Aerospace Navigation Deck" className="p-1 sm:p-1.5 rounded-2xl bg-space-900/90 border border-hud-cyan/30 shadow-2xl backdrop-blur-xl flex items-center gap-1 sm:gap-1.5 overflow-x-auto font-mono scrollbar-none">
          {NAV_PAGES.map((page) => {
            const Icon = page.icon;
            const isCurrent = currentPage === page.id;
            return (
              <button
                key={page.id}
                onClick={() => navigateTo(page.id)}
                className={`flex-1 shrink-0 md:shrink flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2.5 rounded-xl font-orbitron text-[11px] sm:text-xs font-bold tracking-wider transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-hud-cyan text-space-950 shadow-lg shadow-hud-cyan/30 scale-[1.01]'
                    : 'text-slate-400 hover:text-white hover:bg-space-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isCurrent ? 'text-space-950' : 'text-hud-cyan'}`} />
                <span className="whitespace-nowrap font-bold">{page.label}</span>
                <span
                  className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase hidden xl:inline-block ${
                    isCurrent ? 'bg-space-950/20 text-space-950 font-bold' : 'bg-space-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {page.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ================= PAGE ROUTING VIEWPORTS ================= */}

        {/* 1. COCKPIT BRIDGE DISPLAY PAGE (Shared 4-Crew Wall Screen) */}
        {currentPage === 'cockpit' && (
          <SquadronCockpitDeck
            crew={crew}
            activeCrewId={activeCrewId}
            onSelectCrew={(id) => {
              setActiveCrewId(id);
              setAuthenticatedCrewId(id);
              navigateTo('quarters');
            }}
            onOpenSoloConsole={() => navigateTo('quarters')}
            isEmergencyActive={isAnomalyActive}
          />
        )}

        {/* 2. CREW QUARTERS PRIVATE SUITE PAGE (NASA 14 CFR § 1213 Enclave) */}
        {currentPage === 'quarters' && (
          <>
            {!authenticatedCrewId ? (
              <BiometricLoginGate
                crew={crew}
                onAuthenticate={(id) => {
                  setAuthenticatedCrewId(id);
                  setActiveCrewId(id);
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* Confidential Astronaut Session Banner */}
                <div className="p-3 sm:p-4 rounded-2xl bg-space-900/90 border border-hud-cyan/40 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-hud-cyan text-space-950 flex items-center justify-center font-bold text-sm font-display">
                      {authenticatedCrew?.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-hud-cyan uppercase font-bold tracking-wider">
                          AUTHENTICATED PRIVATE ENCLAVE:
                        </span>
                        <span className="font-orbitron font-bold text-sm text-white">
                          {authenticatedCrew?.name} ({authenticatedCrew?.callsign})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">
                        Clearance: <span className="text-emerald-400 font-bold">NASA-COSMIC LEVEL-4</span> • In-Flight Private Quarters (CQ-2) • AES-256 Encrypted
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateTo('cockpit')}
                      className="px-3 py-1.5 rounded-xl bg-space-950 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5"
                    >
                      <Tv className="w-3.5 h-3.5 text-hud-cyan" />
                      <span>COCKPIT BRIDGE</span>
                    </button>
                    <button
                      onClick={() => {
                        cockpitAudio.playBlip();
                        setAuthenticatedCrewId(null);
                        navigateTo('login');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-hud-rose/20 border border-hud-rose/50 text-hud-rose hover:bg-hud-rose/30 text-xs font-mono font-bold transition flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>LOCK TERMINAL</span>
                    </button>
                  </div>
                </div>

                {/* Multi-Astronaut Selector Bar */}
                <CrewSelector
                  crew={crew}
                  activeCrewId={activeCrewId}
                  onSelectCrew={(id) => {
                    setActiveCrewId(id);
                    setAuthenticatedCrewId(id);
                  }}
                  isAnomalyActive={isAnomalyActive}
                />

                {/* Sub-Tabs Bar inside Private Quarters */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-space-900/90 border border-hud-cyan/25 backdrop-blur-md overflow-x-auto shadow-xl">
                  {quarterTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeQuarterTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveQuarterTab(tab.id);
                          cockpitAudio.playBlip();
                        }}
                        className={`flex-1 shrink-0 flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl font-orbitron text-xs font-bold tracking-wider transition-all whitespace-nowrap ${
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

                {/* Quarters Tab Views */}
                <main className="transition-all duration-300">
                  {activeQuarterTab === 'biometrics' && (
                    <BiometricsTab
                      crew={crew}
                      activeCrew={activeCrew}
                      onSelectCrew={setActiveCrewId}
                      isEmergencyActive={isAnomalyActive}
                    />
                  )}

                  {activeQuarterTab === 'cardiac' && (
                    <CardiacTab
                      activeCrew={activeCrew}
                      isEmergencyActive={isAnomalyActive}
                    />
                  )}

                  {activeQuarterTab === 'digital-twin' && (
                    <DigitalTwinSimulator
                      activeCrew={activeCrew}
                      isEmergencyActive={isAnomalyActive}
                    />
                  )}

                  {activeQuarterTab === 'ai-doctor' && (
                    <DrBekurAITab
                      activeCrew={activeCrew}
                      isEmergencyActive={isAnomalyActive}
                      onTriggerEmergency={handleToggleAnomaly}
                    />
                  )}

                  {activeQuarterTab === 'comms-science' && (
                    <CommsScienceTab
                      isEmergencyActive={isAnomalyActive}
                    />
                  )}
                </main>
              </div>
            )}
          </>
        )}

        {/* 3. DEDICATED FULL-PAGE NASA GENELAB DNA RADIATION SUITE */}
        {currentPage === 'genomics' && (
          <GenomicDnaRadiationSuite
            activeCrew={activeCrew}
            isEmergencyActive={isAnomalyActive}
          />
        )}

        {/* 4. DEDICATED FULL-PAGE ACOUSTIC VOICE STRESS & HYPOXIA SUITE */}
        {currentPage === 'voice-triage' && (
          <AcousticVoiceTriageSuite
            activeCrew={activeCrew}
            isEmergencyActive={isAnomalyActive}
            onOpenMedicalDossier={() => setIsMedicalDossierOpen(true)}
            onOpenRPPG={() => setIsRPPGOpen(true)}
          />
        )}

        {/* 5. DEDICATED FULL-PAGE DR. BEKUR-AI CHIEF MEDICAL OFFICER */}
        {currentPage === 'ai-doctor' && (
          <DrBekurAITab
            activeCrew={activeCrew}
            isEmergencyActive={isAnomalyActive}
            onTriggerEmergency={handleToggleAnomaly}
            onOpenMedicalDossier={() => setIsMedicalDossierOpen(true)}
          />
        )}

        {/* 6. DEDICATED FULL-PAGE EARTH IMPACT & TRL ROADMAP */}
        {currentPage === 'earth-roadmap' && (
          <EarthImpactRoadmapSuite />
        )}

        {/* 7. DEDICATED FULL-PAGE DSN COMMS & NASA EVIDENCE */}
        {currentPage === 'comms-science' && (
          <CommsScienceTab
            isEmergencyActive={isAnomalyActive}
          />
        )}

        {/* 8. DEDICATED FULL-PAGE BIOMETRIC LOGIN ENCLAVE */}
        {currentPage === 'login' && (
          <BiometricLoginGate
            crew={crew}
            onAuthenticate={(id) => {
              setAuthenticatedCrewId(id);
              setActiveCrewId(id);
              navigateTo('cockpit');
            }}
          />
        )}
      </div>

      {/* Persistent Modals */}
      <AutoPitchWalkthroughModal
        isOpen={isPitchWalkthroughOpen}
        onClose={() => setIsPitchWalkthroughOpen(false)}
        onNavigate={navigateTo}
      />
      <DataIntegrationModal
        isOpen={isDataIntegrationOpen}
        onClose={() => setIsDataIntegrationOpen(false)}
        onApplyCustomTelemetry={handleApplyCustomTelemetry}
        onOpenRPPG={() => setIsRPPGOpen(true)}
      />
      <AIDoctorModal
        isOpen={isAIDocOpen}
        onClose={() => setIsAIDocOpen(false)}
        activeCrew={activeCrew}
        isAnomalyActive={isAnomalyActive}
      />
      <NasaRiskDrawer
        isOpen={isNasaRiskOpen}
        onClose={() => setIsNasaRiskOpen(false)}
      />
      <OpticalRPPGScannerModal
        isOpen={isRPPGOpen}
        onClose={() => setIsRPPGOpen(false)}
        activeCrew={activeCrew}
        onApplyPulse={handleApplyCustomTelemetry}
      />
      <GeneralMedicalDossierModal
        isOpen={isMedicalDossierOpen}
        onClose={() => setIsMedicalDossierOpen(false)}
        crew={crew}
        activeCrew={activeCrew}
        isEmergencyActive={isAnomalyActive}
      />
    </div>
  );
}
