import React, { useState } from 'react';
import {
  FileText,
  Printer,
  FileDown,
  X,
  ShieldCheck,
  Heart,
  Eye,
  Dna,
  Mic,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Radio,
  Copy,
  Check,
  Code,
} from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function GeneralMedicalDossierModal({
  isOpen,
  onClose,
  crew,
  activeCrew,
  isEmergencyActive,
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    cockpitAudio.playBlip();
    window.print();
  };

  const getDossierObject = () => ({
    mission: 'ARES-V / Mars Transit Vehicle (MTV-1)',
    missionSol: 142,
    totalMissionDays: 520,
    timestamp: new Date().toISOString(),
    distanceFromEarthKm: 78450200,
    lightSpeedCommsDelay: '04m 21s',
    flightSurgeonCertification: 'NASA-STD-3001 Vol 1 § 4.3 // Autonomous Space Medicine',
    squadronReadinessPercent: 89.8,
    crewStatus: crew.map((c) => ({
      id: c.id,
      name: c.name,
      role: c.role,
      healthScore: c.overallHealthScore,
      bpm: c.vitals?.bpm || 72,
      spo2: c.vitals?.spo2 || 98.4,
      bloodPressure: `${c.vitals?.bloodPressureSys || 120}/${c.vitals?.bloodPressureDia || 80}`,
      sansScore: c.sansScore || 30,
    })),
    systemsEvaluation: {
      cardiovascularLeadII: 'Refractory sinus rhythm with microgravity stroke volume reduction (-8%). Pacing protocol active for Abebe Worku.',
      neuroOcularSANS: 'Optic nerve sheath diameter (ONSD) monitored at 5.8mm. Mild posterior globe flattening. Grade 1-2 SANS management nominal.',
      genomicRadiation: 'Cumulative mission dose 148.6 mSv (NASA career threshold: 600.0 mSv). GeneLab GLDS-242 DSB repair pathway intact.',
      acousticVoiceTriage: 'Vocal tract acoustic jitter (< 1.2% nominal baseline). Airway restriction negative. Real-time stress inference validated.',
      contactlessOpticalRPPG: 'Facial capillary green-channel photoplethysmography active at 530nm. Real-time optical pulse verified without skin contact.',
    },
    flightSurgeonSignOff: {
      certifyingAuthority: 'Dr. BEKUR-AI Autonomous Flight Surgeon & CMO',
      missionClearance: 'PROVISIONAL FLIGHT DUTY CLEARANCE GRANTED',
      mandatoryCountermeasures: [
        'Daily 2.5-hour ARED high-load deadlifts and cycle ergometer',
        'Lower-Body Negative Pressure (LBNP) 30 min prior to sleep cycle',
        'Forced 2.5L/day hydration with 20 mEq potassium citrate alkalization',
      ],
    },
  });

  const copyTextToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setIsCopied(true);
        })
        .catch(() => {
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
    } catch (err) {
      console.warn('Fallback copy failed', err);
    }
  };

  const handleExportJson = () => {
    cockpitAudio.playSuccess();
    const flightDossier = getDossierObject();
    const jsonStr = JSON.stringify(flightDossier, null, 2);

    // 1. Copy to clipboard
    copyTextToClipboard(jsonStr);

    // 2. Blob file download
    try {
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'NASA_ARES_V_General_Flight_Medical_Dossier_Sol142.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 500);
    } catch (_) {
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonStr);
      window.open(dataUri, '_blank');
    }

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 4000);
  };

  const handleCopyOnly = () => {
    cockpitAudio.playSuccess();
    const jsonStr = JSON.stringify(getDossierObject(), null, 2);
    copyTextToClipboard(jsonStr);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-space-950/85 backdrop-blur-xl animate-fadeIn font-mono">
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-space-900 border border-hud-cyan/50 shadow-2xl overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-space-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-hud-cyan/15 border border-hud-cyan/40 text-hud-cyan">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-orbitron font-extrabold text-sm sm:text-base text-white tracking-wider">
                  NASA FLIGHT SURGEON COMPREHENSIVE MEDICAL DOSSIER
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded bg-hud-cyan/20 border border-hud-cyan/40 text-hud-cyan font-bold uppercase">
                  SOL 142 GENERAL CLINICAL EVALUATION
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Unified Aerospace Clinical Health Record • NASA-STD-3001 Vol 1 & 2 Compliant • Edge Autonomous Generation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Report Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-300 font-sans">
          {/* Mission Executive Summary */}
          <div className="p-4 rounded-2xl bg-space-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">MISSION</span>
              <span className="font-bold text-white text-sm">ARES-V / MTV-1</span>
              <span className="text-[10px] text-hud-cyan block">Mars Hohmann Arc</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">DISTANCE / COMMS</span>
              <span className="font-bold text-white text-sm">78.45 M km</span>
              <span className="text-[10px] text-amber-400 block">+4m 21s 1-Way Latency</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">CREW READINESS</span>
              <span className="font-bold text-hud-emerald text-sm">89.8% NOMINAL</span>
              <span className="text-[10px] text-slate-400 block">4 Astronauts Active</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">FLIGHT SURGEON</span>
              <span className="font-bold text-hud-cyan text-sm">Dr. BEKUR-AI</span>
              <span className="text-[10px] text-emerald-400 block">Autonomous Edge CMO</span>
            </div>
          </div>

          {/* Squadron 4-Astronaut Telemetry Grid */}
          <div className="space-y-2">
            <h4 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-hud-cyan" />
              SQUADRON CREW BIOMETRIC ROSTER
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {crew.map((c) => {
                const isSelected = c.id === activeCrew.id;
                const isElevated = c.status === 'ELEVATED' || isEmergencyActive;
                return (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-xl border transition ${
                      isSelected
                        ? 'bg-space-950 border-hud-cyan/60 shadow-lg'
                        : 'bg-space-950/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                      <div>
                        <span className="font-orbitron font-bold text-white text-xs block">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{c.role}</span>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${
                          isElevated
                            ? 'bg-rose-950 text-hud-rose border border-rose-500/40'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {isElevated ? 'ELEVATED RISK' : 'NOMINAL 94%'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
                      <div>
                        <span className="text-[9px] text-slate-500 block">HEART</span>
                        <span className="font-bold text-white">{c.vitals.bpm} BPM</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block">SPO2</span>
                        <span className="font-bold text-white">{c.vitals.spo2}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block">BLOOD PRESS.</span>
                        <span className="font-bold text-white">
                          {c.vitals.bloodPressureSys}/{c.vitals.bloodPressureDia}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block">SANS INDEX</span>
                        <span className={`font-bold ${c.sansScore > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {c.sansScore}/100
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subsystems Comprehensive Clinical Findings */}
          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              PHYSIOLOGICAL SUBSYSTEM EVALUATION & COUNTERMEASURES
            </h4>

            <div className="space-y-2 font-mono text-xs">
              {/* Cardiac */}
              <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-3">
                <Heart className="w-4 h-4 text-hud-rose shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">1. CARDIOVASCULAR & LEAD-II ECG DYNAMICS</span>
                  <p className="text-slate-400 font-sans text-xs mt-0.5 leading-relaxed">
                    Microgravity cephalad fluid shift induces an initial 10-15% reduction in left ventricular stroke volume. Lead-II telemetry verifies sinus rhythm. Flight pilot Abebe Worku exhibits transient post-EVA PVC bursts, addressed with oral electrolyte replenishment and autonomic pacing.
                  </p>
                </div>
              </div>

              {/* SANS */}
              <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-3">
                <Eye className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">2. NEURO-OCULAR & SANS INTRACRANIAL PRESSURE</span>
                  <p className="text-slate-400 font-sans text-xs mt-0.5 leading-relaxed">
                    Longitudinal optic nerve sheath diameter (ONSD) telemetry recorded at 5.8mm (baseline 4.8mm) in pilot Worku. Posterior globe flattening and choroidal folds detected. Prescription: 30 minutes daily Lower-Body Negative Pressure (LBNP) to pull venous blood caudal and relieve optic disc edema.
                  </p>
                </div>
              </div>

              {/* Radiation & DNA */}
              <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-3">
                <Dna className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">3. GENOMIC INTEGRITY & GALACTIC COSMIC RAY (GCR) DOSIMETRY</span>
                  <p className="text-slate-400 font-sans text-xs mt-0.5 leading-relaxed">
                    Cumulative radiation absorbed dose: 148.6 mSv (well below the 600.0 mSv NASA lifetime career limit). NASA GeneLab GLDS-242 genomic markers demonstrate active homologous recombination and non-homologous end-joining (NHEJ) DNA repair kinetics. Zero acute radiation syndrome risk.
                  </p>
                </div>
              </div>

              {/* Acoustic Voice Triage */}
              <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-3">
                <Mic className="w-4 h-4 text-hud-cyan shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">4. ACOUSTIC VOICE STRESS & HYPOXIA SPECTROMETRY</span>
                  <p className="text-slate-400 font-sans text-xs mt-0.5 leading-relaxed">
                    Autonomous vocal tract spectral jitter analysis ($F_0$) confirmed at nominal thresholds (&lt; 1.2%). Voice harmonics confirm uninhibited upper airway airflow with zero hypobaric laryngeal edema. Provides a 15-minute lead indicator over standard pulse oximetry alarms during EVA maneuvers.
                  </p>
                </div>
              </div>

              {/* Contactless Camera rPPG */}
              <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-3">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">5. ZERO-CONTACT OPTICAL CAMERA rPPG VERIFICATION</span>
                  <p className="text-slate-400 font-sans text-xs mt-0.5 leading-relaxed">
                    Facial microvascular blood absorption (530 nm green channel) continuously estimates pulsatile hemodynamics with ±2.1 BPM accuracy. Completely eliminates the need for continuous sticky hydrogel chest patches during long-duration interplanetary cruise.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NASA Flight Surgeon Final Sign-Off & Seal */}
          <div className="p-4 rounded-2xl bg-space-950 border border-emerald-500/40 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-orbitron font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                OFFICIAL NASA FLIGHT SURGEON MEDICAL CERTIFICATION
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold">
                CLEARED FOR MISSION DUTY
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              "Based on autonomous multi-organ telemetry, 148.6 mSv cumulative dosimetry, and real-time behavioral acoustic voice triage, the ARES-V squadron is hereby certified medically fit for continued Sol 142 transit operations. Prescribed countermeasures: continuous ARED resistance protocol, LBNP sessions, and acoustic monitoring."
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              <span>Authority: Dr. BEKUR-AI Autonomous Edge CMO // NASA Johnson Space Center Flight Medicine</span>
              <span>Encrypted Hash: 0x8a94e...3b1f (SHA-256 Verified)</span>
            </div>
          </div>

          {/* Raw JSON In-App Preview Terminal (When toggled) */}
          {showJsonPreview && (
            <div className="p-4 rounded-2xl bg-space-950 border border-hud-cyan/40 space-y-2 animate-fadeIn font-mono">
              <div className="flex items-center justify-between text-xs text-hud-cyan font-bold">
                <span>NASA_ARES_V_FLIGHT_MEDICAL_DOSSIER.JSON</span>
                <button
                  onClick={handleCopyOnly}
                  className="px-2.5 py-1 rounded bg-hud-cyan text-space-950 text-[10px] font-bold flex items-center gap-1"
                >
                  {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'COPIED!' : 'COPY RAW JSON'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-space-900 border border-slate-800 text-[10px] text-slate-300 max-h-56 overflow-y-auto selection:bg-hud-cyan selection:text-space-950">
                {JSON.stringify(getDossierObject(), null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-space-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden lg:inline">
              NASA Space Apps Challenge 2026 // Team BEKUR
            </span>
            {isCopied && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" />
                <span>COPIED TO CLIPBOARD & DOWNLOAD TRIGGERED!</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                cockpitAudio.playBlip();
                setShowJsonPreview((prev) => !prev);
              }}
              className="px-3 py-2 rounded-xl bg-space-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJsonPreview ? 'HIDE RAW JSON' : 'VIEW RAW JSON'}</span>
            </button>

            <button
              onClick={handleCopyOnly}
              className="px-3 py-2 rounded-xl bg-space-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-hud-cyan" />}
              <span>{isCopied ? 'COPIED!' : 'COPY JSON'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-space-900 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 flex items-center gap-1.5 text-xs font-bold transition"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT / SAVE PDF</span>
            </button>

            <button
              onClick={handleExportJson}
              className="px-4 py-2 rounded-xl bg-hud-cyan text-space-950 hover:bg-hud-cyan/90 flex items-center gap-1.5 text-xs font-black transition shadow-lg shadow-hud-cyan/20"
            >
              <FileDown className="w-4 h-4" />
              <span>EXPORT CLINICAL JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}