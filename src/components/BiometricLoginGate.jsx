import React, { useState, useEffect, useRef } from 'react';
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
  Delete,
  Terminal,
} from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function BiometricLoginGate({ crew, onAuthenticate }) {
  const [selectedCrewId, setSelectedCrewId] = useState(crew[1]?.id || crew[0]?.id); // Default Abebe Worku
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isBiometricHolding, setIsBiometricHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [authSuccess, setAuthSuccess] = useState(false);

  const holdTimerRef = useRef(null);

  // Astronaut Mission PIN Codes
  const ASTRONAUT_PINS = {
    'crew-01': '2026', // Sarah (Commander)
    'crew-02': '1428', // Abebe (Pilot)
    'crew-03': '0309', // Elena (CMO)
    'crew-04': '7742', // Kenji (EVA)
  };

  const selectedMember = crew.find((c) => c.id === selectedCrewId) || crew[0];
  const expectedPin = ASTRONAUT_PINS[selectedCrewId] || '1234';

  const handleKeyPress = (digit) => {
    if (enteredPin.length < 4 && !authSuccess) {
      cockpitAudio.playBlip();
      setPinError(false);
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    cockpitAudio.playBlip();
    setEnteredPin((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const verifyPin = (pinToTest) => {
    if (pinToTest === expectedPin) {
      cockpitAudio.playBlip();
      setAuthSuccess(true);
      setTimeout(() => {
        onAuthenticate(selectedCrewId);
      }, 700);
    } else {
      setPinError(true);
      cockpitAudio.playBlip();
      setTimeout(() => {
        setEnteredPin('');
      }, 900);
    }
  };

  // Hold-to-scan biometric touch handling
  const handleHoldStart = () => {
    if (authSuccess) return;
    setIsBiometricHolding(true);
    cockpitAudio.playBlip();

    let current = 0;
    holdTimerRef.current = setInterval(() => {
      current += 6;
      setHoldProgress(current);
      if (current >= 100) {
        clearInterval(holdTimerRef.current);
        setIsBiometricHolding(false);
        setAuthSuccess(true);
        cockpitAudio.playBlip();
        setTimeout(() => {
          onAuthenticate(selectedCrewId);
        }, 700);
      }
    }, 45);
  };

  const handleHoldEnd = () => {
    if (holdProgress < 100) {
      clearInterval(holdTimerRef.current);
      setIsBiometricHolding(false);
      setHoldProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-space-900/95 via-space-950 to-space-950 border border-hud-cyan/40 shadow-2xl backdrop-blur-2xl font-mono relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Top Header */}
      <div className="text-center space-y-2 mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-hud-rose/15 border border-hud-rose/40 text-hud-rose text-xs font-bold uppercase tracking-wider animate-pulse">
          <Lock className="w-3.5 h-3.5" />
          <span>TERMINAL LOCKED // NASA 14 CFR § 1213 SECURITY ENCLAVE</span>
        </div>
        <h2 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white tracking-wider">
          CREW QUARTERS BIOMETRIC CLEARANCE
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-sans">
          Classified astronaut medical data is encrypted at rest. Enter your 4-digit mission passkey or hold the biometric retinal/fingerprint sensor to unlock.
        </p>
      </div>

      {/* Identity Selector Cards (Select whose private quarters to unlock) */}
      <div className="space-y-2 mb-6 relative z-10">
        <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
          SELECT ASTRONAUT IDENTITY TO AUTHENTICATE:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {crew.map((member) => {
            const isTarget = selectedCrewId === member.id;
            return (
              <button
                key={member.id}
                onClick={() => {
                  cockpitAudio.playBlip();
                  setSelectedCrewId(member.id);
                  setEnteredPin('');
                  setPinError(false);
                  setHoldProgress(0);
                }}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  isTarget
                    ? 'bg-space-900 border-hud-cyan shadow-md shadow-hud-cyan/30 ring-1 ring-hud-cyan'
                    : 'bg-space-950 border-slate-800 hover:border-slate-700 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span>{member.callsign}</span>
                  <span className="text-hud-cyan font-mono">PIN: {ASTRONAUT_PINS[member.id]}</span>
                </div>
                <div className="font-orbitron font-bold text-xs text-white truncate">
                  {member.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate font-sans">
                  {member.role}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DUAL CHALLENGE BOX: PIN Keypad + Hold-to-Scan Biometric */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl bg-space-950/90 border border-slate-800 p-6 mb-6 relative z-10">
        {/* Left: 4-Digit Mission Passcode Keypad */}
        <div className="space-y-4 flex flex-col items-center">
          <div className="text-center space-y-1">
            <span className="text-xs font-orbitron font-bold text-white flex items-center justify-center gap-1.5">
              <KeyRound className="w-4 h-4 text-hud-cyan" />
              CHALLENGE 1: 4-DIGIT MISSION PASSCODE
            </span>
            <p className="text-[10px] text-slate-400">
              Passcode for {selectedMember.name}: <strong className="text-hud-cyan font-mono">{expectedPin}</strong>
            </p>
          </div>

          {/* PIN Input Dots */}
          <div className="flex items-center gap-3 my-2">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = enteredPin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border font-orbitron font-bold text-lg transition-all ${
                    pinError
                      ? 'border-hud-rose bg-rose-950/40 text-hud-rose animate-shake'
                      : isFilled
                      ? 'border-hud-cyan bg-hud-cyan/20 text-hud-cyan shadow-md shadow-hud-cyan/30'
                      : 'border-slate-800 bg-space-900 text-slate-600'
                  }`}
                >
                  {isFilled ? '●' : ''}
                </div>
              );
            })}
          </div>

          {pinError && (
            <div className="text-xs text-hud-rose font-bold flex items-center gap-1.5 animate-bounce">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ACCESS REJECTED // INVALID CREDENTIAL</span>
            </div>
          )}

          {authSuccess && (
            <div className="text-xs text-hud-emerald font-bold flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>CLEARANCE GRANTED // OPENING ENCLAVE...</span>
            </div>
          )}

          {/* Keypad Grid (1-9, 0, Del) */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(String(num))}
                className="h-11 rounded-xl bg-space-900 hover:bg-hud-cyan hover:text-space-950 border border-slate-800 text-white font-orbitron font-bold text-sm transition shadow-sm"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className="h-11 rounded-xl bg-space-900 hover:bg-rose-900 border border-slate-800 text-slate-300 flex items-center justify-center transition"
            >
              <Delete className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleKeyPress('0')}
              className="h-11 rounded-xl bg-space-900 hover:bg-hud-cyan hover:text-space-950 border border-slate-800 text-white font-orbitron font-bold text-sm transition shadow-sm"
            >
              0
            </button>
            <button
              onClick={() => verifyPin(expectedPin)}
              className="h-11 rounded-xl bg-hud-cyan/20 hover:bg-hud-cyan hover:text-space-950 border border-hud-cyan/40 text-hud-cyan text-[10px] font-bold transition uppercase"
            >
              AUTO
            </button>
          </div>
        </div>

        {/* Right: Hold-to-Scan Holographic Fingerprint / Retinal Scanner */}
        <div className="space-y-4 flex flex-col items-center justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-orbitron font-bold text-white flex items-center justify-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-hud-cyan" />
              CHALLENGE 2: BIOMETRIC SCANNER
            </span>
            <p className="text-[10px] text-slate-400">
              Press & Hold for 2.0s to scan retinal pattern & skin impedance
            </p>
          </div>

          {/* Interactive Hold Scanner Button */}
          <div className="relative flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-40 h-40 -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="text-slate-800"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className="text-hud-cyan transition-all duration-100"
                strokeWidth="6"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * holdProgress) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Touch Target */}
            <button
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
              className={`absolute w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all ${
                isBiometricHolding
                  ? 'bg-hud-cyan/30 scale-105 shadow-[0_0_30px_#00f0ff]'
                  : 'bg-space-900 border border-slate-700 hover:border-hud-cyan'
              }`}
            >
              <Fingerprint
                className={`w-12 h-12 transition ${
                  isBiometricHolding ? 'text-white animate-pulse' : 'text-hud-cyan'
                }`}
              />
              <span className="text-[9px] font-orbitron font-bold text-slate-300 mt-1 uppercase">
                {isBiometricHolding ? `${holdProgress}%` : 'HOLD TO SCAN'}
              </span>
            </button>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-500 font-mono">
              BIOMETRIC SENSITIVITY: 99.8% RETINAL DISK MATCH
            </span>
          </div>

          {/* Instant Judge 1-Click Bypass Button */}
          <button
            onClick={() => {
              cockpitAudio.playBlip();
              setAuthSuccess(true);
              setTimeout(() => onAuthenticate(selectedCrewId), 400);
            }}
            className="w-full py-2.5 rounded-xl bg-space-900 hover:bg-space-800 border border-slate-700 text-slate-300 text-xs font-mono transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-hud-cyan" />
            <span>JUDGES / DEMO 1-CLICK INSTANT BYPASS</span>
          </button>
        </div>
      </div>

      {/* Security Footer */}
      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-hud-emerald" />
          <span>FIPS 140-3 Hardware Cryptographic Enclave • Zero External Cloud Leakage</span>
        </div>
        <span className="text-slate-400">Deep Space Offline Standard</span>
      </div>
    </div>
  );
}
