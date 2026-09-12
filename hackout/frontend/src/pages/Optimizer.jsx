import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { OptimizerForm } from '../components/energy/OptimizerForm';
import { DispatchResult } from '../components/energy/DispatchResult';
import { apiService } from '../services/api';
import { Sliders, Cpu, MapPin } from 'lucide-react';
import { DEMO_LOCATION } from '../utils/constants';
import { useSystemStatus } from '../hooks/useSystemStatus';

export const Optimizer = () => {
  const { activeLocation, status } = useSystemStatus();
  const loc = activeLocation || status?.location || DEMO_LOCATION;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleOptimize = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.runOptimization(formData);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to run energy mix optimization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
              <Cpu className="w-6 h-6 text-cyan-400" />
              Energy Mix Optimizer (MILP)
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              {loc.shortName || loc.village}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Optimal unit commitment & dispatch for {loc.community || loc.name} ({loc.latitude}°N, {loc.longitude}°E)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>{loc.name}</span>
        </div>
      </div>

      {/* Input Parameters Form Card */}
      <Card title={`Operator Parameters & Grid Constraints (${loc.shortName || loc.village} Baseline)`} icon={Sliders}>
        <OptimizerForm onSubmit={handleOptimize} loading={loading} />
      </Card>

      {/* Error state if any */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Results Component */}
      {result && <DispatchResult result={result} />}
    </div>
  );
};

export default Optimizer;
