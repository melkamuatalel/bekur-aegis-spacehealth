import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  X,
  CheckCircle2,
  AlertOctagon,
  Radio,
  Activity,
  ShieldCheck,
  ChevronRight,
  WifiOff,
  Heart,
  Eye,
  Bot,
  Zap,
} from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function JudgeGuidedTourModal({
  isOpen,
  onClose,
  onTriggerAnomaly,
  onOpenAIDoc,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSimulatingBlackout, setIsSimulatingBlackout] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsSimulatingBlackout(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const STEPS = [
    {
      step: 1,
      title: 'STAGE 1: NOMINAL SQUADRON TELEMETRY INGEST',
      subtitle: 'Cruise Baseline • ARES-V Sol 142 • 78.4M km from Earth',
      badge: 'NOMINAL BASELINE',
      badgeColor: 'text-emerald-400 bg-emerald-950 border-emerald-500/40',
      description:
        'Astronaut telemetry streams at nominal cruise parameters. Multi-organ biometrics confirm stable 72 BPM resting cardiac rhythm, 98.4% cabin oxygenation, and nominal 4.8mm optic sheath diameter.',
      actionNote: 'Notice the clear UI labels separating LIVE BLE HARDWARE from FLIGHT BENCHMARK DATA.',
    },
    {
      step: 2,
      title: 'STAGE 2: SPEED-OF-LIGHT COMMS BLACKOUT (+4m 21s DELAY)',
      subtitle: 'Earth Telemedicine Disconnected • Autonomous Edge Active',
      badge: 'COMMS LAG ACTIVE',
      badgeColor: 'text-amber-400 bg-amber-950 border-amber-500/40',
      description:
        'One-way radio transmission to Houston takes +04m 21s (8m 42s round-trip). Real-time ground intervention is physically impossible. BEKUR-Aegis switches to 100% offline edge autonomy with localized telemetry buffering.',
      actionNote: 'Zero cloud dependency: All DSP pipelines, 3D Canvas visualizers, and AI inference execute strictly on-device.',
    },
    {
      step: 3,
      title: 'STAGE 3: ACUTE POST-EVA ANOMALY & SANS ELEVATION',
      subtitle: 'Apollo 16 PVC Ectopy & SANS ICP Spike Detected',
      badge: 'MASTER ALARM ANOMALY',
      badgeColor: 'text-hud-rose bg-rose-950 border-rose-500/40',
      description:
        'During pilot Abebe Worku’s post-EVA recovery, sympathetic vocal jitter spikes to 5.8% and Lead-II ECG registers hypokalemic PVC bursts. Intracranial pressure rises, expanding optic sheath diameter to 5.8mm (SANS Risk Grade 2).',
      actionNote: 'Master Emergency Anomaly Klaxon sounds autonomously. Clinical reason logged: "Lead-II PVC ectopy + vocal tract micro-tremor".',
    },
    {
      step: 4,
      title: 'STAGE 4: DR. BEKUR-AI AUTONOMOUS CLINICAL INTERVENTION',
      subtitle: 'NASA-STD-3001 Prescriptions & Preemptive Countermeasures',
      badge: 'COUNTERMEASURES ACTIVE',
      badgeColor: 'text-hud-cyan bg-cyan-950 border-cyan-500/40',
      description:
        'Dr. BEKUR-AI evaluates the telemetry in 42ms offline and prescribes immediate clinical protocols: 20 mEq oral potassium citrate, 30 minutes Lower-Body Negative Pressure (LBNP) to pull venous blood caudal, and laryngeal respiration pacing.',
      actionNote: 'The 72-Hour Digital Twin confirms SANS optic edema halts and stroke volume returns to nominal within 12 hours.',
    },
  ];

  const currentStage = STEPS[currentStep - 1];

  const handleNextStep = () => {
    cockpitAudio.playBlip();
    if (currentStep < 4) {
      const next = currentStep + 1;
      setCurrentStep(next);

      if (next === 2) {
        setIsSimulatingBlackout(true);
      } else if (next === 3) {
        cockpitAudio.playWarningAlarm();
        if (onTriggerAnomaly) onTriggerAnomaly();
      }
    } else {
      // Completed tour
      onClose();
    }
  };

  const handleResetTour = () => {
    cockpitAudio.playBlip();
    setCurrentStep(1);
    setIsSimulatingBlackout(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-space-950/85 backdrop-blur-xl animate-fadeIn font-mono">
      <div className="relative w-full max-w-3xl rounded-3xl bg-space-900 border border-hud-cyan shadow-2xl overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-space-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-hud-cyan/15 border border-hud-cyan/40 text-hud-cyan">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-orbitron font-extrabold text-sm sm:text-base text-white tracking-wider">
                  RUN MISSION DEMO: 60-SEC JUDGE GUIDED TOUR
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded bg-hud-cyan/20 border border-hud-cyan/40 text-hud-cyan font-bold uppercase">
                  1-CLICK EVALUATION
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Experience the complete sensor-to-countermeasure flight scenario with zero login or device setup required.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              cockpitAudio.playBlip();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper Bar */}
        <div className="px-6 py-3 bg-space-950/90 border-b border-slate-800 flex items-center justify-between gap-2">
          {STEPS.map((s) => {
            const isDone = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            return (
              <div key={s.step} className="flex-1 flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-orbitron font-bold text-xs transition ${
                    isCurrent
                      ? 'bg-hud-cyan text-space-950 shadow-lg shadow-hud-cyan/30'
                      : isDone
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                      : 'bg-space-900 border border-slate-800 text-slate-500'
                  }`}
                >
                  {isDone ? '✓' : s.step}
                </div>
                <div className="hidden sm:block flex-1">
                  <div className={`h-1 rounded-full ${isDone ? 'bg-emerald-500' : isCurrent ? 'bg-hud-cyan' : 'bg-slate-800'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Stage Content Card */}
        <div className="p-6 space-y-5 text-slate-300 font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">
                STAGE {currentStage.step} OF 4
              </span>
              <h4 className="font-orbitron font-bold text-base text-white mt-0.5">
                {currentStage.title}
              </h4>
              <span className="text-xs text-hud-cyan font-mono">{currentStage.subtitle}</span>
            </div>
            <span className={`text-[10px] px-2.5 py-1 rounded-lg border font-mono font-bold uppercase ${currentStage.badgeColor}`}>
              {currentStage.badge}
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {currentStage.description}
          </p>

          <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-3 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4 text-hud-cyan shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-bold block">JUDGE VERIFICATION NOTE:</span>
              <span className="text-slate-400 font-sans mt-0.5 block">{currentStage.actionNote}</span>
            </div>
          </div>

          {/* Interactive Stage Previews */}
          {currentStep === 1 && (
            <div className="grid grid-cols-4 gap-2 font-mono text-center text-xs">
              <div className="p-2.5 rounded-xl bg-space-950 border border-slate-800">
                <span className="text-[9px] text-slate-500 block">HEART RATE</span>
                <span className="font-bold text-white text-sm">72 BPM</span>
                <span className="text-[9px] text-emerald-400 block">Live Sinus Rhythm</span>
              </div>
              <div className="p-2.5 rounded-xl bg-space-950 border border-slate-800">
                <span className="text-[9px] text-slate-500 block">SPO2</span>
                <span className="font-bold text-white text-sm">98.4%</span>
                <span className="text-[9px] text-slate-400 block">Cockpit Standard</span>
              </div>
              <div className="p-2.5 rounded-xl bg-space-950 border border-slate-800">
                <span className="text-[9px] text-slate-500 block">OPTIC SHEATH</span>
                <span className="font-bold text-emerald-400 text-sm">4.8 mm</span>
                <span className="text-[9px] text-slate-400 block">Nominal Baseline</span>
              </div>
              <div className="p-2.5 rounded-xl bg-space-950 border border-slate-800">
                <span className="text-[9px] text-slate-500 block">OFFLINE EDGE</span>
                <span className="font-bold text-hud-cyan text-sm">READY</span>
                <span className="text-[9px] text-slate-400 block">Zero Cloud Dep.</span>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2 text-amber-300">
                <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>DEEP-SPACE RADIO LAG ACTIVE (+04m 21s)</span>
              </div>
              <span className="text-[10px] text-slate-400">All telemetry handled by local spacecraft avionics</span>
            </div>
          )}

          {currentStep === 3 && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-rose-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-hud-rose" />
                  CRITICAL SANS & CARDIAC ANOMALY TRIGGERED
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-rose-900 text-white animate-pulse">
                  ALARM SOUNDING
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1 border-t border-rose-900/60">
                <div>
                  <span className="text-slate-400 block">LEAD-II ECG</span>
                  <span className="font-bold text-hud-rose">PVC Ectopy Bursts</span>
                </div>
                <div>
                  <span className="text-slate-400 block">VOCAL JITTER</span>
                  <span className="font-bold text-hud-rose">5.8% (Strain)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">SANS ONSD</span>
                  <span className="font-bold text-amber-400">5.8 mm (Grade 2)</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  DR. BEKUR-AI AUTONOMOUS COUNTERMEASURES ENGAGED
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-200">
                  42ms INFERENCE
                </span>
              </div>
              <ul className="space-y-1 text-slate-300 font-sans text-xs pt-1 border-t border-emerald-900/60">
                <li>✓ Oral potassium citrate 20 mEq for post-EVA arrhythmia resolution</li>
                <li>✓ 30-minute Lower-Body Negative Pressure (LBNP) to reverse optic edema</li>
                <li>✓ 72-Hour Digital Twin confirms stroke volume recovery trajectory</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-space-950 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
          <button
            onClick={handleResetTour}
            className="px-3 py-1.5 rounded-xl bg-space-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition text-[11px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESTART TOUR</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                cockpitAudio.playBlip();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white transition"
            >
              EXIT
            </button>
            <button
              onClick={handleNextStep}
              className="px-5 py-2 rounded-xl bg-hud-cyan text-space-950 font-black hover:bg-hud-cyan/90 transition flex items-center gap-1.5 shadow-lg shadow-hud-cyan/20"
            >
              <span>{currentStep === 4 ? 'FINISH DEMO' : 'NEXT STAGE'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
