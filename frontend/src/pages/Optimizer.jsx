import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { OptimizerForm } from '../components/energy/OptimizerForm';
import { DispatchResult } from '../components/energy/DispatchResult';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { apiService } from '../services/api';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { Sliders, Cpu, MapPin, DollarSign, Scale, Leaf } from 'lucide-react';

export const Optimizer = () => {
  const { activeLocation, optimizationMode, setOptimizationMode } = useSystemStatus();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleOptimize = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        optimization_mode: optimizationMode,
        latitude: activeLocation?.latitude,
        longitude: activeLocation?.longitude,
      };
      const res = await apiService.runOptimization(payload);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to run energy mix optimization');
    } finally {
      setLoading(false);
    }
  };

  const modes = [
    {
      id: 'cost_saver',
      label: 'Cost Saver',
      emoji: '💰',
      icon: DollarSign,
      desc: 'Prioritize minimal fuel burn & cheapest generation mix',
      color: 'amber',
    },
    {
      id: 'balanced',
      label: 'Balanced',
      emoji: '⚖️',
      icon: Scale,
      desc: 'Optimal tradeoff between fuel cost and load reliability',
      color: 'cyan',
    },
    {
      id: 'green',
      label: 'Green',
      emoji: '🌱',
      icon: Leaf,
      desc: 'Maximize renewable energy share & minimize carbon emissions',
      color: 'emerald',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-cyan-400" />
            Energy Mix Optimizer (MILP)
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Adjust microgrid parameters and trigger optimal dispatch optimization
          </p>
        </div>

        {/* Active Location Info Pill */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200">{activeLocation?.name || 'Baramati Rural'}</span>
          <span className="text-slate-500">
            ({activeLocation?.latitude != null ? Number(activeLocation.latitude).toFixed(2) : '18.15'}°N, {activeLocation?.longitude != null ? Number(activeLocation.longitude).toFixed(2) : '74.58'}°E)
          </span>
        </div>
      </div>

      {/* Optimization Mode Selector Card */}
      <div className="bg-[#131B29] border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            Optimization Objective Mode
          </h3>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
            Mode Preserved Across Locations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {modes.map((m) => {
            const isSelected = optimizationMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setOptimizationMode(m.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/80 shadow-md shadow-cyan-950/30 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <span>{m.emoji}</span> {m.label}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-500/40">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{m.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Parameters Form Card */}
      <Card title="Operator Parameters & Grid Constraints" icon={Sliders}>
        <OptimizerForm onSubmit={handleOptimize} loading={loading} />
      </Card>

      {/* Error state if any */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Results Component */}
      {result && (
        <ErrorBoundary>
          <DispatchResult result={result} />
        </ErrorBoundary>
      )}
    </div>
  );
};
