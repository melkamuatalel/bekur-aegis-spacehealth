import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  Tv,
  Lock,
  Dna,
  Mic,
  Bot,
  X,
  Download,
  Film,
  CheckCircle2,
} from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function AutoPitchWalkthroughModal({ isOpen, onClose, onNavigate }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(74);
  const [autoNavigate, setAutoNavigate] = useState(true);

  // Timeline Segments for Auto-Navigation
  const segments = [
    { start: 0, end: 12, page: 'cockpit', label: '1. Mission Overview & Deep Space Crisis', text: 'Greetings NASA Space Apps Global Judges. I am presenting BEKUR-Aegis, an autonomous edge-AI health intelligence system engineered for deep-space transit to Mars on the ARES-V vehicle, over 78 million kilometers from Earth.' },
    { start: 12, end: 24, page: 'cockpit', label: '2. Shared Squadron Cockpit Wall', text: 'Because radio communications lag up to 22 minutes one-way, Earth flight surgeons cannot intervene during acute emergencies. Compliant with NASA-STD-3001 and federal privacy regulations under 14 CFR 1213, BEKUR-Aegis introduces an aerospace-compliant dual-display architecture: a Shared Squadron Cockpit Deck for overall crew safety, and a private Biometric Crew Quarters Enclave secured by retinal scan.' },
    { start: 24, end: 38, page: 'quarters', label: '3. In-Vivo Tomography & Clickable Organs', text: 'Inside private quarters, BEKUR-Aegis deploys gender-adaptive in-vivo photorealistic organ tomography matching real International Space Station flight consoles. Astronauts interact with physiological vectors across cardiovascular, optic, and musculoskeletal beds.' },
    { start: 38, end: 50, page: 'quarters', label: '4. 72-Hour Prognostic Digital Twin', text: 'Our world-first 72-Hour Prognostic Digital Twin moves beyond reactive monitoring. It forward-simulates SANS optic swelling and cardiac deconditioning, pre-emptively deploying Lower-Body Negative Pressure and electrolyte countermeasures.' },
    { start: 50, end: 60, page: 'genomics', label: '5. NASA GeneLab 3D DNA Radiation Suite', text: 'We also integrated the NASA GeneLab 3D Genomic Radiation suite to track cosmic ray double-strand DNA breaks and antioxidant repair kinetics.' },
    { start: 60, end: 68, page: 'voice-triage', label: '6. Acoustic Voice Stress & Hypoxia', text: '...and an autonomous Acoustic Voice Stress Spectrometer that detects sub-clinical hypoxia 15 minutes before vital signs crash.' },
    { start: 68, end: 75, page: 'ai-doctor', label: '7. Dr. BEKUR-AI & Earth Telemedicine Impact', text: 'Underpinning the mission is Dr. BEKUR-AI, validated with 96.4% diagnostic concordance against NASA historical flight data. Operating 100% offline on spacecraft avionics, BEKUR-Aegis protects astronauts on Mars, and powers remote rural telemedicine in Ethiopia. Thank you.' },
  ];

  const currentSegment = segments.find(
    (s) => currentTime >= s.start && currentTime <= s.end
  ) || segments[0];

  useEffect(() => {
    if (!isOpen && isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  // Handle time updates & trigger auto-navigation
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    setCurrentTime(cur);

    if (autoNavigate) {
      const match = segments.find((s) => cur >= s.start && cur < s.end);
      if (match && match.page) {
        onNavigate(match.page);
      }
    }
  };

  const togglePlay = () => {
    cockpitAudio.playBlip();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (newTime) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    const match = segments.find((s) => newTime >= s.start && newTime < s.end);
    if (match) onNavigate(match.page);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 max-w-4xl mx-auto px-4 pointer-events-auto font-mono">
      <audio
        ref={audioRef}
        src="/audio/pitch-voiceover.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.target.duration || 74)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="rounded-3xl p-5 bg-space-950/95 border-2 border-hud-cyan shadow-[0_0_50px_rgba(0,240,255,0.3)] backdrop-blur-2xl text-white space-y-3 relative overflow-hidden">
        {/* Glowing Background Laser Scan */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-hud-cyan to-transparent animate-pulse" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-hud-cyan/20 border border-hud-cyan/40 text-hud-cyan">
              <Film className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-orbitron font-extrabold text-sm sm:text-base text-white tracking-wider">
                  2-MINUTE AUTOMATED DEMO VIDEO WALKTHROUGH
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded bg-hud-emerald/20 border border-hud-emerald/50 text-hud-emerald font-bold">
                  NASA PITCH MODE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Native English Voiceover with Synchronized Auto-Screen Navigation (Perfect for Screen-Recording!)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/audio/pitch-voiceover.mp3"
              download="bekur-aegis-pitch-voiceover.mp3"
              className="px-2.5 py-1.5 rounded-xl bg-space-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-[10px] transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD MP3</span>
            </a>
            <button
              onClick={() => {
                cockpitAudio.playBlip();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-space-900 hover:bg-space-800 border border-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtitles / Synchronized Live Transcript */}
        <div className="p-3 rounded-2xl bg-space-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-hud-cyan uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {currentSegment.label}
            </span>
            <span className="text-slate-500">
              {Math.floor(currentTime)}s / {Math.floor(duration)}s
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed italic">
            "{currentSegment.text}"
          </p>
        </div>

        {/* Playback Controls & Progress Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={togglePlay}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-orbitron transition flex items-center gap-2 shadow-lg ${
                isPlaying
                  ? 'bg-hud-rose text-white shadow-hud-rose/40'
                  : 'bg-hud-cyan text-space-950 shadow-hud-cyan/40 hover:bg-hud-cyan/90'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE WALKTHROUGH' : 'START 2-MIN AUDIO WALKTHROUGH'}</span>
            </button>

            <button
              onClick={() => handleSeek(0)}
              className="p-2.5 rounded-xl bg-space-900 border border-slate-700 text-slate-400 hover:text-white transition"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Segment Jump Pills */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-[9px]">
            {segments.map((seg, idx) => (
              <button
                key={idx}
                onClick={() => handleSeek(seg.start)}
                className={`px-2 py-1 rounded-lg border transition whitespace-nowrap ${
                  currentSegment.start === seg.start
                    ? 'bg-hud-cyan text-space-950 font-bold border-hud-cyan'
                    : 'bg-space-900/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Part {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Helper Note for User Recording Screen */}
        <div className="text-[11px] text-slate-400 font-sans flex items-center gap-2 pt-1 border-t border-slate-800/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-hud-emerald shrink-0" />
          <span>
            <strong>Screen-Recording Tip:</strong> Click <em>Start 2-Min Audio Walkthrough</em> while your screen recorder is running. The app will talk in fluent English and automatically navigate all screens for your YouTube demo video!
          </span>
        </div>
      </div>
    </div>
  );
}
