import React, { useState } from 'react';
import { Bot, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, CheckSquare, Sparkles, Send, X } from 'lucide-react';
import { EMERGENCY_CLINICAL_PROTOCOLS, NASA_HRP_RISKS } from '../data/nasaHealthData';
import { cockpitAudio } from '../utils/audioAlert';

export default function AIDoctorModal({ isOpen, onClose, defaultCrew, onTriggerProtocol }) {
  const [selectedProtocol, setSelectedProtocol] = useState(EMERGENCY_CLINICAL_PROTOCOLS[0]);
  const [completedSteps, setCompletedSteps] = useState({});
  const [customQuery, setCustomQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: `BEKUR-MED Autonomous Edge AI initialized. Deep Space Network latency is 04m 21s. I am ready to assist with clinical diagnosis, countermeasure execution, or ultrasound guidance without Earth assistance.`
    }
  ]);

  if (!isOpen) return null;

  const handleToggleStep = (idx) => {
    cockpitAudio.playBlip();
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSendQuery = (e) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    cockpitAudio.playBlip();
    const userText = customQuery;
    setCustomQuery('');

    setChatLog(prev => [...prev, { sender: 'user', text: userText }]);

    // Simulated offline Edge LLM inference
    setTimeout(() => {
      let aiResponse = `Analyzing biometrics for ${defaultCrew.name}... Based on NASA HRP space clinical evidence, recommend checking intraocular pressure, administering 500 mL warm oral electrolyte fluid, and initiating 30 minutes in Lower Body Negative Pressure (LBNP) suit.`;
      
      if (userText.toLowerCase().includes('headache') || userText.toLowerCase().includes('eye') || userText.toLowerCase().includes('vision')) {
        aiResponse = `⚠️ High clinical correlation with SANS (Spaceflight-Associated Neuro-ocular Syndrome). Cephalad fluid accumulation suspected. Action items: 1) Measure optic nerve diameter with ultrasound; 2) Check cabin CO2 levels (ensure < 0.4%); 3) Apply venous choke collar if cleared.`;
      } else if (userText.toLowerCase().includes('heart') || userText.toLowerCase().includes('chest') || userText.toLowerCase().includes('pulse')) {
        aiResponse = `🚨 Cardiac telemetry review indicated: Check Lead-II ECG for premature ventricular contractions. Evaluate serum potassium/magnesium via i-STAT. Prepare Metoprolol oral if resting tachycardia exceeds 110 BPM.`;
      } else if (userText.toLowerCase().includes('radiation') || userText.toLowerCase().includes('solar') || userText.toLowerCase().includes('flare')) {
        aiResponse = `🛡️ Radiation alert protocol: Orient spacecraft thruster block to sunward. Direct crew to water-shielded central shelter. Cumulative dose is currently monitored at 148.6 mSv.`;
      }

      setChatLog(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      cockpitAudio.playBlip();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
      <div className="hud-panel w-full max-w-4xl max-h-[90vh] rounded-2xl border border-hud-cyan/40 flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-hud-cyan/20 bg-space-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-hud-cyan/10 border border-hud-cyan/30 text-hud-cyan">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display text-lg font-bold text-white tracking-wider">
                  BEKUR-MED // AUTONOMOUS CHIEF MEDICAL OFFICER
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-hud-emerald/20 border border-hud-emerald/40 text-hud-emerald font-bold">
                  100% OFFLINE EDGE AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                PATIENT: {defaultCrew.name} ({defaultCrew.callsign}) • LATENCY TO EARTH: 04m 21s
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          
          {/* Left Column: NASA Emergency Protocols List */}
          <div className="p-4 bg-space-950/50">
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-3 font-bold tracking-wider">
              NASA SPACE EMERGENCY PROTOCOLS
            </span>

            <div className="space-y-2">
              {EMERGENCY_CLINICAL_PROTOCOLS.map((proto) => {
                const isSelected = selectedProtocol.id === proto.id;
                return (
                  <button
                    key={proto.id}
                    onClick={() => {
                      cockpitAudio.playBlip();
                      setSelectedProtocol(proto);
                      setCompletedSteps({});
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs font-sans ${
                      isSelected
                        ? 'border-hud-cyan bg-hud-cyan/15 text-white shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                        : 'border-slate-800 bg-space-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        proto.severity === 'CRITICAL' || proto.severity === 'EMERGENCY'
                          ? 'bg-hud-rose/20 text-hud-rose border border-hud-rose/40'
                          : 'bg-hud-amber/20 text-hud-amber border border-hud-amber/40'
                      }`}>
                        {proto.severity}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                    <div className="font-semibold text-white line-clamp-1">{proto.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1 line-clamp-1">
                      {proto.condition}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Diagnostic Triage Prompts */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-bold">
                QUICK CLINICAL SYMPTOM INJECTION
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Blurred vision & eye pressure",
                  "Heart palpitations after EVA",
                  "Severe headache / CO2 spike",
                  "Solar flare alert protocol"
                ].map((symptom, i) => (
                  <button
                    key={i}
                    onClick={() => setCustomQuery(symptom)}
                    className="text-[10px] font-sans px-2.5 py-1 rounded bg-space-850 hover:bg-hud-cyan/20 border border-slate-700 hover:border-hud-cyan text-slate-300 transition"
                  >
                    + {symptom}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Two Columns: Protocol Execution & AI Chat */}
          <div className="md:col-span-2 p-5 flex flex-col justify-between space-y-4">
            
            {/* Active Protocol Checklist */}
            <div className="bg-space-900/80 p-4 rounded-xl border border-hud-cyan/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-hud-cyan" />
                  {selectedProtocol.title}
                </h4>
                <span className="text-[11px] font-mono text-hud-cyan">
                  {Object.values(completedSteps).filter(Boolean).length} / {selectedProtocol.steps.length} STEPS COMPLETED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mb-3">
                CONDITION TRIGGER: {selectedProtocol.condition}
              </p>

              {/* Step list */}
              <div className="space-y-2">
                {selectedProtocol.steps.map((step, idx) => {
                  const isDone = completedSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleStep(idx)}
                      className={`flex items-start space-x-3 p-2.5 rounded-lg border text-xs cursor-pointer transition select-none ${
                        isDone
                          ? 'border-hud-emerald/50 bg-hud-emerald/10 text-slate-200 line-through opacity-80'
                          : 'border-slate-800 bg-space-950/70 text-slate-300 hover:border-hud-cyan/40'
                      }`}
                    >
                      <button className={`mt-0.5 shrink-0 ${isDone ? 'text-hud-emerald' : 'text-slate-500'}`}>
                        <CheckSquare className="w-4 h-4" />
                      </button>
                      <span className="leading-relaxed">
                        <strong className="font-mono text-hud-cyan mr-1.5">STEP {idx + 1}:</strong>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Assistant Chat Stream */}
            <div className="flex-1 bg-space-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between max-h-56 overflow-y-auto">
              <div className="space-y-3 overflow-y-auto pr-1">
                {chatLog.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start space-x-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-6 h-6 rounded bg-hud-cyan/20 border border-hud-cyan/40 flex items-center justify-center text-hud-cyan shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`p-2.5 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                        msg.sender === 'user'
                          ? 'bg-hud-cyan/20 border border-hud-cyan/40 text-white font-mono'
                          : 'bg-space-900 border border-slate-800 text-slate-200 font-sans'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendQuery} className="mt-3 flex items-center space-x-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Ask BEKUR-MED for emergency guidance or symptoms analysis..."
                  className="flex-1 bg-space-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-hud-cyan font-sans"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-hud-cyan hover:bg-hud-cyan/80 text-space-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 transition font-display"
                >
                  <span>CONSULT</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
