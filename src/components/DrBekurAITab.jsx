import React, { useState } from 'react';
import ThreeAIAvatar from './ThreeAIAvatar';
import { Bot, Send, ShieldAlert, Sparkles, AlertTriangle, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function DrBekurAITab({ activeCrew, isEmergencyActive, onTriggerEmergency }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Greetings Commander. I am DR. BEKUR-AI, Chief Medical Officer for the ARES Deep Space Transit. Operating 100% autonomously on spacecraft avionics with zero dependency on Earth telemetry. Currently monitoring ${activeCrew.name} on Sol 142. How may I assist with clinical triage?`,
      timestamp: '14:24 UTC',
      protocol: null,
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState(null);

  const clinicalProtocols = [
    {
      id: 'sans',
      name: 'SANS Optic Edema Protocol',
      badge: 'NASA HRP-SANS',
      desc: 'Optic nerve sheath dilation (>5.5mm), choroidal folds, and hyperopic refractive shift triage.',
      response: `[PROTOCOL INITIATED // NASA HRP SANS STAGE 2]\nAstronaut: ${activeCrew.name}\n1. Ultrasound ONSD Scan: Confirm sheath diameter >5.5mm.\n2. Visual Acuity: Deploy adjustable liquid-lens glasses (+1.25D compensation).\n3. Lower-Body Negative Pressure (LBNP): Prescribe 30 mmHg for 45 min to counteract cephalad fluid shift.\n4. Dietary: Reduce sodium intake below 2,000 mg/day to lower CSF production. Schedule repeat OCT in 72 hours.`,
    },
    {
      id: 'arrhythmia',
      name: 'Cardiac Arrhythmia & PVC Countermeasure',
      badge: 'ACLS Micro-G',
      desc: 'Frequent premature ventricular contractions, ST-segment elevation, or sinus tachycardia during EVA.',
      response: `[EMERGENCY PROTOCOL // CARDIAC RESCUE]\nAstronaut: ${activeCrew.name}\n1. Abort current EVA / High workload tasks immediately.\n2. Administer Oral Magnesium Glycinate (400mg) and Potassium Citrate (20 mEq) to stabilize cardiac membrane potential.\n3. Continuous Lead-II Holter ECG sweep engaged.\n4. If PVC frequency exceeds 10/min, administer Metoprolol 25mg PO under closed-loop telemetry supervision.\n5. Log telemetry buffer for next NASA Goldstone DSN transmission window.`,
    },
    {
      id: 'radiation',
      name: 'Solar Particle Event (SPE) Radiation Shelter',
      badge: 'NASA-STD-3001',
      desc: 'High cosmic ray dosimeter spike (>180 µSv/h) from solar coronal mass ejection (CME).',
      response: `[SPE MASTER PROTOCOL // RADIATION SHELTER]\nCabin Alert: Cosmic radiation exceeding 180 µSv/h.\n1. Sound Master Alarm. All 4 crew members must retreat into the water-wall storm shelter within 8 minutes.\n2. Distribute radioprotectant antioxidant cocktail (N-Acetylcysteine 600mg + Alpha-Lipoic Acid 300mg).\n3. Re-orient spacecraft solar panels to maximize hull shielding shadow.\n4. Deep Space Network latency is +04m 21s; Earth ground surgery is impossible. Standby in storm bunker for 36 hours.`,
    },
  ];

  const handleSendCustomMessage = (e) => {
    e?.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setInputQuery('');

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, timestamp: new Date().toLocaleTimeString().slice(0, 5) + ' UTC' },
    ]);

    setIsThinking(true);
    cockpitAudio.playBlip();

    // Generate intelligent clinical AI answer
    setTimeout(() => {
      setIsThinking(false);
      let replyText = '';
      const lower = userText.toLowerCase();

      if (lower.includes('sans') || lower.includes('eye') || lower.includes('vision') || lower.includes('blur')) {
        replyText = `Clinical analysis for ${activeCrew.name}: Microgravity-associated cephalad fluid pressure is elevating the optic sheath diameter to ${activeCrew.sansScore > 60 ? '5.7mm (Elevated)' : '4.8mm (Stable)'}. Recommend immediate 30-minute LBNP session and chorioretinal OCT scan.`;
      } else if (lower.includes('heart') || lower.includes('bpm') || lower.includes('ecg') || lower.includes('chest')) {
        replyText = `Cardiovascular vector analysis: Heart rate is currently ${activeCrew.vitals.bpm} BPM. Lead-II sweep shows ${isEmergencyActive ? 'sinus tachycardia and recurrent PVCs' : 'normal sinus rhythm with -10° anatomical shift'}. Hydration level at 94%. Electrolyte balance stable.`;
      } else if (lower.includes('radiation') || lower.includes('storm') || lower.includes('solar')) {
        replyText = `Dosimetry reading: 184 µSv/h. While galactic cosmic rays (GCR) remain at steady levels, any solar flare requires rapid storm shelter ingress. Radioprotectant stocks are 100% verified in Module B.`;
      } else {
        replyText = `Dr. BEKUR-AI Edge Diagnosis for ${activeCrew.name}: Telemetry biometrics cross-referenced with NASA-STD-3001 Vol 1 database. Overall health index is ${activeCrew.healthIndex}%. All autonomous clinical algorithms are operating locally within spacecraft avionics without Earth ground connection lag.`;
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: replyText, timestamp: new Date().toLocaleTimeString().slice(0, 5) + ' UTC' },
      ]);
      cockpitAudio.playBlip();
    }, 1200);
  };

  const handleSelectProtocol = (proto) => {
    setActiveProtocol(proto.id);
    setIsThinking(true);
    cockpitAudio.playBlip();

    setTimeout(() => {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: proto.response,
          timestamp: new Date().toLocaleTimeString().slice(0, 5) + ' UTC',
          protocol: proto.name,
        },
      ]);
      cockpitAudio.playBlip();
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-space-900/80 border border-hud-cyan/30 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-space-950 border border-hud-cyan/40">
            <Bot className="w-5 h-5 text-hud-cyan" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-white text-base">
              DR. BEKUR-AI // AUTONOMOUS CHIEF MEDICAL OFFICER
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Offline Deep-Space Clinical Reasoning Engine • Zero Ground-Latency Dependency
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            100% OFFLINE EDGE AVIONICS
          </span>
        </div>
      </div>

      {/* Main 2-Column AI Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Holographic AI Avatar & Diagnostic Protocols (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* 3D WebGL Hologram Avatar */}
          <ThreeAIAvatar
            isThinking={isThinking}
            isSpeaking={false}
            stateText={isThinking ? 'PROCESSING NEURAL CLINICAL VECTORS...' : 'AUTONOMOUS EDGE AI READY'}
          />

          {/* Quick-Fire Emergency Clinical Protocols */}
          <div className="p-4 rounded-2xl bg-space-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-orbitron text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-hud-amber" />
                NASA EMERGENCY ACTION PROTOCOLS
              </span>
              <span className="font-mono text-[10px] text-slate-400">ONE-CLICK ENGAGE</span>
            </div>

            <div className="space-y-2">
              {clinicalProtocols.map((proto) => (
                <button
                  key={proto.id}
                  onClick={() => handleSelectProtocol(proto)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col gap-1 ${
                    activeProtocol === proto.id
                      ? 'bg-hud-cyan/15 border-hud-cyan shadow-md shadow-hud-cyan/20'
                      : 'bg-space-950/70 border-slate-800 hover:border-slate-700 hover:bg-space-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-xs font-bold text-slate-200">{proto.name}</span>
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-space-900 border border-slate-700 text-hud-cyan">
                      {proto.badge}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-400 leading-tight">{proto.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Clinical Chat Terminal (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col h-[560px] rounded-2xl bg-space-900/90 border border-hud-cyan/30 shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Chat Terminal Header */}
          <div className="p-3.5 bg-space-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-hud-cyan animate-pulse" />
              <span className="font-mono text-xs text-hud-cyan tracking-wider">
                SECURE CLINICAL TELEMETRY STREAM // PASSENGER: {activeCrew.name.toUpperCase()}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">AES-256 ENCRYPTED</span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-500">
                  <span>{msg.sender === 'user' ? 'COMMANDER (YOU)' : 'DR. BEKUR-AI'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`p-3.5 rounded-2xl max-w-[92%] whitespace-pre-wrap leading-relaxed shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-hud-cyan/20 border border-hud-cyan/40 text-slate-100 rounded-tr-none'
                      : 'bg-space-950/90 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.protocol && (
                    <div className="mb-2 pb-1 border-b border-hud-cyan/30 flex items-center gap-1.5 text-hud-cyan font-bold font-orbitron text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {msg.protocol}
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 p-3 bg-space-950/80 border border-slate-800 rounded-2xl w-fit text-hud-cyan">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="text-xs">Computing clinical differential diagnosis...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendCustomMessage} className="p-3 bg-space-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Dr. BEKUR-AI (e.g., 'Astronaut reports vision blurring and dizziness during EVA')..."
              className="flex-1 bg-space-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-hud-cyan font-mono"
            />
            <button
              type="submit"
              disabled={isThinking || !inputQuery.trim()}
              className="px-4 py-2.5 bg-hud-cyan hover:bg-hud-cyan/80 text-space-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SEND</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
