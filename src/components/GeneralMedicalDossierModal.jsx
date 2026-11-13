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
  User,
  Lock,
  Users,
  Pill,
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
  const [selectedCrewId, setSelectedCrewId] = useState(activeCrew?.id || 'crew-02');
  const [viewMode, setViewMode] = useState('INDIVIDUAL'); // 'INDIVIDUAL' | 'SQUADRON'

  if (!isOpen) return null;

  const targetCrew = crew.find((c) => c.id === selectedCrewId) || activeCrew || crew[0];

  const INDIVIDUAL_DOSSIERS = {
    'crew-02': {
      // Abebe Worku
      cardio: 'Flight Pilot Worku exhibits transient post-EVA hypokalemic premature ventricular contractions (PVCs) correlating with Apollo 16 LSDA historical telemetry. Left ventricular stroke volume -12% due to cephalad fluid shift.',
      neuro: 'Longitudinal optic nerve sheath diameter (ONSD) measured at 5.8mm (baseline 4.8mm). Grade 2 SANS detected with optic disc edema and choroidal folds.',
      radiation: 'Absorbed dose: 148.6 mSv. Homologous recombination DNA repair active (NASA GeneLab GLDS-242 markers nominal).',
      voice: 'Acoustic jitter 1.4% with occasional EVA exertion micro-tremors. Airway resistance normal, zero hypobaric edema.',
      optical: 'Contactless rPPG green absorption active (76-88 BPM). Perfusion index 1.44%.',
      prescriptions: [
        'Oral potassium citrate 20 mEq twice daily for post-EVA PVC ectopy',
        'Daily 30-minute Lower-Body Negative Pressure (LBNP) to relieve intracranial venous congestion',
        'ARED resistance exercise: 2.5 hours daily mandatory loading',
        'Bi-weekly optical coherence tomography (OCT) retinal scan',
      ],
      clearance: 'CLEARED FOR PILOTING DUTIES UNDER ACTIVE SANS COUNTERMEASURES',
    },
    'crew-01': {
      // Dr. Sarah Lindqvist
      cardio: 'Sinus rhythm nominal at 68 BPM. Left ventricular mass preserved with excellent ARED high-load deadlift adherence.',
      neuro: 'Optic nerve sheath diameter stable at 4.6mm (within nominal 4.5-4.8mm baseline). Zero choroidal folds or posterior globe flattening.',
      radiation: 'Cumulative dose 142.1 mSv. Transcriptomic repair velocity 89% nominal.',
      voice: 'Exemplary executive acoustic stability. Jitter 0.78% (low sympathetic stress index 22%).',
      optical: 'Contactless rPPG confirms steady 68 BPM microvascular perfusion.',
      prescriptions: [
        'Standard 2.5-hour ARED cycle ergometer & deadlift regimen',
        'Vitamin D3 2000 IU + calcium citrate for bone density preservation',
        'Weekly command psychological check-in',
      ],
      clearance: 'FULL FLIGHT DUTY CLEARANCE // MISSION COMMAND READY',
    },
    'crew-03': {
      // Dr. Elena Rossi
      cardio: 'Athletic resting bradycardia at 64 BPM. Excellent vagal tone and heart rate variability (HRV RMSSD 58ms).',
      neuro: 'ONSD 4.5mm nominal. Zero intracranial pressure elevation observed.',
      radiation: 'Absorbed dose: 138.4 mSv. Endogenous antioxidant enzyme levels elevated.',
      voice: 'Nominal vocal harmonic resonance. Zero laryngeal strain or hypoxia markers.',
      optical: 'Passive capillary spectrometry locked at 64 BPM with 1.52% perfusion index.',
      prescriptions: [
        'Daily 2.0-hour cycle ergometer and resistive bungee loading',
        'Astrobiology glovebox ergonomic pacing to prevent repetitive strain',
        'Standard hydration protocol: 2.5L electrolyte water daily',
      ],
      clearance: 'FULL FLIGHT DUTY CLEARANCE // CHIEF MEDICAL OFFICER CERTIFIED',
    },
    'crew-04': {
      // Kenji Sato
      cardio: 'Resting pulse 72 BPM with robust autonomic cardiac output. Post-EVA recovery time nominal (sub-3 minutes).',
      neuro: 'ONSD 4.9mm (mild transient post-EVA fluid shift, resolves within 12 hours).',
      radiation: 'Cumulative dose 151.2 mSv (higher due to external EVA operations, within safety envelope).',
      voice: 'Slight voice tract fatigue post 6-hour EVA robotics sortie; recovers to 0.95% jitter.',
      optical: 'Silent ambient cockpit rPPG verified at 72 BPM.',
      prescriptions: [
        'EVA suit pressurization glove warmup and grip-torque recovery therapy',
        'Pre-EVA hyperoxia nitrogen washout protocol (100% O2 for 120 minutes)',
        'Daily 2.5-hour ARED cardiovascular and core muscle conditioning',
      ],
      clearance: 'FULL FLIGHT DUTY CLEARANCE // CERTIFIED FOR EXTRAVEHICULAR ACTIVITY',
    },
  };

  const targetDossier = INDIVIDUAL_DOSSIERS[targetCrew.id] || INDIVIDUAL_DOSSIERS['crew-02'];

  const handlePrint = () => {
    cockpitAudio.playBlip();
    window.print();
  };

  const getDossierObject = () => {
    if (viewMode === 'INDIVIDUAL') {
      const dossier = INDIVIDUAL_DOSSIERS[targetCrew.id] || INDIVIDUAL_DOSSIERS['crew-02'];
      return {
        classification: 'CONFIDENTIAL // NASA 14 CFR § 1213 CREW MEDICAL RECORD',
        privacyNotice: 'RESTRICTED TO ASTRONAUT & FLIGHT SURGEON. UNAUTHORIZED DISCLOSURE PROHIBITED.',
        mission: 'ARES-V / Mars Transit Vehicle (MTV-1)',
        missionSol: 142,
        timestamp: new Date().toISOString(),
        astronaut: {
          id: targetCrew.id,
          name: targetCrew.name,
          role: targetCrew.role,
          readinessScore: `${targetCrew.overallHealthScore}%`,
          assignedQuarters: `Module-0${targetCrew.id.split('-')[1]}`,
          vitals: {
            heartRate: `${targetCrew.vitals?.bpm || 72} BPM`,
            spo2: `${targetCrew.vitals?.spo2 || 98.4}%`,
            bloodPressure: `${targetCrew.vitals?.bloodPressureSys || 120}/${targetCrew.vitals?.bloodPressureDia || 80} mmHg`,
            sansIndex: `${targetCrew.sansScore || 30}/100`,
          },
        },
        clinicalEvaluations: {
          cardiovascularLeadII: dossier.cardio,
          neuroOcularSANS: dossier.neuro,
          genomicRadiation: dossier.radiation,
          acousticVoiceTriage: dossier.voice,
          contactlessOpticalRPPG: dossier.optical,
        },
        flightSurgeonSignOff: {
          certifyingAuthority: 'Dr. BEKUR-AI Autonomous Flight Surgeon & CMO',
          missionDutyStatus: dossier.clearance,
          mandatoryPrescriptions: dossier.prescriptions,
          cryptographicSignature: '0x8a94e...3b1f (SHA-256 Verified by NASA Flight Medicine)',
        },
      };
    } else {
      return {
        classification: 'SQUADRON MISSION OVERVIEW // COMMANDER BRIEFING',
        mission: 'ARES-V / Mars Transit Vehicle (MTV-1)',
        missionSol: 142,
        timestamp: new Date().toISOString(),
        squadronReadiness: '89.8% NOMINAL',
        activeCrewCount: crew.length,
        crewMembers: crew.map((c) => ({
          name: c.name,
          role: c.role,
          bpm: c.vitals?.bpm,
          spo2: c.vitals?.spo2,
          bp: `${c.vitals?.bloodPressureSys}/${c.vitals?.bloodPressureDia}`,
          sans: c.sansScore,
          status: c.status,
        })),
        flightSurgeonSummary: 'Squadron cleared for continued Sol 142 cruise under Dr. BEKUR-AI supervision.',
      };
    }
  };

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

    copyTextToClipboard(jsonStr);

    try {
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const fileName =
        viewMode === 'INDIVIDUAL'
          ? `NASA_Confidential_Medical_Record_${targetCrew.name.replace(/\s+/g, '_')}_Sol142.json`
          : 'NASA_Squadron_General_Flight_Medical_Dossier_Sol142.json';
      a.download = fileName;
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

        {/* Dossier Privacy & Mode Selector Navigation */}
        <div className="px-4 sm:px-6 py-2.5 bg-space-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                cockpitAudio.playBlip();
                setViewMode('INDIVIDUAL');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                viewMode === 'INDIVIDUAL'
                  ? 'bg-hud-cyan text-space-950 shadow-md shadow-hud-cyan/20'
                  : 'bg-space-900 border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>CONFIDENTIAL INDIVIDUAL DOSSIER</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                viewMode === 'INDIVIDUAL' ? 'bg-space-950/30 text-space-950' : 'bg-space-950 text-hud-cyan'
              }`}>
                NASA 14 CFR § 1213
              </span>
            </button>

            <button
              onClick={() => {
                cockpitAudio.playBlip();
                setViewMode('SQUADRON');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                viewMode === 'SQUADRON'
                  ? 'bg-hud-cyan text-space-950 shadow-md shadow-hud-cyan/20'
                  : 'bg-space-900 border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>SQUADRON FLEET OVERVIEW</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            {viewMode === 'INDIVIDUAL' ? (
              <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>RESTRICTED PRIVACY ENCLAVE: EYES-ONLY ASTRONAUT & CMO</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-space-900 border border-slate-700 text-hud-cyan font-bold flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>4 ASTRONAUTS SYNCHRONIZED</span>
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-300 font-sans">
          {viewMode === 'INDIVIDUAL' ? (
            <div className="space-y-4">
              {/* Astronaut Selector Pills */}
              <div className="p-3 rounded-2xl bg-space-950 border border-slate-800 space-y-2 font-mono">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 uppercase font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-hud-cyan" />
                    SELECT ASTRONAUT PATIENT DOSSIER:
                  </span>
                  <span className="text-hud-cyan font-bold">
                    PATIENT: {targetCrew.name.toUpperCase()} ({targetCrew.role})
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {crew.map((c) => {
                    const isSel = c.id === targetCrew.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          cockpitAudio.playBlip();
                          setSelectedCrewId(c.id);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                          isSel
                            ? 'bg-hud-cyan/15 border-hud-cyan text-white shadow-lg shadow-hud-cyan/10'
                            : 'bg-space-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-orbitron font-bold text-xs truncate">{c.name}</span>
                          {isSel && <div className="w-2 h-2 rounded-full bg-hud-cyan animate-pulse" />}
                        </div>
                        <span className="text-[10px] text-slate-400 truncate">{c.role}</span>
                        <div className="flex items-center justify-between pt-1 text-[10px] font-mono border-t border-slate-800">
                          <span className="text-hud-cyan">{c.vitals?.bpm || 72} BPM</span>
                          <span className={c.sansScore > 50 ? 'text-amber-400' : 'text-emerald-400'}>
                            SANS {c.sansScore || 20}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Patient Dossier Header Banner */}
              <div className="p-4 rounded-2xl bg-space-950 border border-hud-cyan/40 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-hud-cyan/15 border border-hud-cyan/50 flex items-center justify-center text-hud-cyan font-orbitron font-extrabold text-base">
                    {targetCrew.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-orbitron font-extrabold text-base text-white">
                        {targetCrew.name}
                      </h4>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-hud-cyan/20 border border-hud-cyan/50 text-hud-cyan font-bold uppercase">
                        {targetCrew.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Station: Module-0{targetCrew.id.split('-')[1]} • Dossier ID: NASA-14CFR-{targetCrew.id.toUpperCase()}-SOL142 • Chief Medical Officer Enclave
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-space-900 border border-slate-800">
                    <span className="text-[9px] text-slate-500 uppercase block">HEART RATE</span>
                    <span className="font-bold text-white text-xs sm:text-sm">{targetCrew.vitals?.bpm || 72} BPM</span>
                  </div>
                  <div className="p-2 rounded-xl bg-space-900 border border-slate-800">
                    <span className="text-[9px] text-slate-500 uppercase block">BLOOD PRESS.</span>
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {targetCrew.vitals?.bloodPressureSys || 120}/{targetCrew.vitals?.bloodPressureDia || 80}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-space-900 border border-slate-800">
                    <span className="text-[9px] text-slate-500 uppercase block">SANS SCORE</span>
                    <span className={`font-bold text-xs sm:text-sm ${targetCrew.sansScore > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {targetCrew.sansScore || 20}/100
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-space-900 border border-slate-800">
                    <span className="text-[9px] text-slate-500 uppercase block">READINESS</span>
                    <span className="font-bold text-emerald-400 text-xs sm:text-sm">{targetCrew.overallHealthScore || 94}%</span>
                  </div>
                </div>
              </div>

              {/* Subsystems Comprehensive Clinical Findings (Tailored per Astronaut) */}
              <div className="space-y-3">
                <h4 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    INDIVIDUAL CLINICAL EVALUATION: {targetCrew.name.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-hud-cyan font-mono">AUTONOMOUS EDGE CLINICAL AUDIT</span>
                </h4>

                <div className="space-y-2 font-mono text-xs">
                  {/* Cardiac */}
                  <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-3">
                    <Heart className="w-4 h-4 text-hud-rose shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">1. CARDIOVASCULAR & LEAD-II ECG DYNAMICS</span>
                      <p className="text-slate-300 font-sans text-xs mt-0.5 leading-relaxed">
                        {targetDossier.cardio}
                      </p>
                    </div>
                  </div>

                  {/* SANS */}
                  <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-3">
                    <Eye className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">2. NEURO-OCULAR & SANS INTRACRANIAL PRESSURE</span>
                      <p className="text-slate-300 font-sans text-xs mt-0.5 leading-relaxed">
                        {targetDossier.neuro}
                      </p>
                    </div>
                  </div>

                  {/* Radiation & DNA */}
                  <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-3">
                    <Dna className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">3. GENOMIC INTEGRITY & GALACTIC COSMIC RAY (GCR) DOSIMETRY</span>
                      <p className="text-slate-300 font-sans text-xs mt-0.5 leading-relaxed">
                        {targetDossier.radiation}
                      </p>
                    </div>
                  </div>

                  {/* Acoustic Voice Triage */}
                  <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-3">
                    <Mic className="w-4 h-4 text-hud-cyan shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">4. ACOUSTIC VOICE STRESS & HYPOXIA SPECTROMETRY</span>
                      <p className="text-slate-300 font-sans text-xs mt-0.5 leading-relaxed">
                        {targetDossier.voice}
                      </p>
                    </div>
                  </div>

                  {/* Contactless Camera rPPG */}
                  <div className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-3">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">5. ZERO-CONTACT OPTICAL CAMERA rPPG VERIFICATION</span>
                      <p className="text-slate-300 font-sans text-xs mt-0.5 leading-relaxed">
                        {targetDossier.optical}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mandatory Prescriptions & Countermeasures */}
              <div className="p-4 rounded-2xl bg-space-950 border border-hud-cyan/30 space-y-2.5 font-mono">
                <span className="text-xs font-orbitron font-bold text-hud-cyan flex items-center gap-2">
                  <Pill className="w-4 h-4 text-hud-cyan" />
                  MANDATORY COUNTERMEASURES & CLINICAL PRESCRIPTIONS ({targetCrew.name})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                  {targetDossier.prescriptions.map((rx, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-space-900 border border-slate-800 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-hud-cyan/20 text-hud-cyan flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <span className="text-slate-200 leading-snug">{rx}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NASA Flight Surgeon Certification */}
              <div className="p-4 rounded-2xl bg-space-950 border border-emerald-500/40 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-orbitron font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    OFFICIAL NASA FLIGHT SURGEON MEDICAL CERTIFICATION
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold uppercase">
                    {targetDossier.clearance}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  "Under NASA-STD-3001 spaceflight clinical protocols, astronaut {targetCrew.name} is evaluated by Dr. BEKUR-AI Autonomous CMO. Physiological biomarkers confirm mission duty readiness with mandatory compliance to prescribed countermeasures."
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 gap-1">
                  <span>Authority: Dr. BEKUR-AI Autonomous Edge CMO // NASA Johnson Space Center Flight Medicine</span>
                  <span>Encrypted Hash: 0x8a94e...3b1f (SHA-256 Verified)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
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
                    const isSelected = c.id === targetCrew.id;
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

              {/* Squadron Flight Surgeon Sign-Off */}
              <div className="p-4 rounded-2xl bg-space-950 border border-emerald-500/40 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-orbitron font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    SQUADRON FLEET MEDICAL CERTIFICATION
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold">
                    SQUADRON CLEARED
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  "Based on autonomous multi-organ telemetry, 148.6 mSv cumulative dosimetry, and real-time behavioral acoustic voice triage, the entire ARES-V squadron is hereby certified medically fit for continued Sol 142 transit operations."
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <span>Authority: Dr. BEKUR-AI Autonomous Edge CMO // NASA Johnson Space Center Flight Medicine</span>
                  <span>Encrypted Hash: 0x8a94e...3b1f (SHA-256 Verified)</span>
                </div>
              </div>
            </div>
          )}

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
              <span>
                EXPORT {viewMode === 'INDIVIDUAL' ? `${targetCrew.name.toUpperCase()} DOSSIER` : 'SQUADRON'} JSON
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}