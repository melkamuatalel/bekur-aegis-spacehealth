import React from 'react';
import { X, BookOpen, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { NASA_HRP_RISKS } from '../data/nasaHealthData';

export default function NasaRiskDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
      <div className="hud-panel w-full max-w-3xl max-h-[85vh] rounded-2xl border border-hud-cyan/40 flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-space-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-hud-cyan/10 border border-hud-cyan/30 text-hud-cyan">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white tracking-wider">
                NASA HUMAN RESEARCH PROGRAM (HRP) EVIDENCE REPOSITORY
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                NASA-STD-3001 HUMAN-SYSTEM SPACEFLIGHT STANDARDS COMPLIANCE
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-space-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of NASA Risks */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="bg-space-950/80 p-3.5 rounded-xl border border-hud-cyan/15 text-xs text-slate-300 leading-relaxed font-sans">
            <p>
              <strong>BEKUR-Aegis</strong> is engineered in direct accordance with the official 
              <strong> NASA Human Research Roadmap (HRR)</strong>. Long-duration deep space exploration 
              demands autonomous edge diagnostics to counter the critical physiological adaptations of microgravity and deep space transit.
            </p>
          </div>

          <div className="space-y-3">
            {NASA_HRP_RISKS.map((risk) => (
              <div key={risk.code} className="bg-space-900/90 p-4 rounded-xl border border-slate-800 hover:border-hud-cyan/30 transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-hud-cyan px-2 py-0.5 rounded bg-hud-cyan/10 border border-hud-cyan/30">
                      {risk.code}
                    </span>
                    <h3 className="font-display font-bold text-sm text-white">{risk.title}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {risk.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3 font-sans leading-relaxed">
                  {risk.description}
                </p>

                <div className="bg-space-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] font-mono text-hud-emerald uppercase font-bold block mb-1">
                    NASA VERIFIED COUNTERMEASURES:
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 font-sans">
                    {risk.countermeasures.map((cm, i) => (
                      <li key={i}>{cm}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-space-900/90 border-t border-slate-800 text-center text-xs font-mono text-slate-400">
          Source: NASA Johnson Space Center // Human Research Program Spaceflight Evidence Books
        </div>

      </div>
    </div>
  );
}
