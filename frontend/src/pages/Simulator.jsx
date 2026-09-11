import React, { useState } from 'react';
import { ScenarioControls } from '../components/simulator/ScenarioControls';
import { BeforeAfterComparison } from '../components/simulator/BeforeAfterComparison';
import { ImpactMetrics } from '../components/simulator/ImpactMetrics';
import { apiService } from '../services/api';
import { BrainCircuit } from 'lucide-react';

export const Simulator = () => {
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
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
          <BrainCircuit className="w-6 h-6 text-rose-400" />
          What-If Crisis Simulator
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Simulate equipment outages, weather shocks, demand spikes, and fuel logistics failures
        </p>
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
