import React, { useState } from 'react';
import {
  Shield,
  Fingerprint,
  Scan,
  Lock,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function BiometricLoginGate({ crew, onAuthenticate }) {
  const [selectedCrewId, setSelectedCrewId] = useState(crew[1]?.id || crew[0]?.id); // Default to Abebe Worku
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('idle'); // 'idle' | 'scanning' | 'success'

  const selectedMember = crew.find((c) => c.id === selectedCrewId) || crew[0];

  const handleStartBiometricScan = (memberId) => {
    const targetId = memberId || selectedCrewId;
    setSelectedCrewId(targetId);
    setIsScanning(true);
    setScanStep('scanning');
    cockpitAudio.playBlip();

    setTimeout(() => {
      setScanStep('success');
      cockpitAudio.playBlip();

      setTimeout(() => {
        setIsScanning(false);
        setScanStep('idle');
        onAuthenticate(targetId);
      }, 700);
    }, 1400);
  };

  return (
    <div className="max-w-4xl mx-auto my-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-space-900/95 via-space-950 to-space-950 border border-hud-cyan/40 shadow-2xl backdrop-blur-2xl font-mono relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hud-cyan/15 border border-hud-cyan/40 text-hud-cyan text-xs font-bold uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5" />
          <span>NASA 14 CFR § 1213 CONFIDENTIAL MEDICAL ENCLAVE</span>
        </div>
        <h2 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white tracking-wider">
          CREW QUARTERS // PRIVATE TERMINAL LOGIN
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-sans">
          To protect astronaut medical confidentiality, personal in-vivo organ scans, psychiatric telemetry, and Dr. BEKUR-AI sessions are restricted to private quarters.
        </p>
      </div>

      {/* Interactive Biometric Scanner Box */}
      <div className="rounded-2xl bg-space-950/80 border border-slate-800 p-6 mb-8 relative overflow-hidden z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Holographic Fingerprint / Retinal Reticle */}
          <div className="relative flex items-center justify-center w-36 h-36 rounded-2xl bg-space-900 border border-hud-cyan/40 shadow-[0_0_30px_rgba(0,240,255,0.15)] shrink-0">
            {scanStep === 'scanning' && (
              <div className="absolute inset-0 bg-hud-cyan/20 animate-pulse rounded-2xl" />
            )}

            {scanStep === 'scanning' ? (
              <Scan className="w-20 h-20 text-hud-cyan animate-spin" />
            ) : scanStep === 'success' ? (
              <CheckCircle2 className="w-20 h-20 text-hud-emerald animate-bounce" />
            ) : (
              <Fingerprint className="w-20 h-20 text-hud-cyan/80 hover:text-hud-cyan transition cursor-pointer" />
            )}

            {scanStep === 'scanning' && (
              <div className="absolute inset-x-0 h-1 bg-hud-cyan shadow-[0_0_15px_#00f0ff] animate-scanBeam pointer-events-none" />
            )}
          </div>

          {/* Target Astronaut Info */}
          <div className="flex-1 space-y-2 text-center md:text-left">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
              TARGET IDENTITY CREDENTIAL
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h3 className="font-orbitron font-bold text-xl text-white">
                {selectedMember.name}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-space-900 border border-slate-700 text-hud-cyan font-bold">
                {selectedMember.callsign}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Role: <strong className="text-slate-200">{selectedMember.role}</strong> • Security Clearance: <strong className="text-emerald-400">COSMIC-TOP-SECRET // NASA FLIGHT CREW</strong>
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Status: {selectedMember.status === 'ELEVATED_RISK' ? '⚠️ Under Active Clinical Surveillance' : 'Nominal Baseline'}
            </p>
          </div>

          {/* Action Authenticate Button */}
          <div className="shrink-0 w-full md:w-auto">
            <button
              disabled={isScanning}
              onClick={() => handleStartBiometricScan(selectedCrewId)}
              className="w-full md:w-auto px-6 py-4 rounded-xl bg-gradient-to-r from-hud-cyan to-blue-500 hover:from-hud-cyan/90 hover:to-blue-600 text-space-950 font-orbitron font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-hud-cyan/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Scan className="w-4 h-4 animate-spin text-space-950" />
                  <span>VERIFYING RETINAL PASSKEY...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-space-950" />
                  <span>SCAN SMART BADGE & ENTER</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Select Astronaut Profile Cards (1-Click Authenticate) */}
      <div className="space-y-3 relative z-10">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
          SELECT ASTRONAUT TO LOG IN PRIVATELY:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {crew.map((member) => {
            const isTarget = selectedCrewId === member.id;
            const hasAlert = member.status === 'ELEVATED_RISK';

            return (
              <button
                key={member.id}
                onClick={() => {
                  cockpitAudio.playBlip();
                  handleStartBiometricScan(member.id);
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                  isTarget
                    ? 'bg-space-900 border-hud-cyan shadow-md shadow-hud-cyan/20 ring-1 ring-hud-cyan'
                    : 'bg-space-950/70 border-slate-800 hover:border-slate-700 hover:bg-space-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-400 font-bold">{member.callsign}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      hasAlert
                        ? 'bg-rose-950 text-hud-rose border border-rose-500/40'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {hasAlert ? 'ALERT' : 'NOMINAL'}
                  </span>
                </div>

                <div className="space-y-0.5 mb-3">
                  <div className="font-orbitron font-bold text-xs text-white truncate">
                    {member.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans truncate">
                    {member.role}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">{member.gender}</span>
                  <span className="text-hud-cyan font-bold flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>LOGIN</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security & Regulatory Footnote */}
      <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-hud-emerald" />
          <span>FIPS 140-3 Hardware Enclave • AES-256 Medical Encryption at Rest</span>
        </div>
        <span className="text-slate-400">Zero Ground Server Dependency (Deep Space Offline)</span>
      </div>
    </div>
  );
}
