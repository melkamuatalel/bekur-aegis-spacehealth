import React, { useState, useEffect } from 'react';
import { Send, Clock, Database, Radio, CheckCircle2, ShieldAlert } from 'lucide-react';
import { cockpitAudio } from '../utils/audioAlert';

export default function EarthSyncQueue({ isAnomalyActive }) {
  const [packets, setPackets] = useState([
    {
      id: 'PKT-9401',
      timestamp: '14:22:10 UTC',
      type: '12-LEAD ECG SWEEP (100Hz)',
      size: '1.4 MB',
      status: 'QUEUED',
      destination: 'NASA DSN GOLDSTONE // STATION 14',
      eta: '04m 21s'
    },
    {
      id: 'PKT-9402',
      timestamp: '14:22:18 UTC',
      type: 'CREW-02 OPTIC ULTRASOUND SLICE',
      size: '4.8 MB',
      status: 'QUEUED',
      destination: 'NASA FLIGHT SURGEON HOUSTON',
      eta: '04m 21s'
    },
    {
      id: 'PKT-9403',
      timestamp: '14:22:24 UTC',
      type: 'CABIN CO2 / GCR DOSIMETRY LOG',
      size: '320 KB',
      status: 'SYNCHRONIZED',
      destination: 'NASA DSN MADRID // STATION 63',
      eta: 'DELIVERED'
    }
  ]);

  const [activeDsnStation, setActiveDsnStation] = useState('DSN-14 (Goldstone, CA)');

  const handleForceFlush = () => {
    cockpitAudio.playBlip();
    setPackets(prev => [
      {
        id: `PKT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        type: isAnomalyActive ? 'EMERGENCY BIOMETRIC TELEMETRY BURST' : 'ROUTINE VITALS AGGREGATION',
        size: '2.1 MB',
        status: 'TRANSMITTING',
        destination: activeDsnStation,
        eta: '04m 21s'
      },
      ...prev
    ]);
  };

  return (
    <div className="hud-panel p-5 rounded-xl border border-hud-cyan/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-hud-cyan animate-pulse" />
            <h3 className="font-display font-bold text-sm text-white tracking-wide">
              EARTH TELEMETRY BUFFER // STORE-AND-FORWARD DSN QUEUE
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            RADIO SPEED-OF-LIGHT DELAY: 261s (+04m 21s) • AUTONOMOUS EDGE RESILIENCE
          </p>
        </div>

        <button
          onClick={handleForceFlush}
          className="px-3 py-1.5 bg-space-900 hover:bg-space-850 text-hud-cyan border border-hud-cyan/40 hover:border-hud-cyan text-xs font-mono font-bold rounded-lg flex items-center space-x-1.5 transition"
        >
          <Send className="w-3.5 h-3.5" />
          <span>TRANSMIT DSN BURST</span>
        </button>
      </div>

      {/* Packet Queue Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
              <th className="pb-2">PACKET ID</th>
              <th className="pb-2">TIMESTAMP</th>
              <th className="pb-2">PAYLOAD TYPE</th>
              <th className="pb-2">SIZE</th>
              <th className="pb-2">DOWNLINK TARGET</th>
              <th className="pb-2 text-right">ONE-WAY ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {packets.map((pkt) => (
              <tr key={pkt.id} className="hover:bg-space-900/40 transition">
                <td className="py-2.5 font-bold text-hud-cyan">{pkt.id}</td>
                <td className="py-2.5 text-slate-400">{pkt.timestamp}</td>
                <td className="py-2.5 text-slate-200 font-sans font-medium">{pkt.type}</td>
                <td className="py-2.5 text-slate-400">{pkt.size}</td>
                <td className="py-2.5 text-slate-400 truncate max-w-xs">{pkt.destination}</td>
                <td className="py-2.5 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      pkt.status === 'SYNCHRONIZED'
                        ? 'bg-hud-emerald/20 text-hud-emerald border border-hud-emerald/40'
                        : pkt.status === 'TRANSMITTING'
                        ? 'bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/40 animate-pulse'
                        : 'bg-hud-amber/20 text-hud-amber border border-hud-amber/40'
                    }`}
                  >
                    {pkt.eta}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-mono gap-2">
        <span>ENCRYPTION: AES-256-GCM MIL-SPEC TELEMETRY PACKETIZATION</span>
        <span className="text-hud-emerald flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> 100% LOCAL BUFFER PERSISTENCE (OFFLINE PROVEN)
        </span>
      </div>
    </div>
  );
}
