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
  Minimize2,
  Maximize2,
  EyeOff,
} from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function AutoPitchWalkthroughModal({ isOpen, onClose, onNavigate }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(119);
  const [autoNavigate, setAutoNavigate] = useState(true);
  const [displayMode, setDisplayMode] = useState('expanded'); // 'expanded' | 'ticker' | 'hidden'

  // Timeline Segments for Auto-Navigation (Strictly under 2-min NASA hard limit: 118.7s)
  const segments = [
    { start: 0.0, end: 4.5, page: 'login', label: '1. NASA Biometric Clearance', text: 'Greetings NASA Space Apps Global Judges. Presenting BEKUR-Aegis, secured by 14 CFR § 1213...' },
    { start: 4.5, end: 16.7, page: 'cockpit', label: '2. Mission Overview & Deep Space Crisis', text: '...autonomous edge-AI health intelligence for Mars transit on ARES-V, 78 million kilometers from Earth.' },
    { start: 16.7, end: 33.6, page: 'cockpit', label: '3. Zero Earth Dependency & Cockpit Bridge', text: 'With 22-minute light-speed lag, Earth doctors cannot intervene. Under NASA-STD-3001, our shared cockpit continuously monitors squadron life-support with zero Earth dependency.' },
    { start: 33.6, end: 47.6, page: 'quarters', label: '4. Private Quarters & 72-Hour Digital Twin', text: 'In private quarters under federal privacy enclaves, our 72-Hour Prognostic Digital Twin forward-simulates SANS and cardiac deconditioning before symptoms occur.' },
    { start: 47.6, end: 61.6, page: 'genomics', label: '5. NASA GeneLab Genomic Radiation Suite', text: 'Using NASA GeneLab GLDS-242 data, our 3D genomic suite monitors cosmic ray DNA breaks and antioxidant repair kinetics in real time.' },
    { start: 61.6, end: 73.8, page: 'voice-triage', label: '6. Acoustic Voice Stress & Hypoxia Triage', text: 'Our contactless acoustic voice stress spectrometer detects sub-clinical hypoxia 15 minutes before physical sensors, using microphone audio.' },
    { start: 73.8, end: 86.7, page: 'ai-doctor', label: '7. Dr. BEKUR-AI Autonomous CMO', text: 'Dr. BEKUR-AI provides autonomous clinical guidance with 96.4 percent concordance against NASA logs, prescribing countermeasures offline.' },
    { start: 86.7, end: 103.6, page: 'earth-roadmap', label: '8. Real-World Earth Spin-Off & Global Impact', text: 'Crucially, BEKUR-Aegis is engineered for Earth. Its offline edge AI brings specialist triage to rural clinics in Ethiopia, Antarctic research stations, and disaster zones without internet.' },
    { start: 103.6, end: 118.7, page: 'earth-roadmap', label: '9. TRL Flight Roadmap & Future Vision', text: 'Advancing from laboratory TRL-4 to Artemis Gateway and Mars 2030s, BEKUR-Aegis protects astronauts in deep space, while saving lives on Earth. Thank you.' },
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

  // Start Clean Recording Mode: starts audio and collapses to slim ticker
  const startCleanRecording = () => {
    cockpitAudio.playBlip();
    if (!audioRef.current) return;
    audioRef.current.play();
    setIsPlaying(true);
    setDisplayMode('ticker'); // Minimize immediately so screen is 100% clear
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
    <>
      <audio
        ref={audioRef}
        src="/audio/pitch-voiceover.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.target.duration || 74)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* MODE 1: ULTRA-SLIM BOTTOM TICKER (Takes only 38px at the very bottom, screen is 98% CLEAR!) */}
      {displayMode === 'ticker' && (
        <div className="fixed inset-x-0 bottom-2 z-50 max-w-4xl mx-auto px-3 pointer-events-auto font-mono animate-fadeIn">
          <div className="rounded-2xl px-4 py-2 bg-space-950/95 border border-hud-cyan/60 shadow-[0_0_30px_rgba(0,240,255,0.25)] backdrop-blur-2xl text-white flex items-center justify-between gap-3 text-xs">
            {/* Play Button & Time */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={togglePlay}
                className={`p-1.5 rounded-xl font-bold transition flex items-center justify-center ${
                  isPlaying ? 'bg-hud-rose text-white' : 'bg-hud-cyan text-space-950'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-hud-emerald animate-ping" />
                <span className="font-orbitron font-bold text-hud-cyan text-xs">
                  {Math.floor(currentTime)}s / {Math.floor(duration)}s
                </span>
              </div>
            </div>

            {/* Subtitle Line (Short & Sleek) */}
            <div className="flex-1 truncate text-slate-300 font-sans text-xs italic hidden sm:block">
              <strong className="text-hud-cyan font-mono not-italic mr-1">[{currentSegment.label.split('.')[1] || 'Overview'}]:</strong>
              "{currentSegment.text}"
            </div>

            {/* Action Buttons: Expand or Close */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  cockpitAudio.playBlip();
                  setDisplayMode('expanded');
                }}
                className="px-2.5 py-1 rounded-xl bg-space-900 hover:bg-space-800 border border-slate-700 text-slate-300 text-[10px] flex items-center gap-1.5 transition"
                title="Expand full player"
              >
                <Maximize2 className="w-3 h-3 text-hud-cyan" />
                <span>EXPAND</span>
              </button>
              <button
                onClick={() => {
                  cockpitAudio.playBlip();
                  onClose();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: EXPANDED FULL CONTROL BOX */}
      {displayMode === 'expanded' && (
        <div className="fixed inset-x-0 bottom-4 z-50 max-w-4xl mx-auto px-4 pointer-events-auto font-mono animate-fadeIn">
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
                    Native English Voiceover with Synchronized Auto-Screen Navigation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    cockpitAudio.playBlip();
                    setDisplayMode('ticker');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-space-900 border border-slate-700 hover:border-hud-cyan text-hud-cyan text-[10px] transition flex items-center gap-1.5"
                  title="Minimize player so screen is unobstructed"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>MINIMIZE TO BAR</span>
                </button>
                <a
                  href="/audio/pitch-voiceover.mp3"
                  download="bekur-aegis-pitch-voiceover.mp3"
                  className="px-2.5 py-1.5 rounded-xl bg-space-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-[10px] transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>MP3</span>
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

            {/* Playback Controls & Clean Record Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Clean Record Button (Auto-Minimizes Immediately) */}
                <button
                  onClick={startCleanRecording}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold font-orbitron transition flex items-center gap-2 shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-space-950 hover:brightness-110"
                  title="Starts audio and automatically minimizes so screen is 100% visible for video recording!"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START & AUTO-MINIMIZE FOR RECORDING</span>
                </button>

                <button
                  onClick={togglePlay}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold font-orbitron transition flex items-center gap-1.5 ${
                    isPlaying
                      ? 'bg-hud-rose text-white'
                      : 'bg-space-900 border border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
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
            <div className="text-[11px] text-slate-400 font-sans flex items-center justify-between pt-1 border-t border-slate-800/60">
              <span className="flex items-center gap-1.5 text-hud-emerald">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Tip: Click <strong>"START & AUTO-MINIMIZE"</strong> to record full-screen with zero screen blockage!</span>
              </span>
              <button
                onClick={() => setDisplayMode('ticker')}
                className="text-[10px] text-hud-cyan underline hover:text-white"
              >
                Hide to bottom bar now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
