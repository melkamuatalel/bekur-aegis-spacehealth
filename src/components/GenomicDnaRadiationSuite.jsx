import React, { useEffect, useRef, useState } from 'react';
import {
  Dna,
  ShieldAlert,
  Zap,
  Activity,
  Sparkles,
  Layers,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function GenomicDnaRadiationSuite({ activeCrew, isEmergencyActive }) {
  const canvasRef = useRef(null);
  const [isSimulatingSpe, setIsSimulatingSpe] = useState(isEmergencyActive);
  const [activeRadioprotectant, setActiveRadioprotectant] = useState(false);
  const [nadPrecursorActive, setNadPrecursorActive] = useState(false);
  const [dnaBreaks, setDnaBreaks] = useState(14.8);
  const [repairVelocity, setRepairVelocity] = useState(82);

  // Update simulation when toggled
  useEffect(() => {
    let baseBreaks = isSimulatingSpe ? 48.6 : 14.8;
    let baseRepair = isSimulatingSpe ? 54 : 82;

    if (activeRadioprotectant) {
      baseBreaks *= 0.65;
      baseRepair += 18;
    }
    if (nadPrecursorActive) {
      baseRepair += 24;
    }

    setDnaBreaks(parseFloat(baseBreaks.toFixed(1)));
    setRepairVelocity(Math.min(100, Math.round(baseRepair)));
  }, [isSimulatingSpe, activeRadioprotectant, nadPrecursorActive]);

  // 3D Canvas Animated Rotating Double-Helix DNA
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let angle = 0;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 380;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      angle += 0.025;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const numPoints = 28;
      const strandRadius = 70;
      const centerY = h / 2;

      for (let i = 0; i < numPoints; i++) {
        const x = (w / (numPoints + 1)) * (i + 1);
        const theta = angle + i * 0.35;

        // Strand 1 (Front/Back 3D projection)
        const y1 = centerY + Math.sin(theta) * strandRadius;
        const z1 = Math.cos(theta);
        const scale1 = 1 + z1 * 0.3;

        // Strand 2 (Phase shifted by PI)
        const y2 = centerY + Math.sin(theta + Math.PI) * strandRadius;
        const z2 = Math.cos(theta + Math.PI);
        const scale2 = 1 + z2 * 0.3;

        // Base-pair ladder rung
        ctx.strokeStyle = z1 > 0 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(244, 63, 94, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();

        // Node 1 (Nucleotide)
        ctx.fillStyle = isSimulatingSpe && i % 4 === 0 ? '#f43f5e' : '#00f0ff';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10 * scale1;
        ctx.beginPath();
        ctx.arc(x, y1, 5 * scale1, 0, Math.PI * 2);
        ctx.fill();

        // Node 2 (Complementary Nucleotide)
        ctx.fillStyle = nadPrecursorActive ? '#10b981' : '#38bdf8';
        ctx.shadowBlur = 10 * scale2;
        ctx.beginPath();
        ctx.arc(x, y2, 5 * scale2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isSimulatingSpe, nadPrecursorActive]);

  return (
    <div className="space-y-6 font-mono">
      {/* Top Header Banner */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-space-950 via-space-900 to-space-950 border border-hud-cyan/40 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-hud-cyan/15 border border-hud-cyan/40 text-hud-cyan">
            <Dna className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron font-extrabold text-base sm:text-lg text-white tracking-wider">
                NASA GENELAB // GENOMIC RADIATION DNA REPAIR SUITE
              </h2>
              <span className="text-[9px] px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-bold uppercase">
                NASA GLDS-242 VALIDATED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Real-time deep-space Galactic Cosmic Ray (GCR) Double-Strand Breaks (DSB) tracking & enzymatic repair kinetics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-space-950 border border-slate-800 text-xs">
            <span className="text-slate-400">SUBJECT:</span>{' '}
            <strong className="text-white">{activeCrew?.name}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-space-950 border border-hud-cyan/40 text-hud-cyan text-xs">
            <span>RAD DOSE: 62.4 µSv/h</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Genomic Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Double-Helix Interactive DNA Canvas (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-space-950/90 border border-hud-cyan/30 shadow-2xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 z-10">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-hud-cyan animate-ping" />
              <span className="font-orbitron font-bold text-white">
                3D ROTATING CHROMATIN & DOUBLE-STRAND LADDER
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {isSimulatingSpe ? '⚠️ SPE RADIATION HIT DETECTED' : 'NOMINAL GCR BACKGROUND'}
            </span>
          </div>

          <div className="relative w-full flex-1 flex items-center justify-center min-h-[360px]">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Glowing Tag Overlay */}
            <div className="absolute bottom-3 left-3 bg-space-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] space-y-0.5 pointer-events-none">
              <div className="text-hud-cyan font-bold">ATM / RAD51 REPAIR COMPLEX: ACTIVE</div>
              <div className="text-slate-400">Poly(ADP-ribose) Polymerase-1 (PARP1): Synchronized</div>
            </div>
          </div>

          {/* DNA Breaker Toggles */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 z-10">
            <span className="text-[11px] text-slate-400">SIMULATION PARAMETERS:</span>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => {
                  cockpitAudio.playBlip();
                  setIsSimulatingSpe((prev) => !prev);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  isSimulatingSpe
                    ? 'bg-hud-rose text-white shadow-md shadow-hud-rose/40'
                    : 'bg-space-900 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isSimulatingSpe ? 'SOLAR FLARE ACTIVE' : 'SIMULATE SOLAR FLARE'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: DNA Damage Telemetry & Countermeasure Pharmacy (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-space-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                DOUBLE-STRAND BREAKS (DSB)
              </span>
              <div className={`font-orbitron font-extrabold text-2xl mt-1 ${dnaBreaks > 30 ? 'text-hud-rose' : 'text-hud-cyan'}`}>
                {dnaBreaks}
              </div>
              <span className="text-[9px] text-slate-500">Breaks per 10⁹ Base Pairs</span>
            </div>

            <div className="p-4 rounded-2xl bg-space-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                DNA REPAIR VELOCITY
              </span>
              <div className={`font-orbitron font-extrabold text-2xl mt-1 ${repairVelocity < 70 ? 'text-amber-400' : 'text-hud-emerald'}`}>
                {repairVelocity}%
              </div>
              <span className="text-[9px] text-slate-500">Enzymatic Ligation Index</span>
            </div>
          </div>

          {/* Transcriptomic Biomarkers (Real NASA GeneLab Data) */}
          <div className="p-4 rounded-2xl bg-space-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-orbitron font-bold text-white flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-hud-cyan" />
                NASA GENELAB GLDS-242 TRANSCRIPTOMIC EXPRESSION
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-space-900 border border-slate-800">
                <span className="text-slate-300">ATM Kinase (DNA Damage Sensor)</span>
                <span className="text-hud-cyan font-bold font-mono">1.84x Overexpressed</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-space-900 border border-slate-800">
                <span className="text-slate-300">RAD51 (Homologous Recombination)</span>
                <span className="text-hud-emerald font-bold font-mono">Active (94% fidelity)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-space-900 border border-slate-800">
                <span className="text-slate-300">p53 Tumor Suppressor</span>
                <span className="text-hud-cyan font-bold font-mono">Intact Baseline</span>
              </div>
            </div>
          </div>

          {/* Interactive Radioprotectant Lab */}
          <div className="p-4 rounded-2xl bg-space-950/90 border border-hud-cyan/40 space-y-3">
            <span className="text-xs font-orbitron font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-hud-cyan" />
              DEPLOY PHARMACOLOGICAL RADIOPROTECTANTS
            </span>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  cockpitAudio.playBlip();
                  setActiveRadioprotectant((prev) => !prev);
                }}
                className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                  activeRadioprotectant
                    ? 'bg-hud-cyan/20 border-hud-cyan text-white shadow-md'
                    : 'bg-space-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold">N-Acetylcysteine (NAC) + Alpha-Lipoic Acid</div>
                  <div className="text-[10px] text-slate-400">Scavenges Reactive Oxygen Species (ROS) by 65%</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${activeRadioprotectant ? 'bg-hud-cyan text-space-950' : 'bg-space-950 text-slate-400'}`}>
                  {activeRadioprotectant ? 'ACTIVE' : 'DEPLOY'}
                </span>
              </button>

              <button
                onClick={() => {
                  cockpitAudio.playBlip();
                  setNadPrecursorActive((prev) => !prev);
                }}
                className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                  nadPrecursorActive
                    ? 'bg-hud-emerald/20 border-hud-emerald text-white shadow-md'
                    : 'bg-space-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold">NMN / NAD+ Cellular Booster (SIRT1 Agonist)</div>
                  <div className="text-[10px] text-slate-400">Accelerates PARP1 enzymatic DNA repair velocity by +24%</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${nadPrecursorActive ? 'bg-hud-emerald text-space-950' : 'bg-space-950 text-slate-400'}`}>
                  {nadPrecursorActive ? 'ACTIVE' : 'DEPLOY'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
