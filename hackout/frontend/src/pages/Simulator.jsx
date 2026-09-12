import React, { useState } from 'react';
import { ScenarioControls } from '../components/simulator/ScenarioControls';
import { BeforeAfterComparison } from '../components/simulator/BeforeAfterComparison';
import { ImpactMetrics } from '../components/simulator/ImpactMetrics';
import { apiService } from '../services/api';
import { BrainCircuit, MapPin } from 'lucide-react';
import { DEMO_LOCATION } from '../utils/constants';
import { useSystemStatus } from '../hooks/useSystemStatus';

export const Simulator = () => {
  const { activeLocation, status } = useSystemStatus();
  const loc = activeLocation || status?.location || DEMO_LOCATION;

  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState(null);

  const handleRunSimulation = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.runSimulation(payload);
      setSimulationResult(res);
    } catch (err) {
      setError(err.message || 'Simulation execution failed');
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
              <BrainCircuit className="w-6 h-6 text-rose-400" />
              What-If Crisis Simulator
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              {loc.shortName || loc.village} Baseline
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Stress-test {loc.community || loc.name} ({loc.latitude}°N, {loc.longitude}°E) against equipment outages and weather shocks
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <MapPin className="w-4 h-4 text-rose-400" />
          <span>{loc.name}</span>
        </div>
      </div>

      {/* Scenario Controls */}
      <ScenarioControls onRunSimulation={handleRunSimulation} loading={loading} />

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Simulation Results Display */}
      {simulationResult && (
        <div className="space-y-6 animate-fadeIn">
          <ImpactMetrics impact={simulationResult.impact} />
          <BeforeAfterComparison
            before={simulationResult.before}
            after={simulationResult.after}
          />
        </div>
      )}
    </div>
  );
};

export default Simulator;
