import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('BEKUR-Aegis Avionics Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/cockpit';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-space-950 text-white flex items-center justify-center p-6 font-mono">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-space-900 border border-hud-rose/40 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-hud-rose">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="font-orbitron font-extrabold text-lg text-white">
                AVIONICS TELEMETRY RECOVERY MODE
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                An isolated telemetry rendering fault was intercepted by Dr. BEKUR-AI failsafe supervisor.
              </p>
            </div>
            {this.state.error && (
              <div className="p-3 rounded-xl bg-space-950 border border-slate-800 text-left text-[11px] text-rose-300 overflow-x-auto">
                <code>{this.state.error.message || String(this.state.error)}</code>
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-hud-cyan text-space-950 font-orbitron font-bold text-xs flex items-center justify-center gap-2 mx-auto hover:bg-hud-cyan/90 transition shadow-lg shadow-hud-cyan/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RE-INITIALIZE AVIONICS BRIDGE</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
