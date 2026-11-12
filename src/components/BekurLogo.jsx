import React from 'react';

export default function BekurLogo({ size = 'default', showText = true, className = '' }) {
  // Sizes: 'sm', 'default', 'lg', 'hero'
  const sizeMap = {
    sm: { box: 'w-8 h-8', svg: 32 },
    default: { box: 'w-12 h-12', svg: 48 },
    lg: { box: 'w-16 h-16', svg: 64 },
    hero: { box: 'w-24 h-24', svg: 96 },
  };

  const currentSize = sizeMap[size] || sizeMap.default;

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Hex-Shield Aerospace Vector Emblem */}
      <div className={`relative ${currentSize.box} shrink-0 group`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-hud-cyan via-sky-500 to-indigo-600 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

        {/* SVG Graphic */}
        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Aegis Cyber Shield Polygon */}
          <polygon
            points="50,4 92,25 92,70 50,96 8,70 8,25"
            fill="url(#shieldGrad)"
            stroke="url(#shieldStroke)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Inset Shield */}
          <polygon
            points="50,11 85,29 85,67 50,89 15,67 15,29"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="0.8"
            strokeDasharray="3 2"
            opacity="0.6"
          />

          {/* Orbital Telemetry Ellipse Rings */}
          <ellipse
            cx="50"
            cy="50"
            rx="36"
            ry="14"
            transform="rotate(-25 50 50)"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="6 3"
            opacity="0.75"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="36"
            ry="14"
            transform="rotate(35 50 50)"
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeDasharray="5 3"
            opacity="0.6"
          />

          {/* Vital ECG Pulse Wave passing across the core */}
          <path
            d="M 22,50 L 38,50 L 42,42 L 46,62 L 50,30 L 54,68 L 58,45 L 62,50 L 78,50"
            stroke="#00f0ff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowFilter)"
          />

          {/* Center Glowing Bio-Core Node */}
          <circle cx="50" cy="50" r="3.5" fill="#ffffff" filter="url(#glowFilter)" />

          {/* 4 Deep-Space Astronaut Crew Nodes */}
          <circle cx="50" cy="18" r="2" fill="#00f0ff" />
          <circle cx="80" cy="45" r="2" fill="#38bdf8" />
          <circle cx="50" cy="82" r="2" fill="#f59e0b" />
          <circle cx="20" cy="45" r="2" fill="#00f0ff" />

          {/* Gradients & Filters */}
          <defs>
            <linearGradient id="shieldGrad" x1="8" y1="4" x2="92" y2="96" gradientUnits="userSpaceOnUse">
              <stop stopColor="#040b18" />
              <stop offset="0.5" stopColor="#091834" />
              <stop offset="1" stopColor="#02050e" />
            </linearGradient>
            <linearGradient id="shieldStroke" x1="8" y1="4" x2="92" y2="96" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00f0ff" />
              <stop offset="0.5" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>

        {/* Floating Ge'ez Monogram Badge */}
        <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-space-950/90 border border-hud-cyan/60 text-[9px] font-bold font-mono text-hud-cyan shadow-sm">
          በኩር
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-orbitron text-xl sm:text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              BEKUR<span className="text-hud-cyan">-AEGIS</span>
            </span>
            <span className="hidden sm:inline-block font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-hud-cyan/15 border border-hud-cyan/30 text-hud-cyan font-bold tracking-wider">
              Autonomous
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 tracking-wide">
            <span className="text-slate-300 font-semibold">NASA DEEP SPACE</span>
            <span>•</span>
            <span className="text-hud-cyan">BIOMEDICAL AI AVIONICS</span>
          </div>
        </div>
      )}
    </div>
  );
}
