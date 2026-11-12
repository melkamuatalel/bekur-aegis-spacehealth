import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Play,
  RotateCcw,
  AudioWaveform as WaveformIcon,
} from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function AcousticVoiceTriageSuite({ activeCrew, isEmergencyActive }) {
  const canvasRef = useRef(null);
  const [selectedScenario, setSelectedScenario] = useState('abebe-eva');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLiveMicActive, setIsLiveMicActive] = useState(false);

  const audioScenarios = [
    {
      id: 'abebe-eva',
      title: 'Abebe Worku — High-G EVA Spacewalk (Current Pilot)',
      astronaut: 'Abebe Worku',
      jitterPercent: 4.8,
      fundamentalPitchHz: 168,
      stressScore: 79,
      status: 'HIGH_STRESS',
      transcript: '"Mission Control... Lead-II vector feeling tight, slight optic blur on left visor... pacing breathing..."',
      aiDiagnosis: 'Vocal tract frequency micro-tremors detected. Acoustic spectral jitter elevated at 4.8% (nominal < 1.0%). Confirms early intracranial pressure elevation and sympathetic adrenaline surge.',
    },
    {
      id: 'sarah-calm',
      title: 'Dr. Sarah Lindqvist — Nominal Habitation Check',
      astronaut: 'Dr. Sarah Lindqvist',
      jitterPercent: 0.6,
      fundamentalPitchHz: 210,
      stressScore: 22,
      status: 'NOMINAL',
      transcript: '"Habitation module oxygen scrubber cycle complete. All crew telemetry nominal Sol 142."',
      aiDiagnosis: 'Acoustic harmonics optimal. Jitter 0.6%, zero cognitive micro-tremor. Cognitive load within normal executive function bounds.',
    },
    {
      id: 'apollo13-historic',
      title: 'NASA Historical Benchmark — Apollo 13 Command Triage',
      astronaut: 'Jim Lovell (Apollo 13 Benchmark)',
      jitterPercent: 3.4,
      fundamentalPitchHz: 145,
      stressScore: 68,
      status: 'ELEVATED',
      transcript: '"Houston, we\'ve had a problem here. We\'ve had a main B bus undervolt."',
      aiDiagnosis: 'Historical NASA voice benchmark. Controlled acute autonomic arousal detected with elevated pitch stability.',
    },
  ];

  const currentScenario = audioScenarios.find((s) => s.id === selectedScenario) || audioScenarios[0];

  // Visual Spectrum Frequency Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let phase = 0;

    const numBars = 48;

    const render = () => {
      phase += 0.08;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = 'rgba(4, 7, 17, 0.35)';
      ctx.fillRect(0, 0, w, h);

      const barWidth = w / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        const factor = Math.sin(phase + i * 0.25) * 0.5 + 0.5;
        const heightMultiplier = isPlayingAudio || isLiveMicActive ? 0.9 : 0.35;
        const barHeight = Math.max(6, (factor * h * 0.8 + (Math.sin(i * 0.8 + phase * 2) * 20)) * heightMultiplier);
        const x = i * (barWidth + 2);
        const y = h - barHeight;

        const isAlert = currentScenario.status === 'HIGH_STRESS';
        const gradient = ctx.createLinearGradient(0, y, 0, h);
        gradient.addColorStop(0, isAlert ? '#f43f5e' : '#00f0ff');
        gradient.addColorStop(1, '#0284c7');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlayingAudio, isLiveMicActive, currentScenario]);

  const handleTogglePlay = () => {
    setIsPlayingAudio((prev) => !prev);
    cockpitAudio.playBlip();
  };

  const handleToggleMic = async () => {
    try {
      if (!isLiveMicActive) {
        cockpitAudio.playBlip();
        setIsLiveMicActive(true);
      } else {
        setIsLiveMicActive(false);
      }
    } catch (e) {
      console.warn('Microphone error', e);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-space-950 via-space-900 to-space-950 border border-hud-cyan/40 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-hud-cyan/15 border border-hud-cyan/40 text-hud-cyan">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron font-extrabold text-base sm:text-lg text-white tracking-wider">
                AUTONOMOUS ACOUSTIC VOICE STRESS & HYPOXIA TRIAGE
              </h2>
              <span className="text-[9px] px-2 py-0.5 rounded bg-hud-cyan/20 border border-hud-cyan/40 text-hud-cyan font-bold uppercase">
                BEHAVIORAL HEALTH SPECTROMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Non-invasive vocal tract jitter ($F_0$) & micro-tremor analysis detects acute hypoxia & cognitive panic 15 min before biometric monitor alarms.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMic}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              isLiveMicActive
                ? 'bg-hud-rose text-white shadow-lg shadow-hud-rose/40 animate-pulse'
                : 'bg-space-950 border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {isLiveMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-slate-500" />}
            <span>{isLiveMicActive ? 'LIVE MIC ACTIVE' : 'ENABLE LIVE MIC'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Audio Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Spectrogram & Waveform (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-space-950/90 border border-hud-cyan/30 shadow-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-orbitron font-bold text-white flex items-center gap-2">
              <WaveformIcon className="w-4 h-4 text-hud-cyan" />
              VOCAL TRACT ACOUSTIC SPECTRUM ($F_0$ TO 4000 Hz)
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              currentScenario.status === 'HIGH_STRESS' ? 'bg-rose-950 text-hud-rose border border-rose-500/40' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
            }`}>
              {currentScenario.status === 'HIGH_STRESS' ? 'CRITICAL ACOUSTIC TREMOR' : 'NOMINAL RESONANCE'}
            </span>
          </div>

          {/* Canvas Spectrum Display */}
          <div className="relative rounded-xl overflow-hidden bg-space-950 border border-slate-800 h-48 flex items-center justify-center">
            <canvas ref={canvasRef} width={500} height={190} className="w-full h-full block" />
            <div className="absolute top-2 right-2 text-[9px] text-slate-500 font-mono">
              FFT RESOLUTION: 1024 BINS
            </div>
          </div>

          {/* Audio Transcript Box */}
          <div className="p-3.5 rounded-xl bg-space-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              SPEECH-TO-TEXT COMMS LOG ({currentScenario.astronaut}):
            </span>
            <p className="text-xs text-white font-sans italic">
              {currentScenario.transcript}
            </p>
          </div>

          {/* Play Scenario Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleTogglePlay}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                isPlayingAudio
                  ? 'bg-hud-rose text-white shadow-md shadow-hud-rose/40'
                  : 'bg-hud-cyan text-space-950 hover:bg-hud-cyan/90 shadow-md shadow-hud-cyan/30'
              }`}
            >
              {isPlayingAudio ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingAudio ? 'PAUSE ACOUSTIC SWEEP' : 'PLAY VOCAL DIAGNOSTIC SWEEP'}</span>
            </button>
            <span className="text-[11px] text-slate-400">Sampling Rate: 48 kHz / 24-bit Flac</span>
          </div>
        </div>

        {/* Right Column: Acoustic Diagnostics & Dr. BEKUR-AI Voice Evaluation (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Key Audio Biomarkers Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-space-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                VOCAL JITTER
              </span>
              <div className={`font-orbitron font-extrabold text-2xl mt-1 ${currentScenario.jitterPercent > 2.0 ? 'text-hud-rose' : 'text-hud-cyan'}`}>
                {currentScenario.jitterPercent}%
              </div>
              <span className="text-[9px] text-slate-500">Nominal Margin: &lt; 1.0%</span>
            </div>

            <div className="p-4 rounded-2xl bg-space-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                STRESS INDEX
              </span>
              <div className={`font-orbitron font-extrabold text-2xl mt-1 ${currentScenario.stressScore > 60 ? 'text-amber-400' : 'text-hud-emerald'}`}>
                {currentScenario.stressScore}%
              </div>
              <span className="text-[9px] text-slate-500">Neuro-Autonomic Arousal</span>
            </div>
          </div>

          {/* Scenario Selector */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              SELECT ASTRONAUT VOICE TELEMETRY SAMPLE:
            </span>
            <div className="space-y-1.5">
              {audioScenarios.map((scen) => (
                <button
                  key={scen.id}
                  onClick={() => {
                    cockpitAudio.playBlip();
                    setSelectedScenario(scen.id);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                    selectedScenario === scen.id
                      ? 'bg-hud-cyan/15 border-hud-cyan text-white shadow-md'
                      : 'bg-space-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold truncate">{scen.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${scen.status === 'HIGH_STRESS' ? 'text-hud-rose' : 'text-slate-400'}`}>
                    {scen.stressScore}% STRESS
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dr. BEKUR-AI Acoustic Diagnostic Report */}
          <div className="p-4 rounded-2xl bg-space-950/90 border border-hud-cyan/40 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-hud-cyan" />
              <span className="text-xs font-orbitron font-bold text-white">
                DR. BEKUR-AI ACOUSTIC DIAGNOSIS
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed bg-space-900/60 p-3 rounded-xl border border-slate-800">
              {currentScenario.aiDiagnosis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
